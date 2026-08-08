import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

import heroImage from "@/assets/hero-assessment.jpg";
import {
  ClubAbout,
  ClubCalendar,
  ClubEvents,
  ClubTeam,
} from "@/components/club/ClubSections";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { getSiteContent } from "@/lib/site-content.functions";

const TITLE = "Code&Creativity — Diploma Coding Assessment Portal";
const DESCRIPTION =
  "Faculty-run coding quizzes for diploma students: year, branch and section aware tests, live timers, instant scores and rich result analytics.";

export const Route = createFileRoute("/")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://codeandcreativityclub.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://codeandcreativityclub.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Code&Creativity",
          url: "https://codeandcreativityclub.lovable.app",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { club, hero, examSteps, calendar, events, members } = Route.useLoaderData();

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
                {hero.badge}
              </span>

              <h1 className="text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
                {hero.headingLead}{" "}
                <span className="gradient-text">{hero.headingAccent}</span>
              </h1>

              <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                {hero.subheading}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="rounded-full px-7 shadow-glow">
                  <Link to="/start">
                    {hero.primaryCtaLabel} <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                  <Link to="/auth">{hero.secondaryCtaLabel}</Link>
                </Button>
              </div>

              <dl className="grid max-w-md grid-cols-3 gap-4 pt-4">
                {hero.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-display text-2xl font-semibold text-primary">
                      {stat.value}
                    </dt>
                    <dd className="text-xs text-muted-foreground">{stat.label}</dd>
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
              <h2 className="text-2xl font-semibold sm:text-3xl">{hero.aboutHeading}</h2>
              {hero.aboutParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
            <ol className="space-y-4">
              {hero.aboutSteps.map((step, index) => (
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

        <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
          <h2 className="text-2xl font-semibold sm:text-3xl">{examSteps.heading}</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{examSteps.intro}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {examSteps.items.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.25, delay: Math.min(index, 3) * 0.03 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <ClubAbout club={club} />
        <ClubCalendar calendar={calendar} />
        <ClubEvents events={events} />
        <ClubTeam members={members} club={club} />
      </main>

      <SiteFooter />
    </div>
  );
}
