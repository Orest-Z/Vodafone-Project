"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";
import { GameResult } from "@/types/game";
import { rollPrize } from "./GameContext";

type Corner = "left" | "center" | "right";
type Phase = "aim" | "result";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

const CORNERS: { id: Corner; label: string; x: number }[] = [
  { id: "left", label: "Left", x: -92 },
  { id: "center", label: "Center", x: 0 },
  { id: "right", label: "Right", x: 92 },
];

const TOBI_LINES = {
  intro: "My diving algorithms are ready. Pick your corner.",
  save: "Predicted. My training data includes every tourist ever.",
  goal: "...okay, that one wasn't in my training data.",
};

export default function TOBiKeeperGame({
  onFinish,
}: {
  onFinish: (result: GameResult) => void;
}) {
  const [phase, setPhase] = useState<Phase>("aim");
  const [shotCorner, setShotCorner] = useState<Corner | null>(null);
  const [diveCorner, setDiveCorner] = useState<Corner | null>(null);
  const [won, setWon] = useState(false);

  const takeShot = (corner: Corner) => {
    // TOBi guesses right ~45% of the time — feels fair, favors the tourist.
    const tobiGuess: Corner =
      Math.random() < 0.45
        ? corner
        : CORNERS.filter((c) => c.id !== corner)[Math.floor(Math.random() * 2)].id;

    const result = tobiGuess !== corner;

    setShotCorner(corner);
    setDiveCorner(tobiGuess);
    setWon(result);
    setPhase("result");
  };

  const finish = () => {
    onFinish({
      gameId: "tobi-keeper",
      won,
      prize: won ? rollPrize() : null,
    });
  };

  const shotX = shotCorner ? CORNERS.find((c) => c.id === shotCorner)!.x : 0;
  const diveX = diveCorner ? CORNERS.find((c) => c.id === diveCorner)!.x : 0;

  return (
    <div className="game-card">
      <div className="game-card-header">
        <p className="game-eyebrow">Mini-Game</p>
        <h1 className="game-title">Beat TOBi</h1>
      </div>

      <div className="game-card-body">
        <div className="tobi-pitch">
          <div className="tobi-goal-frame" />

          <motion.div
            className="tobi-keeper"
            animate={{
              x: phase === "result" ? diveX : 0,
              rotate: phase === "result" ? (diveX < 0 ? -12 : diveX > 0 ? 12 : 0) : 0,
            }}
            transition={SPRING}
          >
            <div className="tobi-keeper-bot">
              <Bot size={22} color="#fff" />
            </div>
          </motion.div>

          <motion.div
            className="tobi-ball"
            animate={{
              x: phase === "result" ? shotX : 0,
              y: phase === "result" ? -78 : 0,
            }}
            transition={{ ...SPRING, delay: 0.05 }}
          />
        </div>

        <div className="tobi-speech">
          <p>{phase === "aim" ? TOBI_LINES.intro : won ? TOBI_LINES.goal : TOBI_LINES.save}</p>
        </div>

        {phase === "aim" ? (
          <div className="tobi-controls">
            {CORNERS.map((c) => (
              <button key={c.id} onClick={() => takeShot(c.id)} className="tobi-corner-btn">
                {c.label}
              </button>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.35 }}
              className="tobi-result"
            >
              <p className={`tobi-result-title ${won ? "tobi-result-title--win" : ""}`}>
                {won ? "Goal! You win a prize." : "Saved. Better luck next time."}
              </p>
              <button onClick={finish} className="game-btn game-btn--primary" style={{ marginTop: 20 }}>
                Continue
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}