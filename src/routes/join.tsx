import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const TITLE = "Join the Club — Code & Creative Club";
const DESCRIPTION =
  "Apply for membership of the Code & Creative Club at Smt. B. Seetha Polytechnic: build projects, join hackathons and level up your coding skills.";

const DEPARTMENTS = [
  "Computer Engineering (CME)",
  "Artificial Intelligence & ML",
  "Electronics & Communication (ECE)",
  "Electrical & Electronics (EEE)",
  "Mechanical Engineering",
  "Civil Engineering",
  "Other / external member",
];

export const Route = createFileRoute("/join")({
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
  component: JoinPage,
});

function JoinPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    pin: "",
    department: "",
    interests: "",
  });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (form.full_name.trim().length < 2 || form.email.trim().length < 5) {
      toast.error("Please enter your name and a valid email address.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("club_applications").insert({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      pin: form.pin.trim(),
      department: form.department,
      interests: form.interests.trim(),
      status: "new",
    });
    setSaving(false);
    if (error) {
      toast.error("Could not send your application. Please try again.");
      return;
    }
    setDone(true);
    toast.success("Application sent — the club team will contact you.");
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
          Recruitment
        </p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Join the club</h1>
        <p className="mt-3 text-muted-foreground">
          Build projects, take part in hackathons and elevate your skills. Share your details and the
          club team will reach out to you.
        </p>

        {done ? (
          <div className="glass mt-8 rounded-3xl p-8 text-center">
            <h2 className="text-xl font-semibold">Application received</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you, {form.full_name || "student"}. The Code &amp; Creative Club team will get in
              touch with you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass mt-8 space-y-5 rounded-3xl p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name *</Label>
                <Input
                  id="full_name"
                  required
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin">PIN / roll number</Label>
                <Input id="pin" value={form.pin} onChange={(e) => set("pin", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department / branch</Label>
              <Select value={form.department} onValueChange={(v) => set("department", v)}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department..." />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Why do you want to join? *</Label>
              <Textarea
                id="interests"
                required
                rows={5}
                value={form.interests}
                onChange={(e) => set("interests", e.target.value)}
                placeholder="Your interests, skills and what you would like to build with the club."
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              <Send className="mr-2 size-4" /> {saving ? "Sending..." : "Send application"}
            </Button>
          </form>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
