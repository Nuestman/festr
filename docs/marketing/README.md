# Marketing site — documentation

This folder specifies **content architecture, messaging, and UX intent** for the public-facing (non-authenticated) **marketing** section of FESTR. It exists so implementation stays coherent: same voice, clear hierarchy, and no “template site” drift.

## Audience

| Segment | What they need |
|--------|----------------|
| **General public** | Trust, clarity, fast scan — “what is this?” in seconds. |
| **Partners / NGOs / funders** | Credibility, scope, seriousness, path to pilot. |
| **Press / institutions** | Mission, differentiation, contact pathway. |

**Default reader:** someone on a phone, skimming after a link share.

## Voice and tone

- **Direct, calm, competent** — emergency context without alarmist hype.
- **Concrete over abstract** — say what the product does, who it’s for, what happens next.
- **Respectful of context** — low-resource settings, real pre-hospital gaps; no Silicon Valley fantasy.
- **Inclusive** — plain language; avoid jargon unless defined once.

Avoid: empty superlatives (“revolutionary”), vague “platform” talk without specifics, and cluttering the hero with five competing CTAs.

## Information architecture (marketing routes)

| Route | Purpose |
|-------|---------|
| `/` | Landing — position FESTR, primary CTA to app or waitlist, secondary trust cues. |
| `/about` | Mission, problem, approach, people / credibility. |
| `/contact` | Structured inquiry; expectations on response time. |
| `/privacy` | Data practices at a high level; link to full policy when legal review exists. |

Optional later: `/terms`, `/security`, `/press`, `/partners` — out of scope until linked from footer or nav.

## Shared layout expectations

- **Header:** wordmark + minimal nav (About, Contact) + primary button (“Open app” / “Get updates” depending on launch phase).
- **Footer:** Privacy, Contact, optional social, copyright, org identifier.
- **Accessibility:** semantic landmarks (`header`, `main`, `footer`), focus states, sufficient contrast (WCAG AA target).
- **Performance:** hero LCP prioritized; no blocking third-party scripts in critical path for v1.

## SEO (baseline)

- Unique `<title>` and meta description per page (see each doc).
- One **H1** per page; logical heading order.
- Open Graph defaults at root layout; per-page overrides where it matters (landing first).

## Relationship to the app

Marketing lives **outside** the authenticated app shell. CTAs may point to `/report`, `/map`, or a **waitlist** route depending on release phase — document the chosen CTA in `landing.md` when you lock it.

---

*Related: [technical-plan.md](../technical-plan.md) for stack and phases.*
