import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const learnMdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="mt-10 scroll-mt-24 text-3xl font-semibold tracking-tight text-foreground first:mt-0"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-10 scroll-mt-24 border-b border-border pb-2 text-2xl font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-8 text-xl font-semibold tracking-tight text-foreground" {...props} />
  ),
  p: (props) => (
    <p className="leading-relaxed text-muted-foreground [&:not(:first-child)]:mt-4" {...props} />
  ),
  ul: (props) => (
    <ul className="my-4 list-disc space-y-2 pl-6 text-muted-foreground" {...props} />
  ),
  ol: (props) => (
    <ol className="my-4 list-decimal space-y-2 pl-6 text-muted-foreground" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  a: ({ href, children, ...rest }) => {
    const h = typeof href === "string" ? href : "";
    if (h.startsWith("/")) {
      return (
        <Link
          className="font-medium text-primary underline underline-offset-4"
          href={h}
          {...rest}
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        className="font-medium text-primary underline underline-offset-4"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  },
  blockquote: (props) => (
    <blockquote
      className="mt-4 border-l-4 border-primary/40 pl-4 italic text-muted-foreground"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-sm"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-10 border-border" {...props} />,
};
