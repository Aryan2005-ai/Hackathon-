// Pure normalizers. Inputs are the raw JSON shapes (short_json / full_json / skill_levels)
// so Phase 2 can pipe database rows in unchanged.

export type CompanyTier = "Super Dream" | "Dream" | "Standard" | "Regular";
export type Difficulty = "EXPERT" | "ADVANCED" | "PRO" | "BEGINNER";

export interface CompanySummary {
  id: number;
  name: string;
  shortName: string;
  logoUrl: string;
  category: string;
  companyType: CompanyTier;
  incorporationYear: string;
  employeeSize: string;
  headquarters: string;
  operatingCountries: string;
  officeLocations: string;
  yoyGrowthRate: string;
  websiteUrl: string;
}

/** Every full_json field as a display string, keyed by its original snake_case name. */
export type CompanyProfile = Record<string, string> & {
  name: string;
  short_name: string;
  website_url: string;
  linkedin_url: string;
  category: string;
};

export interface DashboardSkill {
  id: number;
  name: string;
  score: number;
  proficiency: string;
  difficulty: Difficulty;
}

export const asString = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map(asString).join("; ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v).trim();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const asRecord = (v: unknown): { [k: string]: any } =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

export const splitItems = (v: unknown): string[] =>
  asString(v)
    .split(/\n|;|•|\u2022|(?<=\.)\s+(?=[A-Z])/)
    .map((s) =>
      s
        .replace(/^[-*\s]+/, "")
        .replace(/\.$/, "")
        .trim(),
    )
    .filter(Boolean);

export const titleCaseFromCode = (code: string): string =>
  code
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) =>
      w.length <= 3 && /^(tam|sam|som|ceo|esg|csr|ai|ml|cac|ltv|yoy|r|and)$/i.test(w)
        ? w.toLowerCase() === "and"
          ? "&"
          : w.toUpperCase()
        : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(" ")
    .replace("R & D", "R&D");

export const scoreToDifficulty = (score: number): Difficulty =>
  score >= 8 ? "EXPERT" : score >= 6 ? "ADVANCED" : score >= 4 ? "PRO" : "BEGINNER";

const TIERS: CompanyTier[] = ["Super Dream", "Dream", "Standard", "Regular"];
const toTier = (v: unknown): CompanyTier => {
  const s = asString(v).toLowerCase();
  return TIERS.find((t) => t.toLowerCase() === s) ?? "Regular";
};

export function normalizeCompanySummary(short_json: unknown, id = 0): CompanySummary {
  const r = asRecord(short_json);
  const name = asString(r["name"]);
  return {
    id,
    name,
    shortName: asString(r["short_name"]) || name,
    logoUrl: asString(r["logo_url"]),
    category: asString(r["category"]),
    companyType: toTier(r["company_type"]),
    incorporationYear: asString(r["incorporation_year"]),
    employeeSize: asString(r["employee_size"]),
    headquarters: asString(r["headquarters_address"]),
    operatingCountries: asString(r["operating_countries"]),
    officeLocations: asString(r["office_locations"]),
    yoyGrowthRate: asString(r["yoy_growth_rate"]),
    websiteUrl: asString(r["website_url"]),
  };
}

export function normalizeCompanyProfile(full_json: unknown, short_json: unknown): CompanyProfile {
  const merged = { ...asRecord(short_json), ...asRecord(full_json) };
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(merged)) out[k] = asString(v);
  return out as CompanyProfile;
}

export function normalizeDashboardSkills(skillLevels: unknown): DashboardSkill[] {
  if (!Array.isArray(skillLevels)) return [];
  return skillLevels
    .map((raw) => {
      const r = asRecord(raw);
      const score = Math.max(0, Math.min(10, Number(r["required_level"]) || 0));
      return {
        id: Number(r["skill_set_id"]) || 0,
        name: asString(r["skill_set_name"]),
        score,
        proficiency: asString(r["required_proficiency"]),
        difficulty: scoreToDifficulty(score),
      };
    })
    .sort((a, b) => b.score - a.score);
}

const NULLISH = new Set(["na", "n/a", "none", "-", "null", "undefined", ""]);
export const isNullish = (v: unknown) => NULLISH.has(asString(v).toLowerCase());

export type Bloom = "CU" | "AP" | "AS" | "EV" | "CR";
export const proficiencyToBloom = (level: number): Bloom =>
  level <= 2 ? "CU" : level <= 4 ? "AP" : level <= 6 ? "AS" : level <= 8 ? "EV" : "CR";

export type Criticality = "Critical" | "Important" | "Baseline";
export const scoreToCriticality = (score: number): Criticality =>
  score >= 7 ? "Critical" : score >= 5 ? "Important" : "Baseline";
