"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

const TOPICS = [
  { value: "", label: "Select a topic" },
  { value: "partnership", label: "Partnership" },
  { value: "pilot", label: "Pilot / program" },
  { value: "press", label: "Press & media" },
  { value: "technical", label: "Technical" },
  { value: "other", label: "Other" },
] as const;

type TopicValue = (typeof TOPICS)[number]["value"];

type FormState = {
  name: string;
  email: string;
  organization: string;
  topic: TopicValue;
  message: string;
  consent: boolean;
};

const initialForm: FormState = {
  name: "",
  email: "",
  organization: "",
  topic: "",
  message: "",
  consent: false,
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ContactForm() {
  const formId = useId();
  const [form, setForm] = useState<FormState>(initialForm);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) next.email = "Please enter your email.";
    else if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    if (!form.topic) next.topic = "Choose a topic so we can route your message.";
    const msg = form.message.trim();
    if (msg.length < 20) next.message = "Please write at least 20 characters.";
    if (msg.length > 2000) next.message = "Message is too long (max 2000 characters).";
    if (!form.consent) next.consent = "Please confirm you understand how we use your data.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) return;
    if (!validate()) return;

    setSubmitted(true);
    setForm(initialForm);
    setErrors({});
  }

  return (
    <>
      {submitted && (
        <div className="contact-success" role="status" aria-live="polite">
          <p className="contact-success__title">Thanks — we’ve received your message.</p>
          <p className="contact-success__text">
            We’ll get back to you when we can. If your matter is urgent and operational, say so in the subject line next
            time.
          </p>
          <button
            type="button"
            className="contact-success__reset landing-btn landing-btn--ghost"
            onClick={() => setSubmitted(false)}
          >
            Send another message
          </button>
        </div>
      )}

      {!submitted && (
        <form id={formId} className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="contact-field">
            <label htmlFor={`${formId}-name`}>Name</label>
            <input
              id={`${formId}-name`}
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? `${formId}-name-err` : undefined}
            />
            {errors.name && (
              <span id={`${formId}-name-err`} className="contact-error" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className="contact-field">
            <label htmlFor={`${formId}-email`}>Email</label>
            <input
              id={`${formId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? `${formId}-email-err` : undefined}
            />
            {errors.email && (
              <span id={`${formId}-email-err`} className="contact-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="contact-field">
            <label htmlFor={`${formId}-org`}>
              Organization <span className="contact-optional">(optional)</span>
            </label>
            <input
              id={`${formId}-org`}
              name="organization"
              type="text"
              autoComplete="organization"
              value={form.organization}
              onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
            />
          </div>

          <div className="contact-field">
            <label htmlFor={`${formId}-topic`}>Topic</label>
            <select
              id={`${formId}-topic`}
              name="topic"
              value={form.topic}
              onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value as TopicValue }))}
              aria-invalid={errors.topic ? true : undefined}
              aria-describedby={errors.topic ? `${formId}-topic-err` : undefined}
            >
              {TOPICS.map((t) => (
                <option key={t.value || "topic-placeholder"} value={t.value} disabled={t.value === ""}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.topic && (
              <span id={`${formId}-topic-err`} className="contact-error" role="alert">
                {errors.topic}
              </span>
            )}
          </div>

          <div className="contact-field">
            <label htmlFor={`${formId}-message`}>Message</label>
            <textarea
              id={`${formId}-message`}
              name="message"
              rows={6}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={
                errors.message
                  ? `${formId}-message-hint ${formId}-message-err`
                  : `${formId}-message-hint`
              }
            />
            <span id={`${formId}-message-hint`} className="contact-hint">
              {form.message.length} / 2000 · at least 20 characters
            </span>
            {errors.message && (
              <span id={`${formId}-message-err`} className="contact-error" role="alert">
                {errors.message}
              </span>
            )}
          </div>

          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor={`${formId}-website`}>Company website</label>
            <input
              id={`${formId}-website`}
              name="company_website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="contact-field contact-field--checkbox">
            <label className="contact-checkbox">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? `${formId}-consent-err` : undefined}
              />
              <span>
                I understand how my data is used — see the <Link href="/privacy">Privacy</Link> page.
              </span>
            </label>
            {errors.consent && (
              <span id={`${formId}-consent-err`} className="contact-error" role="alert">
                {errors.consent}
              </span>
            )}
          </div>

          <div className="contact-actions">
            <button type="submit" className="landing-btn landing-btn--primary contact-submit">
              Send message
            </button>
          </div>
        </form>
      )}

      <section className="contact-faq" aria-labelledby="contact-faq-heading">
        <h2 id="contact-faq-heading" className="contact-faq__title">
          Quick answers
        </h2>
        <dl className="contact-faq__list">
          <div>
            <dt>Pilots</dt>
            <dd>
              Choose <strong>Pilot / program</strong> or <strong>Partnership</strong> and describe your organization
              and geography. We’ll follow up by email.
            </dd>
          </div>
          <div>
            <dt>Data &amp; privacy</dt>
            <dd>
              Read the <Link href="/privacy">Privacy</Link> page. Until a backend is connected, this form only confirms
              on screen — wire to secure storage or email when ready.
            </dd>
          </div>
          <div>
            <dt>Emergencies</dt>
            <dd>Do not use this form for emergencies. Use official emergency numbers and local services.</dd>
          </div>
        </dl>
      </section>
    </>
  );
}
