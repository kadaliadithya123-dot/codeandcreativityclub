import { createFileRoute } from "@tanstack/react-router";

import {
  ClubAbout,
  ClubCalendar,
  ClubEvents,
  ClubTeam,
} from "@/components/club/ClubSections";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSiteContent } from "@/lib/site-content.functions";
import type { SiteContent } from "@/lib/site-content";

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
  const { club, calendar, events, members } = Route.useLoaderData() as SiteContent;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <ClubAbout club={club} />
        <ClubCalendar calendar={calendar} />
        <ClubEvents events={events} />
        <ClubTeam members={members} club={club} />
      </main>

      <SiteFooter />
    </div>
  );
}
