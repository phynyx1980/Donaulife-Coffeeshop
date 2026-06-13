export type Language = "de" | "en";

export interface DonauEvent {
  id: string;
  title: string;
  date_de: string;
  date_en: string;
  time: string;
  description_de: string;
  description_en: string;
  tag: string;
  tag_color: string;
  flyer_url: string | null;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  caption_de: string;
  caption_en: string;
  category: "vibes" | "events" | "drinks" | "cbd";
  sort_order: number;
}

export interface InstagramPost {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  caption: string;
  like_count: number;
  timestamp: string;
  permalink: string;
}

export interface ReservationData {
  date: string;
  persons: string;
  seating: string;
  occasion: string;
  wishes: string;
  name: string;
  contact: string;
  lang: Language;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type ReservationStep =
  | "idle"
  | "date"
  | "persons"
  | "seating"
  | "occasion"
  | "wishes"
  | "name"
  | "contact"
  | "confirm"
  | "edit_select"
  | "done";
