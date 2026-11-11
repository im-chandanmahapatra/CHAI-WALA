# Chaiwala v2 · DESIGN.md

One system, three eras. Every page uses these tokens through CSS variables in `app/app.css`; never write raw colour values in markup.
The landing page (`/v2/`) and static pages always use **the Adda** palette, which is the brand. The ordering app re-themes per era with `html[data-era]`.

## Direction
The brand is a chai counter that spans time, so each era takes its look from its own decade, while type, spacing and components stay constant. References: the large product photography of specialty-coffee sites, editorial long-read café sites, and the scroll-driven hero patterns common in component libraries (expanding media, sticky media). The design avoids carousels you have to wait through, purple gradients, glass on everything, and rows of identical cards.

## Colour (role → token)

| Role | Adda · 1900s (dark) | Coffee House · 2000s (dark) | Café · 2020s "Stone & Matcha" (light) |
|---|---|---|---|
| Page background `--bg` | `#0E0A07` espresso | `#0A0C11` midnight | `#F4F1EA` stone |
| Raised surface `--bg-2` / sheets | `#15100B` | `#11141B` | `#FBFAF6` |
| Card `--card` | `rgba(255,236,208,.035)` | `rgba(214,226,255,.04)` | `#FFFFFF` |
| Hairline `--line` / strong `--line-2` | cream 10% / 18% | ice 10% / 19% | `#E4DED2` / `#D3CCBE` |
| Text `--ink` | `#F3E7D3` | `#EDF1F8` | `#151410` |
| Secondary text `--ink-2` | cream 66% | ice 66% | `#5E5A51` |
| Meta text `--ink-3` | cream 42% | ice 42% | `#736E64` |
| **Primary** `--accent`: buttons, links, active states | `#D4A657` brass | `#8FE3DA` aqua chrome | `#3F5F2E` matcha |
| Text on primary `--accent-ink` | `#1A1007` | `#04201C` | `#FFFFFF` |
| Second accent `--accent-2`: small highlights only | `#E9C886` | `#C9B2FF` | `#C46B45` clay |
| Success `--ok` / error `--danger` | `#8FBF7A` / `#F08A6C` | `#8FE3A8` / `#FF8F7A` | `#3F7A4A` / `#B3432B` |

Contrast: body text and buttons are at least 4.5:1 in every era (matcha on white is about 7:1). `--ink-3` is only used for metadata, never for anything you need to read.

## Typography
- **Display:** Instrument Serif 400 (and italic for one emphasised word per heading). Used for headings, prices in the pass, and the cassette and disc labels.
- **UI and body:** Geist 400/500/600. Body text 16px on content pages, 15px inside the ordering app.
- **Numbers:** Geist Mono, with tabular figures, for prices, tokens and times.
- Scale (px, desktop → phone): 96→48 hero · 64→40 page H1 · 48→32 H2 · 28→24 H3 · 18 lead · 16 body · 13 meta · 11 eyebrow (mono, uppercase, letter-spacing .18em).
- Line length 60 to 70 characters. One H1 per page.

## Spacing and layout
- 4px base: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64 · 96 · 128.
- Content width `--shell` 1180px with 18px gutters; section spacing 96px desktop, 64px phone.

## Shape and depth
- Radius: 12 (inputs, small) · 18 (cards) · 26 (large cards) · 34 (hero media) · 999 (pills, buttons).
- Shadow: one soft drop shadow, `--shadow`. Dark eras add a 1px inner highlight; the 2020s uses a hairline border plus a light shadow instead of glass.

## Components
- **Buttons:** primary (accent fill, pill, 48px tall), ghost (card fill and hairline), glass (only on top of photos). Hover brightens slightly, press scales to .96, and focus shows a 2px accent ring. Disabled is 45% opacity with no pointer.
- **Links in text:** ink colour with an accent underline.
- **Inputs:** 58px, with a floating label, an accent focus ring, and the error message below the field.
- **Cards:** product card (photo, name, two-line blurb, mono price, add button) that expands in place to customise.
- **Navigation:** sticky blurred bar; links at 900px and up; the brand always links to the landing page.
- **Token pass:** paper ticket (Adda), holographic (Coffee House), white with a hairline (Café).

## Motion
Spring easing (stiffness and damping compiled to CSS `linear()`). Only `transform` and `opacity` are animated in scroll-linked effects, and every effect has a `prefers-reduced-motion` fallback that shows the final state.

## Imagery and icons
- Real product photos (WebP, 800px; scenes 1800px), cropped with `object-fit: cover`, and descriptive alt text on every image.
- Icons: one inline stroke set, 1.6 to 2px stroke and rounded caps. No emoji as icons.
