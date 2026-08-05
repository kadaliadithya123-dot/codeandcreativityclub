import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Public (unauthenticated) student exam endpoints.
 *
 * Students never sign in, so all reads/writes happen here on the server with a
 * privileged client. Correct answers are stripped before questions leave the
 * server, and grading happens server-side so scores cannot be tampered with.
 */

const scopeSchema = z.object({
  year: z.string().min(1).max(40),
  department: z.string().min(1).max(20),
  section: z.string().min(1).max(4),
});

const startSchema = scopeSchema.extend({
  name: z.string().trim().min(2).max(80),
  hall_ticket: z
    .string()
    .trim()
    .min(4)
    .max(20)
    .regex(/^[A-Za-z0-9]+$/, "Hall ticket must be letters and numbers only"),
});

const submitSchema = z.object({
  student_id: z.string().uuid(),
  test_id: z.string().uuid(),
  attempt_token: z.string().min(20).max(500),
  time_taken_seconds: z.number().int().min(0).max(60 * 60 * 8),
  answers: z.record(z.string().uuid(), z.enum(["A", "B", "C", "D"])),
});

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

/** Checks whether a published test exists for the selected year/department/section. */
export const findAssignedTest = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => scopeSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: test } = await supabaseAdmin
      .from("tests")
      .select("id, title, subject, duration_minutes, question_count")
      .eq("year", data.year)
      .eq("department", data.department)
      .eq("section", data.section)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return { test: test ?? null };
  });

/** Registers/updates the student and returns their assigned test with sanitised questions. */
export const startAttempt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => startSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: test } = await supabaseAdmin
      .from("tests")
      .select("*")
      .eq("year", data.year)
      .eq("department", data.department)
      .eq("section", data.section)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!test) {
      return { ok: false as const, reason: "no_test" as const };
    }

    const hallTicket = data.hall_ticket.toUpperCase();
    // Never rename/overwrite an existing student row from a public endpoint:
    // reuse the stored record and only insert when the hall ticket is new.
    const { data: knownStudent } = await supabaseAdmin
      .from("students")
      .select("*")
      .eq("hall_ticket", hallTicket)
      .maybeSingle();

    let student = knownStudent;
    let studentError: unknown = null;
    if (!student) {
      const inserted = await supabaseAdmin
        .from("students")
        .insert({
          hall_ticket: hallTicket,
          name: data.name,
          year: data.year,
          department: data.department,
          section: data.section,
        })
        .select("*")
        .single();
      student = inserted.data;
      studentError = inserted.error;
    }

    if (studentError || !student) {
      return { ok: false as const, reason: "student_error" as const };
    }

    const { data: existing } = await supabaseAdmin
      .from("results")
      .select("id")
      .eq("student_id", student.id)
      .eq("test_id", test.id)
      .maybeSingle();

    if (existing) {
      return { ok: false as const, reason: "already_attempted" as const };
    }

    const { data: allQuestions } = await supabaseAdmin
      .from("questions")
      .select("id, question, option_a, option_b, option_c, option_d, marks, difficulty, subject")
      .eq("year", data.year)
      .eq("department", data.department)
      .eq("section", data.section)
      .eq("subject", test.subject);

    let pool = allQuestions ?? [];
    if (pool.length === 0) {
      return { ok: false as const, reason: "no_questions" as const };
    }
    if (test.shuffle_questions) pool = shuffle(pool);
    pool = pool.slice(0, Math.max(1, test.question_count));

    const { issueAttemptToken } = await import("./attempt-token.server");
    const attemptToken = await issueAttemptToken(student.id, test.id);

    return {
      ok: true as const,
      student,
      attempt_token: attemptToken,
      test: {
        id: test.id,
        title: test.title,
        subject: test.subject,
        duration_minutes: test.duration_minutes,
        shuffle_options: test.shuffle_options,
      },
      questions: pool,
    };
  });

/** Grades the submitted answers on the server and stores the result once. */
export const submitAttempt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submitSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Only the browser that started this exact attempt may submit it.
    const { verifyAttemptToken } = await import("./attempt-token.server");
    const tokenOk = await verifyAttemptToken(data.attempt_token, data.student_id, data.test_id);
    if (!tokenOk) return { ok: false as const, reason: "invalid_attempt" as const };

    const questionIds = Object.keys(data.answers);
    const { data: test } = await supabaseAdmin
      .from("tests")
      .select("id, title, subject")
      .eq("id", data.test_id)
      .maybeSingle();
    if (!test) return { ok: false as const, reason: "no_test" as const };

    const { data: existing } = await supabaseAdmin
      .from("results")
      .select("id")
      .eq("student_id", data.student_id)
      .eq("test_id", data.test_id)
      .maybeSingle();
    if (existing) return { ok: false as const, reason: "already_attempted" as const };

    const { data: questions } = await supabaseAdmin
      .from("questions")
      .select(
        "id, question, option_a, option_b, option_c, option_d, correct_answer, marks, explanation",
      )
      .in("id", questionIds.length > 0 ? questionIds : ["00000000-0000-0000-0000-000000000000"]);

    let score = 0;
    let totalMarks = 0;
    let correct = 0;
    let wrong = 0;
    const review: {
      id: string;
      question: string;
      options: { key: "A" | "B" | "C" | "D"; text: string }[];
      correct_answer: string;
      student_answer: string | null;
      is_correct: boolean;
      marks: number;
      marks_awarded: number;
      explanation: string | null;
    }[] = [];

    for (const q of questions ?? []) {
      totalMarks += q.marks;
      const given = data.answers[q.id] ?? null;
      const isCorrect = given === q.correct_answer;
      if (isCorrect) {
        score += q.marks;
        correct += 1;
      } else {
        wrong += 1;
      }
      review.push({
        id: q.id,
        question: q.question,
        options: [
          { key: "A", text: q.option_a },
          { key: "B", text: q.option_b },
          { key: "C", text: q.option_c },
          { key: "D", text: q.option_d },
        ],
        correct_answer: q.correct_answer,
        student_answer: given,
        is_correct: isCorrect,
        marks: q.marks,
        marks_awarded: isCorrect ? q.marks : 0,
        explanation: q.explanation ?? null,
      });
    }

    const percentage = totalMarks > 0 ? Number(((score / totalMarks) * 100).toFixed(2)) : 0;

    const { data: result, error } = await supabaseAdmin
      .from("results")
      .insert({
        student_id: data.student_id,
        test_id: data.test_id,
        score,
        total_marks: totalMarks,
        percentage,
        correct,
        wrong,
        time_taken_seconds: data.time_taken_seconds,
        answers: data.answers,
      })
      .select("*")
      .single();

    if (error || !result) return { ok: false as const, reason: "save_error" as const };

    return {
      ok: true as const,
      result: {
        score,
        total_marks: totalMarks,
        percentage,
        correct,
        wrong,
        time_taken_seconds: data.time_taken_seconds,
        test_title: test.title,
        subject: test.subject,
      },
      review,
    };
  });