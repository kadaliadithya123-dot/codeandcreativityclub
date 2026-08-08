import { useRef, useState } from "react";
import { ImageUp, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

/** Uploads an image to the club media bucket and returns its public site URL. */
export async function uploadClubMedia(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("club-media")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return `/api/public/media/${path}`;
}

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
};

export function MediaInput({ label, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadClubMedia(file));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Image URL or upload a file"
          className="min-w-0 flex-1"
        />
        <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? <Loader2 className="mr-1 size-4 animate-spin" /> : <ImageUp className="mr-1 size-4" />}
          Upload
        </Button>
        {value ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
            <X className="size-4" />
            <span className="sr-only">Remove image</span>
          </Button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
      {value ? (
        <img src={value} alt="" className="max-h-40 rounded-lg border border-border/60" />
      ) : null}
    </div>
  );
}