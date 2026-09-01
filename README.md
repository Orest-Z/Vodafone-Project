# Vodafone Tourist Pack — Frontend

![Preview](public/assets/banner.png)

Next.js app for the tourist eSIM/data pack flow: browse packs, activate one, pay through PayPal, and land in a Game Hub where the tourist can claim a daily credit and scratch a card for a prize.

Talks to a separate Spring Boot backend over REST. This repo doesn't run without it.

## Stack

- Next.js 14, App Router    
- TypeScript
- Plain CSS (`app/styles.css`), theming via CSS custom properties and `[data-theme='dark']` — no Tailwind, no CSS modules
- Framer Motion for the scratch card / reveal animations
- Lucide for icons
- PayPal JS SDK, proxied through a couple of Next API routes so the client secret never reaches the browser

## Structure

```
app/                    routes (activate, payment, game-hub) + PayPal API routes
features/
  activation/           pack selection, checkout stepper, PayPal, tourist details form
  game-hub/              daily drop, scratch card, reward reveal, prize catalog
  marketing/             landing page offer sections
  stores/                store locator map pins + data
shared/                 header, footer, theme toggle, shared utils
```

Each feature owns its own `lib/api.ts` and talks to the backend directly — there's no shared API client.

## Running locally

```
npm install
npm run dev
```

Needs the backend running on `localhost:8080` (or wherever `NEXT_PUBLIC_API_BASE_URL` points).

## Environment variables

| Variable | Used by | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | every feature's `lib/api.ts`, PayPal API routes | Defaults to `http://localhost:8080/api/v1` if unset |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | `features/activation/lib/paypal.ts` | Public, safe to expose |
| `PAYPAL_CLIENT_SECRET` | PayPal API routes (server-side only) | Do not prefix with `NEXT_PUBLIC_` |
| `PAYPAL_MODE` | PayPal API routes | `sandbox` or `live`, defaults to `sandbox` |

## Flow, roughly

1. `/` → pack selection → `/activate`
2. `/activate` collects tourist details, redirects to `/payment` with the order/pack IDs
3. `/payment` handles the PayPal capture, calls the backend to activate the pack, then redirects to `/game-hub?touristId=...`
4. `/game-hub` reads `touristId` from the query string and mounts `GameProvider`, which drives credit balance, daily claim, and the scratch card end to end

The `touristId` is passed around as a plain query param, not stored in a cookie or session — worth keeping in mind if you're testing and the URL gets dropped.

## Known rough edges

- No loading skeletons on the activation form — a slow backend just shows a blank state.
- Game Hub state isn't polled or revalidated on window focus, so if a tourist claims their credit on another tab/device it won't show up here until the next manual action triggers a refetch.