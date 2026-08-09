import { createFileRoute } from "@tanstack/react-router";
import { IdCard, Mail, Phone } from "lucide-react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSiteContent } from "@/lib/site-content.functions";
import type { ClubMember, SiteContent } from "@/lib/site-content";

const TITLE = "Club Team — Code & Creative Club";
const DESCRIPTION =
  "Meet the president, office bearers and members of the Code & Creative Club at Smt. B. Seetha Polytechnic for 2025-2026.";

export const Route = createFileRoute("/team")({
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
  component: TeamPage,
});

function MemberCard({ member, large }: { member: ClubMember; large?: boolean }) {
  return (
    <article
      className={`glass group rounded-3xl p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-1 hover:ring-primary/40 ${member.featured ? "border-primary/40 ring-1 ring-primary/30" : ""}`}
    >
      {member.photo_url ? (
        <img
          src={member.photo_url}
          alt={`${member.name}, ${member.role_title}`}
          loading="lazy"
          decoding="async"
          className={`mb-4 rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105 ${large ? "size-28" : "size-20"}`}
        />
      ) : null}
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
        {member.role_title}
      </p>
      <h3 className={`mt-2 font-semibold ${large ? "text-2xl" : "text-lg"}`}>{member.name}</h3>
      <dl className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        {member.pin ? (
          <div className="flex items-center gap-2">
            <IdCard className="size-4 shrink-0 text-primary" /> {member.pin}
          </div>
        ) : null}
        {member.phone ? (
          <a
            href={`tel:${member.phone}`}
            className="flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Phone className="size-4 shrink-0 text-primary" /> {member.phone}
          </a>
        ) : null}
        {member.email ? (
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-2 break-all transition-colors hover:text-foreground"
          >
            <Mail className="size-4 shrink-0 text-primary" /> {member.email}
          </a>
        ) : null}
      </dl>
    </article>
  );
}

function TeamPage() {
  const { members, club } = Route.useLoaderData() as SiteContent;
  const featured = members.filter((m) => m.featured);
  const rest = members.filter((m) => !m.featured);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-semibold sm:text-4xl">Club leadership &amp; team</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Student office bearers of the {club.name}, {club.college} ({club.campus}) for{" "}
          {club.academicYear}. “{club.tagline}”
        </p>

        {featured.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-xl font-semibold">Leadership</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((member) => (
                <MemberCard key={member.id} member={member} large />
              ))}
            </div>
          </section>
        ) : null}

        {rest.length > 0 ? (
          <section className="mt-14">
            <h2 className="text-xl font-semibold">Office bearers &amp; members</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {rest.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        ) : null}

        {club.objectives.length > 0 || club.activities.length > 0 ? (
          <section className="mt-16 grid gap-6 lg:grid-cols-2">
            {club.objectives.length > 0 ? (
              <div className="glass rounded-3xl p-6 transition-shadow duration-300 hover:shadow-xl hover:ring-1 hover:ring-primary/30">
                <h2 className="text-lg font-semibold">Objectives</h2>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {club.objectives.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {club.activities.length > 0 ? (
              <div className="glass rounded-3xl p-6 transition-shadow duration-300 hover:shadow-xl hover:ring-1 hover:ring-primary/30">
                <h2 className="text-lg font-semibold">Activities</h2>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {club.activities.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
