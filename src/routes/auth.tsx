import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import logo from "@/assets/college-logo.png";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const TITLE = "Faculty login — Code&Creativity";
const DESCRIPTION =
  "Secure sign in for diploma faculty to manage question banks, publish tests and review student results.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AuthPage,
});

const REMEMBER_KEY = "portal-remembered-email";

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(REMEMBER_KEY);
    if (stored) {
      setEmail(stored);
      setRemember(true);
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  function persistEmail() {
    if (remember) window.localStorage.setItem(REMEMBER_KEY, email);
    else window.localStorage.removeItem(REMEMBER_KEY);
  }

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    persistEmail();
    toast.success("Welcome back");
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="hero-surface flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="glass w-full max-w-md rounded-3xl p-8"
      >
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="College emblem" width={56} height={56} className="size-14" />
          <h1 className="mt-4 text-2xl font-semibold">Administrator access</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This portal has a single fixed admin login. Public sign-ups are disabled.
          </p>
        </div>

        <form onSubmit={handleSignIn} className="mt-7 space-y-4">
          <Field id="email" label="Email" type="email" value={email} onChange={setEmail} />
          <Field
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
          />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <Checkbox
                checked={remember}
                onCheckedChange={(value) => setRemember(value === true)}
              />
              Remember me
            </label>
          </div>
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />
            Credentials are issued by the exam cell — there is no self-service registration.
          </p>
          <Button type="submit" className="w-full rounded-full" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span className="sr-only">Signing in…</span>
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5" />
          <Link to="/" className="hover:text-foreground">
            Return to the student portal
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        required
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}