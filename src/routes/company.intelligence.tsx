import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Linkedin, PlayCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "@/components/CompanyLogo";
import { useCompany } from "@/context/CompanyContext";
import { companyDetailsQueryOptions } from "@/lib/companyQueries";
import { CompanyDataError, CompanyDataMissing } from "@/components/CompanyDataError";
import { isNullish, splitItems } from "@/lib/companyData";
import {
  buildIntelligenceSections,
  type IntelField,
  type IntelSection,
} from "@/data/intelligenceData";

export const Route = createFileRoute("/company/intelligence")({
  errorComponent: CompanyDataError,
  head: () => ({
    meta: [
      { title: "Company Intelligence · JSS UNIVERSITY Placement Hub" },
      {
        name: "description",
        content: "22-section research profile of a recruiting company for JSS UNIVERSITY students.",
      },
      { property: "og:title", content: "Company Intelligence · JSS UNIVERSITY Placement Hub" },
      { property: "og:description", content: "Deep research profile of recruiting companies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CompanyIntelligence,
});

const NA = () => (
  <span className="inline-flex rounded-full border bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
    Not Available
  </span>
);

function renderValue(field: IntelField) {
  const v = field.value ?? "";
  if (isNullish(v)) return <NA />;
  if (/^https?:\/\//.test(v)) {
    const video = /youtube|vimeo|video/i.test(field.key + v);
    return (
      <a
        href={v}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 break-all text-link hover:underline"
      >
        {video ? (
          <PlayCircle className="h-4 w-4 shrink-0" />
        ) : (
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        )}
        {v.replace(/^https?:\/\/(www\.)?/, "")}
      </a>
    );
  }
  if (/^\d(\.\d)?\/5$/.test(v)) {
    const n = parseFloat(v);
    return (
      <span className="inline-flex items-center gap-1 font-medium">
        <Star className="h-4 w-4 fill-regular text-regular" />
        {n} <span className="text-muted-foreground">/ 5</span>
      </span>
    );
  }
  if (v.length > 140 && !v.includes(";"))
    return <p className="leading-relaxed text-foreground">{v}</p>;
  const items = v.includes(";")
    ? splitItems(v)
    : v.length < 140 && v.split(",").length > 2
      ? v.split(",").map((s) => s.trim())
      : [];
  if (items.length > 1) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span
            key={it}
            className="rounded-md border bg-secondary px-2 py-0.5 text-xs text-foreground"
          >
            {it}
          </span>
        ))}
      </div>
    );
  }
  return <span className="text-foreground">{v}</span>;
}

const FieldRow = memo(function FieldRow({ field }: { field: IntelField }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4">
      <div className="text-sm font-medium text-muted-foreground sm:w-1/3">{field.label}</div>
      <div className="text-sm sm:w-2/3">{renderValue(field)}</div>
    </div>
  );
});

const SectionCard = memo(function SectionCard({ section }: { section: IntelSection }) {
  const Icon = section.icon;
  const filled = section.fields.filter((f) => !isNullish(f.value)).length;
  return (
    <section
      id={section.id}
      data-section
      className="scroll-mt-28 rounded-xl border bg-card p-4 sm:p-5"
    >
      <div className="mb-1 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-link-soft text-link">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <h2 className="flex-1 text-base font-semibold sm:text-lg">{section.title}</h2>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
          {filled}/{section.fields.length}
        </span>
      </div>
      <div className="divide-y">
        {section.fields.map((f) => (
          <FieldRow key={f.key} field={f} />
        ))}
      </div>
    </section>
  );
});

function CompanyIntelligence() {
  const { selected } = useCompany();
  if (!selected) return null;
  return <CompanyIntelligenceContent companyId={selected.companyId} />;
}

function CompanyIntelligenceContent({ companyId }: { companyId: number }) {
  const { selected } = useCompany();
  const { data } = useSuspenseQuery(companyDetailsQueryOptions(companyId));
  const profile = data?.profile ?? null;
  const sections = useMemo(() => buildIntelligenceSections(profile), [profile]);
  const [active, setActive] = useState(0);
  const isScrollingRef = useRef(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const obs = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(els.indexOf(vis[0].target as HTMLElement));
      },
      { rootMargin: "-120px 0px -60% 0px" },
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [sections]);

  useEffect(() => {
    tabRefs.current[active]?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [active]);

  const scrollToSection = useCallback((idx: number) => {
    isScrollingRef.current = true;
    setActive(idx);
    document
      .getElementById(`section-${idx}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  }, []);

  if (!profile || !selected) return <CompanyDataMissing />;

  return (
    <div>
      <div className="sticky top-12 z-20 border-b bg-surface">
        <div className="flex items-center gap-3 px-4 py-3">
          <CompanyLogo
            name={profile.name}
            logoUrl={selected.logoUrl}
            websiteUrl={profile.website_url}
            className="h-10 w-10"
          />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold sm:text-xl">{profile.name}</h1>
            <span className="inline-flex rounded-full bg-link-soft px-2 py-0.5 text-xs font-medium text-link">
              {profile.category}
            </span>
          </div>
          <div className="flex gap-2">
            {!isNullish(profile.website_url) && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.website_url} target="_blank" rel="noreferrer">
                  <ExternalLink />
                  <span className="hidden sm:inline">Website</span>
                </a>
              </Button>
            )}
            {!isNullish(profile.linkedin_url) && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer">
                  <Linkedin />
                  <span className="hidden sm:inline">LinkedIn</span>
                </a>
              </Button>
            )}
          </div>
        </div>
        <div className="scrollbar-none flex gap-1 overflow-x-auto px-3 pb-2">
          {sections.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              onClick={() => scrollToSection(i)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${i === active ? "bg-link-soft text-link" : "text-muted-foreground hover:bg-secondary"}`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        {sections.map((s) => (
          <SectionCard key={s.id} section={s} />
        ))}
      </div>
    </div>
  );
}
