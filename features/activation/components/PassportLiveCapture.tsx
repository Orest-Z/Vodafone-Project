"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { isCameraCaptureSupported, startRearCamera, type CameraStream } from "@/features/activation/lib/cameraCapture";
import { scanPassportFromCapture, type PassportScanResult } from "@/features/activation/lib/passportScan";

interface DisplayRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface PassportLiveCaptureProps {
  onScanned: (fields: PassportScanResult) => void;
  onError: (message: string) => void;
  onUnavailable: () => void;
  onCancel: () => void;
}

// Where the guide band sits within the *visible camera image* (not the
// whole screen) — bottom 30% height with a bit of horizontal margin, same
// proportions passportScan.ts uses for a still photo's crop guess. Here
// it's not a guess: the tourist visually aligns the MRZ into this exact
// band before capturing, so what gets OCR'd is precisely what they saw.
const BAND_HEIGHT_RATIO = 0.3;
const BAND_MARGIN_RATIO = 0.06;

export default function PassportLiveCapture({ onScanned, onError, onUnavailable, onCancel }: PassportLiveCaptureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<CameraStream | null>(null);

  const [displayRect, setDisplayRect] = useState<DisplayRect | null>(null);
  const [starting, setStarting] = useState(true);
  const [capturing, setCapturing] = useState(false);

  // The video is shown with object-fit: contain, so it's letterboxed inside
  // the container unless its aspect ratio happens to match exactly — this
  // computes the actual on-screen rectangle the camera feed occupies, which
  // both the visual guide overlay and the capture math below are anchored to.
  const recomputeDisplayRect = useCallback(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container || !video.videoWidth || !video.videoHeight) return;

    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const scale = Math.min(containerW / video.videoWidth, containerH / video.videoHeight);
    const width = video.videoWidth * scale;
    const height = video.videoHeight * scale;

    setDisplayRect({
      left: (containerW - width) / 2,
      top: (containerH - height) / 2,
      width,
      height,
    });
  }, []);

  useEffect(() => {
    if (!isCameraCaptureSupported()) {
      onUnavailable();
      return;
    }

    let cancelled = false;
    startRearCamera()
      .then((cam) => {
        if (cancelled) {
          cam.stop();
          return;
        }
        streamRef.current = cam;
        if (videoRef.current) videoRef.current.srcObject = cam.stream;
      })
      .catch(() => {
        if (!cancelled) onUnavailable();
      });

    window.addEventListener("resize", recomputeDisplayRect);
    return () => {
      cancelled = true;
      streamRef.current?.stop();
      streamRef.current = null;
      window.removeEventListener("resize", recomputeDisplayRect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadedMetadata = () => {
    setStarting(false);
    recomputeDisplayRect();
  };

  const handleCapture = async () => {
    const video = videoRef.current;
    if (!video || !displayRect || !video.videoWidth || capturing) return;

    setCapturing(true);
    streamRef.current?.stop();

    try {
      // Map the on-screen guide band back to native video pixel coordinates.
      const scale = video.videoWidth / displayRect.width;
      const bandHeightCss = displayRect.height * BAND_HEIGHT_RATIO;
      const marginCss = displayRect.width * BAND_MARGIN_RATIO;

      const sx = marginCss * scale;
      const sy = (displayRect.height - bandHeightCss) * scale;
      const sw = (displayRect.width - marginCss * 2) * scale;
      const sh = bandHeightCss * scale;

      const targetWidth = Math.max(sw, 1200);
      const upscale = targetWidth / sw;

      const primary = document.createElement("canvas");
      primary.width = targetWidth;
      primary.height = sh * upscale;
      const pctx = primary.getContext("2d");
      if (!pctx) throw new Error("Canvas not supported");
      pctx.drawImage(video, sx, sy, sw, sh, 0, 0, primary.width, primary.height);

      const fallback = document.createElement("canvas");
      fallback.width = video.videoWidth;
      fallback.height = video.videoHeight;
      const fctx = fallback.getContext("2d");
      if (!fctx) throw new Error("Canvas not supported");
      fctx.drawImage(video, 0, 0);

      const outcome = await scanPassportFromCapture(primary, fallback);
      if (outcome.ok) {
        onScanned(outcome.data);
      } else {
        onError(outcome.error);
      }
    } catch {
      onError("Something went wrong reading that photo. Please try again or enter your details manually.");
    }
  };

  const bandStyle = displayRect
    ? {
        left: displayRect.left + displayRect.width * BAND_MARGIN_RATIO,
        top: displayRect.top + displayRect.height * (1 - BAND_HEIGHT_RATIO),
        width: displayRect.width * (1 - BAND_MARGIN_RATIO * 2),
        height: displayRect.height * BAND_HEIGHT_RATIO,
      }
    : null;

  return (
    <div className="passport-live-overlay" ref={containerRef}>
      <video
        ref={videoRef}
        className="passport-live-video"
        autoPlay
        playsInline
        muted
        onLoadedMetadata={handleLoadedMetadata}
      />

      {starting && (
        <div className="passport-live-starting">
          <div className="page-loader-ring" />
          <span>Starting camera…</span>
        </div>
      )}

      {bandStyle && !capturing && (
        <>
          <div className="passport-live-guide-band" style={bandStyle} />
          <p className="passport-live-hint" style={{ top: bandStyle.top - 34 }}>
            Line up the bottom text strip in this box
          </p>
        </>
      )}

      {capturing && (
        <div className="passport-live-starting">
          <div className="page-loader-ring" />
          <span>Scanning…</span>
        </div>
      )}

      <button type="button" className="passport-live-close" aria-label="Cancel" onClick={onCancel}>
        <X size={18} />
      </button>

      {!starting && !capturing && (
        <div className="passport-live-bottombar">
          <button type="button" className="passport-scan-button" onClick={handleCapture}>
            Capture Photo
          </button>
        </div>
      )}
    </div>
  );
}
