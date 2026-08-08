import { useEffect, useState } from "react";

import { MediaInput } from "@/components/admin/MediaInput";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_CLUB_INFO, type ClubInfo } from "@/lib/site-content";

import { Labelled, SaveBar, StringListEditor, useContentBlock } from "./shared";

export function ClubInfoEditor() {
  const { query, save } = useContentBlock<ClubInfo>("club_info", DEFAULT_CLUB_INFO);
  const [form, setForm] = useState<ClubInfo>(DEFAULT_CLUB_INFO);

  useEffect(() => {
    if (query.data) setForm(query.data);
  }, [query.data]);

  function set<K extends keyof ClubInfo>(field: K, value: ClubInfo[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Labelled label="Club name">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
        </Labelled>
        <Labelled label="Tagline">
          <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Labelled>
        <Labelled label="College">
          <Input value={form.college} onChange={(e) => set("college", e.target.value)} />
        </Labelled>
        <Labelled label="Campus">
          <Input value={form.campus} onChange={(e) => set("campus", e.target.value)} />
        </Labelled>
        <Labelled label="Society">
          <Input value={form.society} onChange={(e) => set("society", e.target.value)} />
        </Labelled>
        <Labelled label="Centre">
          <Input value={form.centre} onChange={(e) => set("centre", e.target.value)} />
        </Labelled>
        <Labelled label="Academic year">
          <Input value={form.academicYear} onChange={(e) => set("academicYear", e.target.value)} />
        </Labelled>
      </div>

      <MediaInput
        label="Club poster"
        value={form.posterUrl}
        onChange={(url) => set("posterUrl", url)}
      />

      <Labelled label="Mission">
        <Textarea rows={5} value={form.mission} onChange={(e) => set("mission", e.target.value)} />
      </Labelled>
      <Labelled label="Goal">
        <Textarea rows={3} value={form.goal} onChange={(e) => set("goal", e.target.value)} />
      </Labelled>

      <StringListEditor
        label="Objectives"
        items={form.objectives}
        onChange={(items) => set("objectives", items)}
      />
      <StringListEditor
        label="Club activities"
        items={form.activities}
        onChange={(items) => set("activities", items)}
      />

      <SaveBar onSave={() => save.mutate(form)} saving={save.isPending} />
    </div>
  );
}