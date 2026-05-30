import type { InstagramPost } from "./types";
import { kvGet, kvSet } from "./kv";

const KV_POSTS_KEY = "ig:posts";
const KV_EVENTS_KEY = "ig:events";
const KV_TTL = 90000; // 25h

function isEventPost(post: InstagramPost): boolean {
  return post.caption?.toLowerCase().includes("#donaulifeevent") ?? false;
}

function extractEventDate(caption: string): string {
  // DD.MM.YYYY or DD.MM or "DD. Monat"
  const m =
    caption.match(/\b(\d{1,2})\.(\d{1,2})\.?(\d{4})?\b/) ??
    caption.match(/\b(\d{1,2})\.\s*(Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i);
  return m ? m[0] : "";
}

export async function fetchAndStore(): Promise<{
  posts: number;
  events: number;
}> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!token || !userId) throw new Error("Instagram credentials not configured");

  const url =
    `https://graph.instagram.com/${userId}/media` +
    `?fields=id,media_type,media_url,thumbnail_url,caption,like_count,timestamp,permalink` +
    `&limit=50&access_token=${token}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Instagram API error: ${res.status}`);

  const data = await res.json();
  const posts: InstagramPost[] = (data.data ?? []).map((p: InstagramPost) => ({
    id: p.id,
    media_type: p.media_type,
    media_url: p.media_url ?? "",
    thumbnail_url: p.thumbnail_url,
    caption: p.caption ?? "",
    like_count: p.like_count ?? 0,
    timestamp: p.timestamp,
    permalink: p.permalink,
  }));

  const events = posts.filter(isEventPost);

  await kvSet(KV_POSTS_KEY, posts, { ex: KV_TTL });
  await kvSet(KV_EVENTS_KEY, events, { ex: KV_TTL });

  return { posts: posts.length, events: events.length };
}

export async function getPosts(): Promise<InstagramPost[] | null> {
  return kvGet<InstagramPost[]>(KV_POSTS_KEY);
}

export async function getEvents(): Promise<InstagramPost[] | null> {
  return kvGet<InstagramPost[]>(KV_EVENTS_KEY);
}

export async function refreshToken(): Promise<void> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) throw new Error("INSTAGRAM_ACCESS_TOKEN not set");
  const res = await fetch(
    `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
  );
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);
  const data = await res.json();
  console.log("[instagram] Token refreshed, expires in:", data.expires_in, "s");
}

export { extractEventDate, isEventPost };
