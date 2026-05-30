import { NextResponse } from "next/server";
import { readStore } from "@/lib/json-store";
import type { DonauEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

const FALLBACK: DonauEvent[] = [
  { id: "1", title: "Karaoke Night", date_de: "Fr, 30. Mai", date_en: "Fri, May 30th", time: "19:00", description_de: "Jeden letzten Freitag gehört die Bühne euch!", description_en: "Every last Friday the stage is yours!", tag: "Karaoke", tag_color: "#f59e0b", flyer_url: null },
  { id: "2", title: "BPM : Schicht", date_de: "Sa, 7. Juni", date_en: "Sat, June 7th", time: "20:00", description_de: "Elektronische Beats und entspannte Vibes.", description_en: "Electronic beats and relaxed vibes.", tag: "DJ", tag_color: "#8b5cf6", flyer_url: null },
  { id: "3", title: "River Grooves", date_de: "Fr, 13. Juni", date_en: "Fri, June 13th", time: "19:30", description_de: "Live-Musik an der Donau.", description_en: "Live music by the Danube.", tag: "Live", tag_color: "#06b6d4", flyer_url: null },
];

export async function GET() {
  const events = await readStore<DonauEvent[]>("events", FALLBACK);
  return NextResponse.json(events);
}
