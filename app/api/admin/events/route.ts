import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { kvGet, kvSet } from "@/lib/kv";
import type { DonauEvent } from "@/lib/types";

const KV_KEY = "admin:events";

function auth(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return !!verifySessionToken(token);
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const events = await kvGet<DonauEvent[]>(KV_KEY);
  return NextResponse.json(events ?? []);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const events = (await req.json()) as DonauEvent[];
  await kvSet(KV_KEY, events);
  return NextResponse.json({ ok: true });
}
