import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
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
import { DEPARTMENTS, DIFFICULTIES, OPTION_KEYS, SECTIONS, YEARS } from "@/lib/constants";

export const Route = createFileRoute("/_authenticated/admin/questions")({
  component: QuestionsPage,
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

const EMPTY_FORM: FormState = {
  year: "Second Year",
  department: "CME",
  section: "A",
  subject: "",
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

const PAGE_SIZE = 8;

function QuestionsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ year: "all", department: "all", difficulty: "all" });
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<QuestionRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formOpen, setFormOpen] = useState(false);
  const [preview, setPreview] = useState<QuestionRow | null>(null);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["admin", "questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as QuestionRow[];
    },
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return questions.filter((row) => {
      if (filters.year !== "all" && row.year !== filters.year) return false;
      if (filters.department !== "all" && row.department !== filters.department) return false;
      if (filters.difficulty !== "all" && row.difficulty !== filters.difficulty) return false;
      if (!term) return true;
      return `${row.question} ${row.subject}`.toLowerCase().includes(term);
    });
  }, [questions, search, filters]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const save = useMutation({
    mutationFn: async (payload: { id?: string; values: FormState }) => {
      if (payload.id) {
        const { error } = await supabase.from("questions").update(payload.values).eq("id", payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("questions").insert(payload.values);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      setFormOpen(false);
      toast.success(editing ? "Question updated" : "Question added");
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

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(row: QuestionRow) {
    const { id: _id, ...values } = row;
    setEditing(row);
    setForm(values);
    setFormOpen(true);
  }

  function duplicate(row: QuestionRow) {
    const { id: _id, ...values } = row;
    save.mutate({ values: { ...values, question: `${values.question} (copy)` } });
  }

  function handleSubmit(): void {
    if (form.subject.trim().length < 2) {
      toast.error("Enter a subject");
      return;
    }
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Manage Questions</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} question{filtered.length === 1 ? "" : "s"} in the bank
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1 size-4" /> Add question
        </Button>
      </div>

      <div className="glass grid gap-3 rounded-2xl p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Search questions"
            className="pl-9"
          />
        </div>
        <FilterSelect
          value={filters.year}
          onChange={(value) => setFilters((prev) => ({ ...prev, year: value }))}
          placeholder="All years"
          options={[...YEARS]}
        />
        <FilterSelect
          value={filters.department}
          onChange={(value) => setFilters((prev) => ({ ...prev, department: value }))}
          placeholder="All departments"
          options={[...DEPARTMENTS]}
        />
        <FilterSelect
          value={filters.difficulty}
          onChange={(value) => setFilters((prev) => ({ ...prev, difficulty: value }))}
          placeholder="All difficulties"
          options={[...DIFFICULTIES]}
        />
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Scope</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Loading questions…
                  </td>
                </tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No questions match these filters.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-border/40 last:border-0">
                  <td className="max-w-sm px-4 py-3">
                    <p className="line-clamp-2">{row.question}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {row.year} · {row.department}-{row.section}
                  </td>
                  <td className="px-4 py-3">{row.subject}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{row.difficulty}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" aria-label="Preview" onClick={() => setPreview(row)}>
                        <Eye className="size-4" />
                      </Button>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-sm">
          <span className="text-muted-foreground">
            Page {page + 1} of {pageCount}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit question" : "Add question"}</DialogTitle>
            <DialogDescription>
              Questions are shown only to the year, department and section you tag here.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormSelect
              label="Academic year"
              value={form.year}
              onChange={(value) => setForm((prev) => ({ ...prev, year: value }))}
              options={[...YEARS]}
            />
            <FormSelect
              label="Department"
              value={form.department}
              onChange={(value) => setForm((prev) => ({ ...prev, department: value }))}
              options={[...DEPARTMENTS]}
            />
            <FormSelect
              label="Section"
              value={form.section}
              onChange={(value) => setForm((prev) => ({ ...prev, section: value }))}
              options={[...SECTIONS]}
            />
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={form.subject}
                maxLength={60}
                onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              rows={3}
              maxLength={1000}
              value={form.question}
              onChange={(event) => setForm((prev) => ({ ...prev, question: event.target.value }))}
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
                      setForm((prev) => ({ ...prev, [field]: event.target.value }))
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
              onChange={(value) => setForm((prev) => ({ ...prev, correct_answer: value }))}
              options={[...OPTION_KEYS]}
            />
            <FormSelect
              label="Difficulty"
              value={form.difficulty}
              onChange={(value) => setForm((prev) => ({ ...prev, difficulty: value }))}
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
                  setForm((prev) => ({ ...prev, marks: Number(event.target.value) || 1 }))
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
              onChange={(event) => setForm((prev) => ({ ...prev, explanation: event.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={save.isPending}>
              Save question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(preview)} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Question preview</DialogTitle>
            <DialogDescription>
              {preview?.year} · {preview?.department}-{preview?.section} · {preview?.subject}
            </DialogDescription>
          </DialogHeader>
          <p className="font-medium">{preview?.question}</p>
          <ul className="space-y-2 text-sm">
            {OPTION_KEYS.map((key) => {
              const field = `option_${key.toLowerCase()}` as keyof QuestionRow;
              const isCorrect = preview?.correct_answer === key;
              return (
                <li
                  key={key}
                  className={`rounded-xl border px-3 py-2 ${
                    isCorrect ? "border-success/50 bg-success/10" : "border-border"
                  }`}
                >
                  <span className="font-medium">{key}.</span> {String(preview?.[field] ?? "")}
                </li>
              );
            })}
          </ul>
          {preview?.explanation && (
            <p className="text-sm text-muted-foreground">{preview.explanation}</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
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