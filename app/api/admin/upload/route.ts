import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_MB = 8;
const BUCKET = "donaulife-media";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "Keine Datei empfangen." }, { status: 400 });
  if (!ALLOWED.includes(file.type))
    return NextResponse.json({ error: "Nur JPG, PNG, WebP und GIF erlaubt." }, { status: 400 });
  if (file.size > MAX_MB * 1024 * 1024)
    return NextResponse.json({ error: `Max. ${MAX_MB} MB pro Datei.` }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `flyer-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filename);
  return NextResponse.json({ url: data.publicUrl });
}
