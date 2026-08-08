import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_CALENDAR, type CalendarContent } from "@/lib/site-content";

import { Labelled, SaveBar, useContentBlock } from "./shared";

export function CalendarEditor() {
  const { query, save } = useContentBlock<CalendarContent>("calendar", DEFAULT_CALENDAR);
  const [form, setForm] = useState<CalendarContent>(DEFAULT_CALENDAR);

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

      <div className="space-y-2">
        <p className="text-sm font-medium">Calendar rows</p>
        {form.rows.map((row, index) => (
          <div key={index} className="flex flex-wrap gap-2">
            <Input
              value={row.event}
              placeholder="Event / activity"
              className="min-w-[12rem] flex-1"
              onChange={(e) => {
                const rows = [...form.rows];
                rows[index] = { ...row, event: e.target.value };
                setForm((p) => ({ ...p, rows }));
              }}
            />
            <Input
              value={row.date}
              placeholder="Date"
              className="w-40"
              onChange={(e) => {
                const rows = [...form.rows];
                rows[index] = { ...row, date: e.target.value };
                setForm((p) => ({ ...p, rows }));
              }}
            />
            <Input
              value={row.day}
              placeholder="Day"
              className="w-32"
              onChange={(e) => {
                const rows = [...form.rows];
                rows[index] = { ...row, day: e.target.value };
                setForm((p) => ({ ...p, rows }));
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setForm((p) => ({ ...p, rows: p.rows.filter((_, i) => i !== index) }))}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Remove row</span>
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setForm((p) => ({ ...p, rows: [...p.rows, { event: "", date: "", day: "" }] }))
          }
        >
          <Plus className="mr-1 size-4" /> Add row
        </Button>
      </div>

      <SaveBar onSave={() => save.mutate(form)} saving={save.isPending} />
    </div>
  );
}