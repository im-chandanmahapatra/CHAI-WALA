# Chaiwala v2 — Pay, token, pick up

One page. No login, no cart page, no server to run.
**Pick → pay with Razorpay → get a signed token → show it at the counter.**

```
v2/
├── index.html              ← the whole customer app + counter mode + TV board
└── apps-script/
    ├── Code.gs             ← the "serverless server" (Google Apps Script)
    └── appsscript.json     ← manifest (timezone, scopes, web-app access)
```

The page reuses v1's photos and audio from `../client/public`, so keep the `v2` folder next to `client`.

---

## 1. Try it right now (demo mode)

With `CONFIG.GAS_URL` empty, everything runs on the device, including a clearly labelled demo checkout. No money moves.

```powershell
cd CHAI
python v2/serve.py
```
Use `serve.py` rather than `python -m http.server`. The built-in server can't do byte-range requests, so the 1900s cassette couldn't jump between songs. GitHub Pages supports ranges already.

| Open | What it is |
|---|---|
| `http://localhost:8080/v2/` | Customer app (best on a phone, or DevTools mobile view) |
| `http://localhost:8080/v2/#counter` | Staff counter. Demo PIN **2580** |
| `http://localhost:8080/v2/#board` | "Now serving" TV screen |

**Viva script:** open the customer app and `#counter` side by side in two tabs. Order → slide to pay → the token stamps in. Tap **Start brewing** and **Mark ready** on the counter, and the customer tab updates live (with a chime and vibration on phones). Then scan or type the token. A second attempt says *"already collected"*.
With no counter tab open, demo orders move to Brewing and Ready on their own, so you can also demo solo.

---

## 2. Go live (about 15 minutes)

### a. Google Sheet + Apps Script
1. Create a new Google Sheet → **Extensions → Apps Script**.
2. Paste `Code.gs` into the editor. In **Project Settings**, tick *Show appsscript.json* and paste the manifest.
3. **Project Settings → Script properties**, add:

| Property | Value |
|---|---|
| `RZP_KEY_ID` | `rzp_test_…` from Razorpay Dashboard → API Keys |
| `RZP_KEY_SECRET` | the matching secret (never put this in the HTML) |
| `TOKEN_SECRET` | any long random string, e.g. 40 random characters |
| `COUNTER_PIN` | 4 digits for staff |

4. Select `setup` in the function dropdown → **Run** → allow permissions. This creates the **Menu, Options, Orders, Config** tabs, seeds the menu and installs the 5-minute `reconcile` trigger.
5. **Deploy → New deployment → Web app**. Execute as: **Me**. Who has access: **Anyone**. Copy the `/exec` URL.

### b. Point the page at it
In `index.html`, set:
```js
GAS_URL: 'https://script.google.com/macros/s/XXXX/exec',
```

### c. Razorpay
- Use **Test mode** keys for the viva. Test UPI/cards work without KYC.
- Dashboard → Settings → **Payment capture: Automatic** is recommended. If it's off, `Code.gs` captures payments itself.

### d. Host it (free)
Push the repo and enable **GitHub Pages** (Settings → Pages → branch `main`, root). Your app is then at
`https://<you>.github.io/CHAI-WALA/v2/`. Print a QR of that URL for the counter.

> Each time you change `Code.gs`, use **Deploy → Manage deployments → Edit → New version**, otherwise the old code keeps running.

---

## 3. How it stays honest without a backend

| Risk | What v2 does |
|---|---|
| Someone edits the price in the browser | `priceCart_()` recalculates every line from the **Menu** and **Options** tabs. The browser total is display-only. |
| Fake "payment successful" | HMAC-SHA256 of `order_id|payment_id` is checked with the secret in Script Properties, using the `order_id` **from the Sheet**, never the browser's. |
| Paid, then closed the tab | The ticket is saved on the phone *before* checkout opens. Reopening polls `status`, which asks Razorpay directly. A 5-minute `reconcile()` trigger sweeps the rest. (Apps Script can't read webhook headers, so there's no webhook to trust.) |
| Two payments in the same second | `LockService` around the daily token counter: tokens never duplicate. |
| Screenshot shared with a friend | The QR holds `orderId.signature`. The first scan marks it **COLLECTED**, and every later scan shows *already collected at 10:42*. |
| Guessing someone's order | Status needs the signed ticket. Lookup needs the full mobile number. Counter actions need the PIN (8 wrong tries locks for 5 minutes). |
| CORS | The browser POSTs as `text/plain`, so there's no preflight (Apps Script can't answer one). |

**Owner workflow:** change a price or flip `available` to `FALSE` in the **Menu** tab, and it shows within a minute. Tune the wait estimate in **Config** (`baseMinutes`, `minutesPerOrder`).

---

## 4. The premium layer: what's in the page

- **Two complete themes:** 1900s *adda* (espresso and brass, dark) and 2020s *café* (bone and indigo, light). The era switch is a circular reveal (View Transitions API).
- **Type:** Instrument Serif (display), Geist (UI), Geist Mono (prices, tokens). The fonts are self-hosted in `v2/fonts`, so the demo works fully offline.
- **No. 03 Sound system:** a cassette deck for the 1900s (reels turn, tape winds across, the label shows the song) and a disc player for the 2020s (the disc spins, the tonearm lowers). There's a full song list, a seek bar, volume, and a colored glow that follows each song. Song credits are shown. Lyrics are not, because they're copyrighted.
- **Spring physics:** stiffness/damping springs, the same model Framer Motion uses, compiled to CSS `linear()` easing. No animation library, no extra kilobytes.
- **Carousels:** a story-style hero (auto-advancing progress bars, parallax photos, pauses on touch) and a coverflow "Perfect pairs" rail with snap and dots.
- **In-place customizing:** cards expand inline for sugar, size and add-ons with a live price. No modal.
- **The kulhad dock:** fills as you add. Items fly into it.
- **Slide to pay:** with haptics. Keyboard users can press Enter on the knob.
- **Brewing interstitial:** chai pours while the payment is verified (it covers the 1–3 s Apps Script round trip).
- **Token pass:** a railway-ticket paper pass (1900s) or a frosted-glass pass (2020s), a stamp that thuds in, a built-in QR encoder (no CDN; tested with OpenCV), and live Paid → Brewing → Ready with a chime and vibration.
- **Counter mode:** PIN pad, three-lane queue, camera scanner (BarcodeDetector, with a jsQR fallback) and manual token entry.
- **Mobile-first:** safe-area insets, 44 px+ touch targets, `prefers-reduced-motion` respected. Only transform and opacity are animated in the hot paths.
