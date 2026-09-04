"use client";

import { useRef, useState } from "react";
import { ScanLine, Lock, Loader2 } from "lucide-react";
import { scanPassport, type PassportScanResult } from "@/features/activation/lib/passportScan";
import { isCameraCaptureSupported } from "@/features/activation/lib/cameraCapture";
import PassportCaptureGuide from "./PassportCaptureGuide";
import PassportLiveCapture from "./PassportLiveCapture";

interface PassportScanButtonProps {
  onScanned: (fields: PassportScanResult) => void;
}

type Mode = "idle" | "live" | "guide" | "scanning";

// Renders the "Scan Passport" affordance next to the Passport/ID field.
//
// Two capture paths:
//  - Live camera (preferred): a real-time preview with an on-screen guide
//    showing exactly where to line up the MRZ, so the crop OCR reads is
//    precisely what the tourist saw — no guessing. Requires a secure
//    context (HTTPS or localhost); getUserMedia is unavailable over plain
//    http://<lan-ip>, which is common when testing from a phone on the
//    same Wi-Fi as a dev machine.
//  - File picker fallback: capture="environment" opens the native camera
//    app directly. No live preview, but works everywhere plain HTTP does.
//    Shown automatically if the live camera path isn't available.
//
// Either way, no image ever leaves the browser — see
// features/activation/lib/passportScan.ts for the actual processing and
// the privacy rationale.
export default function PassportScanButton({ onScanned }: PassportScanButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setError(null);
    setMode(isCameraCaptureSupported() ? "live" : "guide");
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset the input so picking the same file again still fires onChange.
    e.target.value = "";
    if (!file) return;

    setMode("scanning");
    setError(null);

    const outcome = await scanPassport(file);

    setMode("idle");
    if (outcome.ok) {
      onScanned(outcome.data);
    } else {
      setError(outcome.error);
    }
  };

  return (
    <div className="passport-scan">
      <button
        type="button"
        className="passport-scan-button"
        onClick={handleStart}
        disabled={mode === "scanning"}
      >
        {mode === "scanning" ? <Loader2 size={16} className="passport-scan-spinner" /> : <ScanLine size={16} />}
        {mode === "scanning" ? "Scanning…" : "Scan Passport / ID"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        style={{ display: "none" }}
      />

      <p className="passport-scan-note">
        <Lock size={12} />
        Processed on your device — your photo is never uploaded or stored.
      </p>

      {error && <p className="passport-scan-error">{error}</p>}

      {mode === "live" && (
        <PassportLiveCapture
          onScanned={(fields) => {
            setMode("idle");
            onScanned(fields);
          }}
          onError={(message) => {
            setMode("idle");
            setError(message);
          }}
          onUnavailable={() => setMode("guide")}
          onCancel={() => setMode("idle")}
        />
      )}

      {mode === "guide" && (
        <PassportCaptureGuide
          onConfirm={() => {
            setMode("idle");
            inputRef.current?.click();
          }}
          onCancel={() => setMode("idle")}
        />
      )}
    </div>
  );
}
