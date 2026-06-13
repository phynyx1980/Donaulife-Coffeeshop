import type { Language, ReservationStep, ReservationData } from "@/lib/types";

interface FlowState {
  step: ReservationStep;
  data: Partial<ReservationData>;
  /** Wenn true: nach dem nächsten Eintrag direkt zurück zur Zusammenfassung statt im Flow weiter */
  editing?: boolean;
}

interface StepConfig {
  promptKey: (lang: Language) => string;
  quickReplies?: (lang: Language) => string[];
  field: keyof ReservationData | null;
}

const PROMPTS: Record<ReservationStep, StepConfig> = {
  idle: { promptKey: () => "", quickReplies: () => [], field: null },
  date: {
    promptKey: (lang) =>
      lang === "de"
        ? "Für welchen Tag und Uhrzeit planst du deinen Besuch?"
        : "What day and time are you planning your visit?",
    field: "date",
  },
  persons: {
    promptKey: (lang) =>
      lang === "de"
        ? "Super! Für wie viele Personen soll ich reservieren?"
        : "Great! For how many people should I make the reservation?",
    quickReplies: () => ["2", "3", "4", "5", "6+"],
    field: "persons",
  },
  seating: {
    promptKey: (lang) =>
      lang === "de" ? "Drinnen oder draußen?" : "Inside or outside?",
    quickReplies: (lang) =>
      lang === "de"
        ? ["Drinnen 🏠", "Draußen 🌿", "Egal"]
        : ["Inside 🏠", "Outside 🌿", "No preference"],
    field: "seating",
  },
  occasion: {
    promptKey: (lang) =>
      lang === "de"
        ? "Was ist der Anlass? (optional)"
        : "What's the occasion? (optional)",
    quickReplies: (lang) =>
      lang === "de"
        ? ["Geburtstag 🎂", "Date 💚", "Freunde 👥", "Business 💼", "Kein besonderer"]
        : ["Birthday 🎂", "Date 💚", "Friends 👥", "Business 💼", "No special occasion"],
    field: "occasion",
  },
  wishes: {
    promptKey: (lang) =>
      lang === "de"
        ? "Hast du besondere Wünsche für deinen Besuch?"
        : "Do you have any special requests for your visit?",
    quickReplies: (lang) =>
      lang === "de"
        ? ["Keine besonderen Wünsche"]
        : ["No special wishes"],
    field: "wishes",
  },
  name: {
    promptKey: (lang) =>
      lang === "de"
        ? "Auf welchen Namen soll ich die Reservierung machen?"
        : "What name should I make the reservation under?",
    field: "name",
  },
  contact: {
    promptKey: (lang) =>
      lang === "de"
        ? "Perfekt! Und wie können wir dich erreichen? (Telefon oder E-Mail)"
        : "Perfect! And how can we reach you? (Phone or Email)",
    field: "contact",
  },
  confirm: {
    promptKey: () => "",
    quickReplies: (lang) =>
      lang === "de"
        ? ["✅ Ja, abschicken!", "✏️ Ändern"]
        : ["✅ Yes, submit!", "✏️ Edit"],
    field: null,
  },
  done: { promptKey: () => "", field: null },
};

const STEP_ORDER: ReservationStep[] = [
  "idle", "date", "persons", "seating", "occasion", "wishes", "name", "contact", "confirm", "done",
];

export function isReservationTrigger(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("reservier") ||
    lower.includes("tisch") ||
    lower.includes("buchen") ||
    lower.includes("book") ||
    lower.includes("table") ||
    lower.includes("reserv")
  );
}

export function getNextStep(current: ReservationStep): ReservationStep {
  const idx = STEP_ORDER.indexOf(current);
  if (idx === -1 || idx >= STEP_ORDER.length - 1) return "done";
  return STEP_ORDER[idx + 1];
}

export function getStepPrompt(step: ReservationStep, lang: Language): string {
  return PROMPTS[step]?.promptKey(lang) ?? "";
}

export function getStepQuickReplies(step: ReservationStep, lang: Language): string[] {
  return PROMPTS[step]?.quickReplies?.(lang) ?? [];
}

export function buildSummary(data: Partial<ReservationData>, lang: Language): string {
  const isDE = lang === "de";
  const lines: string[] = [];
  if (data.date) lines.push(`📅 ${isDE ? "Datum" : "Date"}: ${data.date}`);
  if (data.persons) lines.push(`👥 ${isDE ? "Personen" : "Persons"}: ${data.persons}`);
  if (data.seating) lines.push(`🪑 ${isDE ? "Bereich" : "Area"}: ${data.seating}`);
  if (data.occasion) lines.push(`🎉 ${isDE ? "Anlass" : "Occasion"}: ${data.occasion}`);
  if (data.wishes) lines.push(`💬 ${isDE ? "Wünsche" : "Wishes"}: ${data.wishes}`);
  if (data.name) lines.push(`👤 ${isDE ? "Name" : "Name"}: ${data.name}`);
  if (data.contact) lines.push(`📞 ${isDE ? "Kontakt" : "Contact"}: ${data.contact}`);
  return lines.join("\n");
}

export function applyInput(state: FlowState, input: string): FlowState {
  const { step, data } = state;
  const field = PROMPTS[step]?.field;
  const newData = field ? { ...data, [field]: input } : data;
  return { step, data: newData };
}

export function buildWhatsAppUrl(data: Partial<ReservationData>, lang: Language): string {
  const isDE = lang === "de";
  const msg = [
    isDE ? "🌿 Reservierungsanfrage" : "🌿 Reservation Request",
    `📅 ${isDE ? "Datum" : "Date"}: ${data.date ?? "–"}`,
    `👥 ${isDE ? "Personen" : "Persons"}: ${data.persons ?? "–"}`,
    `🪑 ${isDE ? "Sitzplatz" : "Seating"}: ${data.seating ?? "–"}`,
    `🎉 ${isDE ? "Anlass" : "Occasion"}: ${data.occasion || "–"}`,
    `✨ ${isDE ? "Wünsche" : "Wishes"}: ${data.wishes || "–"}`,
    `👤 ${isDE ? "Name" : "Name"}: ${data.name ?? "–"}`,
    `📞 ${isDE ? "Kontakt" : "Contact"}: ${data.contact ?? "–"}`,
  ].join("\n");

  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "436608866699";
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

export function buildGeneralInquiryUrl(message: string, lang: Language): string {
  const isDE = lang === "de";
  const prefix = isDE
    ? "💬 Allgemeine Anfrage an Donaulife Coffeeshop:\n\n"
    : "💬 General inquiry to Donaulife Coffeeshop:\n\n";
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "436608866699";
  return `https://wa.me/${number}?text=${encodeURIComponent(prefix + message)}`;
}

export function isGeneralInquiryTrigger(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("anfrage") ||
    lower.includes("frage") ||
    lower.includes("allgemein") ||
    lower.includes("kontakt") ||
    lower.includes("info") ||
    lower.includes("inquiry") ||
    lower.includes("question") ||
    lower.includes("contact")
  );
}

export { type FlowState };
