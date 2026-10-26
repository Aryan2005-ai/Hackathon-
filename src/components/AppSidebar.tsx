import { Link, useRouterState } from "@tanstack/react-router";
import { Brain, Building2, LayoutGrid } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { COLLEGE_SHORT } from "@/lib/companies";

const items = [
  { title: "Company Intelligence", url: "/company/intelligence", icon: Building2 },
  { title: "Skill Intelligence", url: "/company/skills", icon: Brain },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-1 py-1.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-link font-heading text-xs font-bold text-sidebar-primary-foreground">
            {COLLEGE_SHORT}
          </div>
          <span className="truncate font-heading text-sm font-semibold group-data-[collapsible=icon]:hidden">
            Placement Hub
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((it) => (
                <SidebarMenuItem key={it.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={path === it.url}
                    tooltip={it.title}
                    className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-link data-[active=true]:font-medium"
                  >
                    <Link to={it.url}>
                      <it.icon />
                      <span>{it.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="All Companies">
              <Link to="/">
                <LayoutGrid />
                <span>All Companies</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
