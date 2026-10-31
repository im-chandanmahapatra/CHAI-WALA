# Chaiwala — delivery record

## Product outcome

Chaiwala is a cinematic, QR-first chai counter experience built around one idea: the same counter feels different to a 90s chai regular, a 2000s college crowd, and a present-day matcha/cold-drink customer. A scroll-led pour intro transitions into three selectable worlds, each with an appropriate menu edit, visual language and optional soundtrack cue. The purchase path remains intentionally simple: add to bag, choose a pickup slot, confirm the order.

## Delivered

- [x] Scroll-led cinematic opener: a chai pour, steam, layered copy and no "enter" button. Reduced-motion users get a static, usable first screen.
- [x] Three switchable worlds: **90s Adda**, **2000s Café**, and **Now**. Every world changes its colour accent, editorial photograph, story, sound cue and featured product set.
- [x] Chai-first menus: classic chai, biscuits and cakes for Adda; chai, cold coffee, lemon tea and brownies for Café; matcha, boba and iced drinks for Now. No pizza/burger expansion.
- [x] Premium mobile-responsive visual system with no custom cursor, no forced autoplay and no page-load preloader.
- [x] Custom Chaiwala cup/steam favicon and reusable SVG wordmark.
- [x] Real order interactions retained: persistent bag, quantities, pickup-slot selection, payment-at-counter wording and confirmation ticket.
- [x] Locally generated editorial art for the 90s and 2000s worlds plus a cinematic hero photograph.

## Intentionally staged for review

- A YouTube playlist can be connected per era after playlist IDs are supplied. The UI uses an explicit user action because browsers frequently block media autoplay and a college presentation should not unexpectedly play sound.
- The current confirmation flow uses the existing local mock when Supabase environment variables are absent. The checked-in live SQL function and client payload still need contract/RLS verification before public deployment.
- The displayed name **Chaiwala** is approved for this academic project only. It is generic/high-collision and must be replaced or cleared through trademark/domain checks before commercial launch.

## Verification

- `npm run build` must pass from `client` after any UI change.
- `http://localhost:5173/` is the local development URL. Opening `client/index.html` directly by `file://` will not start a React/Vite application.
- Before a QR is printed, deploy to a stable HTTPS URL, generate the QR for that URL and scan it with an unrelated phone.
