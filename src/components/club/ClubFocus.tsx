import {
  Code2,
  Gamepad2,
  Globe,
  PartyPopper,
  Quote,
  Sparkles,
  Trophy,
} from "lucide-react";

import type { ClubInfo } from "@/lib/site-content";

/** Core focus areas of the club (ported from the club's earlier site). */
const DIRECTIVES = [
  {
    icon: Code2,
    title: "Coding workshops",
    body: "Intensive syntax training, basics of coding and architectural logic design — from zero to deployment-ready.",
  },
  {
    icon: Trophy,
    title: "Hackathons",
    body: "Survival coding: build interactive apps, break limits and compete in national and international hackathons.",
  },
  {
    icon: Globe,
    title: "Website building",
    body: "Front-end aesthetics meets back-end logic to build modern, responsive web experiences.",
  },
  {
    icon: Gamepad2,
    title: "Game development",
    body: "Constructing simple digital games, interactive mechanics and playable prototypes.",
  },
  {
    icon: Sparkles,
    title: "Simple animations",
    body: "Breathing life into pixels through keyframes, vectors and web animations.",
  },
  {
    icon: PartyPopper,
    title: "Tech fests",
    body: "Large gatherings of student developers showcasing innovation, creativity and original ideas.",
  },
] as const;

export function ClubFocus({ club }: { club: ClubInfo }) {
  return (
    <section id="focus" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Core directives</p>
      <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">What the club does</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Where bugs become features and ideas become reality — the six areas the {club.name} works on
        through the year.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DIRECTIVES.map((item) => (
          <article
            key={item.title}
            className="glass group rounded-2xl p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-1 hover:ring-primary/40"
          >
            <item.icon
              className="size-6 text-primary transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            />
            <h3 className="mt-4 font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
          </article>
        ))}
      </div>

      {club.mission ? (
        <figure className="glass mt-10 rounded-3xl p-6 transition-shadow duration-300 hover:shadow-2xl hover:ring-1 hover:ring-primary/30 sm:p-8">
          <Quote className="size-6 text-primary" aria-hidden="true" />
          <blockquote className="mt-3 text-base leading-relaxed sm:text-lg">
            {club.mission}
          </blockquote>
          <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Primary mission — {club.name}
          </figcaption>
        </figure>
      ) : null}

      {club.goal ? (
        <p className="mt-6 max-w-3xl text-sm text-muted-foreground">{club.goal}</p>
      ) : null}
    </section>
  );
}
