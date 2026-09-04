"use client";

import Link from "next/link";
import { WalletCards } from "lucide-react";

interface WalletUnavailableNoticeProps {
  platform: "apple" | "google";
  subscriptionId: string;
}

const PLATFORM_LABEL: Record<WalletUnavailableNoticeProps["platform"], string> = {
  apple: "Apple Wallet",
  google: "Google Wallet",
};

// Reached only as a fallback: ActivationService links here when PassKit
// enrollment itself failed, so there is no real pass to hand the tourist —
// this exists to turn that into an honest, informative screen instead of a
// dead link, not to pretend the pass is on its way.
export default function WalletUnavailableNotice({ platform, subscriptionId }: WalletUnavailableNoticeProps) {
  const label = PLATFORM_LABEL[platform];

  return (
    <div className="checkout-dark-wrapper">
      <div className="activate-shell">
        <div className="form-card" style={{ textAlign: "center" }}>
          <div className="wallet-fallback-icon">
            <WalletCards size={26} color="#fff" strokeWidth={2} />
          </div>
          <h2 className="activate-success-title">Your {label} pass isn&apos;t available right now</h2>
          <p className="step-text">
            This can happen occasionally when pass issuance fails on our end. Your tourist pack
            itself is unaffected and already active — this only concerns the {label} shortcut.
          </p>

          <div className="form-alert-error" style={{ textAlign: "left" }}>
            Reference: <span style={{ fontFamily: "monospace" }}>{subscriptionId}</span>
            <br />
            Reply to your activation email with this reference, or{" "}
            <a href="https://www.vodafone.al/na-kontaktoni" target="_blank" rel="noopener noreferrer">
              contact support
            </a>
            , and we&apos;ll sort out your {label} pass directly.
          </div>

          <Link href="/" className="game-btn game-btn--dark" style={{ marginTop: 8 }}>
            Return to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
