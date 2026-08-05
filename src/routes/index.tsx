import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  Clock,
  FileSpreadsheet,
  Layers,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import heroImage from "@/assets/hero-assessment.jpg";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";

const TITLE = "Code&Creativity — Diploma Coding Assessment Portal";
const DESCRIPTION =
  "Faculty-run coding quizzes for diploma students: year, branch and section aware tests, live timers, instant scores and rich result analytics.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

const FEATURES = [
  {
    icon: Layers,
    title: "Section-aware tests",
    body: "Questions are scoped to year, department and section so students only ever see their own paper.",
  },
  {
    icon: Clock,
    title: "Timed with auto-save",
    body: "A live countdown, question palette and progress bar keep every attempt on track and recoverable.",
  },
  {
    icon: ShieldCheck,
    title: "Tamper-proof grading",
    body: "Answers are graded on the server, and one hall ticket can submit an attempt exactly once.",
  },
  {
    icon: BarChart3,
    title: "Result analytics",
    body: "Department, year and section performance charts turn raw submissions into teaching insight.",
  },
  {
    icon: FileSpreadsheet,
    title: "Export & print",
    body: "Download CSV reports or print a clean result sheet straight from the results workspace.",
  },
  {
    icon: Sparkles,
    title: "Ready for coding items",
    body: "The question model is built to grow into coding, paragraph, fill-in-the-blank and true/false items.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="hero-surface relative overflow-hidden">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="space-y-7"
            >
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" />
                Diploma coding assessments, done properly
              </span>

              <h1 className="text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
                Run coding quizzes your <span className="gradient-text">students can trust</span>
              </h1>

              <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                Code&Creativity gives faculty one place to author question banks, publish tests to a
                specific year, branch and section, and read the results the minute the timer stops.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="rounded-full px-7 shadow-glow">
                  <Link to="/start">
                    Start Test <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                  <Link to="/auth">Faculty Login</Link>
                </Button>
              </div>

              <dl className="grid max-w-md grid-cols-3 gap-4 pt-4">
                {[
                  ["6", "Departments"],
                  ["3", "Academic years"],
                  ["4", "Sections each"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="font-display text-2xl font-semibold text-primary">{value}</dt>
                    <dd className="text-xs text-muted-foreground">{label}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            <div className="glass rounded-3xl p-3">
              <img
                src={heroImage}
                alt="Diploma students taking an online coding assessment on laptops"
                width={1100}
                height={825}
                fetchPriority="high"
                decoding="async"
                className="w-full rounded-2xl"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="glass grid gap-8 rounded-3xl p-8 md:grid-cols-[1.1fr_1fr] md:p-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold sm:text-3xl">About the portal</h2>
              <p className="text-muted-foreground">
                Built for polytechnic and diploma programmes, Code&Creativity replaces scattered
                spreadsheets and paper quizzes with a single workflow. Faculty maintain a question
                bank tagged by year, department, section, subject and difficulty, then publish it as
                a timed test.
              </p>
              <p className="text-muted-foreground">
                Students never need an account. They pick their academic details, enter their hall
                ticket, and the system loads only the paper assigned to them.
              </p>
            </div>
            <ol className="space-y-4">
              {[
                "Faculty author and tag questions",
                "A test is published to a year, branch and section",
                "Students verify their details and attempt it once",
                "Scores and analytics appear instantly for faculty",
              ].map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-sm text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">Everything an exam cell needs</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.25, delay: Math.min(index, 3) * 0.03 }}
                className="glass rounded-2xl p-6"
              >
                <feature.icon className="size-6 text-primary" />
                <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
              </motion.article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
