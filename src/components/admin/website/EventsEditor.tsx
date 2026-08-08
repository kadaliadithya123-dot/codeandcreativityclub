import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { MediaInput } from "@/components/admin/MediaInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { ClubEvent } from "@/lib/site-content";

import { Labelled, StringListEditor } from "./shared";

const BLANK: ClubEvent = {
  id: "",
  title: "",
  kind: "",
  event_date: "",
  event_time: "",
  venue: "",
  audience: "",
  resource_persons: [],
  highlights: [],
  summary: [],
  poster_url: null,
  photos: [],
  sort_order: 0,
  published: true,
};

export function EventsEditor() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<ClubEvent | null>(null);

  const events = useQuery({
    queryKey: ["club_events", "admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_events")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as ClubEvent[];
    },
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["club_events", "admin"] });
  };

  const upsert = useMutation({
    mutationFn: async (event: ClubEvent) => {
      const { id, ...rest } = event;
      const payload = { ...rest, poster_url: rest.poster_url || null } as never;
      const query = id
        ? supabase.from("club_events").update(payload).eq("id", id)
        : supabase.from("club_events").insert(payload);
      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Event saved");
      setDraft(null);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("club_events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Event deleted");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function set<K extends keyof ClubEvent>(field: K, value: ClubEvent[K]) {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Events shown on the home page. Unpublished events stay hidden from students.
        </p>
        <Button
          size="sm"
          onClick={() => setDraft({ ...BLANK, sort_order: (events.data?.length ?? 0) + 1 })}
        >
          <Plus className="mr-1 size-4" /> New event
        </Button>
      </div>

      {events.isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading events…
        </div>
      ) : null}

      <div className="grid gap-3">
        {(events.data ?? []).map((event) => (
          <div key={event.id} className="glass flex flex-wrap items-center gap-3 rounded-xl p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{event.title || "Untitled event"}</p>
              <p className="text-xs text-muted-foreground">
                {[event.kind, event.event_date, event.venue].filter(Boolean).join(" · ")}
                {event.published ? "" : " · draft"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setDraft(event)}>
              <Pencil className="mr-1 size-4" /> Edit
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => remove.mutate(event.id)}
              disabled={remove.isPending}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Delete event</span>
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={draft !== null} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft?.id ? "Edit event" : "New event"}</DialogTitle>
          </DialogHeader>
          {draft ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Labelled label="Title">
                  <Input value={draft.title} onChange={(e) => set("title", e.target.value)} />
                </Labelled>
                <Labelled label="Kind (workshop, contest…)">
                  <Input value={draft.kind} onChange={(e) => set("kind", e.target.value)} />
                </Labelled>
                <Labelled label="Date">
                  <Input value={draft.event_date} onChange={(e) => set("event_date", e.target.value)} />
                </Labelled>
                <Labelled label="Time">
                  <Input value={draft.event_time} onChange={(e) => set("event_time", e.target.value)} />
                </Labelled>
                <Labelled label="Venue">
                  <Input value={draft.venue} onChange={(e) => set("venue", e.target.value)} />
                </Labelled>
                <Labelled label="Audience">
                  <Input value={draft.audience} onChange={(e) => set("audience", e.target.value)} />
                </Labelled>
                <Labelled label="Display order">
                  <Input
                    type="number"
                    value={draft.sort_order}
                    onChange={(e) => set("sort_order", Number(e.target.value))}
                  />
                </Labelled>
              </div>

              <label className="flex items-center gap-3 text-sm font-medium">
                <Switch
                  checked={draft.published}
                  onCheckedChange={(checked) => set("published", checked)}
                />
                Published on the website
              </label>

              <MediaInput
                label="Poster"
                value={draft.poster_url ?? ""}
                onChange={(url) => set("poster_url", url || null)}
              />

              <StringListEditor
                label="Resource persons"
                items={draft.resource_persons}
                onChange={(items) => set("resource_persons", items)}
              />
              <StringListEditor
                label="Highlights"
                items={draft.highlights}
                onChange={(items) => set("highlights", items)}
              />
              <StringListEditor
                label="Summary paragraphs"
                items={draft.summary}
                onChange={(items) => set("summary", items)}
              />

              <div className="space-y-3">
                <p className="text-sm font-medium">Event photos</p>
                {draft.photos.map((photo, index) => (
                  <div key={index} className="glass space-y-3 rounded-xl p-3">
                    <MediaInput
                      label={`Photo ${index + 1}`}
                      value={photo.url}
                      onChange={(url) => {
                        const photos = [...draft.photos];
                        photos[index] = { ...photo, url };
                        set("photos", photos);
                      }}
                    />
                    <div className="flex gap-2">
                      <Textarea
                        rows={2}
                        value={photo.alt}
                        placeholder="Caption / alt text"
                        onChange={(e) => {
                          const photos = [...draft.photos];
                          photos[index] = { ...photo, alt: e.target.value };
                          set("photos", photos);
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          set(
                            "photos",
                            draft.photos.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Remove photo</span>
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => set("photos", [...draft.photos, { url: "", alt: "" }])}
                >
                  <Plus className="mr-1 size-4" /> Add photo
                </Button>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => draft && upsert.mutate(draft)}
              disabled={upsert.isPending}
            >
              {upsert.isPending ? "Saving…" : "Save event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}