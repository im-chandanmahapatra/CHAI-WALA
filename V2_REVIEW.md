# Chaiwala V2 implementation review

Reviewed 1 November 2026. Local implementation; no deployment or real payment executed.

## Verdict: 7/10 overall

This is a substantially more coherent college-project demo, with a working local ordering journey. It does not yet meet the complete photorealistic cinematic ambition of the research brief. The rating is a qualitative engineering/design review, not a measured usability score.

| Area | Score | Assessment |
| --- | --- | --- |
| Visual identity | 8/10 | Chalk/oxblood palette, Fraunces/Manrope typography, matching era campaign images and consistent footer improve coherence. Existing catalogue imagery still varies. |
| Motion and 3D | 6/10 | Interactive shared tabletop, vessel changes, short procedural pour and scroll-linked scene movement work. The rendering is stylized; there is no photorealistic liquid/steam film. |
| Ordering UX | 8/10 | Search, shared bag across eras, customization, transparent pairing prices and mobile checkout were exercised. Store operations remain a demonstration. |
| Engineering | 6.5/10 | TypeScript/build pass, 3D code is split, scenes render on demand, media has fallback. OrderPage remains large and the CSS still layers over legacy styles. |
| Production readiness | 5/10 | Live database behaviour, real device performance, payment, deployment and full accessibility audit are unverified. |

## Implemented

- A non-blocking 4.5-second first-session presentation through three vessels; normal anchor scrolling and reduced-motion handling.
- A shared Three.js table/coaster, GSAP vessel entry, brief procedural pouring stream and scroll-linked table orientation.
- Remembered era, three era selectors, compact story and an immediately reachable menu.
- Three new campaign images, exported as JPEGs of approximately 196–244 KB each. Original generated PNGs retained.
- Revised type, colours, spacing, favicon, responsive sheets and compact footer.
- Full-catalogue search, empty results, house pairings, continued browsing after Add, live bag notice and cross-era cart persistence.
- Visible user-opened YouTube player with native controls. Close destroys the player and resets playback; the button is labelled Close rather than incorrectly labelled Pause.
- Explicit demo disclosure in checkout and confirmation. No payment or real café submission is implied in local mode.
- Coffee and matcha no longer inherit misleading Cutting/Kulhad size labels in the seed catalogue.

## Verification evidence

- `npm run build`: TypeScript and Vite production build passed. Vite still warns about large chunks: entry approximately 543 KB minified / 159 KB gzip; lazy 3D approximately 990 KB / 282 KB gzip.
- Rebuilt and ran the existing order verification suite from current source: 31/31 local checks passed. Its printed 'full stack verified 100%' line overstates the scope: these are local/mock checks, not live Supabase assurance. The generated tracked test bundle was restored after execution to avoid committing a bundled dependency tree.
- Desktop viewport 1440×900: menu anchor, product search, customization and bag inspected.
- Selected Adrak Chai, Less Sugar, Kulhad Mug: item ₹60, GST ₹3, packaging ₹10, total ₹73. Changed era to Gen Z; bag retained the configuration and price.
- At 390×844: completed a local demo checkout with test data and received CW-1001 confirmation. No external order/payment sent.
- House pairing: matcha ₹140 + brownie ₹80 = subtotal ₹220; total ₹241 with displayed charges. Two lines added correctly.
- Empty search produces a useful message. Full-menu toggle works.
- Gen Z YouTube embed visibly loaded and showed active playback controls. Other two video links were retained but their playback was not separately verified.
- Fresh page load returned no captured JavaScript errors. A development hot-reload React duplication error occurred while dependencies were reoptimized; React/ReactDOM/Three deduplication was added, followed by a clean-load check.
- No broken loaded images in the inspected page; no horizontal overflow at inspected desktop/mobile widths.
- Screenshots: `v2-desktop-review.jpg`, `v2-mobile-review.jpg`.

## Remaining work, in priority order

1. Produce and integrate the separately rendered opening film if photorealistic pouring/steam is essential. Current procedural 3D is an alternative implementation, not completion of that film deliverable.
2. Normalize all catalogue photography, portion descriptions and menu facts. The three new campaign photographs do not constitute a reshoot of all 19 products.
3. Validate real Supabase order behaviour and server-side rules before accepting live orders. Integrate Razorpay only in its separately planned payment milestone.
4. Profile real midrange Android hardware and slow connections; measure Core Web Vitals. No Lighthouse score or field performance result is claimed.
5. Extract catalogue, customization, checkout and soundtrack into focused components; consolidate legacy CSS instead of continuing to append overrides.
6. Complete keyboard/screen-reader, reduced-motion and media-failure testing. Current handling exists in code, but this review is not a complete accessibility audit.

## Generated asset provenance

Used the built-in imagegen tool, not an external CLI. Assets live under `client/public/images/campaign/` as `table-adda-v2`, `table-cafe-v2`, and `table-now-v2`, with PNG masters and JPEG delivery copies.

Shared final prompt: Create a single photorealistic editorial cafe photograph for Chaiwala website, landscape 3:2. Camera at 40 degrees above table, 50mm lens, vessel centered at 52% horizontal, cup on a plain circular oxblood coaster with a subtle cream ring, cup occupies middle third of frame, precise realistic food texture, natural soft shadows, quiet warm muted colour grading, premium independent Indian cafe. Leave bottom 25% darker quiet table for overlay text. No text, no logos, no people, no collage, no surreal elements. This is one of a consistent three-era campaign: exact same coaster geometry and cup placement in all three images.

Scene variations:

- Adda: a clear Indian cutting glass of amber milk ginger chai, a stainless biscuit plate with two Osmania biscuits, small old radio softly blurred at the back, worn walnut table, warm late afternoon light.
- Cafe: an ivory ceramic cappuccino cup, a small plate with plain butter cake, an ink-blue notebook softly blurred at the back, oxblood laminate cafe table, warm afternoon light.
- Now: a clear glass of iced matcha latte with realistic condensation, a small plate with plain butter cake, pale mineral cafe table and one satin steel detail, soft natural daylight.

The images are generated campaign illustrations of the concept. They are not photographs of an operating café's actual servings.
