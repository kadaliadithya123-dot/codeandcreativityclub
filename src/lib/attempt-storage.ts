/** Session-scoped storage for the in-progress attempt and the last result. */
export type AttemptQuestion = {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  marks: number;
  difficulty: string;
  subject: string;
};

export type AttemptStudent = {
  id: string;
  name: string;
  hall_ticket: string;
  year: string;
  department: string;
  section: string;
};

export type Attempt = {
  student: AttemptStudent;
  test: {
    id: string;
    title: string;
    subject: string;
    duration_minutes: number;
    shuffle_options: boolean;
  };
  questions: AttemptQuestion[];
  answers: Record<string, "A" | "B" | "C" | "D">;
  startedAt: number;
  attemptToken: string;
};

export type ReviewItem = {
  id: string;
  question: string;
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  correct_answer: string;
  student_answer: string | null;
  is_correct: boolean;
  marks: number;
  marks_awarded: number;
  explanation: string | null;
};

export type AttemptResult = {
  student: AttemptStudent;
  score: number;
  total_marks: number;
  percentage: number;
  correct: number;
  wrong: number;
  time_taken_seconds: number;
  test_title: string;
  subject: string;
  review?: ReviewItem[];
};

const ATTEMPT_KEY = "portal-attempt";
const RESULT_KEY = "portal-result";

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(key, JSON.stringify(value));
}

export const attemptStore = {
  get: () => read<Attempt>(ATTEMPT_KEY),
  set: (attempt: Attempt) => write(ATTEMPT_KEY, attempt),
  clear: () => window.sessionStorage.removeItem(ATTEMPT_KEY),
};

export const resultStore = {
  get: () => read<AttemptResult>(RESULT_KEY),
  set: (result: AttemptResult) => write(RESULT_KEY, result),
  clear: () => window.sessionStorage.removeItem(RESULT_KEY),
};