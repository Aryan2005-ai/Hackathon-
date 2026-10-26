//#region node_modules/.nitro/vite/services/ssr/assets/companyData-BuZUeMTN.js
var asString = (v) => {
	if (v === null || v === void 0) return "";
	if (Array.isArray(v)) return v.map(asString).join("; ");
	if (typeof v === "object") return JSON.stringify(v);
	return String(v).trim();
};
var asRecord = (v) => v && typeof v === "object" && !Array.isArray(v) ? v : {};
var splitItems = (v) => asString(v).split(/\n|;|•|\u2022|(?<=\.)\s+(?=[A-Z])/).map((s) => s.replace(/^[-*\s]+/, "").replace(/\.$/, "").trim()).filter(Boolean);
var titleCaseFromCode = (code) => code.split(/[_\s]+/).filter(Boolean).map((w) => w.length <= 3 && /^(tam|sam|som|ceo|esg|csr|ai|ml|cac|ltv|yoy|r|and)$/i.test(w) ? w.toLowerCase() === "and" ? "&" : w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)).join(" ").replace("R & D", "R&D");
var scoreToDifficulty = (score) => score >= 8 ? "EXPERT" : score >= 6 ? "ADVANCED" : score >= 4 ? "PRO" : "BEGINNER";
var TIERS = [
	"Super Dream",
	"Dream",
	"Standard",
	"Regular"
];
var toTier = (v) => {
	const s = asString(v).toLowerCase();
	return TIERS.find((t) => t.toLowerCase() === s) ?? "Regular";
};
function normalizeCompanySummary(short_json, id = 0) {
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
		websiteUrl: asString(r["website_url"])
	};
}
function normalizeCompanyProfile(full_json, short_json) {
	const merged = {
		...asRecord(short_json),
		...asRecord(full_json)
	};
	const out = {};
	for (const [k, v] of Object.entries(merged)) out[k] = asString(v);
	return out;
}
function normalizeDashboardSkills(skillLevels) {
	if (!Array.isArray(skillLevels)) return [];
	return skillLevels.map((raw) => {
		const r = asRecord(raw);
		const score = Math.max(0, Math.min(10, Number(r["required_level"]) || 0));
		return {
			id: Number(r["skill_set_id"]) || 0,
			name: asString(r["skill_set_name"]),
			score,
			proficiency: asString(r["required_proficiency"]),
			difficulty: scoreToDifficulty(score)
		};
	}).sort((a, b) => b.score - a.score);
}
var NULLISH = /* @__PURE__ */ new Set([
	"na",
	"n/a",
	"none",
	"-",
	"null",
	"undefined",
	""
]);
var isNullish = (v) => NULLISH.has(asString(v).toLowerCase());
var proficiencyToBloom = (level) => level <= 2 ? "CU" : level <= 4 ? "AP" : level <= 6 ? "AS" : level <= 8 ? "EV" : "CR";
var scoreToCriticality = (score) => score >= 7 ? "Critical" : score >= 5 ? "Important" : "Baseline";
//#endregion
export { proficiencyToBloom as a, titleCaseFromCode as c, normalizeDashboardSkills as i, normalizeCompanyProfile as n, scoreToCriticality as o, normalizeCompanySummary as r, splitItems as s, isNullish as t };
