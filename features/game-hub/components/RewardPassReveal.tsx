"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet } from "lucide-react";
import { DropResult } from "@/features/game-hub/types/game";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

export default function RewardPassReveal({
  result,
  touristId,
  onClose,
}: {
  result: DropResult;
  touristId: string;
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
                Your pack is still fully active. Head back to the hub for another game if you&apos;ve got credits left.
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
                <p className="reward-note">
                  This reward is redeemed straight from your Vodafone Tourist Pass in Apple
                  Wallet. No code to show, no extra step. Just open your pass at checkout.
                </p>

                <a
                  href={`/my-pack?touristId=${touristId}`}
                  className="game-btn game-btn--dark"
                  style={{ marginTop: 20, textDecoration: "none" }}
                >
                  <Wallet size={16} />
                  Open my Tourist Pass
                </a>

                <button onClick={onClose} className="reward-done-link">
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