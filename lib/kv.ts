/**
 * Graceful wrapper around @vercel/kv.
 * Falls back to null when KV_URL is not configured (local dev without KV).
 */

type KVClient = {
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, value: T, opts?: { ex?: number }) => Promise<void>;
};

let _kv: KVClient | null = null;

async function getKV(): Promise<KVClient | null> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null;
  }
  if (_kv) return _kv;
  const { kv } = await import("@vercel/kv");
  _kv = kv as unknown as KVClient;
  return _kv;
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const client = await getKV();
  if (!client) return null;
  try {
    return await client.get<T>(key);
  } catch (err) {
    console.warn(`[kv] get(${key}) failed:`, err);
    return null;
  }
}

export async function kvSet<T>(
  key: string,
  value: T,
  opts?: { ex?: number }
): Promise<void> {
  const client = await getKV();
  if (!client) return;
  try {
    await client.set(key, value, opts);
  } catch (err) {
    console.warn(`[kv] set(${key}) failed:`, err);
  }
}

export const kvAvailable = () =>
  !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
