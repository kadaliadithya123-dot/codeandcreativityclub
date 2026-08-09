import { Link } from "@tanstack/react-router";

import logo from "@/assets/college-logo.png";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" loading="lazy" width={32} height={32} className="size-8" />
            <span className="font-display font-semibold">Code&Creativity</span>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            A secure coding assessment portal built for Smt. B. Seetha Polytechnic faculty and their
            students.
          </p>
          <p className="text-xs text-muted-foreground">Design by NextGenDevs</p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">Quick links</p>
          <Link to="/" className="block text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <Link to="/events" className="block text-muted-foreground hover:text-foreground">
            Events
          </Link>
          <Link to="/team" className="block text-muted-foreground hover:text-foreground">
            Team
          </Link>
          <Link to="/updates" className="block text-muted-foreground hover:text-foreground">
            Updates
          </Link>
          <Link to="/auth" className="block text-muted-foreground hover:text-foreground">
            Faculty Login
          </Link>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">Support</p>
          <a
            href="mailto:support@seethapoly.edu.in"
            className="block text-muted-foreground hover:text-foreground"
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