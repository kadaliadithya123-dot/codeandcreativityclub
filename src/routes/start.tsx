import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEPARTMENTS, DEPARTMENT_LABELS, SECTIONS, YEARS } from "@/lib/constants";
import { attemptStore } from "@/lib/attempt-storage";
import { startAttempt } from "@/lib/exam.functions";
import { cn } from "@/lib/utils";

const TITLE = "Start your test — Code&Creativity";
const DESCRIPTION =
  "Select your academic year, department and section, confirm your hall ticket details and begin the coding test assigned to your class.";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: StartPage,
});

const STEPS = ["Academic Year", "Department", "Section", "Your Details"];

function StartPage() {
  const navigate = useNavigate();
  const begin = useServerFn(startAttempt);

  const [step, setStep] = useState(0);
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [name, setName] = useState("");
  const [hallTicket, setHallTicket] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleContinue() {
    if (name.trim().length < 2) {
      toast.error("Enter your full name");
      return;
    }
    if (!/^[A-Za-z0-9]{4,20}$/.test(hallTicket.trim())) {
      toast.error("Enter a valid hall ticket number (letters and numbers)");
      return;
    }

    setSubmitting(true);
    try {
      const response = await begin({
        data: {
          name: name.trim(),
          hall_ticket: hallTicket.trim(),
          year,
          department,
          section,
        },
      });

      if (!response.ok) {
        const messages: Record<string, string> = {
          no_test: "No test is published for your year, branch and section yet.",
          no_questions: "Your test has no questions yet. Please contact your faculty.",
          already_attempted: "This hall ticket has already submitted this test.",
          student_error: "We couldn't verify your details. Please try again.",
        };
        toast.error(messages[response.reason] ?? "Unable to start the test.");
        return;
      }

      attemptStore.set({
        student: {
          id: response.student.id,
          name: response.student.name,
          hall_ticket: response.student.hall_ticket,
          year: response.student.year,
          department: response.student.department,
          section: response.student.section,
        },
        test: response.test,
        questions: response.questions,
        answers: {},
        startedAt: Date.now(),
        attemptToken: response.attempt_token,
      });
      navigate({ to: "/test" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="hero-surface min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6">
        <div className="mx-auto w-full max-w-2xl">
          <ol className="mb-8 flex items-center gap-2 text-xs">
            {STEPS.map((label, index) => (
              <li key={label} className="flex flex-1 items-center gap-2">
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border font-display text-xs",
                    index <= step
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    "hidden sm:inline",
                    index === step ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </li>
            ))}
          </ol>

          <motion.section
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="glass rounded-3xl p-6 sm:p-8"
          >
            <h1 className="text-2xl font-semibold">{STEPS[step]}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {step === 3
                ? "Confirm your identity. Your test is loaded from these details."
                : "Choose the option that matches your class."}
            </p>

            <div className="mt-6">
              {step === 0 && (
                <OptionGrid
                  options={YEARS.map((y) => ({ value: y, label: y }))}
                  selected={year}
                  onSelect={(value) => {
                    setYear(value);
                    setStep(1);
                  }}
                />
              )}

              {step === 1 && (
                <OptionGrid
                  options={DEPARTMENTS.map((d) => ({
                    value: d,
                    label: d,
                    hint: DEPARTMENT_LABELS[d],
                  }))}
                  selected={department}
                  onSelect={(value) => {
                    setDepartment(value);
                    setStep(2);
                  }}
                />
              )}

              {step === 2 && (
                <OptionGrid
                  options={SECTIONS.map((s) => ({ value: s, label: `Section ${s}` }))}
                  selected={section}
                  onSelect={(value) => {
                    setSection(value);
                    setStep(3);
                  }}
                />
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      value={name}
                      maxLength={80}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="e.g. Aarav Reddy"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hall">Hall ticket number</Label>
                    <Input
                      id="hall"
                      value={hallTicket}
                      maxLength={20}
                      onChange={(event) => setHallTicket(event.target.value.toUpperCase())}
                      placeholder="e.g. 22CM1A0101"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <ReadOnlyField label="Year" value={year} />
                    <ReadOnlyField label="Branch" value={department} />
                    <ReadOnlyField label="Section" value={section} />
                  </div>
                  <Button
                    className="w-full rounded-full"
                    size="lg"
                    disabled={submitting}
                    onClick={handleContinue}
                  >
                    {submitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        Continue <ArrowRight className="ml-1 size-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {step > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-6"
                onClick={() => setStep((prev) => prev - 1)}
              >
                <ArrowLeft className="mr-1 size-4" /> Back
              </Button>
            )}
          </motion.section>
        </div>
      </main>
    </div>
  );
}

function OptionGrid({
  options,
  selected,
  onSelect,
}: {
  options: { value: string; label: string; hint?: string | undefined }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={cn(
            "rounded-2xl border p-4 text-left transition-colors duration-100 hover:border-primary/60 hover:bg-primary/5 active:border-primary",
            selected === option.value
              ? "border-primary bg-primary/10 shadow-glow"
              : "border-border bg-card/40",
          )}
        >
          <span className="block font-medium">{option.label}</span>
          {option.hint && (
            <span className="mt-0.5 block text-xs text-muted-foreground">{option.hint}</span>
          )}
        </button>
      ))}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 px-3 py-2">
      <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}