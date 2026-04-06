import type { Metadata } from "next";

import { ContactForm } from "@/components/marketing/contact-form";

export const metadata: Metadata = {
  title: "Contact — FESTR",
  description:
    "Reach FESTR for partnerships, pilots, press, and collaboration. We aim to respond within a few business days.",
};

export default function ContactPage() {
  return (
    <main id="main-content" className="contact-main">
      <header className="contact-intro">
        <h1 className="contact-title">Contact</h1>
        <p className="contact-lede">
          Use this form for <strong>partnerships</strong>, <strong>pilots</strong>, <strong>press</strong>,{" "}
          <strong>technical questions</strong>, or general feedback. We aim to reply within{" "}
          <strong>a few business days</strong>.
        </p>
        <p className="contact-note">
          For life-threatening emergencies, use your <strong>local emergency number</strong>. FESTR is not a substitute
          for official dispatch.
        </p>
      </header>
      <ContactForm />
    </main>
  );
}
