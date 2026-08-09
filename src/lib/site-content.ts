/** Shared shapes for the admin-editable website content. */

export type ClubInfo = {
  college: string;
  campus: string;
  society: string;
  centre: string;
  name: string;
  academicYear: string;
  tagline: string;
  posterUrl: string;
  mission: string;
  goal: string;
  objectives: string[];
  activities: string[];
};

export type HeroContent = {
  badge: string;
  headingLead: string;
  headingAccent: string;
  subheading: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  stats: { value: string; label: string }[];
  aboutHeading: string;
  aboutParagraphs: string[];
  aboutSteps: string[];
};

export type ExamStepsContent = {
  heading: string;
  intro: string;
  items: { title: string; body: string }[];
};

export type CalendarContent = {
  heading: string;
  intro: string;
  rows: { event: string; date: string; day: string }[];
};

export type ClubEvent = {
  id: string;
  title: string;
  kind: string;
  event_date: string;
  event_time: string;
  venue: string;
  audience: string;
  resource_persons: string[];
  highlights: string[];
  summary: string[];
  poster_url: string | null;
  photos: { url: string; alt: string }[];
  sort_order: number;
  published: boolean;
};

export type ClubMember = {
  id: string;
  role_title: string;
  name: string;
  /** Staff-only fields, never included in public site content. */
  pin?: string;
  email?: string;
  phone?: string;
  photo_url: string | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
};

export type SiteContent = {
  club: ClubInfo;
  hero: HeroContent;
  examSteps: ExamStepsContent;
  calendar: CalendarContent;
  events: ClubEvent[];
  members: ClubMember[];
};

export const CONTENT_KEYS = ["club_info", "hero", "exam_steps", "calendar"] as const;
export type ContentKey = (typeof CONTENT_KEYS)[number];

export const DEFAULT_CLUB_INFO: ClubInfo = {
  college: "Smt. B. Seetha Polytechnic",
  campus: "Vishnupur, Bhimavaram",
  society: "Shri Vishnu Educational Society",
  centre: "Vishnu Student Success Centre",
  name: "Code & Creative Club",
  academicYear: "2025-2026",
  tagline: "You dream it, we'll create it",
  posterUrl: "",
  mission: "",
  goal: "",
  objectives: [],
  activities: [],
};

export const DEFAULT_HERO: HeroContent = {
  badge: "Club events, workshops and coding tests",
  headingLead: "Learn, build and compete with the",
  headingAccent: "Code & Creative Club",
  subheading: "",
  primaryCtaLabel: "Start Test",
  secondaryCtaLabel: "Faculty Login",
  stats: [],
  aboutHeading: "About the portal",
  aboutParagraphs: [],
  aboutSteps: [],
};

export const DEFAULT_EXAM_STEPS: ExamStepsContent = {
  heading: "Steps to write an exam",
  intro: "",
  items: [],
};

export const DEFAULT_CALENDAR: CalendarContent = {
  heading: "Monthly calendar",
  intro: "",
  rows: [],
};

/** Merges a raw jsonb blob over the matching defaults so the UI never breaks. */
export function mergeContent<T extends object>(fallback: T, raw: unknown): T {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return fallback;
  return { ...fallback, ...(raw as Partial<T>) };
}

export const EMPTY_SITE_CONTENT: SiteContent = {
  club: DEFAULT_CLUB_INFO,
  hero: DEFAULT_HERO,
  examSteps: DEFAULT_EXAM_STEPS,
  calendar: DEFAULT_CALENDAR,
  events: [],
  members: [],
};