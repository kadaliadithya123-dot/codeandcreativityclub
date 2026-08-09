import { createFileRoute } from "@tanstack/react-router";
import { BellRing, CalendarDays, Clock, MapPin } from "lucide-react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSiteContent } from "@/lib/site-content.functions";
import type { SiteContent } from "@/lib/site-content";

const TITLE = "Updates & Announcements — Code & Creative Club";
const DESCRIPTION =
  "Latest announcements from the Code & Creative Club at Smt. B. Seetha Polytechnic: upcoming quizzes, workshops and events with dates and venues.";

export const Route = createFileRoute("/updates")({
  loader: () => getSiteContent(),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UpdatesPage,
});

function UpdatesPage() {
  const { updates } = Route.useLoaderData() as SiteContent;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
          Announcements
        </p>
        <h1 className="mt-2 flex items-center gap-3 text-3xl font-semibold sm:text-4xl">
          <BellRing className="size-7 text-primary" /> {updates.heading}
        </h1>
        <p className="mt-3 text-muted-foreground">{updates.intro}</p>

        {updates.items.length === 0 ? (
          <div className="glass mt-10 rounded-3xl p-10 text-center transition-shadow duration-300 hover:shadow-xl">
            <p className="text-muted-foreground">{updates.emptyMessage}</p>
          </div>
        ) : (
          <ul className="mt-10 space-y-4">
            {updates.items.map((item, index) => (
              <li
                key={`${item.title}-${index}`}
                className="glass rounded-2xl p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-1 hover:ring-primary/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
                    {item.kind}
                  </p>
                  {item.status ? (
                    <span className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground transition-colors duration-200 hover:border-primary/50 hover:text-foreground">
                      {item.status}
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
                <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                  {item.date ? (
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-primary" /> {item.date}
                    </div>
                  ) : null}
                  {item.time ? (
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-primary" /> {item.time}
                    </div>
                  ) : null}
                  {item.venue ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" /> {item.venue}
                    </div>
                  ) : null}
                </dl>
                {item.details ? (
                  <p className="mt-3 text-sm text-muted-foreground">{item.details}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 text-sm text-muted-foreground">
          Once an event or quiz is completed, its full report is archived on the Events page.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}