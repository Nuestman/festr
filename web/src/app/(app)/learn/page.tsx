import matter from "gray-matter";
import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";

import { getLearnSlugs, readLearnMdx } from "@/lib/learn-content";

const frontmatterSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export const metadata: Metadata = {
  title: "Learn — FESTR",
  description:
    "Short, practical emergency education for laypeople — not a substitute for certified training.",
};

export default async function LearnHubPage() {
  const slugs = await getLearnSlugs();
  const articles = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readLearnMdx(slug);
      const { data } = matter(raw);
      const fm = frontmatterSchema.safeParse(data);
      if (!fm.success) {
        return null;
      }
      return { slug, ...fm.data };
    }),
  );

  const list = articles.filter((a): a is NonNullable<typeof a> => a !== null);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Learn</h1>
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          Bite-sized topics you can read on a phone under stress. Content is educational only — get
          formal first-aid / BLS training where you live, and always follow your emergency
          dispatcher.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {list.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/learn/${a.slug}`}
              className="block rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/50"
            >
              <h2 className="font-semibold text-foreground">{a.title}</h2>
              {a.description && (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.description}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {list.length === 0 && (
        <p className="text-sm text-muted-foreground">No articles yet — add MDX under src/content/learn.</p>
      )}
    </div>
  );
}
