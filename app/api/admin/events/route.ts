import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import type { DonauEvent } from "@/lib/types";

function auth(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return !!token && !!verifySessionToken(token);
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as DonauEvent[]);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const events = (await req.json()) as DonauEvent[];

  // Alles löschen und neu schreiben (sauberstes Pattern für kleine Datensätze)
  await supabaseAdmin.from("events").delete().neq("id", "");
  if (events.length > 0) {
    const rows = events.map((e, i) => ({ ...e, sort_order: i }));
    const { error } = await supabaseAdmin.from("events").insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
