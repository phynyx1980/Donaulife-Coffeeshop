import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { readStore, writeStore } from "@/lib/json-store";
import type { DonauEvent } from "@/lib/types";

const FALLBACK: DonauEvent[] = [];

function auth(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return !!token && !!verifySessionToken(token);
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const events = await readStore<DonauEvent[]>("events", FALLBACK);
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const events = (await req.json()) as DonauEvent[];
  await writeStore("events", events);
  return NextResponse.json({ ok: true });
}
