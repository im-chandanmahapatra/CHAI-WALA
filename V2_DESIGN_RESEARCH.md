# Chaiwala V2: a researched creative direction

Research date: 31 October 2026. Scope: design discussion and planning. No application code changed for this research. These are proposed decisions, not approved specifications or measured improvements.

## The direction

**One table, three eras.** Keep Chaiwala as the brand. Build the experience around a recognisable cafe table and branded coaster that remain in the same composition while the drink, light and a few surrounding objects change between the 90s, 2000s and the present.

Suggested brand line: **Waqt badla. Baithak wahi.**

The visual thread should reach from the physical QR coaster to the opening film, era selector, product presentation and order receipt. This gives the project a recognisable identity across its touchpoints. The value of 3D is continuity and a meaningful response to selection.

## Research and its limits

Ghia and Subko were visually inspected in the browser. The other references below were researched through the designers' own case studies. These are observations about design and documented intent; no reference site was independently benchmarked, accessibility-audited or tested with users. No claim about conversion lift is inferred from its visual appeal.

| First-party reference | Observed or documented approach | Proposed application to Chaiwala |
| --- | --- | --- |
| [Ghia](https://drinkghia.com/) and its [Original Aperitif page](https://drinkghia.com/products/ghia) | Art-directed product compositions; product detail makes tasting notes, serving ritual, ingredients and purchase controls explicit. | Photograph the actual drink convincingly; make its flavour and pairing useful to someone choosing from a menu. |
| [Subko](https://www.subko.coffee/) | Multilingual identity and process imagery; coffee, cacao and baking stories grounded in the Subcontinent. | Develop an Indian cafe identity through lettering, materials and everyday rituals, with truthful product descriptions. |
| [Polaroid I-2, by Build in Amsterdam](https://www.buildinamsterdam.com/case/polaroid-i-2) | Physical camera interface informs bespoke icons; interactive settings and photography support the product story. | Derive UI behaviour from coasters, menu slips and serving trays. The physical metaphor should help explain a choice. |
| [Moooi, by Build in Amsterdam](https://www.buildinamsterdam.com/case/moooi) | The studio describes a sensory store combining type, imagery, motion and sound with keyboard navigation. | Design sound, motion and commerce together; preserve equivalent access when motion is reduced or music is off. |
| [Vitra Gift Finder, by Build in Amsterdam](https://www.buildinamsterdam.com/case/vitra-gift-finder) | Guided discovery, filtering and fluid product presentation. | Era choice should curate product discovery while preserving access to the full catalogue and one shared bag. |

## An opening with a specific storyboard

The proposed first-visit opening lasts approximately 4.5 seconds inside a usable page. The hero poster, brand and functional navigation appear immediately. A user can scroll at any point; no Enter button or forced countdown is necessary. Finishing the film must not unexpectedly scroll a user who has already moved away.

1. **0.0-1.2 seconds:** Close view of chai pouring into a cutting glass on a Chaiwala coaster. Window light reveals the liquid, glass edge and tabletop texture.
2. **1.2-2.3 seconds:** A match cut keeps the coaster and vessel position aligned while replacing the glass with a ceramic coffee cup. Light shifts to the after-class cafe scene.
3. **2.3-3.4 seconds:** Another aligned cut reveals an iced matcha. Condensation and a quiet moving reflection create depth.
4. **3.4-4.5 seconds:** The camera widens into the final table composition. The brand line and three labelled era choices form the usable page.

These are intentional edits between scenes, not a morph that turns clay into glass or tea into matcha. Natural movement, believable materials and editing carry the effect.

On returning visits, show the last selected era and a usable menu immediately, with an optional replay. With reduced motion or unavailable video, use a composed still and the same controls.

## Three moods, one design system

| Choice | Scene direction | Sample product focus | Accent |
| --- | --- | --- | --- |
| 90s Adda / Shaam ki baithak | Warm side light, worn wood, a steel biscuit plate and one radio detail | Adrak chai, elaichi chai, coffee, biscuits and cake | Muted brass |
| 2000s Cafe / After-class table | Oxblood laminate, ceramic, a casually open notebook, afternoon light | Chai, cappuccino, cold coffee, lemon tea and cake | Ink blue |
| Gen Z / Aaj ka pause | Pale mineral surface, satin steel, clear glass and soft daylight | Matcha, iced latte, boba, black coffee and shared favourites | Leaf green |

These are curatorial moods, not age eligibility rules or assumptions about every person's tastes. The user can change the era freely, see all drinks, and keep items from multiple eras in one order. Existing customizations and bag contents must survive the switch.

Keep typography, navigation placement, product controls and checkout consistent. Change the image, scene lighting, a small accent palette, selected copy and recommended ordering. Avoid treating each era as a different website.

## Colour, type and branding

Proposed common palette: chalk **#F4F1E9**, oxblood **#542B30**, and ink **#242827**. Era accent candidates: brass **#936E42**, blue **#354CA2**, and leaf **#58674C**. These are starting swatches; text/background combinations still need contrast validation.

Use light surfaces for most shopping content. Place the rich oxblood colour on the wordmark, selected states and specific editorial panels. Photographs supply most of the scene's colour. Limit decorative grain to large background areas so it does not interfere with labels or prices.

Typography proposal: [Fraunces](https://fraunces.undercase.xyz/) for short editorial headlines and [Manrope](https://fonts.google.com/specimen/Manrope) for product names, navigation, options and prices. Keep long descriptions in the UI face, preserve generous line height, and use predictable numeral alignment for prices. This pairing is a design proposal, subject to checking real copy on mobile.

Create a custom Chaiwala wordmark with a carefully drawn Devanagari companion where appropriate. Use a simplified letterform from the mark for the favicon and coaster stamp; verify it is recognisable at small size. The same identity should appear on the QR coaster, digital bag and receipt.

## Scroll and interaction choreography

- **Hero to era choice:** one short, controlled scene transition. Native vertical scrolling remains in charge. Scroll position does not force the visitor through all three eras.
- **Era change:** a brief aligned scene replacement, with a stable coaster anchor and clear active label. Start with a 600-800 ms design budget and adjust after testing; this is not a measured requirement.
- **Story to menu:** keep a compact story beside the selected scene; the drink image can visually carry into the featured product. The catalogue begins within one ordinary scroll after selecting an era. Mobile uses normal document flow and all three choices remain discoverable.
- **Product hover or focus:** a small image reframing or alternate detail photograph and a precise border/label change. Essential information and Add controls remain visible without hover. Touch users get the same choices.
- **Customization:** desktop side sheet, mobile bottom sheet, with options and current total together. Show actual visual differences such as vessel size or ice only when the catalogue supports them; a sugar change need not invent a colour change.
- **Add to bag:** a short thumbnail-to-bag transition followed by a clear quantity/total update. The user can keep browsing. Reduced motion receives equivalent text feedback.
- **Return from checkout:** restore the selected era, catalogue position and current bag so the experience remains predictable.

Use three motion scales: fast feedback for controls, moderate transitions for sheets, and the slowest movement for the opening/era scene. Give each element one animation owner so scene and UI libraries do not compete for the same transform.

## Menu, checkout and the final impression

Start the selected era with one house pairing, such as chai with biscuits, presented as an editorial product composition with transparent item prices. Follow it with a practical catalogue: product image, name, flavour information, hot/iced state, price and action. Only display preparation estimates, allergens or ingredient claims when the underlying data supports them.

Keep the story and listening experience close to the menu, but optional. Search and simple category controls should remain useful across eras. Do not require three full-screen chapters before someone can order.

The order journey is: QR -> opening/era choice -> curated menu -> customization -> shared bag -> pickup details -> order confirmation. Checkout has an editable order summary, explicit charges, retained input after errors and clear pending/success/failure states. Real payment integration remains a separate later milestone; a college demonstration must label simulated payment clearly.

The footer can reuse the coaster imprint and table edge in a compact closing composition. Include real location/hours/contact data when available, relevant links, and a clear route back to the menu. It should finish the story without becoming another tall empty panel.

An optional later extra is a downloadable memory postcard based on the chosen era and drink. It should exclude personal order details by default and never delay confirmation. A return-visit shortcut to a previous configuration is more useful than introducing a game or reward system at this stage.

## Soundtrack design

The supplied links identify three videos, so call them era soundtracks unless actual playlist IDs are supplied. Use a user-opened, visible listening panel, preserve the YouTube player controls, and pause when the panel is dismissed. Design playback, pause, buffering and unavailable states from real player events.

This decision follows [YouTube's developer policies](https://developers.google.com/youtube/terms/developer-policies), which prohibit undisplayed background players and audio/video separation. Respect the [player's documented minimum dimensions](https://developers.google.com/youtube/player_parameters). On mobile, the listening view must not cover checkout controls. Opening a soundtrack should preserve the current order and scroll position.

## Asset production comes before animation implementation

Build a single reference sheet that fixes vessel geometry, lighting direction, camera height, drink colour, portion size and surface materials. Produce campaign compositions and clear catalogue images from that shared reference. Independently generated images with inconsistent cup shapes and shadows would weaken the identity.

Minimum design assets:

- Wordmark, small favicon and coaster/receipt mark.
- Three era scene compositions, with desktop and portrait framing.
- The 4.5-second opening plus its poster and reduced-motion still.
- A consistent product image set based on the actual menu.
- One reusable table/camera rig and three selected vessels if interactive 3D passes the prototype test.
- Defined component states for the era controls, product rows, customization sheet, bag, listening panel and checkout.

Realistic liquid and steam should be produced as a short rendered film. Interactive assets need actual models/materials; AI-generated photographs alone do not provide dependable 3D geometry or fluid simulation. Use generated images for concept exploration and coherent still assets, with review for physical inconsistencies.

## Technical recommendation and checks

The existing client package manifest already contains React Three Fiber, Three.js, GSAP, Motion and Lenis. Additional animation dependencies are not the starting need.

Proposed responsibilities: React Three Fiber for a single meaningful interactive scene; GSAP/ScrollTrigger for scene choreography and limited scroll synchronization; CSS or existing Motion for UI feedback. Prefer native scrolling for the first prototype. Do not introduce a site-wide scrolling layer simply because a dependency is installed.

[React Three Fiber's performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) supports on-demand rendering when scenes can settle. [GSAP's ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) supports controlled scroll-linked timelines. These capabilities do not guarantee the proposed assets will run smoothly; a representative phone prototype must establish that.

Aim for LCP <= 2.5 seconds, INP <= 200 ms and CLS <= 0.1 at the 75th percentile, assessed separately for mobile and desktop, following [Web Vitals guidance](https://web.dev/articles/vitals). These are targets, not current measurements. Keep cart interactions independent of 3D/video loading. Honor [reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) without losing choices or content.

## Recommended delivery sequence

1. **Art direction:** reference board, wordmark, palette/type trial, one desktop and mobile hero, all three era stills, and a customization-sheet mockup. Review these as actual compositions before introducing motion.
2. **Motion proof:** a short storyboard/animatic covering the opening, one era switch and the move into the menu. Check that the narrative reads without sound.
3. **Functional slice:** one full QR-to-confirmation journey on a representative phone, including reduced motion, failed media, switching eras and returning to the bag.
4. **Expand and polish:** finish the catalogue art, remaining era content, listening states, footer and responsive details. Add optional postcards only after ordering is dependable.

Suggested small usability review: five people complete era selection, add a customized drink, switch eras, edit the bag and reach confirmation without guidance. Observe hesitation, mistaken taps and lost state. This is a proposed evaluation, not a study already conducted.

The first review should assess whether the three eras are understandable, the visual assets feel like one brand, the menu is immediately reachable, and the motion preserves control. A more elaborate effect is justified only when it improves one of those outcomes.

Related technical research: [V2_MOTION_RESEARCH.md](./V2_MOTION_RESEARCH.md).
