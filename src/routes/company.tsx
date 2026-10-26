import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useCompany } from "@/context/CompanyContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import { companiesQueryOptions } from "@/lib/companyQueries";
import { CompanyDataError, CompanyDataMissing } from "@/components/CompanyDataError";

export const Route = createFileRoute("/company")({
  loader: ({ context }) => context.queryClient.ensureQueryData(companiesQueryOptions),
  errorComponent: CompanyDataError,
  notFoundComponent: CompanyDataMissing,
  component: AppLayout,
});

function AppLayout() {
  const { selected, ready } = useCompany();
  const { data: companies } = useSuspenseQuery(companiesQueryOptions);
  const available = companies.some((c) => c.id === selected?.companyId);
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const page = path.endsWith("/skills") ? "Skill Intelligence" : "Company Intelligence";

  useEffect(() => {
    if (ready && (!selected || !available)) navigate({ to: "/" });
  }, [ready, selected, available, navigate]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="min-w-0 bg-surface">
          <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b bg-surface px-3">
            <SidebarTrigger />
            <nav className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">
                Companies
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{selected?.companyName ?? "…"}</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate font-medium text-foreground">{page}</span>
            </nav>
          </header>
          <main className="min-w-0 flex-1">
            {ready && selected && available ? (
              <Outlet />
            ) : (
              <div className="p-6 text-sm text-muted-foreground">Loading…</div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
