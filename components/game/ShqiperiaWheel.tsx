"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GameResult } from "@/types/game";
import { PRIZE_POOL } from "./GameContext";

const SEGMENT_COUNT = PRIZE_POOL.length; // 7
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;
const RADIUS = 120;
const CENTER = 130;

const GLYPHS = ["eagle", "bunker", "byrek", "mountain", "olive", "raki", "sun"];

function Glyph({ type }: { type: string }) {
  const stroke = "var(--text-main)";
  switch (type) {
    case "eagle":
      return <path d="M0 -10 L6 0 L2 0 L4 8 L0 5 L-4 8 L-2 0 L-6 0 Z" fill={stroke} />;
    case "bunker":
      return <path d="M-8 6 A8 8 0 0 1 8 6 Z M-8 6 L8 6" fill="none" stroke={stroke} strokeWidth="2" />;
    case "byrek":
      return <path d="M-7 6 Q0 -8 7 6 Z" fill="none" stroke={stroke} strokeWidth="2" />;
    case "mountain":
      return (
        <path
          d="M-8 6 L-2 -6 L2 0 L5 -4 L9 6 Z"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    case "olive":
      return <path d="M-6 4 Q0 -8 6 4" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />;
    case "raki":
      return <path d="M-4 -6 L4 -6 L2 6 L-2 6 Z" fill="none" stroke={stroke} strokeWidth="2" />;
    default:
      return <circle r="6" fill="none" stroke={stroke} strokeWidth="2" />;
  }
}

function polarToCartesian(angleDeg: number, r: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) };
}

function segmentPath(index: number) {
  const startAngle = index * SEGMENT_ANGLE;
  const endAngle = startAngle + SEGMENT_ANGLE;
  const start = polarToCartesian(startAngle, RADIUS);
  const end = polarToCartesian(endAngle, RADIUS);
  const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

const SPRING_LAND = { type: "spring" as const, stiffness: 40, damping: 14 };

export default function ShqiperiaWheel({
  onFinish,
}: {
  onFinish: (result: GameResult) => void;
}) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [landedIndex, setLandedIndex] = useState<number | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);

    const targetIndex = Math.floor(Math.random() * SEGMENT_COUNT);
    const targetAngle = 360 - (targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
    const fullSpins = 5 * 360;
    const finalRotation = rotation - (rotation % 360) + fullSpins + targetAngle;

    setRotation(finalRotation);
    setTimeout(() => {
      setSpinning(false);
      setLandedIndex(targetIndex);
    }, 2600);
  };

  const finish = () => {
    if (landedIndex === null) return;
    onFinish({ gameId: "shqiperia-wheel", won: true, prize: PRIZE_POOL[landedIndex] });
  };

  return (
    <div className="game-card">
      <div className="game-card-header">
        <p className="game-eyebrow">Mini-Game</p>
        <h1 className="game-title">Shqipëria Wheel</h1>
      </div>

      <div className="game-card-body wheel-wrap">
        <div className="wheel-pointer-wrap">
          <div className="wheel-pointer" />

          <motion.svg
            width="260"
            height="260"
            viewBox="0 0 260 260"
            animate={{ rotate: rotation }}
            transition={spinning ? { duration: 2.6, ease: [0.15, 0.7, 0.25, 1] } : SPRING_LAND}
          >
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="var(--card-bg-alt)" stroke="var(--text-main)" strokeWidth="2" />
            {PRIZE_POOL.map((prize, i) => {
              const midAngle = i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
              const labelPos = polarToCartesian(midAngle, RADIUS * 0.66);
              const iconPos = polarToCartesian(midAngle, RADIUS * 0.4);
              return (
                <g key={prize.id}>
                  <path
                    d={segmentPath(i)}
                    fill={i % 2 === 0 ? "var(--card-bg)" : "var(--card-bg-alt)"}
                    stroke="var(--card-border)"
                    strokeWidth="1"
                  />
                  <g transform={`translate(${iconPos.x} ${iconPos.y}) rotate(${midAngle})`}>
                    <Glyph type={GLYPHS[i]} />
                  </g>
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    fontSize="7"
                    fontWeight={700}
                    fill="var(--text-main)"
                    transform={`rotate(${midAngle} ${labelPos.x} ${labelPos.y})`}
                  >
                    {prize.sponsor}
                  </text>
                </g>
              );
            })}
            <circle cx={CENTER} cy={CENTER} r="16" fill="var(--primary)" />
          </motion.svg>
        </div>

        {landedIndex === null ? (
          <button onClick={spin} disabled={spinning} className="game-btn game-btn--primary" style={{ marginTop: 32 }}>
            {spinning ? "Spinning\u2026" : "Spin the wheel"}
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_LAND}
            className="wheel-result"
          >
            <p className="wheel-result-title">{PRIZE_POOL[landedIndex].label}</p>
            <p className="wheel-result-sub">at {PRIZE_POOL[landedIndex].sponsor}</p>
            <button onClick={finish} className="game-btn game-btn--dark" style={{ marginTop: 20 }}>
              Claim it
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}