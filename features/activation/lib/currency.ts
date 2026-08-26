// lib/currency.ts
//
// Pack prices (priceAll) are stored in Albanian Lek in the backend.
// All customer-facing charges must be in EUR, so every price shown or
// sent to PayPal needs to go through this converter — never use
// `pack.priceAll` directly as a EUR amount.
//
// The real market rate fluctuates around 95-100 ALL per 1 EUR. We use a
// fixed, round rate here on purpose: it's close enough to market, and it
// turns prices like 2700/2900/3300 ALL into clean marketing price points
// (27 / 29 / 33 EUR) instead of odd numbers like "28.94 EUR". Adjust
// ALL_TO_EUR_RATE if Finance wants a different reference rate.
export const ALL_TO_EUR_RATE = 100;

/**
 * Convert a Lek amount into whole EUR, rounded to the nearest Euro
 * (matches the "27 / 29 / 33 EUR" style clean pricing).
 */
export function allToEur(priceAll: number | null | undefined): number {
  const n = Number(priceAll);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n / ALL_TO_EUR_RATE);
}

/** Formatted "33 EUR" string for display. */
export function formatEur(priceAll: number | null | undefined): string {
  return `${allToEur(priceAll)} EUR`;
}

/** Formatted "3,300 Lek" string for display. */
export function formatAll(priceAll: number | null | undefined): string {
  const n = Number(priceAll);
  if (!Number.isFinite(n)) return "0 Lek";
  return `${n.toLocaleString("en-US")} Lek`;
}
