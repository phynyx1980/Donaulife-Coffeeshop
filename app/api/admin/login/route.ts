import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, COOKIE_NAME } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const { email, password } = (await req.json()) as { email: string; password: string };

  const validEmail = process.env.ADMIN_EMAIL ?? "admin@donaulife.at";
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validPassword) {
    return NextResponse.json(
      { error: "Admin-Zugang nicht konfiguriert. Bitte ADMIN_PASSWORD in .env.local setzen." },
      { status: 503 }
    );
  }

  if (email !== validEmail || password !== validPassword) {
    return NextResponse.json({ error: "E-Mail oder Passwort falsch." }, { status: 401 });
  }

  const token = createSessionToken(email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
  return res;
}
