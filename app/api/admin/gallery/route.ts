import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { readStore, writeStore } from "@/lib/json-store";
import defaultGallery from "@/data/gallery.json";

type GalleryItem = typeof defaultGallery[number];

function auth(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  return !!token && !!verifySessionToken(token);
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await readStore<GalleryItem[]>("gallery", defaultGallery);
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = (await req.json()) as GalleryItem[];
  await writeStore("gallery", items);
  return NextResponse.json({ ok: true });
}
