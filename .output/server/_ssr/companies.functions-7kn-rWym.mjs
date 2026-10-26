import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { i as normalizeDashboardSkills, n as normalizeCompanyProfile, r as normalizeCompanySummary } from "./companyData-BuZUeMTN.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/companies.functions-7kn-rWym.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function publicClient() {
	const url = processModule.env["SUPABASE_URL"];
	const key = processModule.env["SUPABASE_PUBLISHABLE_KEY"];
	if (!url || !key) throw new Error("The Supabase connection is not configured.");
	return createClient(url, key, {
		auth: {
			persistSession: false,
			autoRefreshToken: false
		},
		global: { fetch: (input, init) => {
			const headers = new Headers(init?.headers);
			if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
			headers.set("apikey", key);
			return fetch(input, {
				...init,
				headers
			});
		} }
	});
}
var fetchCompanies_createServerFn_handler = createServerRpc({
	id: "dfe919ae2efd2dde128ef6a04d275d272c4acbaebb8ca23fc5d733b5c6fd26b4",
	name: "fetchCompanies",
	filename: "src/lib/companies.functions.ts"
}, (opts) => fetchCompanies.__executeServer(opts));
var fetchCompanies = createServerFn({ method: "GET" }).handler(fetchCompanies_createServerFn_handler, async () => {
	const client = publicClient();
	const rows = [];
	for (let offset = 0;; offset += 500) {
		const { data, error } = await client.from("company_json").select("company_id, short_json").order("company_id").range(offset, offset + 499);
		if (error) throw new Error(`Companies could not be loaded: ${error.message}`);
		rows.push(...data ?? []);
		if (!data || data.length < 500) break;
	}
	return rows.map((row) => normalizeCompanySummary(row.short_json, row.company_id ?? 0));
});
var fetchCompanyDetails_createServerFn_handler = createServerRpc({
	id: "0ae091475f15fcc2f57e892c592789abab40b2537ed5c51acb97a540bacf1938",
	name: "fetchCompanyDetails",
	filename: "src/lib/companies.functions.ts"
}, (opts) => fetchCompanyDetails.__executeServer(opts));
var fetchCompanyDetails = createServerFn({ method: "GET" }).inputValidator((id) => {
	if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid company selection.");
	return id;
}).handler(fetchCompanyDetails_createServerFn_handler, async ({ data: id }) => {
	const client = publicClient();
	const [research, identity, requirements] = await Promise.all([
		client.from("company_json").select("short_json, full_json").eq("company_id", id).maybeSingle(),
		client.from("companies").select("company_id, incorporation_year, headquarters_address, website_url").eq("company_id", id).maybeSingle(),
		client.from("company_skill_levels").select("skill_set_id, required_level, skill_set_master(skill_set_name), proficiency_levels(proficiency_name)").eq("company_id", id)
	]);
	for (const result of [
		research,
		identity,
		requirements
	]) if (result.error) throw new Error(`Company details could not be loaded: ${result.error.message}`);
	if (!research.data) return null;
	const skills = normalizeDashboardSkills((requirements.data ?? []).map((row) => ({
		skill_set_id: row.skill_set_id,
		required_level: row.required_level,
		skill_set_name: row.skill_set_master?.skill_set_name,
		required_proficiency: row.proficiency_levels?.proficiency_name
	})));
	const topics = {};
	if (skills.length) for (let offset = 0;; offset += 500) {
		const { data, error } = await client.from("skill_set_topics").select("skill_set_id, level_number, topics").in("skill_set_id", skills.map((s) => s.id)).order("topic_id").range(offset, offset + 499);
		if (error) throw new Error(`Learning topics could not be loaded: ${error.message}`);
		for (const row of data ?? []) {
			if (row.skill_set_id === null || row.level_number === null) continue;
			(topics[row.skill_set_id] ??= []).push({
				level_number: row.level_number,
				topic: row.topics ?? ""
			});
		}
		if (!data || data.length < 500) break;
	}
	for (const ladder of Object.values(topics)) ladder.sort((a, b) => a.level_number - b.level_number);
	return {
		profile: normalizeCompanyProfile(research.data.full_json, {
			...identity.data,
			...normalizeCompanyProfile({}, research.data.short_json)
		}),
		skills,
		topics
	};
});
//#endregion
export { fetchCompanies_createServerFn_handler, fetchCompanyDetails_createServerFn_handler };
