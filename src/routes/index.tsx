import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, MapPin, Search, TrendingDown, TrendingUp, Users, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "@/components/CompanyLogo";
import { useCompany } from "@/context/CompanyContext";
import { COLLEGE_NAME, COLLEGE_SHORT } from "@/lib/companies";
import { companiesQueryOptions } from "@/lib/companyQueries";
import { CompanyDataError, CompanyDataMissing } from "@/components/CompanyDataError";
import { isNullish, type CompanySummary, type CompanyTier } from "@/lib/companyData";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(companiesQueryOptions),
  errorComponent: CompanyDataError,
  notFoundComponent: CompanyDataMissing,
  head: () => ({
    meta: [
      { title: `${COLLEGE_NAME} Companies Research & Placement Analytics Portal` },
      {
        name: "description",
        content:
          "Research recruiting companies and the skills they expect — JSS UNIVERSITY Placement Intelligence Hub.",
      },
      { property: "og:title", content: `${COLLEGE_NAME} Placement Intelligence Hub` },
      { property: "og:description", content: "Your strategic edge for campus placements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const TIER_STYLE: Record<CompanyTier, string> = {
  "Super Dream": "text-super-dream bg-super-dream/10 border-super-dream/30",
  Dream: "text-dream bg-dream/10 border-dream/30",
  Standard: "text-standard bg-standard/10 border-standard/30",
  Regular: "text-regular bg-regular/10 border-regular/30",
};
const FILTERS = ["All", "Super Dream", "Dream", "Standard", "Regular"] as const;

const Val = ({ v }: { v: string }) =>
  isNullish(v) ? (
    <span className="italic text-muted-foreground">not publicly available</span>
  ) : (
    <>{v}</>
  );

const CompanyCard = memo(function CompanyCard({
  c,
  onOpen,
}: {
  c: CompanySummary;
  onOpen: (c: CompanySummary) => void;
}) {
  const down = c.yoyGrowthRate.trim().startsWith("-");
  const Trend = down ? TrendingDown : TrendingUp;
  return (
    <button
      onClick={() => onOpen(c)}
      className="group relative flex flex-col gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:border-link/40"
    >
      <div className="flex items-start justify-between">
        <CompanyLogo name={c.name} logoUrl={c.logoUrl} websiteUrl={c.websiteUrl} />
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${TIER_STYLE[c.companyType]}`}
        >
          {c.companyType}
        </span>
      </div>
      <div>
        <h3 className="font-semibold leading-tight">{c.name}</h3>
        <p className="text-sm text-muted-foreground">{c.shortName}</p>
      </div>
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />
          <Val v={c.headquarters} />
        </li>
        <li className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5" />
          <Val v={c.employeeSize} />
        </li>
        <li className={`flex items-center gap-2 ${down ? "text-expert" : "text-standard"}`}>
          <Trend className="h-3.5 w-3.5" />
          <Val v={c.yoyGrowthRate} /> <span className="text-muted-foreground">YoY</span>
        </li>
      </ul>
      <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-link" />
    </button>
  );
});

function Index() {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const { data: companies } = useSuspenseQuery(companiesQueryOptions);
  const loading = false;

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const searched = useMemo(() => {
    const q = debounced.toLowerCase().trim();
    return q
      ? companies.filter((c) =>
          `${c.name} ${c.shortName} ${c.headquarters}`.toLowerCase().includes(q),
        )
      : companies;
  }, [companies, debounced]);
  const visible = filter === "All" ? searched : searched.filter((c) => c.companyType === filter);

  const onOpen = useCallback(
    (c: CompanySummary) => {
      selectCompany({ companyId: c.id, companyName: c.shortName, logoUrl: c.logoUrl });
      navigate({ to: "/company/intelligence" });
    },
    [selectCompany, navigate],
  );

  const reset = () => {
    setQuery("");
    setFilter("All");
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
          <span className="inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold tracking-widest text-link">
            {COLLEGE_SHORT} · INTELLIGENCE PLATFORM
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {COLLEGE_NAME} Companies Research & Placement Analytics Portal
          </h1>
          <p className="mt-2 text-muted-foreground">Your strategic edge for campus placements</p>
          <div className="relative mt-6 max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies…"
              aria-label="Search companies"
              className="h-11 w-full rounded-lg border bg-card pl-10 pr-10 text-sm outline-none focus:border-link focus:ring-2 focus:ring-link/20"
            />
            {query && (
              <button
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="scrollbar-none mb-5 flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => {
            const count =
              f === "All" ? searched.length : searched.filter((c) => c.companyType === f).length;
            const on = filter === f;
            const tone =
              f === "All"
                ? on
                  ? "bg-primary text-primary-foreground border-primary"
                  : ""
                : on
                  ? TIER_STYLE[f]
                  : "";
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium ${tone || "bg-card text-muted-foreground hover:bg-secondary"}`}
              >
                {f} <span className="ml-1 opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <p className="font-medium">No companies match your search</p>
            <Button variant="outline" className="mt-4" onClick={reset}>
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((c) => (
              <CompanyCard key={c.id} c={c} onOpen={onOpen} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
