# Chaiwala — research and decision log

## Experience decisions

| Decision | Evidence / constraint | Project implementation |
|---|---|---|
| Scroll-led arrival | The requested QR journey should feel like a small film, without a redundant entry button. | A sticky 270vh scene changes from copy to pour to the three-world message. |
| Generational menu edits | Taste is the story: classic chai/biscuits, café cold coffee/lemon tea, then matcha/boba/iced options. | The selected era shows only the relevant existing catalogue items. |
| Audio remains opt-in | Browser autoplay policies can prevent unmuted media without a gesture. | A visible Sound on control is prepared for per-era YouTube embeds; no playlist is guessed or copied into source. |
| No pointer gimmick | The brief rejects cursor-following decoration and the experience must work on touch. | Hover/focus uses image scale and tactile button offsets only. |
| Generated photography | Campaign art needs to look more like editorial food photography than generic AI decoration. | Local assets create a hero, 90s Adda and 2000s Café visual world; SVG is reserved for the logo/favicon. |

## Technical decisions

- Keep React and Vite, the existing catalogue, `CartContext`, paise pricing, pickup flow and mock/Supabase adapter.
- Use CSS for the cinematic visual treatment rather than adding a timeline library. This avoids duplicate motion ownership and keeps `prefers-reduced-motion` practical.
- Use locally served campaign assets, avoiding runtime image APIs and fragile hotlinks.
- Do not add YouTube playlist IDs until the project owner chooses their exact presentation playlists. An embedded third-party playlist needs a clear user control, attribution/copyright review, and an internet connection at the review venue.

## Naming note

The user selected **Chaiwala** for this college project because it is immediately understood. It is not a commercial naming recommendation: it is descriptive and likely crowded. Before launch, run a word/phonetic trademark search in the applicable food-service and packaged beverage classes, plus domain/social clearance, and choose a distinct alternative if it conflicts.

## Sources

- [YouTube embedded players and parameters](https://developers.google.com/youtube/player_parameters)
- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
- [GSAP installation](https://gsap.com/docs/v3/Installation/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [IP India trademark search guidance](https://ipindia.gov.in/trade-marks-before-you-apply-search-existing-trademarks)
