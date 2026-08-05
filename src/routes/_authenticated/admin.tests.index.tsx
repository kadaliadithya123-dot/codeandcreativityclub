import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ListChecks, Pencil, Plus, Trash2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { DEPARTMENTS, SECTIONS, YEARS } from "@/lib/constants";

export const Route = createFileRoute("/_authenticated/admin/tests/")({
  component: TestsPage,
});

type TestRow = {
  id: string;
  title: string;
  year: string;
  department: string;
  section: string;
  subject: string;
  duration_minutes: number;
  question_count: number;
  status: string;
  shuffle_questions: boolean;
  shuffle_options: boolean;
};

type FormState = Omit<TestRow, "id">;

const EMPTY_FORM: FormState = {
  title: "",
  year: "Second Year",
  department: "CME",
  section: "A",
  subject: "",
  duration_minutes: 20,
  question_count: 10,
  status: "draft",
  shuffle_questions: true,
  shuffle_options: false,
};

function TestsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<TestRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [open, setOpen] = useState(false);

  const { data: tests = [], isLoading } = useQuery({
    queryKey: ["admin", "tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as TestRow[];
    },
  });

  const published = useMemo(() => tests.filter((row) => row.status === "published").length, [tests]);

  const save = useMutation({
    mutationFn: async (payload: { id?: string; values: FormState }) => {
      if (payload.id) {
        const { error } = await supabase.from("tests").update(payload.values).eq("id", payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("tests").insert(payload.values);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      setOpen(false);
      toast.success("Test saved");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const togglePublish = useMutation({
    mutationFn: async (row: TestRow) => {
      const { error } = await supabase
        .from("tests")
        .update({ status: row.status === "published" ? "draft" : "published" })
        .eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Test deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(row: TestRow) {
    const { id: _id, ...values } = row;
    setEditing(row);
    setForm(values);
    setOpen(true);
  }

  function handleSubmit(): void {
    if (form.title.trim().length < 3) {
      toast.error("Give the test a title");
      return;
    }
    if (form.subject.trim().length < 2) {
      toast.error("Enter a subject");
      return;
    }
    save.mutate({ ...(editing ? { id: editing.id } : {}), values: form });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Manage Tests</h1>
          <p className="text-sm text-muted-foreground">
            {tests.length} test{tests.length === 1 ? "" : "s"} · {published} published · open a test
            to manage its questions
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1 size-4" /> Create test
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {isLoading && <p className="text-sm text-muted-foreground">Loading tests…</p>}
        {!isLoading && tests.length === 0 && (
          <p className="text-sm text-muted-foreground">No tests yet — create your first one.</p>
        )}
        {tests.map((row) => (
          <article key={row.id} className="glass space-y-3 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate font-display text-lg font-semibold">{row.title}</h2>
                <p className="text-xs text-muted-foreground">
                  {row.year} · {row.department}-{row.section} · {row.subject}
                </p>
              </div>
              <Badge variant={row.status === "published" ? "default" : "outline"}>
                {row.status === "published" ? "Published" : "Draft"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>{row.question_count} questions</span>
              <span>{row.duration_minutes} minutes</span>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={row.status === "published"}
                  onCheckedChange={() => togglePublish.mutate(row)}
                  aria-label="Toggle published"
                />
                Live for students
              </label>
              <div className="flex gap-1">
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/admin/tests/$testId" params={{ testId: row.id }}>
                    <ListChecks className="mr-1 size-4" /> Questions
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => openEdit(row)}>
                  <Pencil className="size-4" />
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
          </article>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit test" : "Create test"}</DialogTitle>
            <DialogDescription>
              Students see a test once it is published for their year, department and section.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              maxLength={120}
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <PickerField
              label="Academic year"
              value={form.year}
              onChange={(value) => setForm((prev) => ({ ...prev, year: value }))}
              options={[...YEARS]}
            />
            <PickerField
              label="Department"
              value={form.department}
              onChange={(value) => setForm((prev) => ({ ...prev, department: value }))}
              options={[...DEPARTMENTS]}
            />
            <PickerField
              label="Section"
              value={form.section}
              onChange={(value) => setForm((prev) => ({ ...prev, section: value }))}
              options={[...SECTIONS]}
            />
            <div className="space-y-2">
              <Label htmlFor="test-subject">Subject</Label>
              <Input
                id="test-subject"
                maxLength={60}
                value={form.subject}
                onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min={1}
                max={180}
                value={form.duration_minutes}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    duration_minutes: Number(event.target.value) || 1,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="question-count">Questions</Label>
              <Input
                id="question-count"
                type="number"
                min={1}
                max={100}
                value={form.question_count}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, question_count: Number(event.target.value) || 1 }))
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm">
              <Switch
                checked={form.status === "published"}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, status: checked ? "published" : "draft" }))
                }
              />
              Publish immediately
            </label>
            <label className="flex items-center gap-3 text-sm">
              <Switch
                checked={form.shuffle_questions}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, shuffle_questions: checked }))
                }
              />
              Shuffle question order
            </label>
            <label className="flex items-center gap-3 text-sm">
              <Switch
                checked={form.shuffle_options}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, shuffle_options: checked }))
                }
              />
              Shuffle answer options
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={save.isPending}>
              Save test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PickerField({
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