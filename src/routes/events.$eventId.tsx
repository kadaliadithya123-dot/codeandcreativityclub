import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Clock, MapPin, Users } from "lucide-react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSiteContent } from "@/lib/site-content.functions";
import type { ClubEvent } from "@/lib/site-content";

export const Route = createFileRoute("/events/$eventId")({
  loader: async ({ params }) => {
    const content = await getSiteContent();
    const event = content.events.find((e) => e.id === params.eventId);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Event not found" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.event.title} — Code & Creative Club`;
    const description = loaderData.event.summary[0] ?? loaderData.event.kind;
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 155) },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: EventNotFound,
  component: EventDetail,
});

function EventNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-semibold">Event not found</h1>
        <p className="mt-3 text-muted-foreground">This event may have been unpublished.</p>
        <Link to="/events" className="mt-6 inline-block text-primary">
          Back to all events
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function EventDetail() {
  const { event } = Route.useLoaderData() as { event: ClubEvent };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <Link
          to="/events"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" /> All
          events
        </Link>

        <p className="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-primary">
          {event.kind}
        </p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{event.title}</h1>

        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4 [&>div]:transition-[transform,box-shadow] [&>div]:duration-300 [&>div:hover]:-translate-y-0.5 [&>div:hover]:shadow-lg [&>div:hover]:ring-1 [&>div:hover]:ring-primary/30">
          <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3 text-muted-foreground">
            <CalendarDays className="size-4 text-primary" /> {event.event_date}
          </div>
          <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3 text-muted-foreground">
            <Clock className="size-4 text-primary" /> {event.event_time}
          </div>
          <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3 text-muted-foreground">
            <MapPin className="size-4 text-primary" /> {event.venue}
          </div>
          <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3 text-muted-foreground">
            <Users className="size-4 text-primary" /> {event.audience}
          </div>
        </dl>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {event.poster_url ? (
            <div className="glass group overflow-hidden rounded-3xl p-3 transition-shadow duration-300 hover:shadow-2xl">
              <img
                src={event.poster_url}
                alt={`${event.title} event poster`}
                decoding="async"
                className="w-full rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          ) : null}

          <div className="space-y-8">
            {event.highlights.length > 0 ? (
              <section>
                <h2 className="text-lg font-semibold">Highlights</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {event.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-full border border-border/60 bg-primary/10 px-3 py-1 text-xs transition-colors duration-200 hover:border-primary/50 hover:bg-primary/20"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {event.resource_persons.length > 0 ? (
              <section>
                <h2 className="text-lg font-semibold">Resource person(s)</h2>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {event.resource_persons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {event.summary.length > 0 ? (
              <section>
                <h2 className="text-lg font-semibold">Report</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {event.summary.map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>

        {event.photos.length > 0 ? (
          <section className="mt-14">
            <h2 className="text-2xl font-semibold">Event gallery</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {event.photos.map((photo) => (
                <figure
                  key={photo.url}
                  className="glass group overflow-hidden rounded-2xl transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <img
                    src={photo.url}
                    alt={photo.alt || `${event.title} photograph`}
                    loading="lazy"
                    decoding="async"
                    className="w-full transition-transform duration-500 group-hover:scale-105"
                  />
                  {photo.alt ? (
                    <figcaption className="px-4 py-3 text-xs text-muted-foreground">
                      {photo.alt}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
