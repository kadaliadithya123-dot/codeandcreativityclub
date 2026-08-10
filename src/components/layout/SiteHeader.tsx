import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

import logo from "@/assets/college-logo.png";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const NAV_LINKS = [
  { to: "/", label: "Home", exact: true },
  { to: "/events", label: "Events" },
  { to: "/team", label: "Team" },
  { to: "/updates", label: "Updates" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto grid h-16 w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="group flex min-w-0 items-center gap-3">
          <img
            src={logo}
            alt="College emblem"
            width={36}
            height={36}
            className="size-9 shrink-0 transition-transform duration-300 group-hover:scale-110"
          />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-display text-sm font-semibold tracking-tight transition-colors group-hover:text-primary">
              Code&Creativity
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              Smt. B. Seetha Polytechnic
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <nav className="hidden items-center gap-0.5 [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-primary md:flex lg:gap-2">
            {NAV_LINKS.map((link) => (
              <Button key={link.to} asChild variant="ghost" size="sm">
                <Link
                  to={link.to}
                  activeProps={{ className: "text-primary" }}
                  activeOptions={link.exact ? { exact: true } : undefined}
                >
                  {link.label}
                </Link>
              </Button>
            ))}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="transition-transform duration-200 hover:scale-105 hover:border-primary/60"
            >
              <Link to="/auth">Faculty Login</Link>
            </Button>
          </nav>

          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="font-display text-base">Menu</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Button key={link.to} asChild variant="ghost" className="justify-start">
                    <Link
                      to={link.to}
                      onClick={() => setOpen(false)}
                      activeProps={{ className: "text-primary" }}
                      activeOptions={link.exact ? { exact: true } : undefined}
                    >
                      {link.label}
                    </Link>
                  </Button>
                ))}
                <Button asChild variant="outline" className="mt-3 justify-center">
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    Faculty Login
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}