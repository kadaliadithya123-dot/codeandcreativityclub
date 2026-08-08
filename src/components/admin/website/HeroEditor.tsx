import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_HERO, type HeroContent } from "@/lib/site-content";

import { Labelled, SaveBar, StringListEditor, useContentBlock } from "./shared";

export function HeroEditor() {
  const { query, save } = useContentBlock<HeroContent>("hero", DEFAULT_HERO);
  const [form, setForm] = useState<HeroContent>(DEFAULT_HERO);

  useEffect(() => {
    if (query.data) setForm(query.data);
  }, [query.data]);

  function set<K extends keyof HeroContent>(field: K, value: HeroContent[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="space-y-6">
      <Labelled label="Badge text">
        <Input value={form.badge} onChange={(e) => set("badge", e.target.value)} />
      </Labelled>
      <div className="grid gap-4 sm:grid-cols-2">
        <Labelled label="Headline (plain part)">
          <Input value={form.headingLead} onChange={(e) => set("headingLead", e.target.value)} />
        </Labelled>
        <Labelled label="Headline (highlighted part)">
          <Input value={form.headingAccent} onChange={(e) => set("headingAccent", e.target.value)} />
        </Labelled>
      </div>
      <Labelled label="Sub-heading">
        <Textarea rows={3} value={form.subheading} onChange={(e) => set("subheading", e.target.value)} />
      </Labelled>
      <div className="grid gap-4 sm:grid-cols-2">
        <Labelled label="Primary button label">
          <Input value={form.primaryCtaLabel} onChange={(e) => set("primaryCtaLabel", e.target.value)} />
        </Labelled>
        <Labelled label="Secondary button label">
          <Input value={form.secondaryCtaLabel} onChange={(e) => set("secondaryCtaLabel", e.target.value)} />
        </Labelled>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Highlight stats</p>
        {form.stats.map((stat, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={stat.value}
              placeholder="6"
              className="w-24"
              onChange={(e) => {
                const next = [...form.stats];
                next[index] = { ...stat, value: e.target.value };
                set("stats", next);
              }}
            />
            <Input
              value={stat.label}
              placeholder="Departments"
              onChange={(e) => {
                const next = [...form.stats];
                next[index] = { ...stat, label: e.target.value };
                set("stats", next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => set("stats", form.stats.filter((_, i) => i !== index))}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Remove stat</span>
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => set("stats", [...form.stats, { value: "", label: "" }])}
        >
          <Plus className="mr-1 size-4" /> Add stat
        </Button>
      </div>

      <Labelled label="About section heading">
        <Input value={form.aboutHeading} onChange={(e) => set("aboutHeading", e.target.value)} />
      </Labelled>
      <StringListEditor
        label="About paragraphs"
        items={form.aboutParagraphs}
        onChange={(items) => set("aboutParagraphs", items)}
      />
      <StringListEditor
        label="About numbered steps"
        items={form.aboutSteps}
        onChange={(items) => set("aboutSteps", items)}
      />

      <SaveBar onSave={() => save.mutate(form)} saving={save.isPending} />
    </div>
  );
}