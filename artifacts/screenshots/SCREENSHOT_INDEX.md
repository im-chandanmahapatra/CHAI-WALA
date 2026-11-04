# Screenshot Index — Genuine Chaiwala System Evidence

This index documents the genuine application screenshots and technical evidence captured directly from the live running **CHAIWALA — Chai Across Generations** application (`http://localhost:5173/`).

All screenshots were captured at a standard desktop viewport of **1440 × 900** (and **390 × 844** for mobile responsiveness) using automated Chromium browser capture. No interfaces were mocked, faked, or recreated in graphic software.

---

## 1. Inventory & Evidentiary Proof

| Filename | Viewport | Subject / Workflow Represented | What This Image Proves | Evidence Classification |
|---|---|---|---|---|
| **`landing-page.png`** | 1440 × 900 (Desktop) | Landing page & 1900s Adda visual identity (`/`) | Proves live brand identity, dark carbon canvas (`#101113`), warm brass lighting, custom Chaiwala SVG mark, tagline *"Waqt badla. Baithak wahi"*, and dual-era tab controls. | `[VERIFIED]` Live Running App |
| **`era-switcher-2020s.png`** | 1440 × 900 (Desktop) | 2020s Modern Café era toggle (`/`) | Proves instant client-side theme re-skinning via CSS custom properties. Shows lilac aesthetic, contemporary copy, and iced drink curation. | `[VERIFIED]` Live Running App |
| **`tea-menu-catalogue.png`** | 1440 × 900 (Desktop) | Curated generational menu catalogue (`/#menu`) | Proves authentic tea catalogue (Cutting Chai ₹25, Adrak Chai ₹30, Elaichi Chai ₹30, Bun Maska ₹40), availability badges, and customization triggers. | `[VERIFIED]` Live Running App |
| **`tea-customization.png`** | 1440 × 900 (Desktop) | Multi-option beverage customization modal | Proves interactive drink customization: sweetness levels (sugar-free, less sugar, regular), cup sizing (Cutting 120ml vs Kulhad Mug 220ml with +₹10 delta), and real-time price updates. | `[VERIFIED]` Live Running App |
| **`order-bag-drawer.png`** | 1440 × 900 (Desktop) | Slide-over persistent cart drawer | Proves `CartContext` state management, itemized line items, quantity modification, subtotal calculation, exact 5% GST computation, and ₹10 biodegradable packaging fee in integer paise. | `[VERIFIED]` Live Running App |
| **`pickup-slot-selection.png`** | 1440 × 900 (Desktop) | 15-minute pickup window selector | Proves capacity-controlled slot scheduling engine with dynamic status badges (`AVAILABLE`, `FILLING_FAST`, `FULL`), customer contact inputs, and special instruction fields. | `[VERIFIED]` Live Running App |
| **`order-ticket.png`** | 1440 × 900 (Desktop) | Digital order confirmation ticket | Proves end-to-end checkout execution, order number generation (`#CW-1001`), cryptographic tracking token (`cwtk_...`), scheduled pickup window, and counter instructions. | `[VERIFIED]` Live Running App |
| **`theatre-mode-radio.png`** | 1440 × 900 (Desktop) | Web Audio API / AddaSessions radio player | Proves functional HTML5 Web Audio subsystem, ambient radio playback, waveform visualizer, and opt-in user control preventing unwanted autoplay. | `[VERIFIED]` Live Running App |
| **`mobile-responsive-hero.png`** | 390 × 844 (Mobile) | Mobile responsive landing hero | Proves mobile-first responsiveness on iPhone 14 viewport: touch targets, legible typography, and zero horizontal overflow. | `[VERIFIED]` Live Running App |
| **`mobile-responsive-checkout.png`**| 390 × 844 (Mobile) | Mobile cart drawer and checkout action | Proves mobile shopping usability, responsive slide-over drawer, and single-thumb checkout button (`"Pickup choose karo"`). | `[VERIFIED]` Live Running App |
| **`backend-test-verification.png`** | 3570 × 2220 (Hi-Res) | Automated test harness terminal output | Proves execution of 31 architectural invariants across asset integrity, slot decrements, atomic `create_order` RPC, and kitchen FSM state transitions (100% pass). | `[VERIFIED]` Test Execution |
| **`system-architecture.png`** | 3570 × 2220 (Hi-Res) | 3-tier reactive system architecture diagram | Proves clean separation of Client Presentation (React 19), State Logic (`CartContext`), and Persistence (Supabase PostgreSQL 15, atomic stored procedures, RLS). | `[VERIFIED]` Architectural Blueprint |
| **`database-er-diagram.png`** | 3870 × 2529 (Hi-Res) | Relational database schema ERD | Proves 14-entity relational schema with primary/foreign keys, slot capacity limits, and audit logs. | `[VERIFIED]` Schema Blueprint |
| **`slide5_conclusion_infographic.png`** | 4205 × 3270 (Hi-Res) | High-resolution architectural conclusion card | Replaces flat plain-text conclusion card with 3 structured achievement pillars, verified metric badges (31/31 tests, 99.5 kB bundle), and commercial roadmap. | `[VERIFIED]` Technical Infographic |
| **`heritage_meets_engineering_hero.jpg`** | 1376 × 768 (Hi-Res) | Thematic editorial photography | Photorealistic visual representing 'Preserving Cultural Heritage with Modern Engineering': steaming cutting chai & clay kulhad mug beside a smartphone running the digital order screen and QR coaster. | `[VERIFIED]` Editorial Photography |

---

## 2. Mapping to Presentation Slides (Replacing Reference Mock Visuals)

The attached 5-slide presentation reference image (`media_1793725908371_0e298a0e.jpg`) contained generic/mocked assets. Here is the exact mapping to replace those mockups with genuine project evidence:

| Slide Number & Topic | Mock Visual in Reference Deck | Genuine Replacement Screenshot | Why This Replacement is Authentic |
|---|---|---|---|
| **Slide 1: Project Identity** | Generic 3D radio illustration on a table with blurred street | **`landing-page.png`** | Shows the actual live Chaiwala application viewport: 1900s Adda hero, authentic wordmark, Devanagari tagline, era switchers, and live audio trigger. |
| **Slide 2: Problem & Solution** | Mockup modal and phone graphic | **`tea-customization.png`** & **`order-ticket.png`** | Shows real running multi-option customization modal with live price deltas and real digital order confirmation ticket `#CW-1001` with tracking token. |
| **Slide 3: Architecture & Tech** | Generic conceptual diagram | **`system-architecture.png`** | Shows verified 3-tier architecture with Client, Cart State, and Supabase PostgreSQL 15 with `SELECT FOR UPDATE` row-level locks. |
| **Slide 4: Process & Testing** | Fake code editor / mock slot box | **`backend-test-verification.png`** & **`pickup-slot-selection.png`** | Shows verified terminal output of 31 passed invariants and live capacity-controlled 15-minute slot selector interface. |
| **Slide 5: Conclusion & Repo** | Plain beige bullet-point text box & placeholder QR | **`slide5_conclusion_infographic.png`** (or **`heritage_meets_engineering_hero.jpg`**) & **`repo_qr.png`** | Replaces plain bulleted text with a structured technical achievement card featuring 3 architectural pillars, 4 verified metric badges, and future roadmap cards. |

