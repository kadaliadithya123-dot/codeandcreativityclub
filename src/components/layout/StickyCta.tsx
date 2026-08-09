import { Link } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck } from "lucide-react";

/** Sticky floating shortcuts for students and faculty. */
export function StickyCta() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="glass pointer-events-auto flex items-center gap-2 rounded-full px-2 py-2 shadow-lg">
        <Link
          to="/start"
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform active:scale-95"
        >
          <GraduationCap className="size-4" /> Start Test
        </Link>
        <Link
          to="/join"
          className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Join club
        </Link>
        <Link
          to="/result"
          className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          My result
        </Link>
        <Link
          to="/auth"
          className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ShieldCheck className="size-4" /> Faculty
        </Link>
      </div>
    </div>
  );
}
