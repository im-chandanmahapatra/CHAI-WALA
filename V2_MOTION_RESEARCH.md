# Chaiwala V2 — motion, performance and soundtrack research

Research date: 31 October 2026. Planning only; no application code changed. Findings below distinguish documented platform facts from proposed design decisions. Sources are first-party documentation, with six sources total.

## 1. Interactive 3D versus a rendered film

**Source facts.** React Three Fiber documents that WebGL cost varies with device capability. Its default render loop runs repeatedly; for scenes that can settle, on-demand rendering avoids unnecessary work. It recommends resource reuse to reduce GPU overhead. [React Three Fiber performance guide](https://r3f.docs.pmnd.rs/advanced/scaling-performance)

**Recommendation.** Use interactive 3D only where the visitor affects the object: choosing one of three vessels or inspecting a signature drink. Use a short pre-rendered film for realistic pouring, foam and steam, where art direction matters more than physical interaction. One shared counter/camera rig with three product arrangements is more manageable than three independent 3D environments. Keep live 3D outside checkout and stop rendering when the scene rests or leaves the viewport. Test a prototype on a representative Android phone before committing to expensive glass, liquid and shadow materials.

## 2. The intro must not become a loading gate

**Source facts.** web.dev recommends posters and explicit preload behaviour for video. A poster occupies the visual slot before playback. `preload="none"` prevents loading video data before it is needed; lazy loading is appropriate for offscreen media. [web.dev: Lazy loading video](https://web.dev/articles/lazy-loading-video)

**Recommendation.** Show the hero poster, title and generation choices immediately. Treat the requested four-to-five-second sequence as a presentation playing inside a usable page, not a mandatory wait before the menu exists. Load lower-page films only as needed. Prefer one compressed short video over a large frame-by-frame image sequence unless the interaction specifically requires precise scroll scrubbing. On a slow connection or playback failure, the poster and regular navigation must still form a complete design. Do not lazy-load the first visible hero poster.

## 3. Measurable premium quality

**Source facts.** Google's current good Core Web Vitals thresholds are LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1. Assessment uses the 75th percentile, separately for mobile and desktop. [web.dev: Web Vitals](https://web.dev/articles/vitals)

**Recommendation.** Use these as acceptance targets rather than promising a Lighthouse score from a desktop demo. Reserve media dimensions before loading. Lazy-load the optional 3D experience and music player, and keep cart actions responsive while either loads. Establish asset budgets after the first visual prototype; a universal megabyte limit is not supplied by the cited guidance. Test cold load, slow network, portrait orientation, returning visitors and the full cart flow. The most useful internal product metric is time from QR scan to a usable generation choice/menu—not the duration of the intro.

## 4. Motion should have a quiet equivalent

**Source facts.** The `prefers-reduced-motion` preference identifies users who request that non-essential movement be reduced or replaced. MDN notes that large-object panning and scaling can trigger vestibular discomfort. [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)

**Recommendation.** Keep native vertical scrolling. Use one brief pinned story section at most, with normal-flow cards on mobile. Make the reduced-motion version a designed static sequence or restrained crossfade, with identical choices, copy and order access. Do not remove content or make choosing an era dependent on dragging, scrolling a precise distance, or completing an animation. Normal touch and keyboard selection must remain available. A return visitor can bypass the introductory performance without losing the brand scene.

## 5. YouTube is a visible media experience

**Source facts.** YouTube developer policies prohibit separating audiovisual components and prohibit features that play content through a background player not displayed in the page, tab or screen the user is viewing. They also prohibit obscuring or disabling YouTube player functionality. [YouTube API Services Developer Policies, section III.I](https://developers.google.com/youtube/terms/developer-policies)

**Recommendation.** Do not promise an invisible YouTube-backed ambient audio system or replace its video with a purely decorative spinning record. Design a visible, dismissible listening panel that preserves the actual player; dismissing it should pause playback. On small screens, use a deliberate listening mode rather than a permanently floating video that covers the bag. If a future product requires unrestricted background audio, evaluate separately owned/licensed audio assets for that purpose. This is a product-design constraint, not a reason to discard the user's supplied music.

## 6. Player dimensions and honest control states

**Source facts.** YouTube specifies a minimum player viewport of 200×200 pixels and recommends 480×270 or larger for 16:9 players. `playsinline=1` enables inline playback where supported. `modestbranding` is deprecated and has no effect. `rel=0` limits related videos to the same channel rather than removing them. Individual video URLs and playlist IDs have different embed formats. [YouTube player parameters](https://developers.google.com/youtube/player_parameters)

**Recommendation.** The supplied links are three individual video URLs; label them soundtracks unless a real playlist ID is supplied. At 350px mobile width, 16:9 alone yields about 197px height, so enforce at least 200px height. Let the listener start playback, expose failures and an Open on YouTube link, and derive playing/paused/buffering status from real player events. Pausing should preserve position through the Player API; removing the iframe is a stop/reset, not a genuine pause. Avoid promising uninterrupted crossfades, suppressed ads or hidden YouTube branding.

## Suggested V2 architecture, as a design decision

1. Immediate art-directed poster and usable page.
2. Optional four-to-five-second rendered opening, with a direct way to proceed.
3. One responsive interactive 3D selection scene only if prototype performance passes.
4. Native scrolling with a small number of connected visual transitions.
5. Ordinary HTML product information, customization and checkout, with restrained feedback.
6. User-opened visible soundtrack panel using the actual YouTube player.

The strongest premium result comes from lighting, composition, image consistency, typography and interaction continuity. The recommendation is to spend the 3D budget on one recognisable moment, and preserve fast, readable ordering everywhere else.
