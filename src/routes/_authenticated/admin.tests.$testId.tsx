import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { DIFFICULTIES, OPTION_KEYS } from "@/lib/constants";

export const Route = createFileRoute("/_authenticated/admin/tests/$testId")({
  component: TestQuestionsPage,
});

type QuestionRow = {
  id: string;
  year: string;
  department: string;
  section: string;
  subject: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  difficulty: string;
  marks: number;
  explanation: string | null;
};

type FormState = Omit<QuestionRow, "id">;

function TestQuestionsPage() {
  const { testId } = Route.useParams();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<QuestionRow | null>(null);
  const [form, setForm] = useState<FormState | null>(null);

  const { data: test, isLoading: testLoading } = useQuery({
    queryKey: ["admin", "tests", testId],
    queryFn: async () => {
      const { data, error } = await supabase.from("tests").select("*").eq("id", testId).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: questions = [], isLoading } = useQuery({
    enabled: Boolean(test),
    queryKey: ["admin", "questions", testId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("year", test!.year)
        .eq("department", test!.department)
        .eq("section", test!.section)
        .eq("subject", test!.subject)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as QuestionRow[];
    },
  });

  const save = useMutation({
    mutationFn: async (payload: { id?: string; values: FormState }) => {
      if (payload.id) {
        const { error } = await supabase
          .from("questions")
          .update(payload.values)
          .eq("id", payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("questions").insert(payload.values);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      setForm(null);
      setEditing(null);
      toast.success("Question saved");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("questions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Question deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function emptyForm(): FormState {
    return {
      year: test?.year ?? "",
      department: test?.department ?? "",
      section: test?.section ?? "",
      subject: test?.subject ?? "",
      question: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "A",
      difficulty: "Medium",
      marks: 1,
      explanation: "",
    };
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
  }

  function openEdit(row: QuestionRow) {
    const { id: _id, ...values } = row;
    setEditing(row);
    setForm(values);
  }

  function duplicate(row: QuestionRow) {
    const { id: _id, ...values } = row;
    save.mutate({ values: { ...values, question: `${values.question} (copy)` } });
  }

  function handleSubmit(): void {
    if (!form) return;
    if (form.question.trim().length < 5) {
      toast.error("Enter the question text");
      return;
    }
    if (!form.option_a || !form.option_b || !form.option_c || !form.option_d) {
      toast.error("All four options are required");
      return;
    }
    save.mutate({ ...(editing ? { id: editing.id } : {}), values: form });
  }

  if (testLoading) {
    return <p className="text-sm text-muted-foreground">Loading test…</p>;
  }

  if (!test) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">That test no longer exists.</p>
        <Button asChild variant="outline">
          <Link to="/admin/tests">Back to tests</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/admin/tests">
          <ArrowLeft className="mr-1 size-4" /> All tests
        </Link>
      </Button>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold">{test.title}</h1>
          <p className="text-sm text-muted-foreground">
            {test.year} · {test.department}-{test.section} · {test.subject} ·{" "}
            {questions.length} question{questions.length === 1 ? "" : "s"} available for{" "}
            {test.question_count} shown
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1 size-4" /> Add question
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading questions…</p>}
        {!isLoading && questions.length === 0 && (
          <p className="glass rounded-2xl p-6 text-sm text-muted-foreground">
            No questions yet for this test — add the first one.
          </p>
        )}
        {questions.map((row, index) => (
          <article key={row.id} className="glass space-y-3 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium">
                <span className="text-muted-foreground">Q{index + 1}.</span> {row.question}
              </p>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => openEdit(row)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Duplicate"
                  onClick={() => duplicate(row)}
                >
                  <Copy className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete"
                  onClick={() => remove.mutate(row.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {OPTION_KEYS.map((key) => {
                const field = `option_${key.toLowerCase()}` as keyof QuestionRow;
                const isCorrect = row.correct_answer === key;
                return (
                  <li
                    key={key}
                    className={`rounded-xl border px-3 py-2 ${
                      isCorrect ? "border-success/50 bg-success/10" : "border-border"
                    }`}
                  >
                    <span className="font-medium">{key}.</span> {String(row[field] ?? "")}
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="outline">{row.difficulty}</Badge>
              <Badge variant="outline">
                {row.marks} mark{row.marks === 1 ? "" : "s"}
              </Badge>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={Boolean(form)} onOpenChange={(open) => !open && setForm(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit question" : "Add question"}</DialogTitle>
            <DialogDescription>
              Saved against {test.year} · {test.department}-{test.section} · {test.subject}.
            </DialogDescription>
          </DialogHeader>

          {form && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  rows={3}
                  maxLength={1000}
                  value={form.question}
                  onChange={(event) =>
                    setForm((prev) => (prev ? { ...prev, question: event.target.value } : prev))
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {OPTION_KEYS.map((key) => {
                  const field = `option_${key.toLowerCase()}` as keyof FormState;
                  return (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`option-${key}`}>Option {key}</Label>
                      <Input
                        id={`option-${key}`}
                        maxLength={300}
                        value={String(form[field] ?? "")}
                        onChange={(event) =>
                          setForm((prev) => (prev ? { ...prev, [field]: event.target.value } : prev))
                        }
                      />
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <FormSelect
                  label="Correct answer"
                  value={form.correct_answer}
                  onChange={(value) =>
                    setForm((prev) => (prev ? { ...prev, correct_answer: value } : prev))
                  }
                  options={[...OPTION_KEYS]}
                />
                <FormSelect
                  label="Difficulty"
                  value={form.difficulty}
                  onChange={(value) =>
                    setForm((prev) => (prev ? { ...prev, difficulty: value } : prev))
                  }
                  options={[...DIFFICULTIES]}
                />
                <div className="space-y-2">
                  <Label htmlFor="marks">Marks</Label>
                  <Input
                    id="marks"
                    type="number"
                    min={1}
                    max={20}
                    value={form.marks}
                    onChange={(event) =>
                      setForm((prev) =>
                        prev ? { ...prev, marks: Number(event.target.value) || 1 } : prev,
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation (optional)</Label>
                <Textarea
                  id="explanation"
                  rows={2}
                  maxLength={600}
                  value={form.explanation ?? ""}
                  onChange={(event) =>
                    setForm((prev) => (prev ? { ...prev, explanation: event.target.value } : prev))
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setForm(null)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={save.isPending}>
              Save question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}