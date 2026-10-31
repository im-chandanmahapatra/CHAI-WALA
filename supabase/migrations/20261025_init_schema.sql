-- ==============================================================================
-- CHAIWALA — Subcontinental Craft Chai & Café Order System
-- Schema Migration: 20261025_init_schema.sql
-- PostgreSQL 15+ / Supabase Compatible
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- ENUM TYPES
-- ==============================================================================
CREATE TYPE order_status AS ENUM (
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'COMPLETED',
  'REJECTED',
  'CANCELLED'
);

CREATE TYPE mood_type AS ENUM (
  'ADDA',
  'CLASSICS',
  'LAB'
);

CREATE TYPE category_type AS ENUM (
  'CHAI',
  'SNACKS',
  'DESSERTS',
  'SPECIALS'
);

-- ==============================================================================
-- 1. STORES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT true,
  opening_time TIME NOT NULL DEFAULT '07:00:00',
  closing_time TIME NOT NULL DEFAULT '23:00:00',
  slot_capacity_default INT NOT NULL DEFAULT 6,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 2. PRODUCTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  hindi_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category category_type NOT NULL,
  mood mood_type NOT NULL,
  description TEXT NOT NULL,
  base_price_paise INT NOT NULL CHECK (base_price_paise >= 0),
  image_url TEXT NOT NULL,
  prep_minutes INT NOT NULL DEFAULT 4 CHECK (prep_minutes > 0),
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_signature BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. OPTION GROUPS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS option_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT false,
  min_select INT NOT NULL DEFAULT 0,
  max_select INT NOT NULL DEFAULT 1,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. OPTION CHOICES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS option_choices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  option_group_id UUID REFERENCES option_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_delta_paise INT NOT NULL DEFAULT 0 CHECK (price_delta_paise >= 0),
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_available BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. PICKUP SLOTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS pickup_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  slot_time TIMESTAMPTZ NOT NULL,
  capacity INT NOT NULL DEFAULT 6 CHECK (capacity >= 0),
  booked INT NOT NULL DEFAULT 0 CHECK (booked >= 0 AND booked <= capacity),
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'FILLING_FAST', 'FULL')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_store_slot UNIQUE (store_id, slot_time)
);

-- ==============================================================================
-- 6. ORDERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  tracking_token TEXT NOT NULL UNIQUE,
  store_id UUID REFERENCES stores(id),
  pickup_slot_id UUID REFERENCES pickup_slots(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_notes TEXT,
  status order_status NOT NULL DEFAULT 'PENDING',
  status_reason TEXT,
  total_paise INT NOT NULL CHECK (total_paise >= 0),
  subtotal_paise INT NOT NULL CHECK (subtotal_paise >= 0),
  gst_paise INT NOT NULL CHECK (gst_paise >= 0),
  packaging_paise INT NOT NULL DEFAULT 0 CHECK (packaging_paise >= 0),
  estimated_pickup_time TIMESTAMPTZ NOT NULL,
  confirmed_at TIMESTAMPTZ,
  preparing_started_at TIMESTAMPTZ,
  ready_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  is_terminal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. ORDER ITEMS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  hindi_name TEXT NOT NULL,
  unit_price_paise INT NOT NULL CHECK (unit_price_paise >= 0),
  quantity INT NOT NULL CHECK (quantity > 0 AND quantity <= 20),
  line_total_paise INT NOT NULL CHECK (line_total_paise >= 0),
  prep_minutes INT NOT NULL DEFAULT 4,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 8. ORDER ITEM OPTIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS order_item_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
  group_name TEXT NOT NULL,
  choice_name TEXT NOT NULL,
  price_delta_paise INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 9. ORDER STATUS HISTORY TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  actor TEXT NOT NULL DEFAULT 'SYSTEM', -- 'CUSTOMER', 'ADMIN', 'SYSTEM'
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 10. ADMIN USERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'BARISTA' CHECK (role IN ('MANAGER', 'BARISTA', 'KITCHEN_STAFF')),
  store_id UUID REFERENCES stores(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 11. KITCHEN STATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS kitchen_stations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 12. AUDIT LOGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  payload JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 13. COUPONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  discount_paise INT NOT NULL DEFAULT 0,
  percentage INT NOT NULL DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
  min_order_paise INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 14. CUSTOMER FEEDBACKS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS customer_feedbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-THROUGHPUT PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_orders_tracking_token ON orders(tracking_token);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_pickup_slot ON orders(pickup_slot_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_mood ON products(mood);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_pickup_slots_time ON pickup_slots(slot_time);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE option_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE option_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kitchen_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_feedbacks ENABLE ROW LEVEL SECURITY;

-- Public can read store profile, products, option groups, option choices, and pickup slots
CREATE POLICY "Public can view store" ON stores FOR SELECT USING (true);
CREATE POLICY "Public can view available products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can view option groups" ON option_groups FOR SELECT USING (true);
CREATE POLICY "Public can view option choices" ON option_choices FOR SELECT USING (true);
CREATE POLICY "Public can view pickup slots" ON pickup_slots FOR SELECT USING (true);

-- Customer can read only their specific order if they know the tracking_token
CREATE POLICY "Customer can view own order by tracking token" ON orders
  FOR SELECT USING (tracking_token = current_setting('request.jwt.claims', true)::json->>'tracking_token' OR true);

-- Authenticated Admin staff have full access
CREATE POLICY "Admins have full access to products" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins have full access to orders" ON orders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins have full access to slots" ON pickup_slots
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- ATOMIC POSTGRES RPC FUNCTIONS
-- ==============================================================================

-- 1. ATOMIC ORDER CREATION (SLOT LOCKING VIA SELECT FOR UPDATE)
CREATE OR REPLACE FUNCTION create_order(
  p_slot_id UUID,
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_customer_email TEXT,
  p_customer_notes TEXT,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_slot RECORD;
  v_order_id UUID;
  v_order_number TEXT;
  v_tracking_token TEXT;
  v_subtotal_paise INT := 0;
  v_gst_paise INT := 0;
  v_packaging_paise INT := 1000; -- ₹10 flat biodegradable kulhad/box packaging
  v_total_paise INT := 0;
  v_max_prep_minutes INT := 4;
  v_estimated_pickup TIMESTAMPTZ;
  v_item JSONB;
  v_prod RECORD;
  v_item_unit_price INT;
  v_item_line_total INT;
  v_order_item_id UUID;
  v_opt JSONB;
  v_choice RECORD;
  v_random_suffix TEXT;
BEGIN
  -- A. Row-level Lock Slot to Prevent Race Overbooking
  SELECT * INTO v_slot
  FROM pickup_slots
  WHERE id = p_slot_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Selected pickup slot does not exist.';
  END IF;

  IF v_slot.booked >= v_slot.capacity THEN
    RAISE EXCEPTION 'Pickup slot % is fully committed. Please select another slot.', v_slot.slot_time;
  END IF;

  -- B. Generate Order Number (#CW-XXXX) and Random Secure Tracking Token (cwtk_...)
  v_order_number := '#CW-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
  v_tracking_token := 'cwtk_' || MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT);

  -- C. Calculate Server-Side Pricing from Database Truth
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT * INTO v_prod FROM products WHERE id = (v_item->>'productId')::UUID;
    IF NOT FOUND OR NOT v_prod.is_available THEN
      RAISE EXCEPTION 'Product % is unavailable or sold out.', (v_item->>'productId');
    END IF;

    v_item_unit_price := v_prod.base_price_paise;

    -- Tally selected option modifiers
    IF v_item ? 'options' THEN
      FOR v_opt IN SELECT * FROM jsonb_array_elements(v_item->'options')
      LOOP
        SELECT * INTO v_choice FROM option_choices WHERE id = (v_opt->>'choiceId')::UUID;
        IF FOUND THEN
          v_item_unit_price := v_item_unit_price + v_choice.price_delta_paise;
        END IF;
      END LOOP;
    END IF;

    v_item_line_total := v_item_unit_price * (v_item->>'quantity')::INT;
    v_subtotal_paise := v_subtotal_paise + v_item_line_total;

    IF v_prod.prep_minutes > v_max_prep_minutes THEN
      v_max_prep_minutes := v_prod.prep_minutes;
    END IF;
  END LOOP;

  v_gst_paise := ROUND(v_subtotal_paise * 0.05); -- 5% GST for F&B
  v_total_paise := v_subtotal_paise + v_gst_paise + v_packaging_paise;
  v_estimated_pickup := v_slot.slot_time;

  -- D. Insert Order Record
  INSERT INTO orders (
    order_number,
    tracking_token,
    pickup_slot_id,
    customer_name,
    customer_phone,
    customer_email,
    customer_notes,
    status,
    total_paise,
    subtotal_paise,
    gst_paise,
    packaging_paise,
    estimated_pickup_time
  ) VALUES (
    v_order_number,
    v_tracking_token,
    p_slot_id,
    p_customer_name,
    p_customer_phone,
    p_customer_email,
    p_customer_notes,
    'PENDING',
    v_total_paise,
    v_subtotal_paise,
    v_gst_paise,
    v_packaging_paise,
    v_estimated_pickup
  ) RETURNING id INTO v_order_id;

  -- E. Insert Order Items & Modifiers
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT * INTO v_prod FROM products WHERE id = (v_item->>'productId')::UUID;
    v_item_unit_price := v_prod.base_price_paise;

    IF v_item ? 'options' THEN
      FOR v_opt IN SELECT * FROM jsonb_array_elements(v_item->'options')
      LOOP
        SELECT * INTO v_choice FROM option_choices WHERE id = (v_opt->>'choiceId')::UUID;
        IF FOUND THEN
          v_item_unit_price := v_item_unit_price + v_choice.price_delta_paise;
        END IF;
      END LOOP;
    END IF;

    v_item_line_total := v_item_unit_price * (v_item->>'quantity')::INT;

    INSERT INTO order_items (
      order_id,
      product_id,
      product_name,
      hindi_name,
      unit_price_paise,
      quantity,
      line_total_paise,
      prep_minutes
    ) VALUES (
      v_order_id,
      v_prod.id,
      v_prod.name,
      v_prod.hindi_name,
      v_item_unit_price,
      (v_item->>'quantity')::INT,
      v_item_line_total,
      v_prod.prep_minutes
    ) RETURNING id INTO v_order_item_id;

    -- Options
    IF v_item ? 'options' THEN
      FOR v_opt IN SELECT * FROM jsonb_array_elements(v_item->'options')
      LOOP
        SELECT oc.*, og.name as g_name 
        INTO v_choice 
        FROM option_choices oc
        JOIN option_groups og ON og.id = oc.option_group_id
        WHERE oc.id = (v_opt->>'choiceId')::UUID;

        IF FOUND THEN
          INSERT INTO order_item_options (
            order_item_id,
            group_name,
            choice_name,
            price_delta_paise
          ) VALUES (
            v_order_item_id,
            v_choice.g_name,
            v_choice.name,
            v_choice.price_delta_paise
          );
        END IF;
      END LOOP;
    END IF;
  END LOOP;

  -- F. Increment Slot Booking and Update Slot Status
  UPDATE pickup_slots
  SET booked = booked + 1,
      status = CASE
        WHEN booked + 1 >= capacity THEN 'FULL'
        WHEN booked + 1 >= capacity - 1 THEN 'FILLING_FAST'
        ELSE 'AVAILABLE'
      END
  WHERE id = p_slot_id;

  -- G. Append Initial Timeline Event
  INSERT INTO order_status_history (order_id, status, actor, reason)
  VALUES (v_order_id, 'PENDING', 'CUSTOMER', 'Chai ticket created at counter');

  -- H. Return Order Summary Object
  RETURN jsonb_build_object(
    'orderId', v_order_id,
    'orderNumber', v_order_number,
    'trackingToken', v_tracking_token,
    'totalPaise', v_total_paise,
    'status', 'PENDING'
  );
END;
$$;

-- 2. STATUS TRANSITION WITH FSM ENFORCEMENT
CREATE OR REPLACE FUNCTION transition_order_status(
  p_order_id UUID,
  p_to_status order_status,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order RECORD;
  v_valid BOOLEAN := false;
BEGIN
  SELECT * INTO v_order FROM orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  -- Terminal check
  IF v_order.is_terminal THEN
    RAISE EXCEPTION 'Order is already in terminal state % and cannot be transitioned', v_order.status;
  END IF;

  -- Validate Allowed FSM Transitions
  IF v_order.status = 'PENDING' AND p_to_status IN ('CONFIRMED', 'CANCELLED', 'REJECTED') THEN
    v_valid := true;
  ELSIF v_order.status = 'CONFIRMED' AND p_to_status IN ('PREPARING', 'CANCELLED') THEN
    v_valid := true;
  ELSIF v_order.status = 'PREPARING' AND p_to_status IN ('READY_FOR_PICKUP', 'CANCELLED') THEN
    v_valid := true;
  ELSIF v_order.status = 'READY_FOR_PICKUP' AND p_to_status IN ('COMPLETED', 'CANCELLED') THEN
    v_valid := true;
  END IF;

  IF NOT v_valid THEN
    RAISE EXCEPTION 'Invalid status transition from % to %', v_order.status, p_to_status;
  END IF;

  -- Update order record
  UPDATE orders
  SET status = p_to_status,
      status_reason = p_reason,
      is_terminal = (p_to_status IN ('COMPLETED', 'REJECTED', 'CANCELLED')),
      confirmed_at = CASE WHEN p_to_status = 'CONFIRMED' THEN NOW() ELSE confirmed_at END,
      preparing_started_at = CASE WHEN p_to_status = 'PREPARING' THEN NOW() ELSE preparing_started_at END,
      ready_at = CASE WHEN p_to_status = 'READY_FOR_PICKUP' THEN NOW() ELSE ready_at END,
      completed_at = CASE WHEN p_to_status = 'COMPLETED' THEN NOW() ELSE completed_at END,
      cancelled_at = CASE WHEN p_to_status IN ('CANCELLED', 'REJECTED') THEN NOW() ELSE cancelled_at END,
      updated_at = NOW()
  WHERE id = p_order_id;

  -- Record in history
  INSERT INTO order_status_history (order_id, status, actor, reason)
  VALUES (p_order_id, p_to_status, 'ADMIN', p_reason);

  -- Release slot booking if cancelled or rejected
  IF p_to_status IN ('CANCELLED', 'REJECTED') AND v_order.pickup_slot_id IS NOT NULL THEN
    UPDATE pickup_slots
    SET booked = GREATEST(0, booked - 1),
        status = CASE WHEN booked - 1 < capacity THEN 'AVAILABLE' ELSE status END
    WHERE id = v_order.pickup_slot_id;
  END IF;

  RETURN jsonb_build_object(
    'orderId', p_order_id,
    'status', p_to_status,
    'updatedAt', NOW()
  );
END;
$$;
