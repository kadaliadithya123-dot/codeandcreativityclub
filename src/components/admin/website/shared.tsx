import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { mergeContent, type ContentKey } from "@/lib/site-content";

/** Loads and saves one editable jsonb content block. */
export function useContentBlock<T extends object>(key: ContentKey, fallback: T) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["site_content", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      return mergeContent(fallback, data?.value);
    },
  });

  const save = useMutation({
    mutationFn: async (value: T) => {
      const { error } = await supabase
        .from("site_content")
        .upsert({ key, value: value as unknown as Json }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Website updated");
      void queryClient.invalidateQueries({ queryKey: ["site_content", key] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return { query, save };
}

export function SaveBar({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  return (
    <div className="flex justify-end">
      <Button onClick={onSave} disabled={saving}>
        <Save className="mr-1 size-4" /> {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}

export function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            placeholder={placeholder}
            onChange={(event) => {
              const next = [...items];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ""])}>
        <Plus className="mr-1 size-4" /> Add
      </Button>
    </div>
  );
}

export function Labelled({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}