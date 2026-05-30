import { NextResponse } from "next/server";
import { readStore } from "@/lib/json-store";
import defaultGallery from "@/data/gallery.json";

export const dynamic = "force-dynamic";

type GalleryItem = typeof defaultGallery[number];

export async function GET() {
  const items = await readStore<GalleryItem[]>("gallery", defaultGallery);
  return NextResponse.json(items);
}
