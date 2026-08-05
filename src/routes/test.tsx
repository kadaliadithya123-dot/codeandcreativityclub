import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "motion/react";
import { AlertTriangle, ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { attemptStore, resultStore, type Attempt } from "@/lib/attempt-storage";
import { submitAttempt } from "@/lib/exam.functions";
import { OPTION_KEYS, type OptionKey } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/test")({
  head: () => ({
    meta: [
      { title: "Test in progress — Code&Creativity" },
      { name: "description", content: "Answer your assigned coding test before the timer ends." },
      { property: "og:title", content: "Test in progress — Code&Creativity" },
      {
        property: "og:description",
        content: "Answer your assigned coding test before the timer ends.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TestPage,
});

function TestPage() {
  const navigate = useNavigate();
  const finish = useServerFn(submitAttempt);

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    const stored = attemptStore.get();
    if (!stored) {
      navigate({ to: "/start", replace: true });
      return;
    }
    setAttempt(stored);
    setReady(true);
  }, [navigate]);

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (!attempt || submittedRef.current) return;
      submittedRef.current = true;
      setSubmitting(true);

      const elapsed = Math.min(
        Math.floor((Date.now() - attempt.startedAt) / 1000),
        attempt.test.duration_minutes * 60,
      );

      try {
        const response = await finish({
          data: {
            student_id: attempt.student.id,
            test_id: attempt.test.id,
            time_taken_seconds: elapsed,
            answers: attempt.answers,
          },
        });

        if (!response.ok) {
          submittedRef.current = false;
          toast.error(
            response.reason === "already_attempted"
              ? "This test was already submitted."
              : "Could not save your submission. Try again.",
          );
          return;
        }

        resultStore.set({ student: attempt.student, ...response.result });
        attemptStore.clear();
        toast.success(auto ? "Time is up — your test was submitted." : "Test submitted");
        navigate({ to: "/result", replace: true });
      } catch {
        submittedRef.current = false;
        toast.error("Network error while submitting. Try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [attempt, finish, navigate],
  );

  // Countdown timer; auto-submits when it reaches zero.
  useEffect(() => {
    if (!attempt) return;
    const total = attempt.test.duration_minutes * 60;
    const tick = () => {
      const left = total - Math.floor((Date.now() - attempt.startedAt) / 1000);
      setRemaining(Math.max(0, left));
      if (left <= 0) void handleSubmit(true);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [attempt, handleSubmit]);

  const answeredCount = useMemo(
    () => (attempt ? Object.keys(attempt.answers).length : 0),
    [attempt],
  );

  if (!ready || !attempt) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const question = attempt.questions[index]!;
  const total = attempt.questions.length;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const lowTime = remaining <= 60;

  // Auto-save: every answer selection persists the attempt to session storage.
  function selectOption(option: OptionKey) {
    setAttempt((prev) => {
      if (!prev) return prev;
      const next = { ...prev, answers: { ...prev.answers, [question.id]: option } };
      attemptStore.set(next);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div>
            <h1 className="font-display text-sm font-semibold">{attempt.test.title}</h1>
            <p className="text-xs text-muted-foreground">
              {attempt.student.name} · {attempt.student.hall_ticket} ·{" "}
              {attempt.student.department}-{attempt.student.section}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 font-display text-sm tabular-nums",
                lowTime
                  ? "border-destructive/50 bg-destructive/10 text-destructive"
                  : "border-border bg-card/60",
              )}
            >
              <Clock className="size-4" />
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
            <Button
              size="sm"
              className="rounded-full"
              onClick={() => setConfirmOpen(true)}
              disabled={submitting}
            >
              Submit
            </Button>
          </div>
        </div>
        <Progress value={(answeredCount / total) * 100} className="h-1 rounded-none" />
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_240px]">
        <motion.section
          key={question.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="glass rounded-3xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              Question {index + 1} of {total}
            </Badge>
            <Badge variant="outline">{question.difficulty}</Badge>
            <span className="text-xs text-muted-foreground">
              {question.marks} mark{question.marks > 1 ? "s" : ""}
            </span>
          </div>

          <h2 className="mt-5 text-lg font-semibold leading-snug sm:text-xl">
            {question.question}
          </h2>

          <div className="mt-6 space-y-3">
            {OPTION_KEYS.map((key) => {
              const text = question[`option_${key.toLowerCase()}` as keyof typeof question] as string;
              const active = attempt.answers[question.id] === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectOption(key)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors duration-100 hover:border-primary/60 active:border-primary",
                    active
                      ? "border-primary bg-primary/10 shadow-glow"
                      : "border-border bg-card/40",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border font-display text-xs",
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                    )}
                  >
                    {key}
                  </span>
                  <span className="pt-0.5 text-sm">{text}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
              disabled={index === 0}
            >
              <ChevronLeft className="mr-1 size-4" /> Previous
            </Button>
            {index === total - 1 ? (
              <Button onClick={() => setConfirmOpen(true)}>Review & Submit</Button>
            ) : (
              <Button onClick={() => setIndex((prev) => Math.min(total - 1, prev + 1))}>
                Next <ChevronRight className="ml-1 size-4" />
              </Button>
            )}
          </div>
        </motion.section>

        <aside className="glass h-fit rounded-3xl p-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold">Question palette</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {answeredCount} of {total} answered
          </p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {attempt.questions.map((item, itemIndex) => {
              const answered = Boolean(attempt.answers[item.id]);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(itemIndex)}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg border font-display text-xs transition-colors",
                    itemIndex === index && "ring-2 ring-ring",
                    answered
                      ? "border-primary/60 bg-primary/20 text-primary"
                      : "border-border bg-card/50 text-muted-foreground",
                  )}
                >
                  {itemIndex + 1}
                </button>
              );
            })}
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning" />
            Answers save automatically. You cannot change them after submitting.
          </p>
        </aside>
      </main>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit your test?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} of {total} questions. Submissions are final and
              cannot be edited.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep answering</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handleSubmit(false)} disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : "Submit test"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}