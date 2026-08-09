import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/applications")({
  component: ApplicationsPage,
});

type ApplicationRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  pin: string;
  department: string;
  interests: string;
  status: string;
  created_at: string;
};

function ApplicationsPage() {
  const queryClient = useQueryClient();

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", "applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ApplicationRow[];
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("club_applications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Application removed");
      queryClient.invalidateQueries({ queryKey: ["admin", "applications"] });
    },
    onError: () => toast.error("Could not remove the application"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Membership applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Students who applied to join the club through the website.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading applications…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No applications yet.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((row) => (
            <article key={row.id} className="rounded-2xl border border-border/60 bg-card/60 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{row.full_name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {new Date(row.created_at).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete application from ${row.full_name}`}
                  onClick={() => remove.mutate(row.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <dl className="mt-3 space-y-1 text-sm text-muted-foreground">
                <div>Email: {row.email}</div>
                {row.phone ? <div>Phone: {row.phone}</div> : null}
                {row.pin ? <div>PIN: {row.pin}</div> : null}
                {row.department ? <div>Department: {row.department}</div> : null}
              </dl>
              {row.interests ? (
                <p className="mt-3 whitespace-pre-line text-sm">{row.interests}</p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
