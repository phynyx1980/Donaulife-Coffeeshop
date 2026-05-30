import { NextResponse } from "next/server";
import { kvGet } from "@/lib/kv";
import defaultGallery from "@/data/gallery.json";

export const revalidate = 60;

export async function GET() {
  try {
    const items = await kvGet<typeof defaultGallery>("admin:gallery");
    if (items && items.length > 0) return NextResponse.json(items);
  } catch {
    // KV not available, fall through
  }
  return NextResponse.json(defaultGallery);
}
