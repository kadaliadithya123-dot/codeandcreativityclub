import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_EXAM_STEPS, type ExamStepsContent } from "@/lib/site-content";

import { Labelled, SaveBar, useContentBlock } from "./shared";

export function ExamStepsEditor() {
  const { query, save } = useContentBlock<ExamStepsContent>("exam_steps", DEFAULT_EXAM_STEPS);
  const [form, setForm] = useState<ExamStepsContent>(DEFAULT_EXAM_STEPS);

  useEffect(() => {
    if (query.data) setForm(query.data);
  }, [query.data]);

  return (
    <div className="space-y-6">
      <Labelled label="Section heading">
        <Input
          value={form.heading}
          onChange={(e) => setForm((p) => ({ ...p, heading: e.target.value }))}
        />
      </Labelled>
      <Labelled label="Intro line">
        <Textarea
          rows={2}
          value={form.intro}
          onChange={(e) => setForm((p) => ({ ...p, intro: e.target.value }))}
        />
      </Labelled>

      <div className="space-y-4">
        <p className="text-sm font-medium">Steps</p>
        {form.items.map((item, index) => (
          <div key={index} className="glass space-y-3 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Input
                value={item.title}
                placeholder="Step title"
                onChange={(e) => {
                  const items = [...form.items];
                  items[index] = { ...item, title: e.target.value };
                  setForm((p) => ({ ...p, items }));
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== index) }))
                }
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Remove step</span>
              </Button>
            </div>
            <Textarea
              rows={2}
              value={item.body}
              placeholder="What the student should do"
              onChange={(e) => {
                const items = [...form.items];
                items[index] = { ...item, body: e.target.value };
                setForm((p) => ({ ...p, items }));
              }}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setForm((p) => ({ ...p, items: [...p.items, { title: "", body: "" }] }))}
        >
          <Plus className="mr-1 size-4" /> Add step
        </Button>
      </div>

      <SaveBar onSave={() => save.mutate(form)} saving={save.isPending} />
    </div>
  );
}