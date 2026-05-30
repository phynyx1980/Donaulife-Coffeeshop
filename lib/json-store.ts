import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");

export async function readStore<T>(name: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(join(DATA_DIR, `${name}.json`), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeStore<T>(name: string, data: T): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2), "utf-8");
}
