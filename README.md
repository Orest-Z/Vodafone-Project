# Vodafone Tourist Pack — Frontend

![Landing hero](public/assets/header.webp)

Next.js app for the tourist eSIM/data pack flow: find or build a pack, activate it (optionally
auto-filling your passport/ID via an on-device camera scan), pay through PayPal, add a Vodafone
Tourist Pass to Apple/Google Wallet, and land in a Game Hub where a daily scratch card can win a
real discount on your next pack.

Talks to a separate Spring Boot backend over REST. This repo doesn't run without it.

---

## See it in action

<table>
<tr>
<td width="50%" valign="top">

### 1 · Land, and know what to do next

A four-step "How to Activate" strip sits right under the hero, so a tourist who's never heard of
Vodafone knows exactly what happens before they tap anything.

</td>
<td width="50%">

![How to Activate](public/assets/howToActivate.webp)

</td>
</tr>
<tr>
<td width="50%">

![Pack Finder quiz](public/assets/packFinder.webp)

</td>
<td width="50%" valign="top">

### 2 · Not sure what to buy? Answer three questions

The Pack Finder (`features/marketing`) turns "beach, mountains, or city?" into a recommended pack —
no data-plan literacy required.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 3 · ...or just browse the fixed packs

Three packs, straight from `GET /api/v1/packs`. Each `Buy & Activate` button drops straight into
`/activate` with that pack pre-selected.

</td>
<td width="50%">

![All available tourist packs](public/assets/packs.webp)

</td>
</tr>
<tr>
<td width="50%">

![Create your own plan](public/assets/createPlan.webp)

</td>
<td width="50%" valign="top">

### 4 · ...or build your own

Data, minutes, and validity sliders — every drag re-prices live against the backend's
`custom/quote` endpoint. Nothing is saved until "Build & Continue" turns it into a real pack via
`custom/build`.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 5 · One form, no app install

Personal info on the left (with an optional on-device passport/ID scan — the photo never leaves
the browser, see below), a live order summary on the right. Everything here is held in
`sessionStorage` until PayPal capture succeeds.

</td>
<td width="50%">

![Activate a pack](public/assets/activation.webp)

</td>
</tr>
<tr>
<td width="50%">

![Scratch card reward](public/assets/scratchCard.webp)

</td>
<td width="50%" valign="top">

### 6 · Pay, then scratch for a prize

The moment PayPal capture and backend activation succeed, the tourist lands in the Game Hub. One
scratch card per day, Europe/Tirane, enforced server-side — refreshing the tab doesn't get you a
second try.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 7 · A pass that lives in your Wallet, not another app

`/my-pack?touristId=...` — reachable from the confirmation email and from the Daily Drop screen —
adds a QR-coded Vodafone Tourist Pass to Apple/Google Wallet. Scan it at any of 7 partner
businesses in Albania for an instant discount, no sign-up, no extra app.

</td>
<td width="50%">

![Digital Tourist Pass in Apple/Google Wallet](public/assets/touristPass.webp)

</td>
</tr>
</table>

---

## Stack

- Next.js 15, App Router, Turbopack
- TypeScript
- Plain CSS (`app/styles.css`), theming via CSS custom properties and `[data-theme='dark']` — no Tailwind, no CSS modules
- Framer Motion for the scratch card / reveal animations
- Lucide for icons
- `tesseract.js` + `mrz` for 100% client-side passport/ID OCR (see below)
- PayPal JS SDK, proxied through a few Next API routes so the client secret never reaches the browser

## Structure

```
app/                       routes: /, /activate, /payment, /game-hub, /my-pack,
                            /terms, /privacy, /wallet/{apple,google}/[id],
                            plus the PayPal API routes
features/
  activation/               pack selection, custom plan builder, checkout stepper,
                             passport/ID scanner, PayPal, tourist details form
  game-hub/                 daily drop, scratch card, reward reveal, prize catalog
  my-pack/                  subscription-status lookup + wallet button
  marketing/                landing page offer sections
  stores/                   store locator map pins + data
shared/                     header, footer, theme toggle, shared icons/utils
```

Each feature owns its own `lib/api.ts` and talks to the backend directly — there's no shared API client.

## Running locally

```
npm install
npm run dev
```

Needs the backend running on `localhost:8080` (or wherever `NEXT_PUBLIC_API_BASE_URL` points).

### Testing on a phone (same Wi-Fi as your dev machine)

Next.js's dev server blocks `/_next/*` asset requests from origins not listed in
`allowedDevOrigins` (`next.config.ts`) — add your machine's current LAN IP there if it's changed.
You'll also need `NEXT_PUBLIC_API_BASE_URL` pointed at that same LAN IP (not `localhost`) and the
backend's `APP_CORS_ALLOWED_ORIGIN` to include it too. The live passport-camera view additionally
needs a secure context (HTTPS, or exactly `localhost`) — it isn't available over plain
`http://<lan-ip>`, and falls back automatically to the file-picker capture flow when it isn't.

## Environment variables

| Variable | Used by | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | every feature's `lib/api.ts`, PayPal API routes | Defaults to `http://localhost:8080/api/v1` if unset |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | `features/activation/lib/paypal.ts` | Public, safe to expose |
| `PAYPAL_CLIENT_SECRET` | PayPal API routes (server-side only) | Do not prefix with `NEXT_PUBLIC_` |
| `PAYPAL_MODE` | PayPal API routes | `sandbox` or `live`, defaults to `sandbox` |

## Flow, roughly

1. `/` → pick a fixed pack, or build a custom one (live-priced data/minutes/duration sliders) → `/activate`
2. `/activate` collects tourist details — optionally auto-filled by scanning a passport/ID
   entirely on-device — and redirects to `/payment` with the order/pack IDs
3. `/payment` handles the PayPal capture, calls the backend to activate the pack, then redirects
   to `/game-hub?touristId=...`
4. `/game-hub` reads `touristId` from the query string and mounts `GameProvider`, which drives
   credit balance, daily claim, and the scratch card end to end
5. `/my-pack?touristId=...` — pack details, key dates, and the "Add to Apple Wallet" button; also
   linked from the confirmation email and the Daily Drop reward screen

The `touristId` is passed around as a plain query param, not stored in a cookie or session — it's
an unguessable UUID, not a sequential ID, but a leaked link grants full access with no
re-authentication. Reasonable for a low-stakes, no-login tourist flow; worth hardening (short-lived
signed tokens, email re-verification) before this ever handles anything higher-stakes.

## Passport/ID scanning — privacy design

The optional "Scan Passport / ID" button never uploads the photo anywhere:

- OCR (`tesseract.js`) and MRZ parsing (`mrz`) run entirely in the browser.
- Only the passport's Machine Readable Zone is read — the same standardized strip every airport
  e-gate reads — not the printed page or photo.
- Only three fields are ever extracted: first name, last name, document number. Everything else
  the MRZ encodes (DOB, sex, nationality, expiry) is read but discarded immediately.
- The photo, the canvas, and the full OCR text are all dropped the instant scanning finishes —
  nothing is written to any storage, client or server.
- A live camera view with an on-screen alignment guide is used when available (secure context
  required); otherwise it falls back to a native file/camera picker with a static framing guide.

## Known rough edges

- `next.config.ts`'s `allowedDevOrigins` needs manual updating if your LAN IP changes.
- PassKit's free/draft tier caps total passes issued and expires each one after 48 hours — fine
  for a demo, not for anything beyond it.
- Game Hub state isn't polled or revalidated on window focus, so if a tourist claims their credit
  on another tab/device it won't show up here until the next manual action triggers a refetch.
