# Chaiwala design system

## Creative direction

The identity is **memory through a cup**, not an old-fashioned tea-shop template. The opening is dark, cinematic and sensory; the selected generation then owns its colour, image and copy. Editorial typography makes it feel like a campaign rather than a component-library demo. The order flow stays plain and legible.

## Foundations

| Role | Token | Value |
|---|---|---|
| Carbon canvas | `--ink` | `#101113` |
| Warm paper | `--milk` | `#f4eee5` |
| Chai vermilion | `--hot` | `#f04e30` |
| Adda brass | `--gold` | `#c89a44` |
| Café pink | `--pink` | `#ef739c` |
| Now lime | `--lime` | `#b9ff45` |
| Now lilac | `--lilac` | `#a995ff` |

`Bricolage Grotesque` is the high-impact display face, `Fraunces` adds warmth for emphasis and prices, and `DM Sans` keeps UI and product details clear. All type has system fallbacks.

## Motion and interaction

- The cinematic intro uses native sticky positioning and one CSS custom property driven by scroll; it does not hijack scrolling.
- Era cards scale their photographs on hover/focus; product photography has a quiet editorial scale, and buttons use an offset-shadow press response.
- No pointer-following effects, no WebGL, no loading prelude and no compulsory audio.
- `prefers-reduced-motion` turns the opener into a still usable hero and removes ambient animation.

## Components

- Header: wordmark, three anchor links, always-visible bag count.
- Era selector: three large visual tabs. Selection updates both the story and the menu; it never silently alters the bag.
- Sound station: designed as a vinyl/radio artifact. It is an interaction affordance awaiting user-supplied YouTube playlist IDs.
- Menu: only six relevant products are editorially featured at once. Add controls retain availability state.
- Checkout: familiar sheet pattern, labelled pickup choices and payment-at-counter clarity.

## Asset rules

Brand marks remain SVG. Campaign images are local project assets in `client/public/images/campaign/`; use `loading="lazy"` below the fold and never bake legible claims or prices into generated images. New imagery should be realistic, food-led and clearly tied to an era instead of relying on generic neon-café stock art.
