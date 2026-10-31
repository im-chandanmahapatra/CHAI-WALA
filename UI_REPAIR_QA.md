# UI repair — 31 October 2026

Repaired the arrival animation (4.5 seconds, automatic advance, working scroll button and reduced-motion alternative), generation selector, linked story panel, era menu controls, product customization drawer, cart feedback and pickup checkout. Removed the non-functional sound play/pause UI pending the owner's playlists.

## Verification

- Chrome at 1440×900 and 390×844: intro advances, three generations are selectable, product sugar/size and quantities update the total, bag opens, pickup loads, and checkout stores a ticket.
- Example: two ₹60 customized chai → ₹120 subtotal + ₹6 GST + ₹10 packaging = ₹136, verified against the stored order.
- Reduced-motion scroll control tested.
- No browser runtime errors, failed rendered image elements or horizontal overflow in those flows.
- Existing local order invariant suite: 31/31 passed. This tests the local adapter, not a deployed database.
- Production TypeScript/Vite build passes; the existing bundle-size advisory remains.
- Screenshots: client/qa-1440.png and client/qa-390.png. Browser test source: client/verify-ui.mjs (uses a temporary @playwright/test installation and local Chrome).

## Backend scope

Local orders validate quantity and customization, preserve capacity across reloads, refresh pickup windows and reject duplicate submissions. A new ordering boundary maps the checked-in Supabase schema's snake_case fields, UUID catalogue/options, pickup rows and RPC payload to the UI. The live database path needs configured credentials, deployed schema/catalogue and integration testing; it has not been verified against a real Supabase project. Razorpay and YouTube playlists remain deferred.

## Replacement images

Built-in image generation was used for:

- client/public/images/campaign/bun-maska-v2.png — Prompt: A realistic square food photograph for an Indian cafe menu: one soft round golden bakery bun sliced horizontally and generously spread with visible melting salted butter on a small stainless steel plate, close three-quarter view, warm daylight, rustic cafe counter softly blurred, bun fills most of frame. Authentic Mumbai bun maska, no sourdough loaf, no text or logos.
- client/public/images/campaign/cutting-chai-v2.png — Prompt: A realistic square food photograph for an Indian cafe menu: small faceted clear glass half filled with creamy brown Indian milk chai, visible steam, metal saucer on a warm wooden tapri counter. Tight three-quarter product framing, appetizing natural warm light. Authentic cutting chai, opaque milk tea, no black tea, no garnish, no text or logos.
