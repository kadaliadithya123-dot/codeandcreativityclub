import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Eye, Printer, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AnswerReview } from "@/components/result/AnswerReview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { DEPARTMENTS, YEARS, formatDuration, performanceBadge } from "@/lib/constants";
import type { ReviewItem } from "@/lib/attempt-storage";

export const Route = createFileRoute("/_authenticated/admin/results")({
  component: ResultsPage,
});

type ResultRow = {
  id: string;
  score: number;
  total_marks: number;
  correct: number;
  wrong: number;
  percentage: number;
  time_taken_seconds: number;
  submitted_at: string;
  answers: Record<string, "A" | "B" | "C" | "D" | null> | null;
  students: {
    name: string;
    hall_ticket: string;
    year: string;
    department: string;
    section: string;
  } | null;
  tests: { title: string; subject: string } | null;
};

function ResultsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [department, setDepartment] = useState("all");
  const [sort, setSort] = useState("recent");
  const [reviewRow, setReviewRow] = useState<ResultRow | null>(null);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["admin", "results"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("results")
        .select(
          "id, score, total_marks, correct, wrong, percentage, time_taken_seconds, submitted_at, answers, students(name, hall_ticket, year, department, section), tests(title, subject)",
        )
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data as unknown as ResultRow[];
    },
  });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = results.filter((row) => {
      if (year !== "all" && row.students?.year !== year) return false;
      if (department !== "all" && row.students?.department !== department) return false;
      if (!term) return true;
      return `${row.students?.name ?? ""} ${row.students?.hall_ticket ?? ""} ${row.tests?.title ?? ""}`
        .toLowerCase()
        .includes(term);
    });

    return [...filtered].sort((a, b) => {
      if (sort === "highest") return Number(b.percentage) - Number(a.percentage);
      if (sort === "lowest") return Number(a.percentage) - Number(b.percentage);
      return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
    });
  }, [results, search, year, department, sort]);

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("results").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Result deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function exportCsv() {
    const header = [
      "Name",
      "Hall ticket",
      "Year",
      "Department",
      "Section",
      "Test",
      "Score",
      "Total",
      "Percentage",
      "Correct",
      "Wrong",
      "Time taken",
      "Submitted",
    ];
    const body = rows.map((row) => [
      row.students?.name ?? "",
      row.students?.hall_ticket ?? "",
      row.students?.year ?? "",
      row.students?.department ?? "",
      row.students?.section ?? "",
      row.tests?.title ?? "",
      row.score,
      row.total_marks,
      row.percentage,
      row.correct,
      row.wrong,
      formatDuration(row.time_taken_seconds),
      new Date(row.submitted_at).toLocaleString(),
    ]);

    const csv = [header, ...body]
      .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `results-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Results</h1>
          <p className="text-sm text-muted-foreground">
            {rows.length} submission{rows.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="mr-1 size-4" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-1 size-4" /> Print
          </Button>
        </div>
      </div>

      <div className="glass grid gap-3 rounded-2xl p-4 print:hidden sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search student or test"
            className="pl-9"
          />
        </div>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger>
            <SelectValue placeholder="All years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All years</SelectItem>
            {YEARS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="All departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {DEPARTMENTS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="highest">Highest score</SelectItem>
            <SelectItem value="lowest">Lowest score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Test</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Answers</th>
              <th className="px-4 py-3 text-right print:hidden">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Loading results…
                </td>
              </tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No results match these filters.
                </td>
              </tr>
            )}
            {rows.map((row) => {
              const badge = performanceBadge(Number(row.percentage));
              return (
                <tr key={row.id} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{row.students?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.students?.hall_ticket} · {row.students?.department}-
                      {row.students?.section}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{row.tests?.title}</p>
                    <p className="text-xs text-muted-foreground">{row.tests?.subject}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-display font-semibold">
                      {row.score}/{row.total_marks}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">{row.percentage}%</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDuration(row.time_taken_seconds)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{badge.label}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => setReviewRow(row)}>
                      <Eye className="mr-1 size-4" />
                      Review
                    </Button>
                  </td>
                  <td className="px-4 py-3 text-right print:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete result"
                      onClick={() => remove.mutate(row.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={!!reviewRow} onOpenChange={(open) => !open && setReviewRow(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {reviewRow?.students?.name} — {reviewRow?.tests?.title}
            </DialogTitle>
            <DialogDescription>
              {reviewRow?.students?.hall_ticket} · Score {reviewRow?.score}/
              {reviewRow?.total_marks} ({reviewRow?.percentage}%)
            </DialogDescription>
          </DialogHeader>
          {reviewRow && (
            <ResultReview resultId={reviewRow.id} answers={reviewRow.answers ?? {}} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ResultReview({
  resultId,
  answers,
}: {
  resultId: string;
  answers: Record<string, "A" | "B" | "C" | "D" | null>;
}) {
  const questionIds = Object.keys(answers);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin", "result-review", resultId],
    queryFn: async () => {
      if (questionIds.length === 0) return [] as ReviewItem[];
      const { data, error } = await supabase
        .from("questions")
        .select(
          "id, question, option_a, option_b, option_c, option_d, correct_answer, marks, explanation",
        )
        .in("id", questionIds);
      if (error) throw error;
      return (data ?? []).map((q) => {
        const given = answers[q.id] ?? null;
        const isCorrect = given === q.correct_answer;
        return {
          id: q.id,
          question: q.question,
          options: [
            { key: "A" as const, text: q.option_a },
            { key: "B" as const, text: q.option_b },
            { key: "C" as const, text: q.option_c },
            { key: "D" as const, text: q.option_d },
          ],
          correct_answer: q.correct_answer,
          student_answer: given,
          is_correct: isCorrect,
          marks: q.marks,
          marks_awarded: isCorrect ? q.marks : 0,
          explanation: q.explanation ?? null,
        } satisfies ReviewItem;
      });
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading answers…</p>;
  if (items.length === 0)
    return <p className="text-sm text-muted-foreground">No answer data stored for this attempt.</p>;

  return <AnswerReview items={items} />;
}