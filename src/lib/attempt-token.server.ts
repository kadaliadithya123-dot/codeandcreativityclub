/**
 * Signed, short-lived exam attempt tokens.
 *
 * Students never sign in, so the token issued by `startAttempt` is what proves a
 * later `submitAttempt` call comes from the same browser that actually started
 * that attempt (binding student_id + test_id). It is HMAC-signed with a
 * server-only secret and cannot be forged or replayed for another student.
 */

const TOKEN_TTL_SECONDS = 60 * 60 * 8;

type AttemptClaims = {
  sid: string;
  tid: string;
  exp: number;
  /** Ids of every question assigned for this attempt, so grading covers skipped ones. */
  qids?: string[];
};

function getSecret(): string {
  const secret =
    process.env['ATTEMPT_TOKEN_SECRET'] ??
    process.env['SUPABASE_SERVICE_ROLE_KEY'] ??
    process.env['SUPABASE_DB_URL'];
  if (!secret) throw new Error('Missing server secret for attempt token signing');
  return secret;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return base64UrlEncode(new Uint8Array(signature));
}

export async function issueAttemptToken(
  studentId: string,
  testId: string,
  questionIds: string[] = [],
): Promise<string> {
  const claims: AttemptClaims = {
    sid: studentId,
    tid: testId,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    qids: questionIds,
  };
  const payload = base64UrlEncode(new TextEncoder().encode(JSON.stringify(claims)));
  return `${payload}.${await sign(payload)}`;
}

/** Returns the claims only for an unexpired token issued for exactly this student + test. */
export async function verifyAttemptToken(
  token: string,
  studentId: string,
  testId: string,
): Promise<AttemptClaims | null> {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = await sign(payload);
  if (expected.length !== signature.length || expected !== signature) return null;

  try {
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const claims = JSON.parse(json) as AttemptClaims;
    if (claims.sid !== studentId || claims.tid !== testId) return null;
    if (typeof claims.exp !== 'number' || claims.exp * 1000 < Date.now()) return null;
    return claims;
  } catch {
    return null;
  }
}
