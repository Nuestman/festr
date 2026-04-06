import Link from "next/link";

import { MarketingOpenAppLink } from "@/components/marketing/marketing-open-app-link";

export function AboutContent() {
  return (
    <>
      <header className="about-hero">
        <p className="about-eyebrow">Mission</p>
        <h1 className="about-title">Why FESTR exists</h1>
        <p className="about-lede">
          FESTR (First Emergency Support &amp; Trained Response) is a community-powered web application that aims to
          improve how people and services connect during emergencies—through{" "}
          <strong>timely, structured information</strong>, <strong>visibility of life-saving resources</strong>, and{" "}
          <strong>practical education</strong> for the
          public, with room to grow toward deeper coordination with responders as partnerships mature.
        </p>
      </header>

      <section className="about-section" aria-labelledby="problem-heading">
        <h2 id="problem-heading" className="about-h2">
          The reality we start from
        </h2>
        <div className="about-prose">
          <p>
            In many settings—including Ghana—pre-hospital pathways can be <strong>slow</strong> or{" "}
            <strong>fragmented</strong>, and coordination between bystanders and professional help is often weak.
            People may not know where AEDs or first-aid points are, or what to do in the first minutes after a crash, a
            collapse, or a fire.
          </p>
          <p>
            At the same time, witnesses often <strong>document</strong> emergencies before they help—sometimes because
            they lack confidence or a clear channel. FESTR does not moralize that instinct. It tries to{" "}
            <strong>redirect attention</strong> into structured reporting and learning so the same moment can produce
            something usable for victims and for services trying to respond.
          </p>
        </div>
      </section>

      <section className="about-section" aria-labelledby="principles-heading">
        <h2 id="principles-heading" className="about-h2">
          How we build
        </h2>
        <ul className="about-principles">
          <li>
            <strong>Speed under stress</strong> — flows stay short; minimal taps when someone is shaken.
          </li>
          <li>
            <strong>Honesty about phase</strong> — we ship what works and say clearly what still needs partners, policy,
            or time.
          </li>
          <li>
            <strong>Privacy-aware design</strong> — location and media from sensitive incidents deserve careful handling
            and transparent policy.
          </li>
          <li>
            <strong>Accessibility first</strong> — mobile web, readable type, plain language.
          </li>
        </ul>
      </section>

      <section className="about-section" aria-labelledby="scope-heading">
        <h2 id="scope-heading" className="about-h2">
          What FESTR is—and isn’t
        </h2>
        <div className="about-scope" role="region" aria-label="Scope at launch">
          <div className="about-scope__col">
            <h3 className="about-scope__label">FESTR is</h3>
            <ul>
              <li>A channel for structured incident information and location when you use it.</li>
              <li>A map and education layer aimed at public benefit.</li>
              <li>A foundation for pilots with NGOs, services, and institutions.</li>
            </ul>
          </div>
          <div className="about-scope__col about-scope__col--muted">
            <h3 className="about-scope__label">Not a replacement for (at launch)</h3>
            <ul>
              <li>National emergency numbers or official dispatch—always use those for emergencies.</li>
              <li>A guarantee of response time or outcome.</li>
              <li>Full government integration by default—that comes where policy and trust allow.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-section about-founder" aria-labelledby="founder-heading">
        <h2 id="founder-heading" className="about-h2">
          Who’s behind it
        </h2>
        <div className="about-founder__card">
          <p className="about-founder__lead">
            FESTR is led by an <strong>emergency nurse in Ghana</strong> with hands-on experience in pre-hospital
            coordination, incident response, and community emergency training—not a distant product concept.
          </p>
          <p>
            That includes work as <strong>Emergency Response Supervisor</strong> at AGA Health Foundation, coordinating
            off-site emergency response posts and linkage with hospital emergency services, and leadership of the{" "}
            <strong>Usmaniya Foundation for Basic Emergency Care (UFoundBEC)</strong>, focused on public training in
            disaster response, lifesaving skills, and road-safety outreach.
          </p>
          <p className="about-founder__note">
            The product is driven by what shows up on the ground: delays, gaps, and the need for systems that communities
            and responders can actually use—not slide decks alone.
          </p>
        </div>
      </section>

      <section className="about-section" aria-labelledby="roadmap-heading">
        <h2 id="roadmap-heading" className="about-h2">
          Rollout (plain language)
        </h2>
        <ol className="about-roadmap">
          <li>
            <strong>Now / next</strong> — core flows: report, map, learn; authentication and partnerships as you bring
            them online.
          </li>
          <li>
            <strong>Partner integration</strong> — NGOs, private ambulance, selected hospitals and programs.
          </li>
          <li>
            <strong>Deeper integration</strong> — broader official channels where policy, trust, and operations align.
          </li>
        </ol>
      </section>

      <section className="about-cta" aria-labelledby="about-cta-heading">
        <h2 id="about-cta-heading" className="visually-hidden">
          Next steps
        </h2>
        <p className="about-cta__text">Explore the app or get in touch for pilots and collaboration.</p>
        <div className="about-cta__actions">
          <MarketingOpenAppLink className="landing-btn landing-btn--primary">Open FESTR</MarketingOpenAppLink>
          <Link href="/contact" className="landing-btn landing-btn--ghost">
            Contact
          </Link>
        </div>
      </section>
    </>
  );
}
