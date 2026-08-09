import { createServerFn } from "@tanstack/react-start";

import {
  DEFAULT_CALENDAR,
  DEFAULT_CLUB_INFO,
  DEFAULT_EXAM_STEPS,
  DEFAULT_HERO,
  EMPTY_SITE_CONTENT,
  mergeContent,
  type ClubEvent,
  type ClubMember,
  type SiteContent,
} from "./site-content";

/** Public, read-only fetch of every editable website block (safe for SSR). */
export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteContent> => {
    const { createPublicSupabaseClient } = await import("./supabase-public.server");
    const supabase = createPublicSupabaseClient();

    const [blocks, events, members] = await Promise.all([
      supabase.from("site_content").select("key, value"),
      supabase.from("club_events").select("*").eq("published", true).order("sort_order"),
      supabase
        .from("club_members_public")
        .select("id, role_title, name, photo_url, featured, sort_order, published")
        .order("sort_order"),
    ]);

    if (blocks.error || events.error || members.error) return EMPTY_SITE_CONTENT;

    const byKey = new Map((blocks.data ?? []).map((row) => [row.key, row.value]));

    return {
      club: mergeContent(DEFAULT_CLUB_INFO, byKey.get("club_info")),
      hero: mergeContent(DEFAULT_HERO, byKey.get("hero")),
      examSteps: mergeContent(DEFAULT_EXAM_STEPS, byKey.get("exam_steps")),
      calendar: mergeContent(DEFAULT_CALENDAR, byKey.get("calendar")),
      events: (events.data ?? []) as unknown as ClubEvent[],
      members: (members.data ?? []) as unknown as ClubMember[],
    };
  },
);