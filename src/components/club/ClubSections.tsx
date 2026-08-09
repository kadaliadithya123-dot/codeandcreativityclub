import { Link } from "@tanstack/react-router";
import { BellRing, CalendarDays, Clock, MapPin, Users } from "lucide-react";

import type {
  CalendarContent,
  ClubEvent,
  ClubInfo,
  ClubMember,
} from "@/lib/site-content";

export function ClubAbout({ club, updatesCtaLabel }: { club: ClubInfo; updatesCtaLabel?: string }) {
  const CLUB = club;
  return (
    <section id="club" className="hero-surface relative overflow-hidden">
      <div className="relative mx-auto w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid lg:grid-cols-2 lg:py-16">
        {/* Left: club info — capped to the poster height on large screens */}
        <div className="flex flex-col justify-center gap-4 lg:absolute lg:inset-y-12 lg:left-4 lg:w-[calc(50%-3.25rem)] lg:overflow-y-auto sm:lg:left-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            {CLUB.centre} · {CLUB.academicYear}
          </p>
          <h1 className="text-3xl font-semibold leading-[1.12] sm:text-4xl">
            {CLUB.name} — {CLUB.college}
          </h1>
          <p className="text-sm text-muted-foreground">
            {CLUB.campus} · {CLUB.society} · “{CLUB.tagline}”
          </p>
          <p className="text-muted-foreground">{CLUB.mission}</p>
          <div className="pt-2">
            <Link
              to="/updates"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <BellRing className="size-4" /> {updatesCtaLabel || "Check updates"}
            </Link>
          </div>
        </div>

        {/* Right: club poster — defines the section height */}
        {CLUB.posterUrl ? (
          <div className="glass group mt-8 overflow-hidden rounded-3xl p-3 transition-shadow duration-300 hover:shadow-2xl lg:col-start-2 lg:mt-0">
            <img
              src={CLUB.posterUrl}
              alt={`${CLUB.name} ${CLUB.academicYear} official poster of ${CLUB.college}`}
              fetchPriority="high"
              decoding="async"
              className="w-full rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function ClubCalendar({ calendar }: { calendar: CalendarContent }) {
  if (calendar.rows.length === 0) return null;
  return (
    <section id="calendar" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <h2 className="text-2xl font-semibold sm:text-3xl">{calendar.heading}</h2>
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
  );
}

export function ClubEvents({ events }: { events: ClubEvent[] }) {
  if (events.length === 0) return null;
  return (
    <section id="events" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <h2 className="text-2xl font-semibold sm:text-3xl">Events conducted</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Workshops, seminars and technical fests conducted by the club, with the official poster and
        details of each session.
      </p>

      <div className="mt-8 space-y-10">
        {events.map((event) => (
          <article
            key={event.id}
            className="glass group rounded-3xl p-6 transition-shadow duration-300 hover:shadow-2xl hover:ring-1 hover:ring-primary/25 sm:p-8"
          >
            <div className="gap-8 lg:grid lg:grid-cols-[0.8fr_1.2fr]">
              {event.poster_url ? (
                <div className="overflow-hidden rounded-2xl border border-border/60">
                  <img
                    src={event.poster_url}
                    alt={`${event.title} event poster`}
                    loading="lazy"
                    decoding="async"
                    className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              ) : null}

              <div className="mt-6 space-y-5 lg:mt-0">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
                    {event.kind}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold sm:text-2xl">{event.title}</h3>
                </div>

                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="size-4 text-primary" /> {event.event_date}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-4 text-primary" /> {event.event_time}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-4 text-primary" /> {event.venue}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="size-4 text-primary" /> {event.audience}
                  </div>
                </dl>

                <div>
                  <h4 className="text-sm font-semibold">Highlights</h4>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {event.highlights.map((h) => (
                      <li
                        key={h}
                        className="rounded-full border border-border/60 bg-primary/10 px-3 py-1 text-xs text-foreground transition-colors duration-200 hover:border-primary/50 hover:bg-primary/20"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Resource person(s)</h4>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {event.resource_persons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground">
                  {event.summary.map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                </div>

                <Link
                  to="/events/$eventId"
                  params={{ eventId: event.id }}
                  className="story-link inline-block text-sm font-medium text-primary"
                >
                  View full details &amp; photos →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MemberCard({ member }: { member: ClubMember }) {
  const featured = member.featured;
  return (
    <div
      className={`glass group rounded-2xl p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-1 hover:ring-primary/40 ${featured ? "border-primary/40 ring-1 ring-primary/30" : ""}`}
    >
      {member.photo_url ? (
        <img
          src={member.photo_url}
          alt={`${member.name}, ${member.role_title}`}
          loading="lazy"
          decoding="async"
          className="mb-4 size-20 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : null}
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
        {member.role_title}
      </p>
      <h3 className={`mt-2 font-semibold ${featured ? "text-xl" : "text-base"}`}>{member.name}</h3>
    </div>
  );
}

export function ClubTeam({ members, club }: { members: ClubMember[]; club: ClubInfo }) {
  if (members.length === 0) return null;
  const featured = members.filter((m) => m.featured);
  const rest = members.filter((m) => !m.featured);
  return (
    <section id="team" className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6">
      <h2 className="text-2xl font-semibold sm:text-3xl">Club leadership &amp; team</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Student office bearers of the {club.name}, {club.college} for {club.academicYear}.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-4">
        {featured.length > 0 ? (
          <div className="grid gap-5 lg:col-span-1">
            {featured.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : null}
        <div
          className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${featured.length > 0 ? "lg:col-span-3" : "lg:col-span-4"}`}
        >
          {rest.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}