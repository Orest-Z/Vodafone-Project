"use client";

import { useEffect, useRef, useState } from "react";
import type { DropResult } from "@/features/game-hub/types/game";

// Lowered from the original 0.55 — the card should feel quick and generous
// to scratch, not like a chore, especially live on stage.
const REVEAL_THRESHOLD = 0.45;

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  const lines: string[] = [];
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight));
}

export default function ScratchCard({
  result,
  onRevealed,
  disabled,
}: {
  result: DropResult;
  onRevealed: () => void;
  disabled?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const scratching = useRef(false);
  const revealedRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // 1) Draw the real prize face first — this is what the tourist
      //    actually sees as they scratch the foil layer away, part by
      //    part, rather than a blank/black canvas.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.textAlign = "center";

      if (result.won && result.prize) {
        ctx.fillStyle = "#e60000";
        ctx.font = "800 12px Ubuntu, sans-serif";
        ctx.fillText("YOU WON", rect.width / 2, rect.height / 2 - 38);

        ctx.fillStyle = "#111111";
        ctx.font = "800 20px Ubuntu, sans-serif";
        wrapText(ctx, result.prize.label, rect.width / 2, rect.height / 2 - 6, rect.width - 56, 24);

        ctx.fillStyle = "#666666";
        ctx.font = "600 13px Ubuntu, sans-serif";
        ctx.fillText(`at ${result.prize.sponsor}`, rect.width / 2, rect.height / 2 + 34);
      } else {
        ctx.fillStyle = "#999999";
        ctx.font = "700 16px Ubuntu, sans-serif";
        ctx.fillText("Try again tomorrow", rect.width / 2, rect.height / 2);
      }

      // 2) Draw the scratch-off foil layer on top — scratching erases
      //    this layer's pixels (destination-out below), exposing the
      //    prize face drawn underneath in step 1.
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#e60000");
      gradient.addColorStop(1, "#8a0000");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "700 13px Ubuntu, sans-serif";
      ctx.fillText("SCRATCH HERE", rect.width / 2, rect.height / 2);
      setReady(true);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [result]);

  const scratchAt = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    if (revealedRef.current) return;

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    for (let i = 3; i < data.length; i += 4 * 8) {
      if (data[i] === 0) cleared++;
    }
    const ratio = cleared / (data.length / (4 * 8));

    if (ratio > REVEAL_THRESHOLD) {
      revealedRef.current = true;
      onRevealed();
    }
  };

  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <div ref={wrapRef} className="scratch-card-wrap">
      <canvas
        ref={canvasRef}
        className="scratch-card-canvas"
        style={{ opacity: ready ? 1 : 0, pointerEvents: disabled ? "none" : "auto" }}
        onPointerDown={(e) => {
          scratching.current = true;
          const p = pointFromEvent(e);
          scratchAt(p.x, p.y);
        }}
        onPointerMove={(e) => {
          if (!scratching.current) return;
          const p = pointFromEvent(e);
          scratchAt(p.x, p.y);
        }}
        onPointerUp={() => {
          scratching.current = false;
        }}
        onPointerLeave={() => {
          scratching.current = false;
        }}
      />
    </div>
  );
}
