# Chaiwala V2 — Google Apps Script Backend

Serverless HTTP API and Google Sheets persistence layer for Chaiwala V2. Handles authoritative menu pricing, Razorpay order creation, HMAC-SHA256 payment verification, locked daily token generation, automatic payment reconciliation, and PIN-protected staff counter actions.

---

## Files

| File | Purpose |
|---|---|
| [`Code.gs`](Code.gs) | HTTP router (`doGet` / `doPost`), cart pricing (`priceCart_`), Razorpay REST client (`razorpay_`), HMAC signer/verifier (`hmacHex_`, `ticketFor_`), `LockService` token issuer (`markPaid_`), 5-minute `reconcile()`, and `setup()` seeder |
| [`appsscript.json`](appsscript.json) | V8 runtime manifest (`Asia/Kolkata` timezone, `ANYONE_ANONYMOUS` web app access, `spreadsheets.currentonly`, `script.external_request`, `script.scriptapp` OAuth scopes) |

---

## Setup Instructions

1. Create a Google Sheet and open **Extensions → Apps Script**.
2. Replace `Code.gs` with the contents of [`Code.gs`](Code.gs), and enable **Show "appsscript.json" manifest file in editor** under Project Settings to paste [`appsscript.json`](appsscript.json).
   - If the script is standalone (not container-bound to a Sheet), set `SHEET_ID` in `Code.gs` line 17.
3. Under **Project Settings → Script properties**, configure all four mandatory properties:

| Property | Required | Description |
|---|---|---|
| `RZP_KEY_ID` | Mandatory | Razorpay Key ID (`rzp_test_...` or `rzp_live_...`) |
| `RZP_KEY_SECRET` | Mandatory | Razorpay Key Secret (never leaves Apps Script) |
| `TOKEN_SECRET` | Mandatory | Long random secret used for HMAC-SHA256 ticket signing |
| `COUNTER_PIN` | Mandatory | 4–6 digit PIN required for staff `/v2/counter/` actions |

4. Run `setup()` once from the Apps Script editor. It creates the four sheets (`Menu`, `Options`, `Orders`, `Config`), seeds 19 items and 10 option rows, and installs a 5-minute time-driven trigger for `reconcile()`.
   - *Upgrading from an older sheet?* Ensure the `Menu` sheet's `era` column uses `adda`, `y2k`, and `cafe`, or delete the `Menu` tab and run `setup()` again.
5. Click **Deploy → New deployment → Web app** (`Execute as: Me`, `Who has access: Anyone`).
6. Copy the `/exec` URL into `CONFIG.GAS_URL` in [`../app/app.js`](../app/app.js#L6) and rebuild the frontend via `python v2/tools/build.py`.

---

## Google Sheets Schema

- **`Menu`:** `id | name | era | category | price | prep | available | options` (cached for 60 seconds via `CacheService`)
- **`Options`:** `group | type | id | label | delta` (`type`: `one` or `many`)
- **`Orders`:** `orderId | createdAt | token | era | name | phone | itemsJSON | amountPaise | rzpOrderId | paymentId | status | paidAt | readyAt | collectedAt | etaMin`
- **`Config`:** `key | value | note` (`baseMinutes = 4`, `minutesPerOrder = 1.5`)

---

## API Contract

- **GET requests:** `?action=<name>&...`
- **POST requests:** Send JSON body with `Content-Type: text/plain;charset=utf-8` (avoids CORS preflight `OPTIONS` requests).
- **Standard response:** `{ "ok": true, ... }` or `{ "ok": false, "error": "<message>" }`.

### `doGet` Endpoints

| `action` | Query Params | Response |
|---|---|---|
| *(omitted)* | — | `{ ok: true, service: "chaiwala-v2", time: "<ISO>" }` |
| `menu` | — | `{ ok: true, items: [...], groups: { ... } }` |
| `queue` | — | `{ ok: true, ahead: <int>, eta: <int> }` |
| `status` | `ticket` | `{ ok: true, orderId, ticket, token, status, era, name, items, amount, eta, ahead?, paidAt, readyAt, collectedAt }` |
| `lookup` | `phone` | `{ ok: true, orders: [{ token, status, ticket }] }` |
| `board` | — | `{ ok: true, brewing: [...], ready: [...] }` |

### `doPost` Endpoints

| `action` | Body Parameters | Auth | Behavior |
|---|---|---|---|
| `create` | `era`, `name`, `phone`, `items: [{ id, qty, opts }]` | Public | Validates Indian 10-digit phone (`[6-9]\d{9}`), recalculates prices from Sheets, creates Razorpay order, writes `CREATED` row, returns `{ ok, orderId, ticket, rzpOrderId, amount, keyId, lines }` |
| `verify` | `orderId`, `razorpay_payment_id`, `razorpay_signature` | Razorpay HMAC | Verifies `HMAC_SHA256(sheet.rzpOrderId + "|" + razorpay_payment_id, RZP_KEY_SECRET)`, captures `authorized` payments, issues locked daily token (`A-`/`Y-`/`C-001`) |
| `counter.list` | `pin` | `COUNTER_PIN` | Returns today's tokenized orders and queue status (8 wrong PIN attempts lock for 300 seconds) |
| `counter.advance` | `pin`, `orderId`, `to` | `COUNTER_PIN` | Enforces state machine `PAID` → `BREWING` → `READY` → `COLLECTED` |
| `counter.collect` | `pin`, `ticket` | `COUNTER_PIN` | Verifies signed QR `<orderId>.<hmac16>` and marks `COLLECTED` (returns `already: true` if already collected) |
| `counter.collectToken` | `pin`, `token` | `COUNTER_PIN` | Manual fallback to collect today's order by token string (e.g. `A-042`) |

---

## Security & Reliability Mechanisms

- **Authoritative Server Pricing:** Browser totals are display-only; `priceCart_()` sums Sheet prices and validates item availability (`available = TRUE`) and quantities (`1–10`).
- **Signed QR Tickets:** `ticketFor_(orderId)` signs tickets using `HMAC_SHA256(orderId, TOKEN_SECRET).slice(0, 16)` so order IDs cannot be guessed or forged.
- **Race-Safe Sequencing:** `markPaid_()` uses `LockService.getScriptLock().waitLock(20000)` around `seq_yyyyMMdd` in Script Properties.
- **Orphan Payment Recovery:** If a customer closes the browser after paying on Razorpay before `verify` executes, both `status_()` (rate-limited every 20s) and the 5-minute `reconcile()` trigger query Razorpay directly to settle and assign a token.
