# Chaiwala — System Architecture & Technical Specifications

> **System Name:** Chaiwala — Chai Across Generations  
> **Architecture Scope:** Dual-Era Web Client, Audio Engine, State Domain, and Resilient Storage Contract  
> **Tech Stack:** React 19, TypeScript 5.8, Vite 6, Tailwind CSS 3.4, HTML5 Audio / Web Audio, Supabase PostgreSQL

---

## 1. High-Level Architecture Overview

Chaiwala is architected as a high-performance, QR-first, multi-generation web application. The platform provides an immersive dining and ordering experience by seamlessly bridging two generational contexts:
1. **1900s Adda:** Nostalgic brass aesthetics, clay kulhad chai, cutting glasses, vintage radio broadcasts, and traditional accompaniments.
2. **2020s Café:** Minimalist modern typography, iced matcha, boba tea, cold brew, and a curated 35-track local café radio playlist.

The system is decoupled into four foundational layers:

```
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│   (React 19 Components, CSS Custom Property Theming)    │
│   • CinematicHero  • EraSwitcher  • EraRadio           │
│   • DynamicIslandPlayer • ProductCard • OrderRitual    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Audio Subsystem                     │
│   (HTML5 Audio Engine, Range 206 Streaming Adapter)   │
│   • RadioAudio Controller (radio-audio.ts)             │
│   • Dual Playlist Engine (90s Adda / 2000s Café)       │
│   • Local 35-Track Verified Manifest                   │
│   • Interactive Draggable Seek-Bar Synchronizer        │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                  State & Ordering Domain               │
│   • CartContext (Global Cart, Quantities, Options)     │
│   • Capacity-Controlled 15-Minute Pickup Windows       │
│   • Cryptographic Token Generation (cwtk_*)            │
│   • 7-State Order Fulfillment Finite State Machine     │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│               Persistence & Backend Contract           │
│   • Resilient Storage Adapter (localStorage Fallback)  │
│   • Supabase PostgreSQL (Categories, Products, Orders) │
│   • Row-Level Security (RLS) & Atomic Locking          │
└────────────────────────────────────────────────────────┘
```

---

## 2. Dual-Era Visual Design System

The visual identity is founded on **"Waqt badla. Baithak wahi."** (Time changes. The gathering remains.) Rather than loading separate applications or reloading pages, theme transitions are executed entirely through **CSS Custom Properties** on the document root, ensuring 0ms layout shifts.

### 2.1 Color Tokens & Thematic Roles

| Token | Name | 1900s Adda | 2020s Café | Role |
|---|---|---|---|---|
| `--ink` | Carbon Canvas | `#101113` | `#101113` | Primary dark surface background |
| `--milk` | Warm Paper | `#F4EEE5` | `#F4EEE5` | Primary high-contrast light typography |
| `--gold` | Adda Brass | `#C89A44` | `#936E42` | 1900s accent, vintage radio dial, kulhad tones |
| `--pink` | Café Pink | `#EF739C` | `#EF739C` | Vibrant modern editorial highlight |
| `--lilac` | Now Lilac | `#A995FF` | `#A995FF` | 2020s ambient glow, dynamic island highlights |
| `--hot` | Chai Vermilion | `#F04E30` | `#F04E30` | Critical actions, bag count badges, warnings |

### 2.2 Typography Scale

- **Display Face:** `Bricolage Grotesque` — High-impact, editorial titles and headline banners.
- **Warm Editorial Face:** `Fraunces` — Expressive serif styling for prices, heritage quotes, and era highlights.
- **UI & System Face:** `DM Sans` / `system-ui` — Clean, legible numerals, customization modals, and tickets.

---

## 3. Audio Subsystem Architecture

The audio architecture implements an unified singleton audio pipeline (`client/src/lib/radio-audio.ts`) providing robust playback across all UI touchpoints without competing audio instances.

### 3.1 Dual Playlist Engine

1. **1900s Adda Soundtrack:**
   - Continuous authentic vintage broadcast audio stream (`/audio/90s_playlist.mp3`).
   - Paired with cassette/walkman deck visualizations, tape-warble cues, and analog styling.

2. **2020s Café Playlist (35-Track Local Library):**
   - Full integration of the local `2000's` music collection converted to web-optimized static assets under `client/public/audio/2000s/`.
   - Strongly-typed manifest (`client/src/lib/cafe-library-manifest.ts` and `client/public/audio/2000s-manifest.json`).
   - Track metadata extraction: Identified title, verified artist, duration in seconds, file size, and identification status.
   - Fallback protection: Unverified audio files gracefully degrade to `Unknown Track {NN}` while remaining fully seekable and playable.

### 3.2 Draggable Seek-Bar Synchronization

The seek bar (`client/src/components/audio/AudioSeekBar.tsx`) solves standard HTML5 slider lag:
- **Instant Drag Scrubbing:** Local state decouples scrubbing from intermittent `timeupdate` events to prevent visual stuttering.
- **Accurate Time Display:** Formats current time and total duration (`mm:ss`) in real time during seek operations.
- **Browser Event Binding:** Binds `pointerdown`, `pointermove`, and `pointerup` (plus range change events) directly to `audio.currentTime = targetTime`.
- **HTTP 206 Partial Content Support:** Compatible with byte-range requests for sub-second seeking anywhere within multi-megabyte audio tracks.

### 3.3 Audio Player Surfaces

- **No. 03 Chaiwala Radio (`client/src/components/audio/EraRadio.tsx`):** The primary station on the landing page with generation-aware track info, playback toggles, and transport controls.
- **Dynamic Island Mini Player (`client/src/components/audio/DynamicIslandPlayer.tsx`):** Sticky, floating compact capsule with real-time waveform animation, track display, and seek bar.
- **Theatre Mode Overlay (`client/src/components/audio/TheatreModeOverlay.tsx`):** Fullscreen immersive ambient listening space with synchronized aesthetic visuals.

---

## 4. State Management & Ordering Domain

State is managed through clean React context and domain-specific handlers with zero heavy state library overhead.

### 4.1 Cart & Customization (`CartContext.tsx`)

- **Cart Items:** Identified by unique compound keys: `${productId}:${size}:${sugar}:${spice}`.
- **Paise Pricing:** Prices are calculated and stored in integer paise (₹1 = 100 paise) to eliminate floating-point rounding errors during tax and packaging calculations.
- **Product Options:** Supports multi-group option selection (e.g. Cutting 120ml vs. Kulhad 220ml, sugar levels 0%–100%, cardamom/ginger spice infusions).

### 4.2 Capacity-Controlled Pickup Windows

- **15-Minute Windows:** Pickup slots are computed in rolling 15-minute intervals starting from current clock time.
- **Capacity Smoothing:** Default capacity limit of 6 concurrent orders per window prevents rush-hour counter congestion.
- **State Categories:**
  - `AVAILABLE` (0–3 orders booked)
  - `FILLING_FAST` (4–5 orders booked)
  - `FULL` (6 orders booked — selection disabled)

### 4.3 Order Ticket Finite State Machine (FSM)

Each placed order generates a human-readable identifier (`#CW-1001`) and a cryptographic tracking token (`cwtk_${timestamp}_${random}`), transitioning through 7 deterministic states:

```
[ PENDING ] ──► [ CONFIRMED ] ──► [ PREPARING ] ──► [ READY_FOR_PICKUP ] ──► [ COMPLETED ]
       │                                                     
       └──► [ CANCELLED ]                                    
       │                                                     
       └──► [ REFUNDED ]                                     
```

---

## 5. Persistence & Database Contract

### 5.1 Dual-Mode Resilience Architecture

The application operates seamlessly in two environments:
1. **Cloud Production (Supabase):** Full PostgreSQL backend with Row-Level Security, RPC functions, and relational integrity.
2. **Offline / Prototype Mode (`localStorage`):** When Supabase environment variables are unset, the client automatically switches to a local mock adapter that fully honors order validation, pickup capacity limits, and ticket persistence across reloads.

### 5.2 Database Schema Diagram

```
┌────────────────────┐       ┌────────────────────────┐
│     categories     │       │        products        │
├────────────────────┤       ├────────────────────────┤
│ id (UUID, PK)      │◄──────┤ category_id (UUID, FK) │
│ slug (TEXT)        │       │ id (UUID, PK)          │
│ name (TEXT)        │       │ name (TEXT)            │
│ era (TEXT)         │       │ base_price_paise (INT) │
└────────────────────┘       └───────────┬────────────┘
                                         │
                             ┌───────────┴────────────┐
                             │ product_customizations │
                             ├────────────────────────┤
                             │ id (UUID, PK)          │
                             │ product_id (UUID, FK)  │
                             │ group_name (TEXT)      │
                             │ option_name (TEXT)     │
                             │ price_delta_paise (INT)│
                             └────────────────────────┘

┌────────────────────┐       ┌────────────────────────┐
│    pickup_slots    │       │         orders         │
├────────────────────┤       ├────────────────────────┤
│ id (UUID, PK)      │◄──────┤ slot_id (UUID, FK)     │
│ start_time (TIMEST)│       │ id (UUID, PK)          │
│ max_capacity (INT) │       │ ticket_number (TEXT)   │
│ current_load (INT) │       │ status (TEXT)          │
└────────────────────┘       │ total_paise (INT)      │
                             └───────────┬────────────┘
                                         │
                             ┌───────────┴────────────┐
                             │      order_items       │
                             ├────────────────────────┤
                             │ id (UUID, PK)          │
                             │ order_id (UUID, FK)    │
                             │ product_id (UUID, FK)  │
                             │ quantity (INT)         │
                             │ final_price_paise (INT)│
                             └────────────────────────┘
```

### 5.3 Concurrency & Database Locking

Under live PostgreSQL execution, concurrent checkout requests for identical pickup slots are guarded with transactional `SELECT ... FOR UPDATE` row locks inside the `create_order` stored procedure, guaranteeing zero over-booking anomalies under high traffic.

