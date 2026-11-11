# Chaiwala V2 — Application & Build Guide

Three eras, one counter: **Pick → pay with Razorpay → get a signed QR token → collect at the counter.**  
No login, no separate backend server to host: static HTML/CSS/JS paired with Google Apps Script and a Google Sheet.

---

## Module Purpose & Responsibilities

`v2/` is the active production web application of Chaiwala. It separates unminified source files (`app/`), Python static page/SEO generation (`tools/`), optimized static assets (`img/`, `brand/`, `fonts/`, `icons/`, `og/`), and the serverless backend (`apps-script/`), while sharing the curated audio library from [`../client/public/audio/`](../client/public/audio/).

## Pages & Clean URLs

| URL Path | Page | Indexed | Notes |
|---|---|---|---|
| `/v2/` | [`index.html`](index.html) | Yes | Editorial landing page: era fan, scroll-expanding story, three eras, how it works, signatures bento grid, soundtrack preview, FAQ |
| `/v2/order/` | [`order/index.html`](order/index.html) | Yes | Interactive ordering counter: era switcher (`?era=adda\|y2k\|cafe`), deep-link add (`?add=<id>`), coverflow pairs, No. 03 sound system, inline card customization, slide-to-pay sheet, signed QR token pass |
| `/v2/menu/` | [`menu/index.html`](menu/index.html) | Yes | Static full menu with prices across all 3 eras and JSON-LD `Menu` schema |
| `/v2/how-it-works/` | [`how-it-works/index.html`](how-it-works/index.html) | Yes | Token workflow walkthrough, server-pricing explanation, and `FAQPage` JSON-LD |
| `/v2/counter/` | [`counter/index.html`](counter/index.html) | No (`noindex`) | Staff counter console: PIN gate, 3-lane live queue (`PAID`, `BREWING`, `READY`), camera QR scanner + manual token collection |
| `/v2/board/` | [`board/index.html`](board/index.html) | No (`noindex`) | Shop TV display showing *Preparing* and *Ready to collect* token numbers |
| `/404.html` | [`../404.html`](../404.html) | No (`noindex`) | Host-level custom 404 page with runtime base-path detection (`/CHAI-WALA/v2/` or `/v2/`) |

---

## Folder Layout

```text
v2/
├── app/                            # SOURCE: edit these JS/CSS files directly
│   ├── app.js                      # Ordering app, Demo/Live API adapters, QR encoder, Sound System, Counter & Board UI
│   ├── app.css                     # Three-era CSS tokens and responsive layout rules
│   └── landing.js                  # Scroll-driven landing page motion layer + active token pill
├── assets/                         # BUILT: minified JS/CSS output by tools/build.py (no source maps)
│   ├── app.js
│   ├── app.css
│   └── landing.js
├── apps-script/                    # Serverless backend (Code.gs, appsscript.json, README.md)
├── brand/                          # Outlined SVG logo lockups (dark/light, horizontal/stacked, marks, app icon)
├── fonts/                          # Self-hosted Geist, Geist Mono, and Instrument Serif WOFF2 + fonts.css
├── icons/                          # SVG & PNG favicons, Apple touch icon, PWA maskable icons
├── img/                            # Optimized WebP photography (19 item/scene photos + token-qr.svg)
├── og/                             # 1200x630 Open Graph / Twitter share cards (home.jpg, menu.jpg, how-it-works.jpg)
├── tools/                          # Static site & SEO generator
│   ├── build.py                    # Parses MENU from app/app.js, minifies assets/, writes HTML + SEO + 404.html
│   └── pages_landing.py            # Templates for /v2/ landing page and /v2/order/ shell
├── index.html                      # Generated landing page
├── order/index.html                # Generated ordering shell
├── menu/index.html                 # Generated menu page
├── how-it-works/index.html         # Generated how-it-works & FAQ page
├── counter/index.html              # Generated staff counter shell
├── board/index.html                # Generated TV board shell
├── DESIGN.md                       # Color tokens, typography scale, spacing, and logo guidelines
├── README.md                       # This file
├── serve.py                        # Local Python server with HTTP 206 Range support & custom 404
├── site.webmanifest                # Standalone PWA manifest
├── sitemap.xml                     # Generated sitemap
└── llms.txt                        # Generated LLM site & menu summary
```

> **Audio dependency:** [`v2/app/app.js`](app/app.js#L23) resolves audio paths via `../client/public/audio/`, pointing to [`client/public/audio/`](../client/public/audio/) (`90s_playlist.mp3` and `2000s/` + `2000s-manifest.json`). Keep both `v2/` and `client/public/audio/` hosted under the same origin root.

---

## Brand & Design System

Full visual tokens, contrast targets, spacing scales, and logo clear-space rules live in [`DESIGN.md`](DESIGN.md). Eight outlined SVGs are maintained in `brand/`:

- `chaiwala-logo-horizontal-on-dark.svg` / `chaiwala-logo-horizontal-on-light.svg`
- `chaiwala-logo-stacked-on-dark.svg` / `chaiwala-logo-stacked-on-light.svg`
- `chaiwala-mark.svg` / `chaiwala-mark-solid.svg`
- `chaiwala-logo-one-colour.svg` / `chaiwala-app-icon.svg`

### The Three Eras

| Era Key | Label | Aesthetic | Token Prefix | Sound System |
|---|---|---|---|---|
| `adda` | 1900s · The Adda | Espresso (`#0E0A07`) & brass (`#D4A657`), railway-ticket pass | `A-` | `WM-1900` cassette deck (`90s_playlist.mp3`, 15 chapters) |
| `y2k` | 2000s · The Coffee House | Midnight (`#0A0C11`) & aqua/violet chrome, collage hero, holographic pass | `Y-` | `CD-2000` Discman (`12` tracks, years ≤ 2015) |
| `cafe` | 2020s · The Café | Stone & Matcha light (`#F4F1EA` / `#3F5F2E`), hairline cards, white pass | `C-` | Turntable (`23` tracks, years > 2015) |

---

## Local Development & Build Commands

### Run Local Dev Server (Demo Mode)

From the repository root (`CHAI/`):

```powershell
python v2/serve.py
```

- Opens on `http://localhost:8080/v2/` (optional custom port: `python v2/serve.py 3000`).
- Provides HTTP `206 Partial Content` byte-range responses for seeking inside `90s_playlist.mp3` and serves root `404.html` for missing paths.
- With `CONFIG.GAS_URL = ''` in [`app/app.js`](app/app.js#L6), orders, simulated Razorpay checkout, autopilot queue progression, counter PIN (`2580`), and the TV board run locally via `localStorage`.

### Rebuild Pages, SEO Files & Assets

After modifying [`app/app.js`](app/app.js), [`app/app.css`](app/app.css), [`app/landing.js`](app/landing.js), or templates in `tools/`:

```powershell
python v2/tools/build.py
```

- Reads the 19 `M(...)` menu entries directly from `app/app.js` so static `/v2/menu/` HTML, JSON-LD, and `llms.txt` never drift from interactive pricing.
- Uses `v2/node_modules/.bin/esbuild` or `esbuild` on `PATH` when installed to minify into `assets/`; otherwise copies unminified files cleanly with no `.map` source maps.

---

## Configuration (`tools/build.py` & `app/app.js`)

- **`SITE_URL` (`tools/build.py`):** Public canonical URL (defaults to `https://im-chandanmahapatra.github.io/CHAI-WALA/v2/`). Update when pointing canonicals/OG/sitemap to a custom domain and re-run `python v2/tools/build.py`.
- **`BUSINESS` (`tools/build.py`):** Optional street address, city, PIN code, phone, opening hours, and geo coordinates for `CafeOrCoffeeShop` JSON-LD (blank fields are omitted rather than fabricated).
- **`CONFIG.GAS_URL` (`app/app.js`):** Paste your deployed Google Apps Script Web App `/exec` URL to switch from Demo Mode to live Razorpay + Google Sheets, then rebuild with `python v2/tools/build.py`.

---

## Deployment

### Vercel (Repo Root)
Managed via root [`../vercel.json`](../vercel.json) and [`../.vercelignore`](../.vercelignore):
- Set Vercel **Root Directory** to empty (`.`), **Framework Preset** to `Other`.
- `/` redirects to `/v2/`; `trailingSlash: true` keeps relative asset links consistent across `/v2/order/`, `/v2/menu/`, `/v2/how-it-works/`, `/v2/counter/`, and `/v2/board/`.
- `client/public/audio/` is served from the same origin root so `../client/public/audio/` resolves cleanly.

### Live Backend (Google Apps Script + Razorpay)
See [`apps-script/README.md`](apps-script/README.md) for the complete Sheets schema, Script Properties, `setup()` initialization, and HTTP endpoint specification.
