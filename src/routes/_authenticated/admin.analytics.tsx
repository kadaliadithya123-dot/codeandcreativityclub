import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { supabase } from "@/integrations/supabase/client";
import { performanceBadge } from "@/lib/constants";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: AnalyticsPage,
});

type Row = {
  percentage: number;
  students: { department: string; year: string } | null;
};

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

function AnalyticsPage() {
  const { data: results = [], isLoading } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("results")
        .select("percentage, students(department, year)");
      if (error) throw error;
      return data as unknown as Row[];
    },
  });

  const byDepartment = useMemo(() => {
    const buckets = new Map<string, { total: number; count: number }>();
    for (const row of results) {
      const key = row.students?.department ?? "Unknown";
      const bucket = buckets.get(key) ?? { total: 0, count: 0 };
      bucket.total += Number(row.percentage);
      bucket.count += 1;
      buckets.set(key, bucket);
    }
    return [...buckets.entries()].map(([department, bucket]) => ({
      department,
      average: Math.round(bucket.total / bucket.count),
      attempts: bucket.count,
    }));
  }, [results]);

  const byGrade = useMemo(() => {
    const buckets = new Map<string, number>();
    for (const row of results) {
      const label = performanceBadge(Number(row.percentage)).label;
      buckets.set(label, (buckets.get(label) ?? 0) + 1);
    }
    return [...buckets.entries()].map(([name, value]) => ({ name, value }));
  }, [results]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Performance patterns across departments and grade bands.
        </p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Crunching numbers…</p>}
      {!isLoading && results.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No submissions yet — analytics appear once students complete tests.
        </p>
      )}

      {results.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="glass rounded-2xl p-5">
            <h2 className="text-base font-semibold">Average score by department</h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDepartment}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="department" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      color: "var(--color-foreground)",
                    }}
                  />
                  <Bar dataKey="average" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="glass rounded-2xl p-5">
            <h2 className="text-base font-semibold">Grade distribution</h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byGrade} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95}>
                    {byGrade.map((entry, index) => (
                      <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      color: "var(--color-foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="glass rounded-2xl p-5 lg:col-span-2">
            <h2 className="text-base font-semibold">Attempts by department</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDepartment}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="department" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      color: "var(--color-foreground)",
                    }}
                  />
                  <Bar dataKey="attempts" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}