import { Link } from "@tanstack/react-router";

import logo from "@/assets/college-logo.png";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="College emblem" width={36} height={36} className="size-9" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-sm font-semibold tracking-tight">Code&Creativity</span>
            <span className="text-[11px] text-muted-foreground">Smt. B. Seetha Polytechnic</span>
          </span>
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/" activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>
              Home
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/events" activeProps={{ className: "text-primary" }}>
              Events
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/team" activeProps={{ className: "text-primary" }}>
              Team
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/updates" activeProps={{ className: "text-primary" }}>
              Updates
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/auth">Faculty Login</Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}