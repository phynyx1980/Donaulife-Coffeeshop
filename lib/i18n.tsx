"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Language } from "./types";

const translations = {
  de: {
    // Navbar
    nav_offering: "Angebot",
    nav_events: "Events",
    nav_gallery: "Galerie",
    nav_findus: "Find Us",
    nav_headshop: "Headshop ↗",
    nav_chat: "Chat",

    // Hero
    hero_badge: "🌿 Krems an der Donau — Österreich",
    hero_h1: "Der erste Coffeeshop in Krems",
    hero_sub: "Coffee · CBD · Vibes · Events",
    hero_cta_primary: "Events ansehen",
    hero_cta_secondary: "Jetzt chatten",

    // Offerings
    offerings_pre: "Was wir bieten",
    offerings_title: "Unser Angebot",
    offerings_sub: "Entspannt, vielfältig und authentisch — bei uns ist für jeden etwas dabei.",
    offering1_title: "Coffee & Drinks",
    offering1_text: "Kaffeespezialitäten, regionale Weine & Säfte, frisch gezapftes Bier und vieles mehr.",
    offering2_title: "CBD & Lifestyle",
    offering2_text: "Hochwertiges CBD-Sortiment, Sweet Puffs und ausgewählte Lifestyle-Produkte.",
    offering3_title: "Events & Vibes",
    offering3_text: "Karaoke, Live-Events, DJs. Jeden letzten Freitag: Karaoke Night.",

    // Events
    events_pre: "Was läuft",
    events_title: "Upcoming Events",
    events_sub: "Von Karaoke bis DJ-Sets — bei uns ist immer was los.",
    events_empty: "Keine Events geplant. Schau bald wieder rein!",

    // Instagram
    ig_pre: "Social Media",
    ig_title: "Folg uns auf Instagram",
    ig_sub: "Bleib am Laufenden — Storys, Events und Daily Vibes direkt aus Krems.",
    ig_follow: "Folgen",
    ig_posts: "Beiträge",
    ig_followers: "Follower",

    // Gallery
    gallery_pre: "Einblicke",
    gallery_title: "Galerie",
    gallery_sub: "Atmosphäre, Events, Produkte — echte Momente aus dem Donaulife.",
    gallery_all: "Alle",
    gallery_vibes: "Vibes",
    gallery_events: "Events",
    gallery_drinks: "Drinks",
    gallery_cbd: "CBD",

    // Headshop CTA
    headshop_badge: "🌱 Auch als Headshop",
    headshop_title: "Über 3000 Produkte im Online-Shop",
    headshop_sub: "Bongs · Vaporizer · Papers · CBD · Grinder",
    headshop_cta: "Zum Headshop ↗",
    headshop_note: "Blitzversand · Neutrale Verpackung · Gratis ab 75€",

    // Find Us
    findus_pre: "Besuche uns",
    findus_title: "Wo wir sind",
    findus_sub: "Mitten in Krems, immer geöffnet wenn du entspannen willst.",
    findus_hours_title: "Öffnungszeiten",
    findus_hours: "Montag – Sonntag",
    findus_hours_time: "13:00 – 22:00 Uhr",
    findus_address_title: "Adresse",
    findus_address: "Untere Landstraße 71, 3500 Krems an der Donau",
    findus_contact_title: "Kontakt",
    findus_map_open: "In Google Maps öffnen ↗",

    // Footer
    footer_copy: "© 2025 Donaulife Coffeeshop · Made with 💚 in Krems",
    footer_impressum: "Impressum",
    footer_datenschutz: "Datenschutz",

    // Chat
    chat_greeting: "Hey! Ich bin Bud 🌿 Wie kann ich dir helfen? Frag mich zu Öffnungszeiten, Angebot oder Events — oder starte direkt eine Reservierung!",
    chat_placeholder: "Schreib eine Nachricht...",
    chat_send: "Senden",
    chat_title: "Bud",
    chat_online: "Online",
    chat_reservation_badge: "Reservierung läuft",

    // Reservation Flow
    res_trigger: "reservier",
    res_date_prompt: "Für welchen Tag und Uhrzeit planst du deinen Besuch?",
    res_persons_prompt: "Super! Für wie viele Personen soll ich reservieren?",
    res_seating_prompt: "Drinnen oder draußen?",
    res_seating_inside: "Drinnen 🏠",
    res_seating_outside: "Draußen 🌿",
    res_seating_any: "Egal",
    res_occasion_prompt: "Was ist der Anlass? (optional)",
    res_occasion_birthday: "Geburtstag 🎂",
    res_occasion_date: "Date 💚",
    res_occasion_friends: "Freunde 👥",
    res_occasion_business: "Business 💼",
    res_occasion_none: "Kein besonderer",
    res_wishes_prompt: "Hast du besondere Wünsche für deinen Besuch?",
    res_wishes_none: "Keine besonderen Wünsche",
    res_name_prompt: "Auf welchen Namen soll ich die Reservierung machen?",
    res_contact_prompt: "Perfekt! Und wie können wir dich erreichen? (Telefon oder E-Mail)",
    res_confirm_prompt: "Alles klar! Hier nochmal deine Reservierung im Überblick:",
    res_confirm_yes: "✅ Ja, abschicken!",
    res_confirm_edit: "✏️ Ändern",
    res_done: "Deine Reservierung wurde erfolgreich abgeschickt! Wir freuen uns auf deinen Besuch 🌿",
    res_error: "Ups, da hat etwas nicht geklappt. Ruf uns kurz an: +43 660 8866699",
    res_summary_date: "📅 Datum",
    res_summary_persons: "👥 Personen",
    res_summary_seating: "🪑 Bereich",
    res_summary_occasion: "🎉 Anlass",
    res_summary_wishes: "💬 Wünsche",
    res_summary_name: "👤 Name",
    res_summary_contact: "📞 Kontakt",

    // Impressum / Datenschutz
    impressum_title: "Impressum",
    datenschutz_title: "Datenschutzerklärung",
    legal_back: "← Zurück zur Startseite",
    legal_placeholder: "Diese Seite wird in Kürze vollständig ausgefüllt.",
  },
  en: {
    // Navbar
    nav_offering: "Offering",
    nav_events: "Events",
    nav_gallery: "Gallery",
    nav_findus: "Find Us",
    nav_headshop: "Headshop ↗",
    nav_chat: "Chat",

    // Hero
    hero_badge: "🌿 Krems an der Donau — Austria",
    hero_h1: "The First Coffeeshop in Krems",
    hero_sub: "Coffee · CBD · Vibes · Events",
    hero_cta_primary: "See Events",
    hero_cta_secondary: "Chat Now",

    // Offerings
    offerings_pre: "What we offer",
    offerings_title: "Our Offering",
    offerings_sub: "Relaxed, diverse and authentic — we have something for everyone.",
    offering1_title: "Coffee & Drinks",
    offering1_text: "Coffee specialties, regional wines & juices, fresh draught beer and much more.",
    offering2_title: "CBD & Lifestyle",
    offering2_text: "Premium CBD range, Sweet Puffs and selected lifestyle products.",
    offering3_title: "Events & Vibes",
    offering3_text: "Karaoke, live events, DJs. Every last Friday: Karaoke Night.",

    // Events
    events_pre: "What's on",
    events_title: "Upcoming Events",
    events_sub: "From karaoke to DJ sets — there's always something happening.",
    events_empty: "No events scheduled. Check back soon!",

    // Instagram
    ig_pre: "Social Media",
    ig_title: "Follow us on Instagram",
    ig_sub: "Stay up to date — stories, events and daily vibes from Krems.",
    ig_follow: "Follow",
    ig_posts: "Posts",
    ig_followers: "Followers",

    // Gallery
    gallery_pre: "Impressions",
    gallery_title: "Gallery",
    gallery_sub: "Atmosphere, events, products — real moments from Donaulife.",
    gallery_all: "All",
    gallery_vibes: "Vibes",
    gallery_events: "Events",
    gallery_drinks: "Drinks",
    gallery_cbd: "CBD",

    // Headshop CTA
    headshop_badge: "🌱 Also a Headshop",
    headshop_title: "Over 3000 Products in the Online Shop",
    headshop_sub: "Bongs · Vaporizers · Papers · CBD · Grinders",
    headshop_cta: "Go to Headshop ↗",
    headshop_note: "Express Shipping · Discreet Packaging · Free from €75",

    // Find Us
    findus_pre: "Visit us",
    findus_title: "Where We Are",
    findus_sub: "Right in the heart of Krems, always open when you want to relax.",
    findus_hours_title: "Opening Hours",
    findus_hours: "Monday – Sunday",
    findus_hours_time: "1:00 PM – 10:00 PM",
    findus_address_title: "Address",
    findus_address: "Untere Landstraße 71, 3500 Krems an der Donau",
    findus_contact_title: "Contact",
    findus_map_open: "Open in Google Maps ↗",

    // Footer
    footer_copy: "© 2025 Donaulife Coffeeshop · Made with 💚 in Krems",
    footer_impressum: "Imprint",
    footer_datenschutz: "Privacy Policy",

    // Chat
    chat_greeting: "Hey! I'm Bud 🌿 How can I help you? Ask me about opening hours, products or events — or start a reservation right away!",
    chat_placeholder: "Write a message...",
    chat_send: "Send",
    chat_title: "Bud",
    chat_online: "Online",
    chat_reservation_badge: "Reservation in progress",

    // Reservation Flow
    res_trigger: "reserv",
    res_date_prompt: "What day and time are you planning your visit?",
    res_persons_prompt: "Great! For how many people should I make the reservation?",
    res_seating_prompt: "Inside or outside?",
    res_seating_inside: "Inside 🏠",
    res_seating_outside: "Outside 🌿",
    res_seating_any: "No preference",
    res_occasion_prompt: "What's the occasion? (optional)",
    res_occasion_birthday: "Birthday 🎂",
    res_occasion_date: "Date 💚",
    res_occasion_friends: "Friends 👥",
    res_occasion_business: "Business 💼",
    res_occasion_none: "No special occasion",
    res_wishes_prompt: "Do you have any special requests for your visit?",
    res_wishes_none: "No special wishes",
    res_name_prompt: "What name should I make the reservation under?",
    res_contact_prompt: "Perfect! And how can we reach you? (Phone or Email)",
    res_confirm_prompt: "All good! Here's a summary of your reservation:",
    res_confirm_yes: "✅ Yes, submit!",
    res_confirm_edit: "✏️ Edit",
    res_done: "Your reservation has been submitted successfully! We look forward to your visit 🌿",
    res_error: "Oops, something went wrong. Please call us: +43 660 8866699",
    res_summary_date: "📅 Date",
    res_summary_persons: "👥 Persons",
    res_summary_seating: "🪑 Area",
    res_summary_occasion: "🎉 Occasion",
    res_summary_wishes: "💬 Wishes",
    res_summary_name: "👤 Name",
    res_summary_contact: "📞 Contact",

    // Impressum / Datenschutz
    impressum_title: "Imprint",
    datenschutz_title: "Privacy Policy",
    legal_back: "← Back to Home",
    legal_placeholder: "This page will be completed shortly.",
  },
} as const;

type TranslationKey = keyof typeof translations.de;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "de",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("de");

  useEffect(() => {
    const stored = localStorage.getItem("donaulife-lang") as Language | null;
    if (stored === "de" || stored === "en") {
      setLangState(stored);
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("donaulife-lang", newLang);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[lang][key] as string;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
