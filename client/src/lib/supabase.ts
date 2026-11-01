/// <reference types="vite/client" />
import type { SupabaseClient } from '@supabase/supabase-js';
import { Product, Order, PickupSlot, OrderStatus } from './database.types';
import { SEED_PRODUCTS, generateDemoPickupSlots } from './seed-data';

const supabaseUrl =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_SUPABASE_URL
    : (globalThis as any).process?.env?.VITE_SUPABASE_URL;
const supabaseAnonKey =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_SUPABASE_ANON_KEY
    : (globalThis as any).process?.env?.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const storageHelper = {
  getItem: (key: string): string | null => {
    try {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  setItem: (key: string, val: string): void => {
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, val);
    } catch {}
  },
  removeItem: (key: string): void => {
    try {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
    } catch {}
  },
};

// Local In-Memory & LocalStorage Store for Offline / Demo execution
class MockSupabaseBackend {
  private products: Product[] = [];
  private orders: Order[] = [];
  private slots: PickupSlot[] = [];

  constructor() {
    this.init();
  }

  private init() {
    // Always start from the current seed so new products, copy and options ship to returning
    // browsers; only the admin-editable fields (availability, price) are restored from storage.
    let saved: Product[] = [];
    try {
      const parsed = JSON.parse(storageHelper.getItem('cw.db.products') ?? '[]');
      if (Array.isArray(parsed)) saved = parsed;
    } catch {}
    this.products = SEED_PRODUCTS.map((seed) => {
      const prev = saved.find((p) => p?.id === seed.id);
      return {
        ...seed,
        isAvailable: typeof prev?.isAvailable === 'boolean' ? prev.isAvailable : seed.isAvailable,
        basePricePaise: Number.isInteger(prev?.basePricePaise) ? prev!.basePricePaise : seed.basePricePaise,
      };
    });
    storageHelper.setItem('cw.db.products', JSON.stringify(this.products));

    // Load orders
    const savedOrders = storageHelper.getItem('cw.db.orders');
    if (savedOrders) {
      try {
        this.orders = JSON.parse(savedOrders);
      } catch {
        this.orders = [];
      }
    }

    // Load slots
    this.slots = generateDemoPickupSlots();
  }

  private save() {
    storageHelper.setItem('cw.db.products', JSON.stringify(this.products));
    storageHelper.setItem('cw.db.orders', JSON.stringify(this.orders));
  }

  public getProducts() {
    return this.products;
  }

  public updateProductAvailability(id: string, isAvailable: boolean) {
    const prod = this.products.find((p) => p.id === id);
    if (prod) {
      prod.isAvailable = isAvailable;
      this.save();
    }
    return prod;
  }

  public updateProductPrice(id: string, basePricePaise: number) {
    const prod = this.products.find((p) => p.id === id);
    if (prod) {
      prod.basePricePaise = basePricePaise;
      this.save();
    }
    return prod;
  }

  public getPickupSlots() {
    // Rebuild rolling windows and subtract persisted reservations, including after reload.
    this.slots = generateDemoPickupSlots().map(slot => {
      const booked = this.orders.filter(order => order.pickupSlot.id === slot.id && !['CANCELLED', 'REJECTED'].includes(order.status)).length;
      const remaining = Math.max(0, slot.remaining - booked);
      return { ...slot, remaining, isOpen: remaining > 0, status: remaining > 0 ? 'AVAILABLE' as const : 'FULL' as const };
    });
    return this.slots;
  }

  public getOrders() {
    return this.orders;
  }

  public getOrderByTrackingToken(token: string) {
    const order = this.orders.find((o) => o.trackingToken === token);
    if (!order) return null;

    // Recalculate dynamic ETA on read
    const activeAhead = this.orders.filter(
      (o) =>
        (o.status === 'CONFIRMED' || o.status === 'PREPARING') &&
        o.id !== order.id
    );
    const aheadPrepMinutes = activeAhead.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.prepMinutes * i.quantity, 0),
      0
    );
    const ownPrep = order.items.reduce((s, i) => s + i.prepMinutes * i.quantity, 0);

    const now = new Date();
    const slotStart = new Date(order.pickupSlot.startsAt);
    const earliestMs = now.getTime() + (aheadPrepMinutes + ownPrep) * 60 * 1000;
    const estTime = new Date(Math.max(slotStart.getTime(), earliestMs));

    // Round UP to 5 min
    const remMin = estTime.getMinutes() % 5;
    if (remMin !== 0) {
      estTime.setMinutes(estTime.getMinutes() + (5 - remMin));
    }
    estTime.setSeconds(0, 0);

    const isLate = estTime.getTime() > new Date(order.pickupSlot.endsAt).getTime();

    const formattedTime = estTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    order.estimate = order.status === 'READY_FOR_PICKUP' || order.isTerminal
      ? null
      : {
          readyAt: estTime.toISOString(),
          isLate,
          note: `Estimated ready around ${formattedTime} (estimate based on queue)`,
        };

    return order;
  }

  // Atomic order creation simulating the Postgres RPC function
  public createOrder(input: {
    items: { productId: string; quantity: number; optionIds?: string[] }[];
    pickupSlotId: string;
    customer: { name: string; phone: string; note?: string };
    idempotencyKey: string;
    requestHash: string;
  }) {
    // 1. Idempotency Check
    const existing = this.orders.find((o) => o.clientRequestId === input.idempotencyKey);
    if (existing) {
      return {
        orderNumber: existing.orderNumber,
        displayNumber: existing.displayNumber,
        trackingToken: existing.trackingToken,
        status: existing.status,
        subtotalPaise: existing.subtotalPaise,
        totalPaise: existing.totalPaise,
        isReplay: true,
      };
    }

    if (!input.items?.length || input.items.length > 100) throw new Error('Add at least one item before checkout.');
    if (!input.customer?.name?.trim() || !/^\d{10}$/.test(input.customer.phone)) throw new Error('Enter a name and 10-digit mobile number.');
    if (!input.idempotencyKey) throw new Error('Order request identifier is required.');
    // 2. Slot Validation
    this.getPickupSlots();
    const slot = this.slots.find((s) => s.id === input.pickupSlotId);
    if (!slot || !slot.isOpen) {
      throw new Error('SLOT_CLOSED: Selected pickup slot is unavailable.');
    }
    if (slot.remaining <= 0) {
      throw new Error('SLOT_FULL: Selected pickup slot has reached full capacity.');
    }

    // 3. Server-side Price Calculation from Database
    let subtotalPaise = 0;
    const orderItems = input.items.map((line, idx) => {
      const product = this.products.find((p) => p.id === line.productId);
      if (!product || !product.isAvailable || product.isArchived) {
        throw new Error(`PRODUCT_UNAVAILABLE: Product "${product?.name || line.productId}" is currently unavailable.`);
      }

      if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 20) throw new Error('Quantity must be between 1 and 20.');
      const optionIds = line.optionIds ?? [];
      if (new Set(optionIds).size !== optionIds.length) throw new Error('Duplicate customization options.');
      const allowed = product.optionGroups?.flatMap(group => group.options.filter(option => option.isAvailable).map(option => option.id)) ?? [];
      if (optionIds.some(id => !allowed.includes(id))) throw new Error('A customization is no longer available.');
      for (const group of product.optionGroups ?? []) {
        const count = group.options.filter(option => optionIds.includes(option.id)).length;
        if (count < group.minSelect || count > group.maxSelect) throw new Error('Please choose valid options for ' + group.name + '.');
      }
      let unitPricePaise = product.basePricePaise;
      const selectedOptions: { groupName: string; optionName: string; priceDeltaPaise: number }[] = [];

      if (line.optionIds && line.optionIds.length > 0 && product.optionGroups) {
        for (const grp of product.optionGroups) {
          for (const opt of grp.options) {
            if (line.optionIds.includes(opt.id) && opt.isAvailable) {
              unitPricePaise += opt.priceDeltaPaise;
              selectedOptions.push({
                groupName: grp.name,
                optionName: opt.name,
                priceDeltaPaise: opt.priceDeltaPaise,
              });
            }
          }
        }
      }

      const lineTotalPaise = unitPricePaise * line.quantity;
      subtotalPaise += lineTotalPaise;

      return {
        id: `item-${Date.now()}-${idx}`,
        productId: product.id,
        productName: product.name,
        unitPricePaise,
        quantity: line.quantity,
        lineTotalPaise,
        prepMinutes: product.prepMinutes,
        options: selectedOptions,
      };
    });

    // 4. Reserve Slot Capacity
    slot.remaining -= 1;
    if (slot.remaining === 0) slot.status = 'FULL';

    // 5. Generate Sequence & Unguessable Token
    const orderSeq = 1001 + this.orders.length;
    const token =
      'cwtk_' +
      Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

    const gstPaise = Math.round(subtotalPaise * 0.05);
    const packagingPaise = 1000;
    const totalPaise = subtotalPaise + gstPaise + packagingPaise;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderSeq,
      displayNumber: `CW-${orderSeq}`,
      trackingToken: token,
      clientRequestId: input.idempotencyKey,
      status: 'PENDING_CONFIRMATION',
      statusLabel: 'Waiting for café confirmation',
      isTerminal: false,
      pickupSlot: {
        id: slot.id,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
      },
      customerName: input.customer.name.trim(),
      customerPhone: input.customer.phone.trim(),
      customerNote: input.customer.note?.trim() || null,
      paymentMethod: 'CASH_AT_PICKUP',
      subtotalPaise,
      totalPaise,
      items: orderItems,
      timeline: [
        {
          status: 'PENDING_CONFIRMATION',
          at: new Date().toISOString(),
          actor: 'CUSTOMER',
        },
      ],
      estimate: {
        readyAt: slot.startsAt,
        isLate: false,
        note: 'Estimate only — queued behind existing orders',
      },
      createdAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    this.save();

    return {
      id: newOrder.id,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      displayNumber: newOrder.displayNumber,
      trackingToken: newOrder.trackingToken,
      subtotalPaise: newOrder.subtotalPaise,
      gstPaise,
      packagingPaise,
      totalPaise: newOrder.totalPaise,
      status: newOrder.status,
    };
  }

  // FSM Transition simulation
  public transitionOrderStatus(orderId: string, toStatus: OrderStatus, reason?: string) {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING_CONFIRMATION: ['CONFIRMED', 'REJECTED', 'CANCELLED'],
      CONFIRMED: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY_FOR_PICKUP', 'CANCELLED'],
      READY_FOR_PICKUP: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      REJECTED: [],
      CANCELLED: [],
    };

    if (!validTransitions[order.status]?.includes(toStatus)) {
      throw new Error(`INVALID_TRANSITION: Cannot transition from ${order.status} to ${toStatus}`);
    }

    if ((toStatus === 'REJECTED' || toStatus === 'CANCELLED') && !reason && order.status !== 'PENDING_CONFIRMATION') {
      throw new Error('A reason is required for rejection or cancellation.');
    }

    order.status = toStatus;
    const nowIso = new Date().toISOString();

    const labelMap: Record<OrderStatus, string> = {
      PENDING_CONFIRMATION: 'Waiting for café confirmation',
      CONFIRMED: 'Confirmed — queued in kitchen',
      PREPARING: 'Being prepared fresh',
      READY_FOR_PICKUP: 'Ready for pickup at counter!',
      COMPLETED: 'Collected & Paid (Cash)',
      REJECTED: 'Order Rejected',
      CANCELLED: 'Order Cancelled',
    };

    order.statusLabel = labelMap[toStatus];
    order.isTerminal = ['COMPLETED', 'REJECTED', 'CANCELLED'].includes(toStatus);
    if (reason) order.statusReason = reason;

    if (toStatus === 'CONFIRMED') order.confirmedAt = nowIso;
    if (toStatus === 'PREPARING') order.preparingStartedAt = nowIso;
    if (toStatus === 'READY_FOR_PICKUP') order.readyAt = nowIso;
    if (toStatus === 'COMPLETED') order.completedAt = nowIso;
    if (toStatus === 'CANCELLED') order.cancelledAt = nowIso;

    order.timeline.push({
      status: toStatus,
      at: nowIso,
      actor: 'ADMIN',
      reason,
    });

    // If cancelled or rejected, free capacity
    if (toStatus === 'CANCELLED' || toStatus === 'REJECTED') {
      const slot = this.slots.find((s) => s.id === order.pickupSlot.id);
      if (slot && slot.remaining < slot.capacity) {
        slot.remaining += 1;
        if (slot.status === 'FULL') slot.status = 'AVAILABLE';
      }
    }

    this.save();
    return order;
  }
}

export const mockBackend = new MockSupabaseBackend();

// Local demo client mimicking the Supabase API surface the app uses.
export const supabase = {
  from(table: string) {
    if (table === 'products') {
      return {
        select: async () => ({ data: mockBackend.getProducts(), error: null }),
        update: (values: Partial<Product>) => ({
          eq: async (_col: string, val: string) => {
            if ('isAvailable' in values) {
              mockBackend.updateProductAvailability(val, values.isAvailable!);
            }
            if ('basePricePaise' in values) {
              mockBackend.updateProductPrice(val, values.basePricePaise!);
            }
            return { data: null, error: null };
          },
        }),
      };
    }
    if (table === 'pickup_slots') {
      return {
        select: async () => ({ data: mockBackend.getPickupSlots(), error: null }),
      };
    }
    if (table === 'orders') {
      return {
        select: async () => ({ data: mockBackend.getOrders(), error: null }),
      };
    }
    return {
      select: async () => ({ data: [], error: null }),
    };
  },
  rpc(fnName: string, params: Record<string, any>) {
    try {
      if (fnName === 'create_order') {
        const result = mockBackend.createOrder(params as any);
        return Promise.resolve({ data: result, error: null });
      }
      if (fnName === 'get_order_tracking') {
        const order = mockBackend.getOrderByTrackingToken(params.p_token);
        if (!order) {
          return Promise.resolve({ data: null, error: { message: 'Order not found', code: '404' } });
        }
        return Promise.resolve({ data: order, error: null });
      }
      if (fnName === 'transition_order_status') {
        const updated = mockBackend.transitionOrderStatus(
          params.p_order_id,
          params.p_to_status,
          params.p_reason
        );
        return Promise.resolve({ data: updated, error: null });
      }
      return Promise.resolve({ data: null, error: { message: `Unknown RPC function: ${fnName}` } });
    } catch (err: any) {
      return Promise.resolve({ data: null, error: { message: err.message } });
    }
  },
  auth: {
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      if (email === 'admin@chaiwala.com' && password === 'chaiwala123') {
        const session = { user: { id: 'admin-001', email }, access_token: 'demo-token' };
        storageHelper.setItem('cw.admin.session', JSON.stringify(session));
        return { data: { session, user: session.user }, error: null };
      }
      return { data: { session: null, user: null }, error: { message: 'Invalid login credentials' } };
    },
    async signOut() {
      storageHelper.removeItem('cw.admin.session');
      return { error: null };
    },
    async getSession() {
      const saved = storageHelper.getItem('cw.admin.session');
      return { data: { session: saved ? JSON.parse(saved) : null }, error: null };
    },
    onAuthStateChange(callback: (event: string, session: any) => void) {
      const saved = storageHelper.getItem('cw.admin.session');
      if (saved) callback('SIGNED_IN', JSON.parse(saved));
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
  },
};

// The Supabase SDK is only downloaded when real credentials are configured, keeping it out of the demo bundle.
let realClient: Promise<SupabaseClient> | null = null;
export const getSupabase = (): Promise<SupabaseClient | typeof supabase> => {
  if (!isSupabaseConfigured) return Promise.resolve(supabase);
  realClient ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(supabaseUrl, supabaseAnonKey));
  return realClient;
};
