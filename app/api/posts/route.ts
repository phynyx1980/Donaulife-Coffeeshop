import { NextResponse } from "next/server";
import type { InstagramPost } from "@/lib/types";

export const revalidate = 1800;

const MOCK_POSTS: InstagramPost[] = Array.from({ length: 9 }, (_, i) => ({
  id: `mock_${i + 1}`,
  media_type: (i % 4 === 3 ? "VIDEO" : i % 5 === 4 ? "CAROUSEL_ALBUM" : "IMAGE") as InstagramPost["media_type"],
  media_url: "",
  caption: [
    "Entspannt ankommen und den Moment genießen 🌿 #donaulife #coffeeshop #krems",
    "Karaoke Night — die Bühne gehört euch! 🎤 #karaoke #event #krems",
    "Premium CBD direkt aus Krems 🌱 #cbd #lifestyle #wellness",
    "Fresh vibes, fresh brews ☕ #coffee #specialty #donaulife",
    "Live tonight — River Grooves 🎶 #live #music #krems",
    "Sweet Puffs sind wieder da 🍬 #sweetpuffs #donaulife",
    "Unser Team wünscht einen entspannten Abend 💚 #vibes #coffeeshop",
    "DJ Set ab 20:00 🎧 #dj #music #party #krems",
    "Beste Atmosphäre mitten in Krems 🏙️ #krems #austria #coffeeshop",
  ][i],
  like_count: Math.floor(Math.random() * 200) + 20,
  timestamp: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  permalink: "https://www.instagram.com/donaulifecoffeeshop/",
}));

export async function GET() {
  try {
    const { kvGet } = await import("@/lib/kv");
    const cached = await kvGet<InstagramPost[]>("ig:posts");
    if (cached && cached.length > 0) {
      return NextResponse.json(cached.slice(0, 9));
    }
  } catch {
    // KV not available
  }
  return NextResponse.json(MOCK_POSTS);
}
