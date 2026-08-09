import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSiteContent } from "@/lib/site-content.functions";
import type { SiteContent } from "@/lib/site-content";

const TITLE = "Club Events — Code & Creative Club";
const DESCRIPTION =
  "Workshops, seminars, techfests and hackathons conducted by the Code & Creative Club at Smt. B. Seetha Polytechnic.";

export const Route = createFileRoute("/events/")({
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
  component: EventsIndex,
});

function EventsIndex() {
  const { events, calendar } = Route.useLoaderData() as SiteContent;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-semibold sm:text-4xl">Events conducted</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{DESCRIPTION}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.id}
              to="/events/$eventId"
              params={{ eventId: event.id }}
              className="glass group flex flex-col overflow-hidden rounded-3xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:ring-1 hover:ring-primary/30"
            >
              {event.poster_url ? (
                <img
                  src={event.poster_url}
                  alt={`${event.title} event poster`}
                  loading="lazy"
                  decoding="async"
                  className="w-full transition-transform duration-500 group-hover:scale-105"
                />
              ) : null}
              <div className="space-y-3 p-5">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
                  {event.kind}
                </p>
                <h2 className="text-lg font-semibold transition-colors duration-200 group-hover:text-primary">
                  {event.title}
                </h2>
                <dl className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-primary" /> {event.event_date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-primary" /> {event.event_time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-primary" /> {event.venue}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-primary" /> {event.audience}
                  </div>
                </dl>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  View full details
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {calendar.rows.length > 0 ? (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold">{calendar.heading}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{calendar.intro}</p>
            <div className="glass mt-6 overflow-x-auto rounded-2xl">
              <table className="w-full min-w-[540px] text-left text-sm">
                <thead className="border-b border-border/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-3">S.No</th>
                    <th scope="col" className="px-5 py-3">Event</th>
                    <th scope="col" className="px-5 py-3">Date</th>
                    <th scope="col" className="px-5 py-3">Day</th>
                  </tr>
                </thead>
                <tbody>
                  {calendar.rows.map((row, index) => (
                    <tr
                      key={`${row.event}-${index}`}
                      className="border-b border-border/40 transition-colors duration-200 last:border-0 hover:bg-primary/5"
                    >
                      <td className="px-5 py-3 text-muted-foreground">{index + 1}</td>
                      <td className="px-5 py-3 font-medium">{row.event}</td>
                      <td className="px-5 py-3 text-muted-foreground">{row.date}</td>
                      <td className="px-5 py-3 text-muted-foreground">{row.day}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
