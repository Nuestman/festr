# Contact page (`/contact`)

## Job of this page

Provide a **low-friction, trustworthy** way to reach the team: pilots, partnerships, press, technical questions, or general feedback — without looking like a black hole.

---

## Proposed layout

### 1. Intro

**H1:** “Contact”

**Short paragraph:** Who should write (organizations, media, collaborators) and **expected response** — e.g. “We aim to reply within a few business days.” Set expectations; don’t promise 24/7 human support unless true.

---

### 2. Contact form (recommended fields)

| Field | Required | Notes |
|-------|----------|--------|
| Name | Yes | |
| Email | Yes | Validate format client + server. |
| Organization | No | Helps triage. |
| Topic | Yes | Select: Partnership / Pilot / Press / Technical / Other. |
| Message | Yes | Min length ~20 chars to reduce spam; max ~2000. |
| Consent | Yes (checkbox) | Link to Privacy: “I understand how my data is used.” |

**After submit:** Inline success state — “Thanks — we’ve received your message.” No redirect to a blank page.

**Implementation note:** wire form to **email** (Resend, etc.), **CRM**, or **database + notification** in a later phase — document the chosen channel in `../technical-plan.md` when implemented.

---

### 3. Alternative contact (optional)

If you maintain a **public email** for press or partnerships only, show it as secondary:

- “Press: press@…” — only if monitored.

Avoid listing personal phone numbers unless necessary and safe.

---

### 4. FAQ snippet (optional, 2–3 items)

- **Pilots:** how organizations can express interest.
- **Data / privacy:** pointer to `/privacy`.
- **Emergencies:** “For life-threatening emergencies, use local emergency numbers” — jurisdiction-appropriate disclaimer (review locally).

---

## SEO

| Field | Guidance |
|-------|----------|
| **Title** | `Contact — FESTR` |
| **Meta description** | Partnerships, pilots, press — how to reach the team. |

---

## Abuse and spam

- Server-side rate limit by IP (see technical plan).
- Honeypot field (hidden) optional.
- No public listing of submitted messages, ever.
