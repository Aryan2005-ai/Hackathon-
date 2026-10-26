import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  normalizeCompanyProfile,
  normalizeCompanySummary,
  normalizeDashboardSkills,
} from "./companyData";

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("The Supabase connection is not configured.");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`)
          headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const fetchCompanies = createServerFn({ method: "GET" }).handler(async () => {
  const client = publicClient();
  const rows = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await client
      .from("company_json")
      .select("company_id, short_json")
      .order("company_id")
      .range(offset, offset + 499);
    if (error) throw new Error(`Companies could not be loaded: ${error.message}`);
    rows.push(...(data ?? []));
    if (!data || data.length < 500) break;
  }
  return rows.map((row) => normalizeCompanySummary(row.short_json, row.company_id ?? 0));
});

export const fetchCompanyDetails = createServerFn({ method: "GET" })
  .inputValidator((id: number) => {
    if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid company selection.");
    return id;
  })
  .handler(async ({ data: id }) => {
    const client = publicClient();
    const [research, identity, requirements] = await Promise.all([
      client
        .from("company_json")
        .select("short_json, full_json")
        .eq("company_id", id)
        .maybeSingle(),
      client
        .from("companies")
        .select("company_id, incorporation_year, headquarters_address, website_url")
        .eq("company_id", id)
        .maybeSingle(),
      client
        .from("company_skill_levels")
        .select(
          "skill_set_id, required_level, skill_set_master(skill_set_name), proficiency_levels(proficiency_name)",
        )
        .eq("company_id", id),
    ]);
    for (const result of [research, identity, requirements]) {
      if (result.error)
        throw new Error(`Company details could not be loaded: ${result.error.message}`);
    }
    if (!research.data) return null;
    const skills = normalizeDashboardSkills(
      (requirements.data ?? []).map((row) => ({
        skill_set_id: row.skill_set_id,
        required_level: row.required_level,
        skill_set_name: row.skill_set_master?.skill_set_name,
        required_proficiency: row.proficiency_levels?.proficiency_name,
      })),
    );
    const topics: Record<number, { level_number: number; topic: string }[]> = {};
    if (skills.length) {
      for (let offset = 0; ; offset += 500) {
        const { data, error } = await client
          .from("skill_set_topics")
          .select("skill_set_id, level_number, topics")
          .in(
            "skill_set_id",
            skills.map((s) => s.id),
          )
          .order("topic_id")
          .range(offset, offset + 499);
        if (error) throw new Error(`Learning topics could not be loaded: ${error.message}`);
        for (const row of data ?? []) {
          if (row.skill_set_id === null || row.level_number === null) continue;
          (topics[row.skill_set_id] ??= []).push({
            level_number: row.level_number,
            topic: row.topics ?? "",
          });
        }
        if (!data || data.length < 500) break;
      }
    }
    for (const ladder of Object.values(topics))
      ladder.sort((a, b) => a.level_number - b.level_number);
    return {
      profile: normalizeCompanyProfile(research.data.full_json, {
        ...identity.data,
        ...normalizeCompanyProfile({}, research.data.short_json),
      }),
      skills,
      topics,
    };
  });
