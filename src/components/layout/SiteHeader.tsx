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
            <span className="font-display text-sm font-semibold tracking-tight">CodeAssess</span>
            <span className="text-[11px] text-muted-foreground">Diploma Assessment Portal</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/start">Start Test</Link>
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