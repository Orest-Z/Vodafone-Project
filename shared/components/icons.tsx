/**
 * A small set of purpose-built icons for the Tourist Pack site.
 *
 * Why these exist instead of just pulling more from lucide-react:
 * generic outline icons (sparkles, a rotated wifi symbol standing in for
 * NFC, a plain ticket) are the fastest way to make a page feel like a
 * templated AI mockup. These are simple, but each one is drawn to match
 * what it's actually representing (real signal bars, a real NFC wave,
 * a Vodafone-style speech mark) rather than being a stand-in.
 */

export function SignalBarsIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="12" width="3.2" height="7" rx="1" fill={color} />
      <rect x="6" y="8.5" width="3.2" height="10.5" rx="1" fill={color} />
      <rect x="11" y="5" width="3.2" height="14" rx="1" fill={color} />
      <rect x="16" y="1.5" width="3.2" height="17.5" rx="1" fill={color} />
    </svg>
  );
}

/* A real NFC "tap" glyph — concentric arcs radiating from a point,
   rather than a rotated wifi icon standing in for it. */
export function NfcWaveIcon({ size = 40, color = "#e60000" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="3.4" fill={color} />
      <path d="M31 17c4 4 4 10 0 14" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M17 17c-4 4-4 10 0 14" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M37 11c7 7 7 19 0 26" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <path d="M11 11c-7 7-7 19 0 26" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

/* Vodafone's iconic speech-mark, used sparingly as a brand accent
   instead of a generic "sparkles" icon on promos. */
export function SpeechMarkIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9" stroke={color} strokeWidth="1.6" fill="none" />
      <path d="M9.4 6.2c-1.9 0.7-3 2.1-3 3.9 0 1.3 0.9 2.2 2 2.2 1.1 0 1.9-0.8 1.9-1.9 0-1-0.7-1.7-1.6-1.7-0.1 0-0.2 0-0.3 0 0.2-0.9 1-1.6 1.9-2l-0.9-0.5z" fill={color} />
      <path d="M14.4 6.2c-1.9 0.7-3 2.1-3 3.9 0 1.3 0.9 2.2 2 2.2 1.1 0 1.9-0.8 1.9-1.9 0-1-0.7-1.7-1.6-1.7-0.1 0-0.2 0-0.3 0 0.2-0.9 1-1.6 1.9-2l-0.9-0.5z" fill={color} />
    </svg>
  );
}

/* Simple, weighty checkmark badge used for "instant activation" style
   trust points — heavier and more confident than a thin outline check. */
export function BadgeCheckIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 1.2l2.1 1.3 2.5-.2 1 2.3 2.2 1.2-.4 2.5 1.1 2.2-1.7 1.9.2 2.5-2.4.8-1.3 2.1-2.4-.6-2.4.6-1.3-2.1-2.4-.8.2-2.5-1.7-1.9 1.1-2.2-.4-2.5 2.2-1.2 1-2.3 2.5.2z"
        fill={color}
      />
      <path d="M6.7 10.1l2.1 2.1 4.4-4.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
