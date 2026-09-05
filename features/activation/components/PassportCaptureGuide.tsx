"use client";

import { X } from "lucide-react";

interface PassportCaptureGuideProps {
  onConfirm: () => void;
  onCancel: () => void;
}

// Shown once, right before the camera opens, so the tourist knows exactly
// what to frame — the #1 cause of a failed scan is a photo that doesn't
// clearly show the bottom text strip (the Machine Readable Zone) the OCR
// actually reads. A plain <input capture> can't overlay live guidance on
// the camera viewfinder itself, so this is the next best thing: a quick
// static picture of what a good shot looks like, shown right before.
export default function PassportCaptureGuide({ onConfirm, onCancel }: PassportCaptureGuideProps) {
  return (
    <div className="passport-guide-overlay" onClick={onCancel}>
      <div className="passport-guide-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="passport-guide-close" aria-label="Cancel" onClick={onCancel}>
          <X size={16} />
        </button>

        <h3 className="passport-guide-title">Line up your passport or ID</h3>

        <svg viewBox="0 0 220 140" className="passport-guide-diagram" aria-hidden="true">
          <rect x="4" y="4" width="212" height="132" rx="10" className="passport-guide-doc" />
          <rect x="18" y="18" width="46" height="58" rx="4" className="passport-guide-photo" />
          <rect x="76" y="24" width="110" height="7" rx="3" className="passport-guide-line" />
          <rect x="76" y="40" width="90" height="7" rx="3" className="passport-guide-line" />
          <rect x="76" y="56" width="100" height="7" rx="3" className="passport-guide-line" />
          <rect x="18" y="88" width="184" height="34" rx="4" className="passport-guide-mrz-band" />
          <rect x="26" y="97" width="168" height="5" rx="2.5" className="passport-guide-mrz-line" />
          <rect x="26" y="109" width="168" height="5" rx="2.5" className="passport-guide-mrz-line" />
        </svg>

        <p className="passport-guide-text">
          Make sure the block of text at the <strong>bottom of the photo page</strong> (passport) or the{" "}
          <strong>back of the card</strong> (ID) is flat, well-lit, and fills the frame. That strip is what
          gets read.
        </p>

        <div className="passport-guide-actions">
          <button type="button" className="passport-scan-button" onClick={onConfirm}>
            Open Camera
          </button>
          <button type="button" className="passport-guide-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
