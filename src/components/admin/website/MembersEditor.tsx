import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import type { ClubMember } from "@/lib/site-content";

import { Labelled } from "./shared";

const BLANK: ClubMember = {
  id: "",
  role_title: "",
  name: "",
  pin: "",
  email: "",
  phone: "",
  photo_url: null,
  featured: false,
  sort_order: 0,
  published: true,
};

export function MembersEditor() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<ClubMember | null>(null);

  const members = useQuery({
    queryKey: ["club_members", "admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as ClubMember[];
    },
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["club_members", "admin"] });
  };

  const upsert = useMutation({
    mutationFn: async (member: ClubMember) => {
      const { id, ...rest } = member;
      const payload = { ...rest, photo_url: rest.photo_url || null } as never;
      const query = id
        ? supabase.from("club_members").update(payload).eq("id", id)
        : supabase.from("club_members").insert(payload);
      const { error } = await query;
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Member saved");
      setDraft(null);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("club_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Member removed");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function set<K extends keyof ClubMember>(field: K, value: ClubMember[K]) {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Office bearers and members. Mark the president as featured to highlight them.
        </p>
        <Button
          size="sm"
          onClick={() => setDraft({ ...BLANK, sort_order: (members.data?.length ?? 0) + 1 })}
        >
          <Plus className="mr-1 size-4" /> New member
        </Button>
      </div>

      {members.isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading members…
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {(members.data ?? []).map((member) => (
          <div
            key={member.id}
            className="glass flex items-start gap-3 rounded-xl p-4 transition-shadow duration-200 hover:shadow-lg hover:ring-1 hover:ring-primary/30"
          >
            {member.photo_url ? (
              <img
                src={member.photo_url}
                alt={member.name}
                loading="lazy"
                className="size-12 shrink-0 rounded-full object-cover"
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{member.name || "Unnamed"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {member.role_title}
                {member.featured ? " · featured" : ""}
                {member.published ? "" : " · hidden"}
              </p>
              <dl className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                <div className="truncate">PIN: {member.pin || "—"}</div>
                <div className="truncate">Phone: {member.phone || "—"}</div>
                <div className="truncate">Email: {member.email || "—"}</div>
                <div className="truncate">Order: {member.sort_order}</div>
              </dl>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => setDraft(member)}>
                Edit
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove.mutate(member.id)}
                disabled={remove.isPending}
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Delete member</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={draft !== null} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft?.id ? "Edit member" : "New member"}</DialogTitle>
          </DialogHeader>
          {draft ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Labelled label="Name">
                  <Input value={draft.name} onChange={(e) => set("name", e.target.value)} />
                </Labelled>
                <Labelled label="Role title">
                  <Input value={draft.role_title} onChange={(e) => set("role_title", e.target.value)} />
                </Labelled>
                <Labelled label="PIN / roll number">
                  <Input value={draft.pin} onChange={(e) => set("pin", e.target.value)} />
                </Labelled>
                <Labelled label="Phone">
                  <Input value={draft.phone} onChange={(e) => set("phone", e.target.value)} />
                </Labelled>
                <Labelled label="Email">
                  <Input value={draft.email} onChange={(e) => set("email", e.target.value)} />
                </Labelled>
                <Labelled label="Display order">
                  <Input
                    type="number"
                    value={draft.sort_order}
                    onChange={(e) => set("sort_order", Number(e.target.value))}
                  />
                </Labelled>
              </div>

              <MediaInput
                label="Photo"
                value={draft.photo_url ?? ""}
                onChange={(url) => set("photo_url", url || null)}
              />

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-3 text-sm font-medium">
                  <Switch
                    checked={draft.featured}
                    onCheckedChange={(checked) => set("featured", checked)}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-3 text-sm font-medium">
                  <Switch
                    checked={draft.published}
                    onCheckedChange={(checked) => set("published", checked)}
                  />
                  Visible on website
                </label>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button onClick={() => draft && upsert.mutate(draft)} disabled={upsert.isPending}>
              {upsert.isPending ? "Saving…" : "Save member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}