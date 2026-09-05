export const metadata = {
  title: "Terms & Conditions | Vodafone Tourist Pack",
};

export default function TermsPage() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <p className="legal-eyebrow">Legal</p>
        <h1 className="legal-title">Terms &amp; Conditions</h1>
        <p className="legal-updated">Last updated: 4 September 2026 · Demonstration prototype</p>
      </div>

      <div className="legal-body">
        <p className="legal-intro">
          These Terms &amp; Conditions govern your purchase and use of a Vodafone Tourist Pack
          (&ldquo;Pack&rdquo;) through this website (&ldquo;Service&rdquo;). By checking &ldquo;I agree to the Terms
          &amp; Conditions and Privacy Policy&rdquo; during activation, you accept these terms in full.
        </p>

        <section className="legal-section">
          <h2>1. Eligibility &amp; the Tourist Pack</h2>
          <p>
            The Tourist Pack is a prepaid mobile data, minutes and roaming bundle intended for
            visitors to Albania. Each Pack includes a fixed data allowance, national minutes, and a
            validity period in days, delivered either as an eSIM (digital) or a physical SIM
            collected in-store. You may also build a Custom Plan, choosing your own data, minutes,
            and validity within the ranges offered by the Custom Plan tool. Its price is calculated
            automatically and shown to you before you continue to payment.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Identity Verification</h2>
          <p>
            Albanian law requires a valid passport or national ID number to be recorded against every
            SIM activation, tourist or otherwise. You must provide accurate identity details during
            activation. You may type these manually or use the optional &ldquo;Scan Passport / ID&rdquo;
            feature, see our{" "}
            <a href="/privacy">Privacy Policy</a> for exactly how that feature works and what it does
            (and does not) do with your document photo.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Pricing &amp; Payment</h2>
          <p>
            Pack prices are set in Albanian Lek (ALL) and converted to Euro (EUR) for payment, at the
            rate shown on the checkout page at the time of purchase. Payment is processed by PayPal;
            we accept PayPal balance, linked bank accounts, and major debit/credit cards through
            PayPal&rsquo;s checkout. We never see or store your full card number. PayPal handles that
            directly. An activation is only confirmed once PayPal has successfully captured payment.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Delivery</h2>
          <p>
            eSIM Packs are delivered by email, typically within a few minutes of a successful payment,
            and include a QR code and manual entry details. Physical SIM Packs must be collected from
            a Vodafone store in Albania; bring the passport or ID used during activation.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Daily Drop Game &amp; Game Credits</h2>
          <p>
            Every successful Pack activation grants one Game Credit, redeemable for a single Daily
            Drop scratch-card play. Game Credits and any prizes won have no cash value, are
            non-transferable, and cannot be exchanged for money. Discount prizes apply only to your
            next Pack purchase and are shown, together with any other exclusive partner offers, in
            your Vodafone Tourist Pass.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Vodafone Tourist Pass</h2>
          <p>
            Where supported, your Pack can be added to Apple Wallet or Google Wallet as a Vodafone
            Tourist Pass, showing your plan details and any game rewards. The Pass is provided for
            convenience; your legal proof of purchase remains the confirmation email and order
            reference issued at activation.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Partner Offers</h2>
          <p>
            Discounts shown for partner businesses (restaurants, transport, retail, and similar) are
            provided by those independent third parties. Vodafone is not responsible for the
            availability, quality, or terms of any partner offer or service.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Cancellations &amp; Refunds</h2>
          <p>
            You may request a cancellation within 24 hours of activation, provided the Pack has not
            yet been used. Once an eSIM has been installed on a device, or a physical SIM has been
            activated and used, the purchase is final. To request a cancellation within the eligible
            window, contact Vodafone Support with your order reference.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Acceptable Use</h2>
          <p>
            Packs are intended for personal, non-commercial use by the identified traveler. Reselling,
            sharing account access, or using the Service for unlawful purposes may result in
            suspension without refund.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Limitation of Liability</h2>
          <p>
            The Service is provided on an &ldquo;as is&rdquo; basis. Network coverage, speeds, and
            third-party partner offers are provided in good faith but not guaranteed. To the extent
            permitted by law, Vodafone&rsquo;s liability is limited to the amount paid for the
            relevant Pack.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the Service after an update
            constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Contact</h2>
          <p>
            Questions about these Terms can be directed to Vodafone Albania Support through the
            channels listed in the site footer.
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
