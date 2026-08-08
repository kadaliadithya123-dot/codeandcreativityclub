import { CalendarDays, Clock, MapPin, Target, Users, Mail, Phone, IdCard } from "lucide-react";

import { CALENDAR, CLUB, EVENTS, MEMBERS, PRESIDENT, type Member } from "@/lib/club-data";

export function ClubAbout() {
  return (
    <section id="club" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="glass overflow-hidden rounded-3xl p-3">
          <img
            src={CLUB.posterUrl}
            alt={`${CLUB.name} ${CLUB.academicYear} official poster of ${CLUB.college}`}
            loading="lazy"
            decoding="async"
            className="w-full rounded-2xl"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              {CLUB.centre} · {CLUB.academicYear}
            </p>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              {CLUB.name} — {CLUB.college}
            </h2>
            <p className="text-sm text-muted-foreground">
              {CLUB.campus} · {CLUB.society} · “{CLUB.tagline}”
            </p>
          </div>

          <p className="text-muted-foreground">{CLUB.mission}</p>

          <div className="glass rounded-2xl p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <Target className="size-4 text-primary" /> Goal of the club
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{CLUB.goal}</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-base font-semibold">Objectives</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {CLUB.objectives.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-base font-semibold">Club activities</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {CLUB.activities.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ClubCalendar() {
  return (
    <section id="calendar" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <h2 className="text-2xl font-semibold sm:text-3xl">Monthly calendar {CLUB.academicYear}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Events planned and conducted by the {CLUB.name} for the academic year {CLUB.academicYear}.
      </p>

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
            {CALENDAR.map((row) => (
              <tr key={row.no} className="border-b border-border/40 last:border-0">
                <td className="px-5 py-3 text-muted-foreground">{row.no}</td>
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

export function ClubEvents() {
  return (
    <section id="events" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <h2 className="text-2xl font-semibold sm:text-3xl">Events conducted</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Workshops, seminars and technical fests conducted by the club, with official posters and
        photographs from each session.
      </p>

      <div className="mt-8 space-y-10">
        {EVENTS.map((event) => (
          <article key={event.slug} className="glass rounded-3xl p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="overflow-hidden rounded-2xl border border-border/60">
                <img
                  src={event.poster}
                  alt={`${event.title} event poster`}
                  loading="lazy"
                  decoding="async"
                  className="w-full"
                />
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
                    {event.kind}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold sm:text-2xl">{event.title}</h3>
                </div>

                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="size-4 text-primary" /> {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-4 text-primary" /> {event.time}
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
                        className="rounded-full border border-border/60 bg-primary/10 px-3 py-1 text-xs text-foreground"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Resource person(s)</h4>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {event.resourcePersons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground">
                  {event.summary.map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {event.photos.map((photo) => (
                <figure key={photo.url} className="overflow-hidden rounded-2xl border border-border/60">
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full"
                  />
                  <figcaption className="px-4 py-2 text-xs text-muted-foreground">
                    {photo.alt}
                  </figcaption>
                </figure>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MemberCard({ member, featured = false }: { member: Member; featured?: boolean }) {
  return (
    <div
      className={`glass rounded-2xl p-6 ${featured ? "border-primary/40 ring-1 ring-primary/30" : ""}`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">{member.role}</p>
      <h3 className={`mt-2 font-semibold ${featured ? "text-xl" : "text-base"}`}>{member.name}</h3>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <IdCard className="size-4 text-primary" /> {member.pin}
        </li>
        <li className="flex items-center gap-2 break-all">
          <Mail className="size-4 shrink-0 text-primary" />
          <a href={`mailto:${member.email}`} className="hover:text-foreground">
            {member.email}
          </a>
        </li>
        <li className="flex items-center gap-2">
          <Phone className="size-4 text-primary" />
          <a href={`tel:+91${member.phone}`} className="hover:text-foreground">
            +91 {member.phone}
          </a>
        </li>
      </ul>
    </div>
  );
}

export function ClubTeam() {
  return (
    <section id="team" className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6">
      <h2 className="text-2xl font-semibold sm:text-3xl">Club leadership &amp; team</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Student office bearers of the {CLUB.name}, {CLUB.college} for {CLUB.academicYear}.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <MemberCard member={PRESIDENT} featured />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
          {MEMBERS.map((member) => (
            <MemberCard key={member.pin} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}