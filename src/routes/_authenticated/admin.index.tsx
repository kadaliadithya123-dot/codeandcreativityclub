import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, FileQuestion, Percent, Trophy, Users } from "lucide-react";

import { StatCard } from "@/components/admin/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { performanceBadge } from "@/lib/constants";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const [students, questions, tests, results] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("questions").select("id", { count: "exact", head: true }),
        supabase.from("tests").select("id", { count: "exact", head: true }),
        supabase
          .from("results")
          .select("id, percentage, submitted_at, students(name, hall_ticket), tests(title)")
          .order("submitted_at", { ascending: false })
          .limit(8),
      ]);

      const percentages = (results.data ?? []).map((row) => Number(row.percentage));
      const average =
        percentages.length > 0
          ? Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length)
          : 0;

      return {
        students: students.count ?? 0,
        questions: questions.count ?? 0,
        tests: tests.count ?? 0,
        recent: results.data ?? [],
        average,
      };
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            A quick pulse on your question bank, tests and student performance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/questions">Add question</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/admin/tests">Create test</Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((key) => (
            <Skeleton key={key} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Students" value={data?.students ?? 0} />
          <StatCard icon={FileQuestion} label="Questions" value={data?.questions ?? 0} />
          <StatCard icon={ClipboardList} label="Tests" value={data?.tests ?? 0} />
          <StatCard
            icon={Percent}
            label="Recent average"
            value={`${data?.average ?? 0}%`}
            hint="Across the latest submissions"
          />
        </div>
      )}

      <section className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Trophy className="size-4 text-primary" /> Latest submissions
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/results">View all</Link>
          </Button>
        </div>

        <div className="mt-4 divide-y divide-border/60">
          {(data?.recent ?? []).length === 0 && (
            <p className="py-6 text-sm text-muted-foreground">No submissions yet.</p>
          )}
          {(data?.recent ?? []).map((row) => {
            const badge = performanceBadge(Number(row.percentage));
            return (
              <div key={row.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{row.students?.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {row.students?.hall_ticket} · {row.tests?.title}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{badge.label}</Badge>
                  <span className="font-display text-sm font-semibold">{row.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}