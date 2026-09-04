export const metadata = {
  title: "Privacy Policy | Vodafone Tourist Pack",
};

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <p className="legal-eyebrow">Legal</p>
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Last updated: 4 September 2026 · Demonstration prototype</p>
      </div>

      <div className="legal-body">
        <p className="legal-intro">
          This Privacy Policy explains what information the Vodafone Tourist Pack website
          (&ldquo;Service&rdquo;) collects, why, and how it is protected. We collect only what a Pack
          activation, the Daily Drop game, and your Tourist Pass genuinely need to work.
        </p>

        <section className="legal-section">
          <h2>1. Information We Collect</h2>
          <ul className="legal-list">
            <li>
              <strong>Identity details</strong> — first name, last name, and passport/ID number,
              provided by you (typed manually or via the on-device passport scanner described below).
            </li>
            <li>
              <strong>Contact details</strong> — your email address, used to send your eSIM/pickup
              confirmation and Pack details.
            </li>
            <li>
              <strong>Payment confirmation</strong> — the PayPal order and capture reference and the
              amount paid. We never receive or store your card number; PayPal processes that directly.
            </li>
            <li>
              <strong>Pack &amp; usage data</strong> — the Pack you purchased, delivery method, order
              reference, and Daily Drop game credit balance.
            </li>
          </ul>
        </section>

        <section className="legal-section legal-section--highlight">
          <h2>2. Passport/ID Scanning — how it actually works</h2>
          <p>
            The optional &ldquo;Scan Passport / ID&rdquo; feature is designed so your document photo
            never leaves your device:
          </p>
          <ul className="legal-list">
            <li>The photo is read and processed entirely in your browser, on your own device.</li>
            <li>
              It is never uploaded, transmitted, or sent to any Vodafone server or any third party —
              there is no network request involved in reading it.
            </li>
            <li>
              We read only the passport&rsquo;s standardized Machine Readable Zone (the printed strip
              of text at the bottom of the document), the same field every airport e-gate reads —
              never the printed photo or visual page.
            </li>
            <li>
              Only three values are ever extracted into the form: first name, last name, and document
              number. Other data encoded in that strip (date of birth, nationality, sex, expiry date)
              is read by the scanner but immediately discarded, never stored or displayed.
            </li>
            <li>
              The photo itself, and the full scanned text, are discarded the instant scanning
              finishes — nothing is written to your device&rsquo;s storage or ours.
            </li>
          </ul>
          <p>
            The resulting passport/ID number is then stored the same way it would be if you had typed
            it — see &ldquo;Why We Store Your Passport Number&rdquo; below.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Why We Store Your Passport Number</h2>
          <p>
            Albanian telecommunications law requires a valid identity document number to be recorded
            against every SIM activation. We retain this specifically to meet that legal requirement
            and to protect against fraudulent or unlawful use of an activated SIM.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Who We Share Data With</h2>
          <ul className="legal-list">
            <li><strong>PayPal</strong> — processes your payment; we never see your card details.</li>
            <li>
              <strong>PassKit</strong> — issues your Vodafone Tourist Pass to Apple Wallet/Google
              Wallet, if you choose to add one, using your name and Pack details.
            </li>
            <li>
              <strong>Supabase</strong> — our database host, where your activation and order records
              are stored.
            </li>
            <li>
              <strong>Email delivery (Gmail/Google)</strong> — used to send your confirmation and
              eSIM/pickup details.
            </li>
          </ul>
          <p>We do not sell your personal data to anyone.</p>
        </section>

        <section className="legal-section">
          <h2>5. Cookies &amp; Local Storage</h2>
          <p>
            We don&rsquo;t use tracking or advertising cookies. Your form details are held briefly in
            your browser&rsquo;s session storage — scoped to a single browser tab and automatically
            cleared once the tab closes — purely to carry your details from the activation page to the
            payment page without putting them in a URL.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Data Retention</h2>
          <p>
            Activation and order records are kept for as long as needed to support your Pack, resolve
            support requests, and meet the legal identity-recording requirement described above.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data by contacting
            Vodafone Albania Support through the channels listed in the site footer, subject to our
            legal obligation to retain identity records for SIM registration.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Security</h2>
          <p>
            Payment is handled entirely by PayPal&rsquo;s own secure checkout. Data in transit to our
            servers is encrypted (HTTPS), and access to stored records is restricted to what the
            Service needs to operate.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Children&rsquo;s Privacy</h2>
          <p>
            The Service is intended for adult travelers activating their own Pack and is not directed
            at children.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Changes to This Policy</h2>
          <p>We may update this policy from time to time; the &ldquo;last updated&rdquo; date above will change accordingly.</p>
        </section>

        <section className="legal-section">
          <h2>11. Contact</h2>
          <p>
            Questions about this policy or your data can be directed to Vodafone Albania Support
            through the channels listed in the site footer.
          </p>
        </section>

        <p className="legal-footnote">
          This page is part of a demonstration prototype built for an internship project and is not a
          real Vodafone legal document.
        </p>
      </div>
    </div>
  );
}
