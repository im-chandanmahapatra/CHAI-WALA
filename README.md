# Chaiwala — Chai Across Generations

> *“Waqt badla. Baithak wahi.”* (Time changes. The gathering remains.)  
> A Subcontinental Craft Chai & Dual-Era Counter Order System bridging nostalgic 1900s Indian 'Adda' culture with modern 2020s café-speed ordering.

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

---

## ☕ Overview

**Chaiwala** is a cinematic, QR-first web application designed to solve peak-hour counter congestion at artisan tea stalls and modern cafés. Traditional tea counters face chaotic morning and evening rushes where blind queues form and orders bottleneck. Chaiwala introduces **15-minute capacity-controlled pickup windows** paired with an evocative, dual-era digital ordering ritual that honors heritage tea culture while providing modern digital efficiency.

### Key Pillars

1. **Dual-Era Curated Atmosphere & Menus:**
   - **1900s Adda:** Warm brass aesthetics (`#C89A44`), clay kulhads, authentic ginger and elaichi chai, bun maska, and a continuous vintage broadcast soundtrack.
   - **2020s Café:** Lilac and modern tones (`#A995FF`), iced matcha lattes, brown sugar boba, butter croissants, and a curated 35-track local café radio library.
   - Pure CSS custom property theming ensures instantaneous zero-reload transitions.

2. **Native Audio Station with Precision Seek Bar:**
   - **No. 03 Chaiwala Radio:** Integrated audio player supporting play/pause, playlist navigation, and live volume adjustment.
   - **Precision Draggable Seek Bar:** Smooth drag-and-drop scrubbing to exact timestamps (e.g. `01:35`) with live synchronization and HTTP 206 byte-range streaming support.
   - **Dynamic Island & Theatre Mode:** Sticky miniature capsule with animated waveforms for global playback and an immersive ambient listening mode.

3. **15-Minute Capacity-Controlled Pickup Windows:**
   - Real-time slot availability (`AVAILABLE`, `FILLING_FAST`, `FULL`) strictly capping orders (default: 6 per window) to smooth counter throughput.
   - Database row-level locks prevent race conditions during high concurrency.

4. **Digital Ticket Fulfillment & 7-State FSM:**
   - Instant ticket issuance (`#CW-1001`) with cryptographic tracking tokens (`cwtk_*`).
   - Finite State Machine lifecycle: `PENDING` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `READY_FOR_PICKUP` ➔ `COMPLETED`.

5. **Resilient Dual-Mode Storage Architecture:**
   - Cloud persistence via Supabase PostgreSQL with full Row-Level Security (RLS) policies.
   - 100% offline fallback via local storage mock adapter when environment credentials are unset, ensuring smooth viva demonstrations anywhere.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or pnpm
- Python 3.10+ (for end-to-end testing suite)

### 1. Installation

```powershell
# Clone the repository
git clone https://github.com/im-chandanmahapatra/CHAI-WALA.git
cd CHAI-WALA

# Install dependencies
cd client
npm install
cd ..
```

### 2. Run Local Development Server

```powershell
cd client
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Production Build

```powershell
cd client
npm run build
```

The optimized bundle is output to `client/dist/`.

---

## 🧪 Testing & Verification

The project includes an automated end-to-end test suite written with Playwright that verifies 10 comprehensive audio streaming and user interaction scenarios:

```powershell
# Run the 10-scenario audio and UI test suite
python tests/test_music_integration.py
```

All 10 scenarios verify:
- Initial station rendering and lazy audio element mounting
- Theme-aware playlist switching (90s Adda stream vs. 2020s Café 35-track library)
- Transport controls (Next/Previous track skipping)
- Accurate draggable seek-bar scrubbing to `01:35`
- Volume adjustments and mute toggling
- Mobile layout responsiveness (390×844)
- Zero console errors and single `<audio>` DOM instance integrity

---

## 📂 Repository Structure

```text
CHAIWALA/
├── artifacts/
│   └── screenshots/              # Evidence screenshots & visual index
├── client/                       # Frontend application (React 19 + Vite 6)
│   ├── public/
│   │   ├── audio/
│   │   │   ├── 2000s/            # 35 local audio tracks for 2020s Café
│   │   │   ├── 2000s-manifest.json
│   │   │   └── 90s_playlist.mp3  # Continuous stream for 1900s Adda
│   │   └── images/               # Food, beverage, and campaign photography
│   ├── src/
│   │   ├── components/
│   │   │   ├── audio/            # EraRadio, AudioSeekBar, DynamicIslandPlayer
│   │   │   ├── hero/             # CinematicHero, EraSwitcher
│   │   │   ├── menu/             # EraMenuSection, ProductCard, FeaturedPairing
│   │   │   └── order/            # OrderRitual, CustomizationDrawer, Ticket
│   │   ├── context/              # CartContext
│   │   ├── lib/                  # radio-audio, cafe-library-manifest, ordering
│   │   └── styles/               # player-saas.css, premium.css
├── docs/
│   ├── presentation/             # Viva factsheet, PPT deck, presentation script
│   ├── ARCHITECTURE.md           # System architecture, schemas, and design tokens
│   └── DEVELOPMENT.md            # Developer workflows, testing, and deployment
├── scripts/                      # Report builders and visual diagram generators
├── supabase/
│   └── migrations/               # PostgreSQL schema, tables, and RLS policies
├── tests/
│   └── test_music_integration.py # 10-scenario automated Playwright test suite
├── .gitignore
└── README.md
```

---

## 📚 Documentation

For in-depth technical documentation, refer to:
- [System Architecture & Technical Specifications](docs/ARCHITECTURE.md)
- [Developer & Operations Guide](docs/DEVELOPMENT.md)
- [Project Quick Reference & Viva Factsheet](docs/presentation/Project_Quick_Reference.md)

---

## 🎓 Academic Context

- **Course:** Master of Computer Applications (MCA), Batch 2025–27
- **Institution:** Srusti Academy of Management and Technology (Autonomous), Bhubaneswar
- **Student Author:** Chandan Mahapatra
- **Repository:** [https://github.com/im-chandanmahapatra/CHAI-WALA](https://github.com/im-chandanmahapatra/CHAI-WALA)
