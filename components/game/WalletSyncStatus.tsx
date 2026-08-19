"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Wallet } from "lucide-react";

const STEPS = [
  "Verifying activation",
  "Encrypting pack details",
  "Writing to wallet",
] as const;

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

interface WalletSyncStatusProps {
  packTitle: string;
  onComplete: () => void;
}

/** Detects platform to decide which wallet CTA to lead with. No QR-on-same-device dead end. */
function useWalletPlatform() {
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) setPlatform("ios");
    else if (/Android/.test(ua)) setPlatform("android");
  }, []);
  return platform;
}

export default function WalletSyncStatus({ packTitle, onComplete }: WalletSyncStatusProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const platform = useWalletPlatform();

  useEffect(() => {
    if (stepIndex >= STEPS.length) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setStepIndex((i) => i + 1), 550);
    return () => clearTimeout(t);
  }, [stepIndex]);

  const walletLabel =
    platform === "ios" ? "Add to Apple Wallet" : platform === "android" ? "Add to Google Wallet" : "Save to phone wallet";

  return (
    <div className="game-card">
      <div className="game-card-header">
        <p className="game-eyebrow">Activation Confirmed</p>
        <h1 className="game-title">{packTitle}</h1>
      </div>

      <div className="game-card-body">
        {!done ? (
          <ul className="wallet-step-list">
            {STEPS.map((label, i) => {
              const active = i === stepIndex;
              const complete = i < stepIndex;
              return (
                <li key={label} className="wallet-step">
                  <div
                    className={`wallet-step-marker ${
                      complete ? "wallet-step-marker--complete" : active ? "wallet-step-marker--active" : ""
                    }`}
                  >
                    <AnimatePresence>
                      {complete && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={SPRING}
                          style={{ display: "flex" }}
                        >
                          <Check size={14} color="#fff" strokeWidth={3} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {active && !complete && <span className="wallet-step-dot" />}
                  </div>
                  <span className={`wallet-step-label ${complete || active ? "wallet-step-label--active" : ""}`}>
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className="wallet-done"
          >
            <div className="wallet-done-icon">
              <Check size={26} color="#fff" strokeWidth={3} />
            </div>
            <p className="wallet-done-title">Your eSIM is live in your wallet.</p>
            <p className="wallet-done-sub">
              No app needed — tap it at the airport gate like a boarding pass.
            </p>

            <button onClick={onComplete} className="game-btn game-btn--dark" style={{ marginTop: 24 }}>
              <Wallet size={16} />
              {walletLabel}
            </button>

            <button onClick={onComplete} className="game-btn game-btn--ghost" style={{ marginTop: 12 }}>
              Skip — take me to my game credit
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}