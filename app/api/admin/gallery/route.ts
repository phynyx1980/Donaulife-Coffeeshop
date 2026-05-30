import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import defaultGallery from "@/data/gallery.json";

type GalleryItem = typeof defaultGallery[number];

function auth(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return !!token && !!verifySessionToken(token);
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabaseAdmin
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return NextResponse.json(defaultGallery);
  return NextResponse.json(data as GalleryItem[]);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = (await req.json()) as GalleryItem[];

  await supabaseAdmin.from("gallery").delete().neq("id", 0);
  if (items.length > 0) {
    const rows = items.map((item, i) => ({
      file: item.file,
      cat: item.cat,
      caption_de: item.caption_de,
      caption_en: item.caption_en,
      sort_order: i,
    }));
    const { error } = await supabaseAdmin.from("gallery").insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
