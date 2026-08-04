import { Link } from "@tanstack/react-router";

import logo from "@/assets/college-logo.png";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" loading="lazy" width={32} height={32} className="size-8" />
            <span className="font-display font-semibold">CodeAssess</span>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            A secure coding assessment portal built for diploma faculty and their students.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">Students</p>
          <Link to="/start" className="block text-muted-foreground hover:text-foreground">
            Start a test
          </Link>
          <Link to="/result" className="block text-muted-foreground hover:text-foreground">
            View last score
          </Link>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">Faculty</p>
          <Link to="/auth" className="block text-muted-foreground hover:text-foreground">
            Admin login
          </Link>
          <span className="block text-muted-foreground">Support: exams@college.edu</span>
        </div>
      </div>
      <div className="border-t border-border/60 px-4 py-5 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Department of Technical Education. All rights reserved.
      </div>
    </footer>
  );
}