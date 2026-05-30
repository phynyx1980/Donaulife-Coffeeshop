import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { kvGet, kvSet } from "@/lib/kv";
import defaultGallery from "@/data/gallery.json";

type GalleryItem = typeof defaultGallery[number];

function auth(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return !!token && !!verifySessionToken(token);
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await kvGet<GalleryItem[]>("admin:gallery");
  return NextResponse.json(items && items.length > 0 ? items : defaultGallery);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = (await req.json()) as GalleryItem[];
  await kvSet("admin:gallery", items);
  return NextResponse.json({ ok: true });
}
