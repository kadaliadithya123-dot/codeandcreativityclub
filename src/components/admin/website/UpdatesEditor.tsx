import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_UPDATES, type UpdateItem, type UpdatesContent } from "@/lib/site-content";

import { Labelled, SaveBar, useContentBlock } from "./shared";

const EMPTY_ITEM: UpdateItem = {
  title: "",
  kind: "Quiz",
  date: "",
  time: "",
  venue: "",
  status: "Upcoming",
  details: "",
};

export function UpdatesEditor() {
  const { query, save } = useContentBlock<UpdatesContent>("updates", DEFAULT_UPDATES);
  const [form, setForm] = useState<UpdatesContent>(DEFAULT_UPDATES);

  useEffect(() => {
    if (query.data) setForm(query.data);
  }, [query.data]);

  function patchItem(index: number, patch: Partial<UpdateItem>) {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index]!, ...patch };
      return { ...prev, items };
    });
  }

  return (
    <div className="space-y-6">
      <Labelled label="Page heading">
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
      <div className="grid gap-4 sm:grid-cols-2">
        <Labelled label="Home page button label">
          <Input
            value={form.ctaLabel}
            onChange={(e) => setForm((p) => ({ ...p, ctaLabel: e.target.value }))}
          />
        </Labelled>
        <Labelled label="Message when there are no updates">
          <Input
            value={form.emptyMessage}
            onChange={(e) => setForm((p) => ({ ...p, emptyMessage: e.target.value }))}
          />
        </Labelled>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium">Updates / upcoming events</p>
        {form.items.map((item, index) => (
          <div key={index} className="space-y-3 rounded-2xl border border-border/60 p-4">
            <div className="flex items-start gap-2">
              <Input
                value={item.title}
                placeholder="Title (e.g. Python Quiz - Round 1)"
                onChange={(e) => patchItem(index, { title: e.target.value })}
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
                <span className="sr-only">Remove update</span>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                value={item.kind}
                placeholder="Type (Quiz / Workshop / Event)"
                onChange={(e) => patchItem(index, { kind: e.target.value })}
              />
              <Input
                value={item.date}
                placeholder="Date (e.g. 12 Sep 2026)"
                onChange={(e) => patchItem(index, { date: e.target.value })}
              />
              <Input
                value={item.time}
                placeholder="Time (e.g. 10:00 AM)"
                onChange={(e) => patchItem(index, { time: e.target.value })}
              />
              <Input
                value={item.venue}
                placeholder="Venue"
                onChange={(e) => patchItem(index, { venue: e.target.value })}
              />
              <Input
                value={item.status}
                placeholder="Status (Upcoming / Live / Completed)"
                onChange={(e) => patchItem(index, { status: e.target.value })}
              />
            </div>
            <Textarea
              rows={3}
              value={item.details}
              placeholder="Details students should know"
              onChange={(e) => patchItem(index, { details: e.target.value })}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setForm((p) => ({ ...p, items: [...p.items, { ...EMPTY_ITEM }] }))}
        >
          <Plus className="mr-1 size-4" /> Add update
        </Button>
      </div>

      <SaveBar onSave={() => save.mutate(form)} saving={save.isPending} />
    </div>
  );
}