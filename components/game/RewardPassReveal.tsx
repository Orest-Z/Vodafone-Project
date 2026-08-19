"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { GameResult } from "@/types/game";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

/** Fake but visually convincing barcode — deterministic from the code string. */
function Barcode({ value }: { value: string }) {
  const bars = Array.from(value).map((ch) => (ch.charCodeAt(0) % 4) + 1);
  return (
    <div className="reward-barcode">
      {bars.map((w, i) => (
        <div key={i} className="reward-barcode-bar" style={{ width: w, height: `${40 - (i % 3) * 6}px` }} />
      ))}
    </div>
  );
}

export default function RewardPassReveal({
  result,
  onClose,
}: {
  result: GameResult;
  onClose: () => void;
}) {
  const { won, prize } = result;

  return (
    <AnimatePresence>
      <motion.div
        className="game-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={SPRING}
          onClick={(e) => e.stopPropagation()}
          className="game-overlay-card"
        >
          <button onClick={onClose} aria-label="Close" className="game-overlay-close">
            <X size={16} />
          </button>

          {!won ? (
            <div className="reward-lose">
              <p className="reward-lose-eyebrow">No Prize This Time</p>
              <h2 className="reward-lose-title">So close.</h2>
              <p className="reward-lose-sub">
                Your pack is still fully active — head back to the hub for another game if you&apos;ve got credits left.
              </p>
              <button onClick={onClose} className="game-btn game-btn--dark" style={{ marginTop: 20 }}>
                Back to Game Hub
              </button>
            </div>
          ) : (
            <>
              <div className="reward-win-header">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="reward-win-eyebrow"
                >
                  Prize Unlocked
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING, delay: 0.2 }}
                  className="reward-win-title"
                >
                  {prize?.label}
                </motion.h2>
                <p className="reward-win-sub">at {prize?.sponsor}</p>
              </div>

              <div className="reward-perforation" />

              <div className="reward-body">
                <p className="reward-body-label">Show this at checkout</p>
                <div className="reward-barcode-row">
                  <Barcode value={prize?.code ?? ""} />
                  <span className="reward-code">{prize?.code}</span>
                </div>

                <p className="reward-note">
                  This has already been added to your Vodafone Tourist Pass — no extra step needed.
                </p>

                <button onClick={onClose} className="game-btn game-btn--dark" style={{ marginTop: 20 }}>
                  Done
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}