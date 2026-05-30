import { createHmac } from "crypto";

const SECRET = process.env.ADMIN_SECRET ?? "donaulife-admin-dev-secret-change-me";
export const COOKIE_NAME = "admin_session";

export function createSessionToken(email: string): string {
  const payload = JSON.stringify({ email, ts: Date.now() });
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(JSON.stringify({ payload, sig })).toString("base64url");
}

export function verifySessionToken(token: string): string | null {
  try {
    const { payload, sig } = JSON.parse(Buffer.from(token, "base64url").toString()) as {
      payload: string;
      sig: string;
    };
    const expected = createHmac("sha256", SECRET).update(payload).digest("hex");
    if (sig !== expected) return null;
    const { email, ts } = JSON.parse(payload) as { email: string; ts: number };
    if (Date.now() - ts > 7 * 24 * 60 * 60 * 1000) return null;
    return email;
  } catch {
    return null;
  }
}
