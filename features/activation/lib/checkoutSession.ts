// features/activation/lib/checkoutSession.ts
//
// Hand-off for the tourist's form data (name, email, passport number, etc.)
// from /activate to /payment during the redirect between them.
//
// Why sessionStorage and NOT URL search params or localStorage:
// - The payment route already receives everything it needs to re-derive
//   the *price* itself (via `packId`, same as the old flow re-fetched the
//   pack) — the server is the source of truth for amount, so nothing
//   financial needs to travel through the URL at all.
// - `formData` contains a passport/ID number and email. Putting PII in a
//   query string means it ends up in browser history, in server access
//   logs, in any analytics/proxy that logs full URLs, and in the
//   Referer header of any request the payment page happens to make.
//   That's a real data-exposure risk for something as sensitive as a
//   passport number, so it must not go in `?...`.
// - localStorage is shared indefinitely across every tab of the origin
//   and never expires on its own — a bad fit for a value that's only
//   ever needed once, for a few minutes, by one specific checkout.
// - sessionStorage is scoped to this tab and clears itself when the tab
//   closes, which matches how long this data actually needs to live.
//
// Caveat: sessionStorage survives client-side navigation (router.push)
// and full page reloads within the same tab, but it's still gone if the
// user bookmarks /payment directly, opens it in a new tab, or the tab
// was closed and reopened. Callers must treat a missing entry as an
// expected "session expired" case, not a bug.

import type { TouristDetails } from "../types/tourist";

const KEY_PREFIX = "checkout:";

export function createOrderId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID (older browsers).
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function saveCheckoutFormData(orderId: string, formData: TouristDetails): void {
  try {
    sessionStorage.setItem(KEY_PREFIX + orderId, JSON.stringify(formData));
  } catch (err) {
    // Storage can throw in private-browsing modes with strict quotas, or
    // if disabled entirely. Not fatal here — the payment page will just
    // treat the data as missing and show its "session expired" state.
    console.error("Could not persist checkout form data:", err);
  }
}

export function readCheckoutFormData(orderId: string | null): TouristDetails | null {
  if (!orderId) return null;
  try {
    const raw = sessionStorage.getItem(KEY_PREFIX + orderId);
    if (!raw) return null;
    return JSON.parse(raw) as TouristDetails;
  } catch (err) {
    console.error("Could not read checkout form data:", err);
    return null;
  }
}

export function clearCheckoutFormData(orderId: string | null): void {
  if (!orderId) return;
  try {
    sessionStorage.removeItem(KEY_PREFIX + orderId);
  } catch {
    // Best-effort cleanup only.
  }
}