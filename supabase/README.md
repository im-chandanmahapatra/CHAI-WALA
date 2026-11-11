# Supabase Database Schema (`supabase/`)

> [!NOTE]
> This PostgreSQL schema belongs to the **V1 (`client/`) application**. Chaiwala **V2 (`v2/`)** uses Google Sheets + Google Apps Script (`v2/apps-script/Code.gs`) instead of Supabase.

---

## Module Purpose

Defines the relational PostgreSQL 15+ schema, Row-Level Security (RLS) policies, and transactional RPC stored procedures for the V1 React client (`client/`).

## Files

- [`migrations/20261025_init_schema.sql`](migrations/20261025_init_schema.sql) — Complete initial migration.

---

## Schema Highlights

### Enum Types
- `order_status`: `PENDING`, `CONFIRMED`, `PREPARING`, `READY_FOR_PICKUP`, `COMPLETED`, `REJECTED`, `CANCELLED`
- `mood_type`: `ADDA`, `CLASSICS`, `LAB`
- `category_type`: `CHAI`, `SNACKS`, `DESSERTS`, `SPECIALS`

### Tables (`14` total)
`stores`, `products`, `option_groups`, `option_choices`, `pickup_slots`, `orders`, `order_items`, `order_item_options`, `order_status_history`, `admin_users`, `kitchen_stations`, `audit_logs`, `coupons`, `customer_feedbacks`.

### Stored Procedures (RPCs)
- **`create_order(p_slot_id, p_customer_name, p_customer_phone, p_customer_email, p_customer_notes, p_items)`**
  - Locks the selected `pickup_slots` row with `SELECT ... FOR UPDATE` to prevent race overbooking.
  - Re-prices items and option deltas from `products` and `option_choices`, applies 5% GST and flat ₹10 (`1000` paise) packaging, generates `#CW-XXXX` and `cwtk_*` tracking tokens, increments `pickup_slots.booked`, and inserts the initial `PENDING` history event.
- **`transition_order_status(p_order_id, p_to_status, p_reason)`**
  - Enforces allowed finite state transitions, blocks updates on terminal states (`COMPLETED`, `REJECTED`, `CANCELLED`), records `order_status_history`, and releases slot capacity on cancellation/rejection.

---

## Applying the Migration (V1 Only)

```powershell
# Using Supabase CLI
supabase db push
```

Or execute [`migrations/20261025_init_schema.sql`](migrations/20261025_init_schema.sql) directly inside the Supabase SQL Editor, then configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `client/.env.local`.
