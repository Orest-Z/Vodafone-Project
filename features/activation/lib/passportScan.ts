// features/activation/lib/passportScan.ts
//
// Privacy-first passport/ID autofill. Everything below runs entirely in the
// browser — the photo the tourist picks NEVER leaves the device: no fetch,
// no XHR, no upload, no server (ours or a third party's) ever sees it.
//
// Why the MRZ, not the whole document: every passport and ID card carries a
// standardized "Machine Readable Zone" (the 2-3 lines of monospace OCR-B
// text at the bottom) — the exact same thing airport e-gates read. It OCRs
// far more reliably than the printed fields, and it's self-validating via
// check digits (see the `mrz` package), so a bad/blurry scan can be
// detected and rejected instead of silently corrupting a legally
// significant field like the passport number.
//
// Data minimization: the MRZ also encodes date of birth, sex, nationality
// and expiry date, but this form only ever asks for first name, last name
// and document number — so that's all we read out of the parsed result.
// Everything else (the image, the full OCR text, the full parsed MRZ
// object) is discarded the moment this function returns; nothing is
// written to localStorage/sessionStorage/IndexedDB/a server.

import { createWorker, PSM } from "tesseract.js";
import { parse as parseMrz } from "mrz";

export interface PassportScanResult {
  firstName: string;
  lastName: string;
  passportNumber: string;
}

export type PassportScanOutcome =
  | { ok: true; data: PassportScanResult }
  | { ok: false; error: string };

type OcrSource = HTMLCanvasElement | HTMLImageElement;

const MRZ_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<";
// A real MRZ line is 30 (TD1), 36 (TD2) or 44 (TD3) chars — allow slack on
// both ends for OCR noise (a single dropped/extra character shouldn't
// disqualify an otherwise-good line), but stay tight enough to reject
// stray printed text from elsewhere on the document.
const MRZ_LINE_PATTERN = /^[A-Z0-9<]{25,46}$/;
// Tesseract's default page-segmentation mode tries to detect columns/blocks,
// which is the wrong model for a tight, uniform strip of monospace text —
// SINGLE_BLOCK ("assume a single uniform block of text") is the standard
// setting for MRZ OCR.
const MRZ_PAGE_SEGMENTATION_MODE = PSM.SINGLE_BLOCK;

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function extractMrzLines(rawText: string): string[] {
  const candidates = rawText
    .split("\n")
    .map((l) => l.trim().toUpperCase().replace(/\s+/g, ""))
    .filter((l) => MRZ_LINE_PATTERN.test(l));

  // TD1 (ID cards) has 3 MRZ lines, TD3 (passports) has 2 — take the last
  // occurrences in that preference order rather than assuming one format.
  if (candidates.length >= 3) return candidates.slice(-3);
  if (candidates.length >= 2) return candidates.slice(-2);
  return candidates;
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Crops the bottom ~30% of the document (where the MRZ sits on every
// passport/ID layout) onto a fresh canvas, upscaling small images for a
// better OCR read.
function cropToMrzBand(img: HTMLImageElement): HTMLCanvasElement {
  const targetWidth = Math.max(img.naturalWidth, 1200);
  const scale = targetWidth / img.naturalWidth;
  const bandHeight = img.naturalHeight * 0.3;

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = bandHeight * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(
    img,
    0,
    img.naturalHeight - bandHeight,
    img.naturalWidth,
    bandHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas;
}

function releaseSource(source: OcrSource | null) {
  if (source instanceof HTMLCanvasElement) {
    source.width = 0;
    source.height = 0;
  }
}

// Shared OCR + MRZ-parsing core. `primary` should already be framed as
// tightly as possible to the MRZ (either our best-guess crop of a still
// photo, or the exact region the tourist aligned live on camera).
// `fallback` — typically the full, uncropped frame — gets a second OCR pass
// with a different page-segmentation mode if the primary attempt finds no
// MRZ-shaped lines, so a slightly-off framing doesn't fail outright.
async function runMrzOcr(primary: OcrSource, fallback: OcrSource | null): Promise<PassportScanOutcome> {
  const worker = await createWorker("eng");
  let lines: string[];
  try {
    await worker.setParameters({
      tessedit_char_whitelist: MRZ_CHARSET,
      tessedit_pageseg_mode: MRZ_PAGE_SEGMENTATION_MODE,
    });
    const primaryText = (await worker.recognize(primary)).data.text;
    lines = extractMrzLines(primaryText);

    if (lines.length < 2 && fallback) {
      // SPARSE_TEXT is built for finding scattered text blocks, unlike
      // SINGLE_BLOCK which assumes one uniform region — the right mode for
      // a full document photo (has a face photo, printed fields, etc.
      // alongside the MRZ) rather than a tight crop.
      console.debug("[passportScan] primary OCR found no MRZ lines, retrying on the fallback frame. Raw text:", primaryText);
      await worker.setParameters({ tessedit_pageseg_mode: PSM.SPARSE_TEXT });
      const fallbackText = (await worker.recognize(fallback)).data.text;
      lines = extractMrzLines(fallbackText);
      if (lines.length < 2) {
        console.debug("[passportScan] fallback OCR also found no MRZ lines. Raw text:", fallbackText);
      }
    }
  } finally {
    await worker.terminate();
  }

  if (lines.length < 2) {
    return { ok: false, error: "Couldn't find a readable passport/ID strip. Try a clearer, well-lit photo of the bottom of the document." };
  }

  // autocorrect fixes common OCR ambiguities (O/0, I/1, S/5, etc.) in
  // fields that are known to be purely numeric or alphabetic — meaningful
  // tolerance for real camera photos rather than a lab-clean scan.
  const parsed = parseMrz(lines, { autocorrect: true });
  const firstName = parsed.fields.firstName;
  const lastName = parsed.fields.lastName;
  const passportNumber = parsed.documentNumber;

  if (!firstName || !lastName || !passportNumber) {
    console.debug("[passportScan] MRZ lines found but didn't validate:", lines, parsed);
    return { ok: false, error: "Scan didn't validate. Please retake the photo or enter your details manually." };
  }

  return {
    ok: true,
    data: {
      firstName: toTitleCase(firstName.replace(/</g, " ")),
      lastName: toTitleCase(lastName.replace(/</g, " ")),
      passportNumber: passportNumber.replace(/</g, ""),
    },
  };
}

// Entry point for the file-picker flow (capture="environment" or a chosen
// photo): loads the file, guesses the MRZ band via a bottom-30% crop, OCRs
// it with the full original image as a fallback source.
export async function scanPassport(file: File): Promise<PassportScanOutcome> {
  let img: HTMLImageElement | null = null;
  let canvas: HTMLCanvasElement | null = null;

  try {
    img = await loadImage(file);
    canvas = cropToMrzBand(img);
    return await runMrzOcr(canvas, img);
  } catch (err) {
    console.debug("[passportScan] unexpected error:", err);
    return { ok: false, error: "Something went wrong reading that photo. Please try again or enter your details manually." };
  } finally {
    // Belt-and-braces cleanup: drop every reference to the image data so
    // nothing outlives this function call.
    releaseSource(canvas);
    img = null;
    canvas = null;
  }
}

// Entry point for the live-camera flow (see PassportLiveCapture.tsx): the
// caller already knows exactly which region the tourist aligned with the
// on-screen guide, so no crop-percentage guessing is needed — `primary` is
// that exact region, `fallback` is the full captured frame as a safety net.
export async function scanPassportFromCapture(
  primary: HTMLCanvasElement,
  fallback: HTMLCanvasElement
): Promise<PassportScanOutcome> {
  try {
    return await runMrzOcr(primary, fallback);
  } catch (err) {
    console.debug("[passportScan] unexpected error:", err);
    return { ok: false, error: "Something went wrong reading that photo. Please try again or enter your details manually." };
  } finally {
    releaseSource(primary);
    releaseSource(fallback);
  }
}
