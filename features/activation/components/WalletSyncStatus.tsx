"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Gift, Mail } from "lucide-react";

const ESIM_STEPS = [
  "Verifying activation",
  "Preparing your eSIM",
  "Emailing your eSIM & setup guide",
] as const;

const PHYSICAL_STEPS = [
  "Verifying activation",
  "Preparing your order",
  "Emailing pickup & delivery details",
] as const;

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

interface WalletSyncStatusProps {
  packTitle: string;
  email: string;
  deliveryMethod: "ESIM" | "PHYSICAL_SIM";
  onComplete: () => void;
}

export default function WalletSyncStatus({
  packTitle,
  email,
  deliveryMethod,
  onComplete,
}: WalletSyncStatusProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const isEsim = deliveryMethod === "ESIM";
  const STEPS = isEsim ? ESIM_STEPS : PHYSICAL_STEPS;

  useEffect(() => {
    if (stepIndex >= STEPS.length) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setStepIndex((i) => i + 1), 550);
    return () => clearTimeout(t);
  }, [stepIndex, STEPS.length]);

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
            <p className="wallet-done-title">
              {isEsim ? "Check your inbox — your eSIM is on its way." : "Check your inbox — your order is confirmed."}
            </p>
            <p className="wallet-done-sub">
              {isEsim ? (
                <>
                  We've emailed your eSIM QR code and step-by-step wallet setup instructions to{" "}
                  <strong>{email}</strong>. Follow them to add it to your phone before you fly.
                </>
              ) : (
                <>
                  We've emailed your pickup and delivery details to <strong>{email}</strong>.
                </>
              )}
            </p>

            <div className="wallet-game-hint">
              <Gift size={18} />
              <span>
                One more thing — play a quick game next. Any credit you win is applied as a discount on your
                next pack.
              </span>
            </div>

            <button onClick={onComplete} className="game-btn game-btn--dark" style={{ marginTop: 20 }}>
              <Gift size={16} />
              Continue to my game credit
            </button>

            <p className="wallet-done-footnote">
              <Mail size={12} /> Didn't get the email? Check spam, or it can take a few minutes to arrive.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}