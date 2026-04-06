import { readdir, readFile } from "fs/promises";
import path from "path";

const LEARN_DIR = path.join(process.cwd(), "src/content/learn");

export async function getLearnSlugs(): Promise<string[]> {
  const entries = await readdir(LEARN_DIR);
  return entries.filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""));
}

export async function readLearnMdx(slug: string): Promise<string> {
  const safe = slug.replace(/[^a-z0-9-]/gi, "");
  if (safe !== slug || !safe) {
    throw new Error("invalid_slug");
  }
  const filePath = path.join(LEARN_DIR, `${safe}.mdx`);
  return readFile(filePath, "utf8");
}
