import { NextResponse } from "next/server";
import type { DonauEvent } from "@/lib/types";

export const revalidate = 3600;

const MOCK_EVENTS: DonauEvent[] = [
  {
    id: "1",
    title: "Karaoke Night",
    date_de: "Fr, 30. Mai",
    date_en: "Fri, May 30th",
    time: "19:00",
    description_de: "Jeden letzten Freitag gehört die Bühne euch!",
    description_en: "Every last Friday the stage is yours!",
    tag: "Karaoke",
    tag_color: "#f59e0b",
    flyer_url: null,
  },
  {
    id: "2",
    title: "BPM : Schicht",
    date_de: "Sa, 7. Juni",
    date_en: "Sat, June 7th",
    time: "20:00",
    description_de: "Elektronische Beats und entspannte Vibes mit unserem Resident DJ.",
    description_en: "Electronic beats and relaxed vibes with our resident DJ.",
    tag: "DJ",
    tag_color: "#8b5cf6",
    flyer_url: null,
  },
  {
    id: "3",
    title: "River Grooves",
    date_de: "Fr, 13. Juni",
    date_en: "Fri, June 13th",
    time: "19:30",
    description_de: "Live-Musik direkt an der Donau — Funk, Soul und gute Laune.",
    description_en: "Live music right by the Danube — funk, soul and good vibes.",
    tag: "Live",
    tag_color: "#06b6d4",
    flyer_url: null,
  },
  {
    id: "4",
    title: "Style Clash",
    date_de: "Sa, 21. Juni",
    date_en: "Sat, June 21st",
    time: "18:00",
    description_de: "Fashion meets Music — Kreative, Locals und gute Energie.",
    description_en: "Fashion meets Music — creatives, locals and great energy.",
    tag: "Special",
    tag_color: "#f43f5e",
    flyer_url: null,
  },
];

function igPostToEvent(post: {
  id: string;
  caption: string;
  media_url?: string;
  thumbnail_url?: string;
  timestamp: string;
}): DonauEvent {
  const lines = (post.caption ?? "").split("\n").filter(Boolean);
  const title = lines[0]?.replace(/#\S+/g, "").trim() || "Event";
  const body = lines.slice(1).join(" ").replace(/#\S+/g, "").trim();

  const dateMatch = post.caption.match(
    /\b(\d{1,2})\.\s*(\d{1,2})\.?(\d{4})?\b|\b(\d{1,2})\.\s*(Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez)/i
  );
  const dateStr = dateMatch ? dateMatch[0] : "";

  const d = new Date(post.timestamp);
  const date_de = dateStr || d.toLocaleDateString("de-AT", { weekday: "short", day: "numeric", month: "long" });
  const date_en = dateStr || d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" });

  return {
    id: post.id,
    title,
    date_de,
    date_en,
    time: "",
    description_de: body,
    description_en: body,
    tag: "Event",
    tag_color: "#15a06a",
    flyer_url: post.thumbnail_url ?? post.media_url ?? null,
  };
}

export async function GET() {
  try {
    const { kvGet } = await import("@/lib/kv");
    const cached = await kvGet<object[]>("ig:events");

    if (cached && cached.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const events = (cached as Parameters<typeof igPostToEvent>[0][])
        .map(igPostToEvent)
        .filter((e) => {
          if (!e.flyer_url) return true;
          return true;
        });
      return NextResponse.json(events.slice(0, 8));
    }
  } catch {
    // KV not available, fall through to mock
  }

  return NextResponse.json(MOCK_EVENTS);
}
