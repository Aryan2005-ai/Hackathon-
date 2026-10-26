import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { memo, useMemo, useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CompanyLogo } from "@/components/CompanyLogo";
import { useCompany } from "@/context/CompanyContext";
import { companyDetailsQueryOptions } from "@/lib/companyQueries";
import { CompanyDataError, CompanyDataMissing } from "@/components/CompanyDataError";
import {
  proficiencyToBloom,
  scoreToCriticality,
  type Bloom,
  type DashboardSkill,
} from "@/lib/companyData";
import type { SkillTopic } from "@/data/skillTopics";

export const Route = createFileRoute("/company/skills")({
  errorComponent: CompanyDataError,
  head: () => ({
    meta: [
      { title: "Skill Intelligence · JSS UNIVERSITY Placement Hub" },
      {
        name: "description",
        content:
          "Skills a recruiter expects, mapped to Bloom levels with a 10-level learning roadmap.",
      },
      { property: "og:title", content: "Skill Intelligence · JSS UNIVERSITY Placement Hub" },
      { property: "og:description", content: "Required skills and learning roadmaps per company." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SkillIntelligence,
});

const BLOOM: Record<Bloom, { label: string; text: string; bg: string; bar: string }> = {
  CU: {
    label: "Comprehension & Understanding",
    text: "text-bloom-cu",
    bg: "bg-bloom-cu/10",
    bar: "bg-bloom-cu",
  },
  AP: { label: "Application", text: "text-bloom-ap", bg: "bg-bloom-ap/10", bar: "bg-bloom-ap" },
  AS: {
    label: "Analysis & Synthesis",
    text: "text-bloom-as",
    bg: "bg-bloom-as/10",
    bar: "bg-bloom-as",
  },
  EV: { label: "Evaluation", text: "text-bloom-ev", bg: "bg-bloom-ev/10", bar: "bg-bloom-ev" },
  CR: { label: "Creation", text: "text-bloom-cr", bg: "bg-bloom-cr/10", bar: "bg-bloom-cr" },
};

const CRIT = {
  Critical: {
    text: "text-expert",
    bg: "bg-expert/10",
    desc: "Score 7+ · must master before interviews",
  },
  Important: {
    text: "text-regular",
    bg: "bg-regular/10",
    desc: "Score 5–6 · strong working knowledge",
  },
  Baseline: {
    text: "text-standard",
    bg: "bg-standard/10",
    desc: "Below 5 · familiarity is enough",
  },
} as const;

const SkillCard = memo(function SkillCard({
  skill,
  topics,
}: {
  skill: DashboardSkill;
  topics: SkillTopic[];
}) {
  const [open, setOpen] = useState(false);
  const bloom = BLOOM[proficiencyToBloom(skill.score)];
  const code = proficiencyToBloom(skill.score);
  const crit = scoreToCriticality(skill.score);
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold">{skill.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className={`rounded-full px-2 py-0.5 font-semibold ${bloom.bg} ${bloom.text}`}>
              {code}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 font-medium ${CRIT[crit].bg} ${CRIT[crit].text}`}
            >
              {crit}
            </span>
            <span className="text-muted-foreground">{skill.proficiency}</span>
          </div>
        </div>
        <div className="text-right font-heading text-lg font-semibold">
          {skill.score}
          <span className="text-sm text-muted-foreground">/10</span>
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full ${bloom.bar}`}
          style={{ width: `${skill.score * 10}%` }}
        />
      </div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-3 flex w-full items-center justify-between text-sm font-medium text-link"
      >
        10-level roadmap{" "}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ol
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 space-y-1 overflow-hidden"
          >
            {topics.map((t) => {
              const locked = t.level_number > skill.score;
              const b = BLOOM[proficiencyToBloom(t.level_number)];
              return (
                <li
                  key={t.level_number}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${locked ? "text-muted-foreground opacity-60" : b.bg}`}
                >
                  <span className={`w-6 shrink-0 text-xs font-semibold ${locked ? "" : b.text}`}>
                    L{t.level_number}
                  </span>
                  <span className="flex-1">{t.topic}</span>
                  {locked && (
                    <span className="flex shrink-0 items-center gap-1 text-xs">
                      <Lock className="h-3 w-3" />
                      Beyond scope
                    </span>
                  )}
                </li>
              );
            })}
          </motion.ol>
        )}
      </AnimatePresence>
    </div>
  );
});

function SkillIntelligence() {
  const { selected } = useCompany();
  if (!selected) return null;
  return <SkillIntelligenceContent companyId={selected.companyId} />;
}

function SkillIntelligenceContent({ companyId }: { companyId: number }) {
  const { selected } = useCompany();
  const { data } = useSuspenseQuery(companyDetailsQueryOptions(companyId));
  if (!selected || !data) return <CompanyDataMissing />;
  const { skills, topics } = data;
  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4">
      <div className="flex items-center gap-3 border-b pb-4">
        <CompanyLogo name={selected.companyName} logoUrl={selected.logoUrl} className="h-10 w-10" />
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">
            {selected.companyName} Skill Intelligence
          </h1>
          <p className="text-sm text-muted-foreground">
            {skills.length} skills · sorted by required level
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {(Object.keys(BLOOM) as Bloom[]).map((k) => (
          <div key={k} className={`rounded-lg p-2.5 ${BLOOM[k].bg}`}>
            <div className={`font-heading font-bold ${BLOOM[k].text}`}>{k}</div>
            <div className="text-xs text-muted-foreground">{BLOOM[k].label}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {(Object.keys(CRIT) as (keyof typeof CRIT)[]).map((k) => (
          <div key={k} className="rounded-lg border bg-card p-3">
            <div className={`text-sm font-semibold ${CRIT[k].text}`}>{k}</div>
            <div className="text-xs text-muted-foreground">{CRIT[k].desc}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {skills.map((s) => (
          <SkillCard key={s.id} skill={s} topics={topics[s.id] ?? []} />
        ))}
      </div>
    </div>
  );
}
