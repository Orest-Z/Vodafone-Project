"use client";

import { useEffect, useRef, useState } from "react";

const REVEAL_THRESHOLD = 0.55;

export default function ScratchCard({
  onRevealed,
  disabled,
}: {
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

      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#e60000");
      gradient.addColorStop(1, "#8a0000");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "700 13px Ubuntu, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SCRATCH HERE", rect.width / 2, rect.height / 2);
      setReady(true);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

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