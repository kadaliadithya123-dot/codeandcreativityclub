import { useMemo } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  Trophy,
  Users,
} from "lucide-react";

import logo from "@/assets/college-logo.png";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Manage Tests", url: "/admin/tests", icon: ClipboardList },
  { title: "Students", url: "/admin/students", icon: Users },
  { title: "Results", url: "/admin/results", icon: Trophy },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
] as const;

export function AdminShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const crumb = useMemo(
    () => NAV.find((item) => item.url === pathname)?.title ?? "Dashboard",
    [pathname],
  );

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <div className="flex items-center gap-2 px-3 py-4">
              <img src={logo} alt="" width={28} height={28} className="size-7" />
              <span className="font-display text-sm font-semibold group-data-[collapsible=icon]:hidden">
                Code&Creativity
              </span>
            </div>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={pathname === item.url}>
                        <Link to={item.url} className="flex items-center gap-2">
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleSignOut}>
                      <LogOut className="size-4" />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
                Admin <span className="px-1">/</span>
                <span className="text-foreground">{crumb}</span>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-1 size-4" /> Logout
              </Button>
            </div>
          </header>

          <main className="min-w-0 flex-1 p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}