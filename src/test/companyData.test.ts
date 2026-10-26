import { describe, expect, it } from "vitest";
import { SEED_COMPANIES } from "@/data/seedCompanies";
import { buildIntelligenceSections } from "@/data/intelligenceData";
import {
  normalizeCompanyProfile,
  normalizeDashboardSkills,
  proficiencyToBloom,
  scoreToCriticality,
  scoreToDifficulty,
} from "@/lib/companyData";

describe("seed smoke test", () => {
  const c = SEED_COMPANIES[0]!;
  it("builds 22 sections with no CTC/stipend/selection-ratio fields", () => {
    const s = buildIntelligenceSections(normalizeCompanyProfile(c.full_json, c.short_json));
    expect(s).toHaveLength(22);
    expect(s.flatMap((x) => x.fields).some((f) => /ctc|stipend|selection/i.test(f.key))).toBe(
      false,
    );
  });
  it("normalizes 12 skills sorted desc", () => {
    const sk = normalizeDashboardSkills(c.skill_levels);
    expect(sk).toHaveLength(12);
    expect(sk[0]?.score).toBe(8);
  });
  it("maps scores to bloom, criticality and difficulty", () => {
    expect(proficiencyToBloom(2)).toBe("CU");
    expect(proficiencyToBloom(8)).toBe("EV");
    expect(proficiencyToBloom(9)).toBe("CR");
    expect(scoreToCriticality(7)).toBe("Critical");
    expect(scoreToCriticality(5)).toBe("Important");
    expect(scoreToCriticality(4)).toBe("Baseline");
    expect(scoreToDifficulty(6)).toBe("ADVANCED");
  });
});
