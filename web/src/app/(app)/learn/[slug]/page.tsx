import matter from "gray-matter";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { learnMdxComponents } from "@/components/learn/learn-mdx-components";
import { getLearnSlugs, readLearnMdx } from "@/lib/learn-content";

const frontmatterSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getLearnSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const raw = await readLearnMdx(slug);
    const { data } = matter(raw);
    const fm = frontmatterSchema.safeParse(data);
    if (!fm.success) {
      return { title: "Learn — FESTR" };
    }
    return {
      title: `${fm.data.title} — Learn — FESTR`,
      description: fm.data.description,
    };
  } catch {
    return { title: "Learn — FESTR" };
  }
}

export default async function LearnArticlePage({ params }: Props) {
  const { slug } = await params;
  const slugs = await getLearnSlugs();
  if (!slugs.includes(slug)) {
    notFound();
  }

  let raw: string;
  try {
    raw = await readLearnMdx(slug);
  } catch {
    notFound();
  }

  const parsed = matter(raw);
  const fm = frontmatterSchema.safeParse(parsed.data);
  if (!fm.success) {
    notFound();
  }

  const { content } = await compileMDX({
    source: parsed.content,
    components: learnMdxComponents,
  });

  return (
    <div className="space-y-8">
      <p>
        <Link
          href="/learn"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Learn hub
        </Link>
      </p>
      <header className="space-y-2 border-b border-border pb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Learn</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{fm.data.title}</h1>
        {fm.data.description && (
          <p className="max-w-2xl text-lg text-muted-foreground">{fm.data.description}</p>
        )}
      </header>
      <div className="max-w-3xl">{content}</div>
    </div>
  );
}
