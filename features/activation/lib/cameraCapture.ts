// features/activation/lib/cameraCapture.ts
//
// Thin wrapper around getUserMedia for the live passport/ID capture view.
// getUserMedia only works in a "secure context" — HTTPS, or exactly
// "localhost" — never plain http://<lan-ip>. isCameraCaptureSupported()
// lets callers detect that up front and fall back to the file-picker flow
// instead of failing confusingly mid-attempt.

export function isCameraCaptureSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    window.isSecureContext &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia
  );
}

export interface CameraStream {
  stream: MediaStream;
  stop: () => void;
}

export async function startRearCamera(): Promise<CameraStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
    audio: false,
  });
  return {
    stream,
    stop: () => stream.getTracks().forEach((t) => t.stop()),
  };
}
