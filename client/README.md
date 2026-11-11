# Chaiwala V1 Client (`client/`) & Shared Audio Library

> [!NOTE]
> The active Chaiwala V2 storefront lives in [`../v2/`](../v2/). This directory houses the **V1 React + Vite + Supabase prototype** and the **shared audio library** (`client/public/audio/`) consumed by both V1 and V2.

---

## Responsibilities

1. **Shared Audio Library (`public/audio/`):**
   - `public/audio/90s_playlist.mp3` (~75 MB continuous recording for the 1900s Adda cassette deck)
   - `public/audio/2000s/` (35 local `.mp3` tracks)
   - `public/audio/2000s-manifest.json` (metadata, duration, year, and `auraColor` for the 2000s Discman and 2020s turntable in V2, and V1 Café Radio)
   - Referenced directly by V2 via `../client/public/audio/` in [`../v2/app/app.js`](../v2/app/app.js#L23).
2. **V1 React Application (`src/`):**
   - Dual-era React 19 + TypeScript + Vite SPA bridging *1900s Adda* and *2020s Café* with 15-minute capacity-controlled pickup slots (`supabase/`) and `localStorage` fallback.

---

## Tech Stack & Dependencies (`package.json`)

- **Runtime:** `react` (`^19.0.0`), `react-dom` (`^19.0.0`), `@supabase/supabase-js` (`^2.48.1`), `lucide-react` (`^0.475.0`)
- **Build & Tooling:** `vite` (`^6.1.0`), `@vitejs/plugin-react` (`^4.3.4`), `typescript` (`^5.7.3`)

---

## Key Files

```text
client/
├── public/
│   ├── audio/
│   │   ├── 2000s/                  # 35 MP3 tracks shared with V2
│   │   ├── 2000s-manifest.json     # Track metadata manifest shared with V2
│   │   └── 90s_playlist.mp3        # 90-minute cassette audio shared with V2
│   └── images/                     # V1 menu & campaign images
├── src/
│   ├── components/
│   │   ├── audio/                  # EraRadio, AudioSeekBar, DynamicIslandPlayer, TheatreModeOverlay, WalkmanDeck
│   │   ├── hero/                   # CinematicHero, EraSwitcher
│   │   ├── layout/                 # SiteHeader, SiteFooter
│   │   ├── menu/                   # EraMenuSection, ProductCard, FeaturedPairing
│   │   ├── order/                  # OrderRitual (cart drawer, slot selector, confirmation ticket)
│   │   └── story/                  # BrandStory
│   ├── context/CartContext.tsx     # Global cart state and paise calculations
│   ├── lib/                        # ordering.ts, supabase.ts, seed-data.ts, radio-audio.ts, cafe-library-manifest.ts
│   └── pages/OrderPage.tsx
├── .env.example                    # Optional VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
├── .qa-order-tests.mjs             # Order invariant QA script
├── verify-ui.mjs                   # UI verification script
├── test-e2e.ts                     # E2E order test script
└── vite.config.ts
```

---

## Local Setup & Scripts (`client/package.json`)

```powershell
cd client
npm install
npm run dev       # Vite dev server (http://localhost:5173/)
npm run build     # Type-check and build production bundle into client/dist/
npm run preview   # Preview built bundle locally
```

### Environment Variables (Optional)

Copy `.env.example` to `.env.local` to connect a live Supabase instance from [`../supabase/`](../supabase/):

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

When omitted, `src/lib/supabase.ts` runs in local `localStorage` mock mode. Never place service-role or payment secrets in `VITE_*` variables.
