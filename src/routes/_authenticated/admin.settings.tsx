import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Moon, Sun } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();

  const { data } = useQuery({
    queryKey: ["admin", "me"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const [{ data: profile }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", auth.user.id),
      ]);
      return { email: auth.user.email ?? "", profile, roles: roles ?? [] };
    },
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Your account and workspace preferences.</p>
      </div>

      <section className="glass space-y-4 rounded-2xl p-6">
        <h2 className="text-base font-semibold">Account</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Name</dt>
            <dd>{data?.profile?.full_name ?? "—"}</dd>
          </div>
          <Separator />
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Email</dt>
            <dd>{data?.email ?? "—"}</dd>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Role</dt>
            <dd className="flex gap-2">
              {(data?.roles ?? []).map((row) => (
                <Badge key={row.role} variant="secondary" className="capitalize">
                  {row.role}
                </Badge>
              ))}
            </dd>
          </div>
        </dl>
      </section>

      <section className="glass space-y-4 rounded-2xl p-6">
        <h2 className="text-base font-semibold">Appearance</h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Currently using the {theme} theme for this browser.
          </p>
          <Button variant="outline" size="sm" onClick={toggle}>
            {theme === "dark" ? (
              <>
                <Sun className="mr-1 size-4" /> Light
              </>
            ) : (
              <>
                <Moon className="mr-1 size-4" /> Dark
              </>
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}