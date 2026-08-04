import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CheckCircle2, Home, Printer, XCircle } from "lucide-react";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDuration, performanceBadge } from "@/lib/constants";
import { resultStore, type AttemptResult } from "@/lib/attempt-storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Your result — CodeAssess" },
      { name: "description", content: "Your coding test score, accuracy and performance badge." },
      { property: "og:title", content: "Your result — CodeAssess" },
      {
        property: "og:description",
        content: "Your coding test score, accuracy and performance badge.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = resultStore.get();
    if (!stored) {
      navigate({ to: "/start", replace: true });
      return;
    }
    setResult(stored);
    setChecked(true);
  }, [navigate]);

  if (!checked || !result) return <div className="min-h-screen bg-background" />;

  const badge = performanceBadge(result.percentage);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="hero-surface px-4 py-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-3xl space-y-6"
        >
          <section className="glass rounded-3xl p-8 text-center">
            <p className="text-sm text-muted-foreground">{result.test_title}</p>
            <h1 className="mt-2 text-4xl font-semibold">
              <span className="gradient-text">{result.percentage}%</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {result.score} of {result.total_marks} marks
            </p>
            <Progress value={result.percentage} className="mx-auto mt-6 h-2 max-w-sm" />
            <span
              className={cn(
                "mt-6 inline-flex rounded-full px-4 py-1.5 text-sm font-medium",
                badge.tone === "success" && "bg-success/15 text-success",
                badge.tone === "primary" && "bg-primary/15 text-primary",
                badge.tone === "warning" && "bg-warning/15 text-warning",
                badge.tone === "destructive" && "bg-destructive/15 text-destructive",
              )}
            >
              {badge.label}
            </span>
          </section>

          <section className="glass grid gap-4 rounded-3xl p-6 sm:grid-cols-2">
            <Detail label="Student name" value={result.student.name} />
            <Detail label="Hall ticket" value={result.student.hall_ticket} />
            <Detail label="Branch" value={result.student.department} />
            <Detail label="Section" value={result.student.section} />
            <Detail label="Year" value={result.student.year} />
            <Detail label="Subject" value={result.subject} />
            <Detail label="Time taken" value={formatDuration(result.time_taken_seconds)} />
            <Detail
              label="Accuracy"
              value={`${result.correct}/${result.correct + result.wrong} questions`}
            />
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="glass flex items-center gap-3 rounded-2xl p-5">
              <CheckCircle2 className="size-8 text-success" />
              <div>
                <p className="font-display text-2xl font-semibold">{result.correct}</p>
                <p className="text-xs text-muted-foreground">Correct answers</p>
              </div>
            </div>
            <div className="glass flex items-center gap-3 rounded-2xl p-5">
              <XCircle className="size-8 text-destructive" />
              <div>
                <p className="font-display text-2xl font-semibold">{result.wrong}</p>
                <p className="text-xs text-muted-foreground">Wrong answers</p>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap justify-center gap-3 print:hidden">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/">
                <Home className="mr-1 size-4" /> Back home
              </Link>
            </Button>
            <Button className="rounded-full" onClick={() => window.print()}>
              <Printer className="mr-1 size-4" /> Print result
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}