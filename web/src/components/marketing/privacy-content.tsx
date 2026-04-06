import Link from "next/link";

export function PrivacyContent() {
  return (
    <>
      <header className="privacy-header">
        <p className="privacy-updated">Last updated: 5 April 2026</p>
        <h1 className="privacy-title">Privacy</h1>
        <aside className="privacy-notice" role="note">
          <strong>Important:</strong> This policy is provided in plain language to help you understand our practices. It
          is <strong>not legal advice</strong> and should be <strong>reviewed by qualified counsel</strong> for your
          jurisdiction before you rely on it commercially or make public commitments. We will refine it as the product and
          hosting setup evolve.
        </aside>
      </header>

      <div className="privacy-body">
        <section aria-labelledby="privacy-intro">
          <h2 id="privacy-intro" className="privacy-h2">
            1. Who we are &amp; scope
          </h2>
          <div className="privacy-prose">
            <p>
              <strong>FESTR</strong> (“we”, “us”) refers to the First Emergency Support &amp; Trained Response initiative
              and its web properties. This page covers the <strong>public marketing site</strong> (pages such as the
              home, about, contact, and privacy) and, where noted, the <strong>web application</strong> when it is
              available and collects data beyond basic browsing.
            </p>
            <p>If we later split marketing and app into separate notices, we will link them clearly from here.</p>
          </div>
        </section>

        <section aria-labelledby="privacy-collect">
          <h2 id="privacy-collect" className="privacy-h2">
            2. What we collect
          </h2>
          <p className="privacy-lead">
            The categories below depend on what you use. Not every visitor provides every type of data.
          </p>
          <div className="privacy-table-wrap" role="region" aria-label="Data collection summary">
            <table className="privacy-table">
              <thead>
                <tr>
                  <th scope="col">Context</th>
                  <th scope="col">Examples</th>
                  <th scope="col">Why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Marketing site</td>
                  <td>
                    Pages you visit, basic technical logs, analytics if we enable them (e.g. aggregated usage)
                  </td>
                  <td>Operate and improve the site; understand reach</td>
                </tr>
                <tr>
                  <td>Contact form</td>
                  <td>Name, email, organization, topic, message, consent timestamp</td>
                  <td>Respond to inquiries; triage partnerships and pilots</td>
                </tr>
                <tr>
                  <td>App (when live)</td>
                  <td>
                    Account details if you sign in; incident reports; approximate or precise location; photos or video
                    you attach
                  </td>
                  <td>Provide the service; coordination workflows as described in-product</td>
                </tr>
                <tr>
                  <td>Cookies &amp; similar tech</td>
                  <td>Essential cookies for sign-in or preferences; optional analytics</td>
                  <td>Security, session, and—if used—usage measurement</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="privacy-prose">
            We do <strong>not</strong> sell your personal information. We do not use it for unrelated third-party
            marketing unless we ask you separately and you opt in.
          </p>
        </section>

        <section aria-labelledby="privacy-basis">
          <h2 id="privacy-basis" className="privacy-h2">
            3. Legal bases &amp; use
          </h2>
          <p className="privacy-prose">
            Depending on where you live, processing may rely on <strong>contract</strong> (providing a service you asked
            for), <strong>legitimate interests</strong> (running a secure site, understanding aggregate usage), and/or{" "}
            <strong>consent</strong> (e.g. optional analytics, marketing emails, or sensitive categories where required). We
            will align final wording with applicable law in the regions we serve.
          </p>
        </section>

        <section aria-labelledby="privacy-sensitive">
          <h2 id="privacy-sensitive" className="privacy-h2">
            4. Location &amp; sensitive information
          </h2>
          <div className="privacy-prose">
            <p>
              <strong>Location.</strong> Incident and safety features may rely on device location. Precision, retention,
              and who can view that data will be described in the app and limited by technical controls and policy as we
              ship each phase.
            </p>
            <p>
              <strong>Media.</strong> Photos or video you upload may reveal scenes of injury or distress. Treat uploads as
              potentially sensitive. Retention and deletion will follow published rules and technical capability
              (including secure storage with providers such as blob storage).
            </p>
            <p>
              <strong>Silent or security-related alerts.</strong> These require extra care. We will document access,
              retention, and any sharing with authorities in line with law and product design—not ahead of what is actually
              built.
            </p>
          </div>
        </section>

        <section aria-labelledby="privacy-sharing">
          <h2 id="privacy-sharing" className="privacy-h2">
            5. Sharing &amp; subprocessors
          </h2>
          <div className="privacy-prose">
            <p>
              We use <strong>service providers</strong> to host and operate the product—categories typically include:
            </p>
            <ul className="privacy-list">
              <li>
                <strong>Hosting &amp; edge</strong> (e.g. Vercel or similar) for the web app and APIs
              </li>
              <li>
                <strong>Database</strong> (e.g. Neon Postgres) for application data
              </li>
              <li>
                <strong>File storage</strong> (e.g. object storage for media) where uploads exist
              </li>
              <li>
                <strong>Authentication</strong> (e.g. managed auth tied to the database) when accounts are enabled
              </li>
            </ul>
            <p>
              <strong>Responders and authorities.</strong> Data is shared with emergency services, NGOs, or government
              systems <strong>only</strong> as described in the product for that phase, and where law and agreements
              allow. There is no blanket “always shared with police” unless the product explicitly says so and the law
              supports it.
            </p>
          </div>
        </section>

        <section aria-labelledby="privacy-retention">
          <h2 id="privacy-retention" className="privacy-h2">
            6. Retention
          </h2>
          <p className="privacy-prose">
            We keep information only as long as needed for the purposes above, including legal, safety, and dispute
            resolution. Exact periods for incidents, media, and accounts will be published as features go live. You may
            request deletion where applicable law requires it, subject to exceptions (e.g. lawful holds).
          </p>
        </section>

        <section aria-labelledby="privacy-security">
          <h2 id="privacy-security" className="privacy-h2">
            7. Security
          </h2>
          <p className="privacy-prose">
            We use industry-standard measures such as <strong>HTTPS</strong> for data in transit, access controls on
            systems, and separation of environments where practical. No method of transmission or storage is 100%
            secure—we describe practices honestly and improve them over time.
          </p>
        </section>

        <section aria-labelledby="privacy-rights">
          <h2 id="privacy-rights" className="privacy-h2">
            8. Your rights
          </h2>
          <p className="privacy-prose">
            Depending on your location, you may have rights to <strong>access</strong>, <strong>correct</strong>,{" "}
            <strong>delete</strong>, or <strong>restrict</strong> processing of your personal data, or to{" "}
            <strong>object</strong> to certain processing. To exercise these rights, contact us via the{" "}
            <Link href="/contact">contact form</Link> and describe your request. We may need to verify your identity
            before acting.
          </p>
        </section>

        <section aria-labelledby="privacy-children">
          <h2 id="privacy-children" className="privacy-h2">
            9. Children
          </h2>
          <p className="privacy-prose">
            FESTR is not directed at children under 13 (or the age required in your country). We do not knowingly
            collect personal information from children. If you believe we have, contact us and we will take appropriate
            steps.
          </p>
        </section>

        <section aria-labelledby="privacy-changes">
          <h2 id="privacy-changes" className="privacy-h2">
            10. Changes to this policy
          </h2>
          <p className="privacy-prose">
            We may update this page as the service changes. We will revise the “Last updated” date and, for material
            changes, provide additional notice where appropriate (e.g. a banner on the site or email to account holders).
          </p>
        </section>

        <section aria-labelledby="privacy-contact">
          <h2 id="privacy-contact" className="privacy-h2">
            11. Contact
          </h2>
          <p className="privacy-prose">
            For privacy questions or requests, use the <Link href="/contact">contact form</Link> and choose the topic that
            best fits, or describe “privacy” in your message. We will respond consistent with our capacity and
            applicable law.
          </p>
        </section>
      </div>
    </>
  );
}
