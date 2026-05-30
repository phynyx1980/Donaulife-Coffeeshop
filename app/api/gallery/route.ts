import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import defaultGallery from "@/data/gallery.json";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return NextResponse.json(defaultGallery);
  return NextResponse.json(data);
}
