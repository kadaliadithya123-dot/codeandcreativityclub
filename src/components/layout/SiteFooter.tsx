import { Link } from "@tanstack/react-router";

import logo from "@/assets/college-logo.png";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="group space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt=""
              loading="lazy"
              width={32}
              height={32}
              className="size-8 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-display font-semibold">Code&Creativity</span>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            A secure coding assessment portal built for Smt. B. Seetha Polytechnic faculty and their
            students.
          </p>
          <p className="text-xs text-muted-foreground">Design by NextGenDevs</p>
        </div>

        <div className="space-y-2 text-sm [&_a]:transition-colors [&_a]:duration-200">
          <p className="font-medium">Quick links</p>
          <Link to="/" className="block w-fit text-muted-foreground hover:translate-x-1 hover:text-primary">
            Home
          </Link>
          <Link to="/events" className="block w-fit text-muted-foreground hover:translate-x-1 hover:text-primary">
            Events
          </Link>
          <Link to="/team" className="block w-fit text-muted-foreground hover:translate-x-1 hover:text-primary">
            Team
          </Link>
          <Link to="/updates" className="block w-fit text-muted-foreground hover:translate-x-1 hover:text-primary">
            Updates
          </Link>
          <Link to="/auth" className="block w-fit text-muted-foreground hover:translate-x-1 hover:text-primary">
            Faculty Login
          </Link>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">Support</p>
          <a
            href="mailto:support@seethapoly.edu.in"
            className="block w-fit text-muted-foreground transition-colors duration-200 hover:text-primary"
          >
            support@seethapoly.edu.in
          </a>
          <p className="text-muted-foreground">
            Quizzes and contests are announced as club events — check the Events page for upcoming
            and past editions.
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 px-4 py-5 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Smt. B. Seetha Polytechnic. All rights reserved. &middot;
        Design by NextGenDevs
      </div>
    </footer>
  );
}