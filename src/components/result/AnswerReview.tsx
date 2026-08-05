import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ReviewItem } from "@/lib/attempt-storage";

export function AnswerReview({ items }: { items: ReviewItem[] }) {
  const gained = items.filter((item) => item.is_correct);
  const lost = items.filter((item) => !item.is_correct);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-success/15 px-3 py-1 font-medium text-success">
          Marks gained in {gained.length} question{gained.length === 1 ? "" : "s"} (
          {gained.reduce((sum, item) => sum + item.marks_awarded, 0)} marks)
        </span>
        <span className="rounded-full bg-destructive/15 px-3 py-1 font-medium text-destructive">
          Marks lost in {lost.length} question{lost.length === 1 ? "" : "s"} (
          {lost.reduce((sum, item) => sum + item.marks, 0)} marks)
        </span>
      </div>

      <ol className="space-y-4">
        {items.map((item, index) => (
          <li
            key={item.id}
            className={cn(
              "rounded-2xl border p-4",
              item.is_correct
                ? "border-success/40 bg-success/5"
                : "border-destructive/40 bg-destructive/5",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">
                Q{index + 1}. {item.question}
              </p>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
                  item.is_correct
                    ? "bg-success/15 text-success"
                    : "bg-destructive/15 text-destructive",
                )}
              >
                {item.is_correct ? (
                  <CheckCircle2 className="size-3.5" />
                ) : (
                  <XCircle className="size-3.5" />
                )}
                {item.marks_awarded}/{item.marks}
              </span>
            </div>

            <ul className="mt-3 space-y-1.5">
              {item.options.map((option) => {
                const isCorrect = option.key === item.correct_answer;
                const isChosen = option.key === item.student_answer;
                return (
                  <li
                    key={option.key}
                    className={cn(
                      "flex items-start gap-2 rounded-xl border px-3 py-2 text-sm",
                      isCorrect && "border-success/60 bg-success/10",
                      isChosen && !isCorrect && "border-destructive/60 bg-destructive/10",
                      !isCorrect && !isChosen && "border-border/60",
                    )}
                  >
                    <span className="font-display text-xs font-semibold">{option.key}.</span>
                    <span className="flex-1">{option.text}</span>
                    {isChosen && (
                      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        Your answer
                      </span>
                    )}
                    {isCorrect && (
                      <span className="text-[11px] uppercase tracking-wide text-success">
                        Correct
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            <p className="mt-2 text-xs text-muted-foreground">
              {item.student_answer
                ? `Chosen ${item.student_answer} · Correct answer ${item.correct_answer}`
                : `Not answered · Correct answer ${item.correct_answer}`}
            </p>
            {item.explanation && (
              <p className="mt-2 rounded-xl bg-card/60 px-3 py-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Solution: </span>
                {item.explanation}
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}