# Chaiwala v2 — order, pay, pick up

Three eras, one counter. **Pick → pay with Razorpay → get a signed token → show it at the counter.**
No login, no cart page, no server to run: Google Apps Script plus a Google Sheet is the backend.

## Pages (clean URLs)

| URL | What it is | Indexed |
|---|---|---|
| `/v2/` | Ordering app: hero, pairs, sound system, live menu, order sheet, token pass | yes |
| `/v2/menu/` | Full menu with prices, all three eras (static HTML) | yes |
| `/v2/how-it-works/` | How token ordering works, plus FAQs | yes |
| `/v2/counter/` | Staff counter: PIN, queue, QR scanner | no (noindex) |
| `/v2/board/` | Now-serving TV board | no (noindex) |
| `/404.html` | Custom not-found page, served by the host for any missing URL | no |

Every page has its own title, meta description, canonical URL, Open Graph and Twitter image, one H1, breadcrumbs (inner pages) and JSON-LD:
`WebSite` + `CafeOrCoffeeShop` (home), `Menu` + `BreadcrumbList` (menu), `FAQPage` + `BreadcrumbList` (how it works).
Also generated: `sitemap.xml`, `/robots.txt`, `llms.txt`, `site.webmanifest`, and the favicon set in `icons/`.

## Folder layout

```
v2/
├── app/app.js, app/app.css   ← SOURCE: edit these
├── assets/                   ← built: minified app.js / app.css (no source maps)
├── tools/build.py            ← regenerates every page + SEO files from the source
├── img/                      ← WebP photos (8.7 MB of originals → 1.1 MB)
├── og/                       ← 1200×630 social share images
├── icons/, favicon.ico, site.webmanifest
├── fonts/                    ← self-hosted Geist, Geist Mono, Instrument Serif
├── apps-script/              ← Code.gs + appsscript.json (the backend)
├── serve.py                  ← local server with audio seeking + custom 404
└── index.html, menu/, how-it-works/, counter/, board/, sitemap.xml, llms.txt
```
Music is shared with v1 from `client/public/audio`.

## Run it locally (demo mode)

```powershell
cd CHAI
python v2/serve.py
```
Open `http://localhost:8080/v2/`, and `http://localhost:8080/v2/counter/` (demo PIN **2580**) in a second tab.
With `GAS_URL` empty in `app/app.js`, orders and payments are simulated on the device. No money moves.

## After editing the source

```powershell
python v2/tools/build.py
```
This rebuilds every page and SEO file and minifies `assets/` with esbuild, using `v2/node_modules/.bin/esbuild` or esbuild on your PATH. Without esbuild it copies the files unminified.

## Settings to fill in (`tools/build.py`)

- **`SITE_URL`**: the public address. It defaults to the GitHub Pages URL `https://im-chandanmahapatra.github.io/CHAI-WALA/v2/`. Change it when a custom domain is connected, then rebuild.
- **`BUSINESS`**: street address, city, PIN code, phone, opening hours, map coordinates. These are empty because they aren't known yet. Empty fields are left out of the LocalBusiness schema rather than faked. Fill them in and rebuild to get a complete Google business listing.
- **`robots.txt`** only works at the root of a domain. Under GitHub Pages that root is `im-chandanmahapatra.github.io`, not this repo, so the file takes effect once a custom domain points here. Until then, the staff pages are kept out of search by their `noindex` tags, and you can submit `sitemap.xml` in Google Search Console.

## Go live (Razorpay + Apps Script)

1. Create a Google Sheet → **Extensions → Apps Script**. Paste `apps-script/Code.gs` and the manifest (`appsscript.json`).
2. **Project Settings → Script properties**: `RZP_KEY_ID`, `RZP_KEY_SECRET`, `TOKEN_SECRET` (a long random string), `COUNTER_PIN`.
3. Run `setup()` once. It creates the Menu, Options, Orders and Config tabs and the 5-minute reconcile trigger.
   *If your Sheet was created before the 2000s era existed, update the `era` column in the Menu tab (`adda`, `y2k`, `cafe`) to match `MENU_SEED` in Code.gs, or delete the Menu tab and run `setup()` again.*
4. **Deploy → New deployment → Web app** (execute as Me, access Anyone). Put the `/exec` URL in `CONFIG.GAS_URL` in `app/app.js`, then run `python v2/tools/build.py`.
5. Host it: GitHub Pages (Settings → Pages → branch, root), then open `…/CHAI-WALA/v2/`.

Tokens are prefixed by era: **A**-001 (1900s), **Y**-001 (2000s), **C**-001 (2020s).

## How it stays honest without a backend

| Risk | What v2 does |
|---|---|
| Someone edits the price in the browser | `priceCart_()` recalculates every line from the Sheet. The browser total is display-only. |
| Fake "payment successful" | HMAC-SHA256 of `order_id|payment_id`, checked with the secret in Script Properties, using the `order_id` from the Sheet. |
| Paid, then closed the tab | The ticket is saved before checkout opens. `status` asks Razorpay directly, and a 5-minute trigger sweeps the rest. |
| Two payments in the same second | `LockService` around the daily token counter. |
| Screenshot shared with a friend | The QR holds `orderId.signature`. The first scan marks it COLLECTED, and later scans show "already collected". |
| Guessing someone's order | Status needs the signed ticket, lookup needs the full mobile number, and counter actions need the PIN (8 wrong tries locks for 5 minutes). |

## The three eras

- **1900s · The Adda**: espresso and brass, a cassette deck playing the 90-minute Bollywood tape, a railway-ticket token.
- **2000s · The Coffee House**: midnight chrome with an iridescent accent, a coffee-house collage hero, a Discman with an LCD playing 2007–2015 songs, a holographic token.
- **2020s · The Café**: bone and indigo, a turntable playing 2016-onwards songs, a frosted-glass token.

Song credits are shown. Lyrics are not, because they're copyrighted.
