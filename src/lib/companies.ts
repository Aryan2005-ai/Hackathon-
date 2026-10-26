// Single swap point for Phase 2: replace SEED_COMPANIES reads with database rows of the same shape.
import { SEED_COMPANIES } from "@/data/seedCompanies";
import {
  normalizeCompanyProfile,
  normalizeCompanySummary,
  normalizeDashboardSkills,
} from "./companyData";

export const COLLEGE_NAME = "JSS UNIVERSITY";
export const COLLEGE_SHORT = "JSS";

export const getCompanySummaries = () =>
  SEED_COMPANIES.map((c) => normalizeCompanySummary(c.short_json, c.company_id));

export const findSeed = (id: number) => SEED_COMPANIES.find((c) => c.company_id === id);

export const getCompanyProfile = (id: number) => {
  const c = findSeed(id);
  return c ? normalizeCompanyProfile(c.full_json, c.short_json) : null;
};

export const getCompanySkills = (id: number) => {
  const c = findSeed(id);
  return c ? normalizeDashboardSkills(c.skill_levels) : [];
};
