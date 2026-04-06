import type { Metadata } from "next";
import { Activity, BookOpen, Link2, Map } from "lucide-react";

import { MarketingOpenAppLink } from "@/components/marketing/marketing-open-app-link";

export const metadata: Metadata = {
  title: "FESTR — First Emergency Support & Trained Response",
  description:
    "FESTR helps bystanders share structured, location-tagged emergency information, discover life-saving resources like AEDs, and learn basic emergency steps—bridging communities and responders.",
};

const pillars = [
  {
    title: "Report",
    subtitle: "Real-time incident reporting",
    body: "Share location, context, and optional media—structured for response workflows, not social noise.",
    Icon: Activity,
  },
  {
    title: "Map",
    subtitle: "Resource awareness",
    body: "See AEDs and critical points on a living map. Crowdsourced today, verified as partnerships grow.",
    Icon: Map,
  },
  {
    title: "Learn",
    subtitle: "Emergency education",
    body: "Short, practical guidance for laypeople—so more people know what to do in the first minutes.",
    Icon: BookOpen,
  },
  {
    title: "Coordinate",
    subtitle: "Responder alignment",
    body: "Dashboards and institutional links roll out in phases—honest scope, real integration over time.",
    Icon: Link2,
  },
] as const;

const differentiators = [
  "Built for real-world constraints: mobile web, variable connectivity, stressful moments.",
  "Silent / discreet help for situations where speaking isn’t safe—handled with clear privacy expectations.",
  "Education alongside reporting—not “map only” or “social only.”",
  "Grounded in frontline emergency and pre-hospital experience—not generic software.",
];

export default function HomePage() {
  return (
    <main id="main-content" className="landing-main flex flex-1 flex-col">
      <section className="landing-hero" aria-labelledby="hero-heading">
        <div className="landing-hero__glow" aria-hidden />
        <div className="landing-hero__inner">
          <p className="landing-eyebrow">Community-powered emergency response</p>
          <h1 id="hero-heading" className="landing-hero__title">
            Turn bystanders
            <span className="landing-hero__title-break"> into a lifeline.</span>
          </h1>
          <p className="landing-hero__lede">
            FESTR helps people who witness emergencies share{" "}
            <strong>location-tagged</strong> information, discover{" "}
            <strong>life-saving resources</strong> (like AEDs), and learn{" "}
            <strong>basic emergency steps</strong>—with a path for official coordination as partnerships grow.
          </p>
          <div className="landing-hero__actions">
            <MarketingOpenAppLink className="landing-btn landing-btn--primary">Open the app</MarketingOpenAppLink>
            <a href="#how-it-works" className="landing-btn landing-btn--ghost">
              How it works
            </a>
          </div>
          <p className="landing-trust">Built with frontline emergency experience.</p>
        </div>
      </section>

      <section className="landing-section landing-problem" aria-labelledby="problem-heading">
        <div className="landing-section__inner">
          <h2 id="problem-heading" className="landing-section__title">
            The gap FESTR addresses
          </h2>
          <div className="landing-problem__grid">
            <p>
              In many places, pre-hospital care is <strong>fragmented</strong>, response{" "}
              <strong>delayed</strong>, and life-saving resources <strong>hard to find</strong>. Bystanders may not
              know what to do—or only document what they see.
            </p>
            <p>
              FESTR doesn’t moralize that behavior. It offers a <strong>structured channel</strong>: fewer wasted
              seconds, clearer signal to those who can help, and education that turns spectators into participants.
            </p>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="landing-section landing-pillars"
        aria-labelledby="pillars-heading"
      >
        <div className="landing-section__inner">
          <h2 id="pillars-heading" className="landing-section__title">
            What FESTR does
          </h2>
          <p className="landing-section__intro">Four pillars—scannable, honest about what ships when.</p>
          <ul className="landing-pillars__list">
            {pillars.map(({ title, subtitle, body, Icon }) => (
              <li key={title} className="landing-pillar">
                <Icon className="landing-pillar__icon size-7 shrink-0" strokeWidth={1.75} aria-hidden />
                <h3 className="landing-pillar__title">{title}</h3>
                <p className="landing-pillar__subtitle">{subtitle}</p>
                <p className="landing-pillar__body">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="landing-section landing-diff" aria-labelledby="diff-heading">
        <div className="landing-section__inner landing-diff__inner">
          <h2 id="diff-heading" className="landing-section__title">
            Why this isn’t another generic “safety app”
          </h2>
          <ul className="landing-diff__list">
            {differentiators.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="landing-section landing-audience" aria-labelledby="audience-heading">
        <div className="landing-section__inner">
          <h2 id="audience-heading" className="landing-section__title">
            Who it’s for
          </h2>
          <div className="landing-audience__grid">
            <div className="landing-audience__card">
              <h3>Public &amp; communities</h3>
              <p>
                Anyone who might witness an emergency—commuters, students, neighbors—needs fast, clear tools under
                stress.
              </p>
            </div>
            <div className="landing-audience__card">
              <h3>Organizations</h3>
              <p>
                Ambulance services, hospitals, and NGOs gain structured signal and a path to pilot integration—without
                vaporware promises on day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-cta" aria-labelledby="cta-heading">
        <div className="landing-cta__inner">
          <h2 id="cta-heading" className="landing-cta__title">
            Ready to explore?
          </h2>
          <p className="landing-cta__text">
            The product shell is live; features roll out in phases—see the app for current capability.
          </p>
          <MarketingOpenAppLink className="landing-btn landing-btn--primary landing-btn--lg">
            Open FESTR
          </MarketingOpenAppLink>
        </div>
      </section>
    </main>
  );
}
