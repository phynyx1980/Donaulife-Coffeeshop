import { NextRequest, NextResponse } from "next/server";
import type { ChatMessage } from "@/lib/types";

const SYSTEM_PROMPT = `Du bist "Bud", der freundliche Assistent des Donaulife Coffeeshops in Krems an der Donau.

Persönlichkeit: Entspannt, locker, authentisch, witzig aber professionell. Antworte in max. 3-4 Sätzen. Antworte immer in der Sprache des Users. Nutze gelegentlich passende Emojis.

WISSEN:
- Öffnungszeiten: Montag–Sonntag, 13:00–22:00 Uhr
- Adresse: Untere Landstraße 71, 3500 Krems an der Donau
- Telefon: +43 660 8866699
- E-Mail: coffeeshop@donaulife.at
- Website: www.donaulife.com
- Angebot: Kaffeespezialitäten, regionale Weine & Säfte, frisch gezapftes Bier, Sweet Puffs, CBD-Sortiment, Lifestyle-Produkte
- Events: Karaoke Night jeden letzten Freitag (ab 19:00 Uhr), DJ-Events, Live Acts
- Instagram: @donaulifecoffeeshop (Coffeeshop) und @donaulife (Headshop)
- Reservierung: per Telefon, E-Mail oder direkt hier im Chat

REGELN:
- Nur Coffeeshop-relevante Themen beantworten
- Keine medizinischen CBD-Aussagen machen
- Bei Reservierungsanfragen: Hinweis auf den Reservierungs-Flow geben`;

const MOCK_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ["öffnungszeit", "offen", "wann", "open", "hours", "when"],
    response: "Wir haben täglich von 13:00 bis 22:00 Uhr für euch geöffnet — sieben Tage die Woche! 🕐",
  },
  {
    keywords: ["reserv", "tisch", "buchen", "book", "table", "reservation"],
    response: "Klar, ich helfe dir gerne mit einer Reservierung! 🌿 Schreib einfach 'Tisch reservieren' und ich führe dich durch den Prozess.",
  },
  {
    keywords: ["event", "karaoke", "dj", "live", "veranstaltung"],
    response: "Bei uns läuft immer was! 🎉 Jeden letzten Freitag steigt die Karaoke Night ab 19:00 Uhr — plus regelmäßige DJ-Sets und Live Acts.",
  },
  {
    keywords: ["cbd", "produkt", "sortiment", "product"],
    response: "Wir haben ein hochwertiges CBD-Sortiment, Sweet Puffs und ausgewählte Lifestyle-Produkte. 🌿 Schau einfach vorbei und lass dich beraten!",
  },
  {
    keywords: ["kaffee", "coffee", "trinken", "drink", "bier", "wein"],
    response: "Bei uns gibt's Kaffeespezialitäten, regionale Weine & Säfte und frisch gezapftes Bier — für jeden Geschmack das Richtige! ☕",
  },
  {
    keywords: ["adresse", "wo", "address", "where", "lage", "location"],
    response: "Du findest uns in der Untere Landstraße 71, 3500 Krems an der Donau. 📍 Einfach zu finden und mitten im Geschehen!",
  },
  {
    keywords: ["instagram", "social", "folgen", "follow"],
    response: "Folg uns auf Instagram! 📸 @donaulifecoffeeshop für den Coffeeshop und @donaulife für unseren Headshop — dort posten wir Events, Produkte und Daily Vibes.",
  },
];

function getMockResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const { keywords, response } of MOCK_RESPONSES) {
    if (keywords.some((k) => lower.includes(k))) {
      return response;
    }
  }
  return "Hey! Ich bin Bud 🌿 Du kannst mich nach Öffnungszeiten, Events, unserem Angebot oder einer Tischreservierung fragen!";
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      const lastMessage = messages[messages.length - 1]?.content ?? "";
      const response = getMockResponse(lastMessage);
      return NextResponse.json({ response });
    }

    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const result = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const content = result.content[0];
    const response = content.type === "text" ? content.text : "";
    return NextResponse.json({ response });
  } catch (error) {
    console.error("[chat] Error:", error);
    return NextResponse.json(
      { error: "Chat service unavailable" },
      { status: 500 }
    );
  }
}
