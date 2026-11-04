# Chaiwala — Project Quick Reference Sheet

> **Document Type:** Project Factsheet & Viva Cheat-Sheet  
> **Course / Program:** Master of Computer Applications (MCA), Batch 2025–27  
> **Institution:** Srusti Academy of Management and Technology (Autonomous), Bhubaneswar  
> **Student Author:** [STUDENT NAME] (Chandan Mahapatra)  
> **GitHub Repository:** `https://github.com/im-chandanmahapatra/CHAI-WALA`  
> **Project Period:** September 1, 2026 – October 31, 2026 | Submission: November 2026

---

## 1. Project Overview & Elevator Pitch

- **Project Title:** **CHAIWALA — Chai Across Generations**
- **Sub-title / Formal Scope:** *Subcontinental Craft Chai & Dual-Era Counter Order System*
- **Brand Line:** *“Waqt badla. Baithak wahi.”* (Time changes. The gathering remains.)
- **One-Sentence Elevator Pitch:**  
  *A cinematic, QR-first web application bridging nostalgic 1900s Indian 'Adda' culture with modern 2020s café-speed ordering, powered by React 19 and capacity-controlled PostgreSQL pickup slots to eliminate rush-hour counter congestion.*

---

## 2. Problem & Solution Summary

| Aspect | Real-World Reality | Chaiwala Solution |
|---|---|---|
| **Counter Congestion** | Chaotic crowds gather during morning/evening peak tea breaks; blind wait times. | **15-Min Capacity Slots**: Limits each window to 6 orders, smoothing counter traffic. |
| **User Experience** | Impersonal food-delivery aggregators erase cultural tea-counter camaraderie. | **Dual-Era Storytelling**: Instant toggle between nostalgic 1900s Adda and 2020s Café. |
| **Order Concurrency** | Multiple simultaneous orders cause kitchen overload and dropped tickets. | **Atomic DB Locking**: PostgreSQL `SELECT FOR UPDATE` prevents double-booking. |
| **Deployment Barrier** | Cloud-only apps fail if venue Wi-Fi drops or API keys expire. | **Resilient Dual Mode**: Full cloud Supabase backend + 100% offline `localStorage` mock. |

---

## 3. Four Core Verified Features

1. **Dual-Era Curated Catalogue & Ambient Sound:**
   - **1900s Adda:** Warm brass (`#C89A44`), clay kulhads, ginger/cardamom chai, bun maska, vintage radio deck.
   - **2020s Café:** Lilac palette (`#A995FF`), iced matcha latte, brown sugar boba, butter croissants.
   - Powered by pure CSS custom properties (`--ink`, `--milk`, `--gold`) for zero-reload theme swaps.
2. **Tactile Multi-Option Customization:**
   - Multi-group modal for cup size (Cutting 120ml vs. Kulhad Mug 220ml), sweetness levels (sugar-free to regular), and spice additions.
   - Dynamic real-time price updates calculated on every option toggle.
3. **Capacity-Controlled 15-Minute Pickup Windows:**
   - Slots dynamically categorized as `AVAILABLE`, `FILLING_FAST`, or `FULL`.
   - Hard capacity limit (default: 6 orders/window) enforced at database transaction boundary.
4. **Digital Ticket Fulfillment & State Tracking:**
   - Instant ticket generation (`#CW-1001`) with cryptographic tracking token (`cwtk_...`).
   - 7-state Finite State Machine (FSM): `PENDING` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `READY_FOR_PICKUP` ➔ `COMPLETED`.

---

## 4. Verified Technology Stack by Tier

```
┌──────────────────────────────────────────────────────────────────┐
│                   CLIENT PRESENTATION TIER                       │
│  React 19.0.0 • Vite 6.1.0 • TypeScript 5.7.3 • Lucide React     │
│  HTML5 Web Audio API • Pure CSS Custom Property Design Tokens    │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
┌─────────────────────────────────▼────────────────────────────────┐
│               STATE & BUSINESS LOGIC TIER                        │
│  React Context (CartContext) • Integer Paise Financial Engine    │
│  5% GST & Packaging Calculations • 15-Min Slot Interval Manager  │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
          ┌───────────────────────┴───────────────────────┐
          │ (Online Mode)                                 │ (Offline Demo)
┌─────────▼───────────────────────┐             ┌─────────▼───────────────┐
│     SUPABASE PERSISTENCE        │             │  LOCAL MOCK PERSISTENCE │
│ PostgreSQL 15 Relational DB     │             │ PostgREST-compatible    │
│ 14 Tables • Row Level Security  │             │ Browser localStorage    │
│ Atomic PL/pgSQL Stored Procs    │             │ Zero-setup demo adapter │
│ (create_order / FSM transition) │             │ (MockSupabaseBackend)   │
└─────────────────────────────────┘             └─────────────────────────┘
```

- **Frontend:** React 19.0.0, Vite 6.1.0, TypeScript 5.7.3, Lucide React (vector icons), Web Audio API (era radio).
- **Styling:** Vanilla CSS design tokens (`client/src/styles/premium.css`), zero UI runtime overhead, responsive from 390px mobile to 1440px desktop.
- **Backend / Database:** Supabase (PostgreSQL 15), 14 relational tables, PL/pgSQL stored procedures.
- **Mock Layer:** Client-side PostgREST emulator in `client/src/lib/supabase.ts`.
- **Testing & Quality:** Node.js automated test runner (`.qa-order-tests.mjs`) with 31 invariants; Playwright E2E verification.
- **Build Metrics:** 99.5 kB gzipped JavaScript bundle; 12.8 kB gzipped CSS; 11.07-second production build.

---

## 5. Development Workflow & Reconstructed AI Prompts

### Systematic 5-Stage Lifecycle
1. **Requirements & Cultural PRD:** Documented in `PRD.md` and `RESEARCH.md` — defining adda social rituals and queue mitigation.
2. **Design Tokens & Visual Language:** Documented in `DESIGN_SYSTEM.md` and `V2_DESIGN_RESEARCH.md` — Fraunces display typography, DM Sans UI, brass/vermilion tokens.
3. **Relational Schema & Concurrency Engineering:** Implemented in `supabase/migrations/20261025_init_schema.sql` — row locking, table schemas, RLS policies.
4. **Reactive Component Implementation:** React 19 components (`CinematicHero`, `EraSwitcher`, `DynamicIslandPlayer`, `OrderPage`).
5. **Automated Verification:** 31-invariant test harness ensuring zero regressions across pricing, slot decrements, and terminal state transitions.

### Key Prompt Examples (Reconstructed from Codebase Architecture)
- **Concurrency Locking Prompt:**  
  *“Write an atomic PostgreSQL function for a tea counter that reserves a 15-minute slot using SELECT FOR UPDATE to prevent race conditions during rush hours.”*
- **Design Token Prompt:**  
  *“Design a CSS custom property system that switches seamlessly between an authentic 1900s brass Adda theme and a modern lilac Café theme without page reload.”*
- **Financial State Prompt:**  
  *“Implement a persistent React 19 cart context with paise-precision financial calculations (5% GST, packaging fee) and a dual-adapter pattern supporting both Supabase RPC and local mock storage.”*

---

## 6. Technical Glossary (Fast Definitions for Viva)

| Term | Simple Definition for Evaluators |
|---|---|
| **Paise-Precision Arithmetic** | Storing currency in lowest denomination integers (₹25.00 = 2500 paise) to eliminate JavaScript IEEE-754 floating-point rounding bugs during GST calculation. |
| **`SELECT FOR UPDATE`** | A PostgreSQL SQL clause that places an exclusive row-level lock on a pickup slot record during an active transaction, ensuring two customers cannot book the final spot simultaneously. |
| **Finite State Machine (FSM)** | A strict mathematical model governing order states (`PENDING` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `READY` ➔ `COMPLETED`). Prevents illegal state transitions (e.g., cancelling an already completed order). |
| **Row Level Security (RLS)** | PostgreSQL security policies ensuring that anonymous customers can only query order records matching their specific cryptographic `tracking_token`. |
| **Idempotency Token** | A unique cryptographic hash (`cwtk_...`) passed with the order request that prevents accidental double-charging if a user clicks "Order" twice on a slow connection. |
| **Dual-Adapter Pattern** | An architectural abstraction in `client/src/lib/ordering.ts` that transparently switches between live Supabase PostgREST endpoints and browser `localStorage` mock data. |

---

## 7. Current Project Limitations & Future Scope

### Acknowledged Limitations
1. **Academic Project Name:** The name *Chaiwala* is an academic demonstration label; commercial deployment would require formal trademark clearance.
2. **Payment Gateway:** Currently operates on payment-at-counter or local mock confirmation; real UPI payment integration is staged for the production phase.
3. **Opt-In Audio:** Ambient radio playback requires an explicit customer click due to browser autoplay policies and to avoid unexpected sound during college presentations.

### Future Enhancements
- **Kitchen Display System (KDS):** Tablet interface for counter baristas using Supabase Realtime subscriptions to update order statuses live.
- **UPI Deep-Linking:** Integration with Razorpay / PhonePe QR intents for instant payment settlement.
- **Progressive Web App (PWA):** Service worker asset caching for instant offline app loading.

