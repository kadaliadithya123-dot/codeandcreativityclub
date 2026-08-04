/** Shared academic taxonomy used by both the student flow and the admin panel. */
export const YEARS = ["First Year", "Second Year", "Final Year"] as const;

export const DEPARTMENTS = ["CME", "CSE", "ECE", "EEE", "ME", "Civil"] as const;

export const DEPARTMENT_LABELS: Record<string, string> = {
  CME: "Computer Engineering",
  CSE: "Computer Science",
  ECE: "Electronics & Comm.",
  EEE: "Electrical & Electronics",
  ME: "Mechanical",
  Civil: "Civil Engineering",
};

export const SECTIONS = ["A", "B", "C", "D"] as const;

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export const OPTION_KEYS = ["A", "B", "C", "D"] as const;

export type OptionKey = (typeof OPTION_KEYS)[number];

/** Performance badge derived from the final percentage. */
export function performanceBadge(percentage: number) {
  if (percentage >= 85) return { label: "Excellent", tone: "success" as const };
  if (percentage >= 70) return { label: "Good", tone: "primary" as const };
  if (percentage >= 50) return { label: "Average", tone: "warning" as const };
  return { label: "Needs Improvement", tone: "destructive" as const };
}

export function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}