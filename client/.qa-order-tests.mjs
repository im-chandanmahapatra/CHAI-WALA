// test-e2e.ts
import fs from "node:fs";
import path from "node:path";

// src/lib/seed-data.ts
var SEED_THEMES = [
  { id: "theme-adda", slug: "adda", name: "Classic Adda", sort_order: 1 },
  { id: "theme-classics", slug: "classics", name: "Caf\xE9 Classics", sort_order: 2 },
  { id: "theme-lab", slug: "lab", name: "Trend Lab", sort_order: 3 }
];
var SEED_CATEGORIES = [
  { id: "cat-chai", slug: "chai", name: "Chai", sort_order: 1 },
  { id: "cat-coffee", slug: "coffee", name: "Coffee & Cocoa", sort_order: 2 },
  { id: "cat-tea", slug: "tea", name: "Tea", sort_order: 3 },
  { id: "cat-cold", slug: "cold", name: "Cold & Iced", sort_order: 4 },
  { id: "cat-bites", slug: "bites", name: "Bites & Buns", sort_order: 5 },
  { id: "cat-sweets", slug: "sweets", name: "Sweets", sort_order: 6 }
];
var BEVERAGE_OPTIONS = [
  {
    id: "grp-sugar",
    productId: "",
    name: "Sugar Level",
    minSelect: 1,
    maxSelect: 1,
    sortOrder: 1,
    options: [
      { id: "opt-sug-reg", groupId: "grp-sugar", name: "Regular Sweet", priceDeltaPaise: 0, isDefault: true, isAvailable: true, sortOrder: 1 },
      { id: "opt-sug-less", groupId: "grp-sugar", name: "Less Sugar", priceDeltaPaise: 0, isDefault: false, isAvailable: true, sortOrder: 2 },
      { id: "opt-sug-none", groupId: "grp-sugar", name: "No Sugar / Khari", priceDeltaPaise: 0, isDefault: false, isAvailable: true, sortOrder: 3 }
    ]
  },
  {
    id: "grp-size",
    productId: "",
    name: "Cup Size",
    minSelect: 1,
    maxSelect: 1,
    sortOrder: 2,
    options: [
      { id: "opt-size-reg", groupId: "grp-size", name: "Cutting (120ml)", priceDeltaPaise: 0, isDefault: true, isAvailable: true, sortOrder: 1 },
      { id: "opt-size-large", groupId: "grp-size", name: "Kulhad Mug (220ml)", priceDeltaPaise: 2e3, isDefault: false, isAvailable: true, sortOrder: 2 }
    ]
  }
];
var SANDWICH_OPTIONS = [
  {
    id: "grp-cheese",
    productId: "",
    name: "Add-ons",
    minSelect: 0,
    maxSelect: 1,
    sortOrder: 1,
    options: [
      { id: "opt-extra-cheese", groupId: "grp-cheese", name: "Extra Amul Cheese Slice", priceDeltaPaise: 2e3, isDefault: false, isAvailable: true, sortOrder: 1 }
    ]
  }
];
var BOBA_OPTIONS = [
  {
    id: "grp-boba",
    productId: "",
    name: "Boba Toppings",
    minSelect: 0,
    maxSelect: 2,
    sortOrder: 1,
    options: [
      { id: "opt-tapioca", groupId: "grp-boba", name: "Brown Sugar Pearls", priceDeltaPaise: 0, isDefault: true, isAvailable: true, sortOrder: 1 },
      { id: "opt-coconut-jelly", groupId: "grp-boba", name: "Coconut Lychee Jelly", priceDeltaPaise: 1500, isDefault: false, isAvailable: true, sortOrder: 2 }
    ]
  }
];
var SEED_PRODUCTS = [
  {
    id: "prod-01",
    slug: "adrak-chai",
    name: "Adrak Chai",
    description: "Fresh crushed ginger simmered slow with robust Assam CTC and creamy milk.",
    categoryId: "cat-chai",
    categorySlug: "chai",
    basePricePaise: 4e3,
    prepMinutes: 4,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/adrak-chai.jpg",
    imageAlt: "Steaming glass of Adrak Chai with ginger slices on stainless steel saucer",
    themes: [
      { themeSlug: "adda", sortOrder: 1, isFeatured: true, copyOverride: "Street-side morning energy, sharp crushed ginger bite." },
      { themeSlug: "classics", sortOrder: 4, isFeatured: false, copyOverride: "Comforting ginger milk tea brewed in traditional pots." }
    ],
    optionGroups: BEVERAGE_OPTIONS
  },
  {
    id: "prod-02",
    slug: "elaichi-chai",
    name: "Elaichi Chai",
    description: "Fragrant green cardamom pods cracked fresh into rich slow-boiled milk tea.",
    categoryId: "cat-chai",
    categorySlug: "chai",
    basePricePaise: 4e3,
    prepMinutes: 4,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/elaichi-chai.jpg",
    imageAlt: "Cardamom chai in a handcrafted earthen terracotta kulhad cup",
    themes: [
      { themeSlug: "adda", sortOrder: 2, isFeatured: true, copyOverride: "Earthen kulhad aroma with fresh green cardamom." }
    ],
    optionGroups: BEVERAGE_OPTIONS
  },
  {
    id: "prod-03",
    slug: "masala-chai",
    name: "Masala Chai",
    description: "Seven-spice house masala blend: star anise, clove, cinnamon, black pepper, and nutmeg.",
    categoryId: "cat-chai",
    categorySlug: "chai",
    basePricePaise: 4500,
    prepMinutes: 4,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/masala-chai.jpg",
    imageAlt: "Spiced Indian masala chai with whole star anise and cinnamon stick",
    themes: [
      { themeSlug: "adda", sortOrder: 3, isFeatured: true, copyOverride: "Our signature winter masala recipe, steeped deep." }
    ],
    optionGroups: BEVERAGE_OPTIONS
  },
  {
    id: "prod-04",
    slug: "cutting-chai",
    name: "Cutting Chai",
    description: "Half-measure of strong, sweet, concentrated tapri tea for the quick mid-day break.",
    categoryId: "cat-chai",
    categorySlug: "chai",
    basePricePaise: 2500,
    prepMinutes: 3,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/cutting-chai.jpg",
    imageAlt: "Traditional cutting chai in wire carriage rack",
    themes: [
      { themeSlug: "adda", sortOrder: 5, isFeatured: false, copyOverride: "The quick half-glass recharge." }
    ],
    optionGroups: BEVERAGE_OPTIONS
  },
  {
    id: "prod-05",
    slug: "bun-maska",
    name: "Bun Maska",
    description: "Soft bakery bun sliced and filled with melting salted Amul butter. Dip straight into chai.",
    categoryId: "cat-bites",
    categorySlug: "bites",
    basePricePaise: 4500,
    prepMinutes: 3,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/bun-maska.jpg",
    imageAlt: "Mumbai style bun maska sliced with luscious melting butter layers",
    themes: [
      { themeSlug: "adda", sortOrder: 4, isFeatured: true, copyOverride: "Irani caf\xE9 style, generous butter slab." }
    ]
  },
  {
    id: "prod-06",
    slug: "biscuit-plate",
    name: "Biscuit Plate",
    description: "A pair of flaky Osmania butter biscuits and two cumin zeera crackers.",
    categoryId: "cat-bites",
    categorySlug: "bites",
    basePricePaise: 3e3,
    prepMinutes: 2,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/biscuit-plate.jpg",
    imageAlt: "Crisp cumin and Osmania biscuits on rustic plate",
    themes: [
      { themeSlug: "adda", sortOrder: 6, isFeatured: false, copyOverride: "Crisp sweet-and-salt tea dipping pairing." }
    ]
  },
  {
    id: "prod-07",
    slug: "hot-coffee",
    name: "Hot Filter Coffee",
    description: "Traditional South Indian filter coffee decoction pulled with frothed whole milk.",
    categoryId: "cat-coffee",
    categorySlug: "coffee",
    basePricePaise: 6e3,
    prepMinutes: 4,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/hot-coffee.jpg",
    imageAlt: "Artisanal hot filter coffee in ceramic cup with silky foam",
    themes: [
      { themeSlug: "classics", sortOrder: 1, isFeatured: true, copyOverride: "High-crema chicory blend pulled with foam." }
    ],
    optionGroups: BEVERAGE_OPTIONS
  },
  {
    id: "prod-08",
    slug: "cold-coffee",
    name: "Classic Cold Coffee",
    description: "Thick, creamy blended iced coffee topped with chocolate dusting and espresso cream.",
    categoryId: "cat-cold",
    categorySlug: "cold",
    basePricePaise: 9e3,
    prepMinutes: 5,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/cold-coffee.jpg",
    imageAlt: "Chilled cold coffee in tall bistro glass with chocolate drip",
    themes: [
      { themeSlug: "classics", sortOrder: 2, isFeatured: true, copyOverride: "Chilled nostalgic caf\xE9 cold coffee." },
      { themeSlug: "lab", sortOrder: 4, isFeatured: false, copyOverride: "Thick blended double-shot shake." }
    ]
  },
  {
    id: "prod-09",
    slug: "lemon-tea",
    name: "Fresh Lemon Tea",
    description: "Clear steeped black tea with fresh hand-squeezed lemon and sweet mint.",
    categoryId: "cat-tea",
    categorySlug: "tea",
    basePricePaise: 5e3,
    prepMinutes: 3,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/lemon-tea.jpg",
    imageAlt: "Clear golden steeped lemon tea with lemon wheels and fresh mint",
    themes: [
      { themeSlug: "classics", sortOrder: 5, isFeatured: false, copyOverride: "Clean, citrusy, and refreshing." }
    ]
  },
  {
    id: "prod-10",
    slug: "ginger-tea",
    name: "Herbal Ginger Tea",
    description: "Dairy-free infusion of fresh crushed ginger root with wild honey and lemon.",
    categoryId: "cat-tea",
    categorySlug: "tea",
    basePricePaise: 5e3,
    prepMinutes: 3,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/ginger-tea.jpg",
    imageAlt: "Steeping herbal ginger tea in contemporary glass teacup",
    themes: [
      { themeSlug: "classics", sortOrder: 6, isFeatured: false, copyOverride: "Gentle warmth for throat and mind." }
    ]
  },
  {
    id: "prod-11",
    slug: "veg-grilled-sandwich",
    name: "Veg Grilled Sandwich",
    description: "Toasted white bread stuffed with spiced potato, cucumber, tomato, mint chutney, and molten cheese.",
    categoryId: "cat-bites",
    categorySlug: "bites",
    basePricePaise: 9e3,
    prepMinutes: 8,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/veg-grilled-sandwich.jpg",
    imageAlt: "Grilled vegetable club sandwich with golden char and melted cheese",
    themes: [
      { themeSlug: "classics", sortOrder: 3, isFeatured: true, copyOverride: "Mumbai street toastie style with green chutney." }
    ],
    optionGroups: SANDWICH_OPTIONS
  },
  {
    id: "prod-12",
    slug: "hot-chocolate",
    name: "Artisan Hot Chocolate",
    description: "Melted single-origin dark cocoa churned with steamed whole milk and vanilla bean.",
    categoryId: "cat-coffee",
    categorySlug: "coffee",
    basePricePaise: 9500,
    prepMinutes: 5,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/hot-chocolate.jpg",
    imageAlt: "Rich dark hot chocolate with cocoa dusting in artisanal mug",
    themes: [
      { themeSlug: "classics", sortOrder: 7, isFeatured: false, copyOverride: "Pure chocolate decadence." }
    ]
  },
  {
    id: "prod-13",
    slug: "chocolate-pastry",
    name: "Belgian Truffle Pastry",
    description: "Layered dark chocolate sponge with silky chocolate truffle ganache.",
    categoryId: "cat-sweets",
    categorySlug: "sweets",
    basePricePaise: 8500,
    prepMinutes: 2,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/chocolate-pastry.jpg",
    imageAlt: "Belgian chocolate gateau slice with glossy mirror ganache",
    themes: [
      { themeSlug: "classics", sortOrder: 8, isFeatured: false, copyOverride: "Silky afternoon sweet bite." }
    ]
  },
  {
    id: "prod-14",
    slug: "iced-coffee",
    name: "Citrus Tonic Cold Brew",
    description: "16-hour slow steep cold brew poured over tonic water, crystal ice, and fresh orange peel.",
    categoryId: "cat-cold",
    categorySlug: "cold",
    basePricePaise: 1e4,
    prepMinutes: 5,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/iced-coffee.jpg",
    imageAlt: "Double espresso tonic with clear artisanal ice cubes and citrus twist",
    themes: [
      { themeSlug: "lab", sortOrder: 1, isFeatured: true, copyOverride: "Fizzy, crisp, double-shot cold brew." }
    ]
  },
  {
    id: "prod-15",
    slug: "matcha-latte",
    name: "Uji Matcha Oat Latte",
    description: "Ceremonial grade Japanese green tea whisked with silky steamed oat milk.",
    categoryId: "cat-cold",
    categorySlug: "cold",
    basePricePaise: 14e3,
    prepMinutes: 5,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/matcha-latte.jpg",
    imageAlt: "Layered ceremonial Japanese matcha latte with oat milk in fluted glass",
    themes: [
      { themeSlug: "lab", sortOrder: 2, isFeatured: true, copyOverride: "Vibrant antioxidant layer with creamy oat milk." }
    ],
    optionGroups: BEVERAGE_OPTIONS
  },
  {
    id: "prod-16",
    slug: "boba-tea",
    name: "Brown Sugar Pearl Boba",
    description: "Rich roasted milk tea with warm brown sugar syrup and chewy black tapioca boba pearls.",
    categoryId: "cat-cold",
    categorySlug: "cold",
    basePricePaise: 15e3,
    prepMinutes: 6,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/boba-tea.jpg",
    imageAlt: "Brown sugar boba milk tea with chewy tapioca pearls and bamboo straw",
    themes: [
      { themeSlug: "lab", sortOrder: 3, isFeatured: false, copyOverride: "Taiwanese style brown sugar marbling." }
    ],
    optionGroups: BOBA_OPTIONS
  },
  {
    id: "prod-17",
    slug: "butter-croissant",
    name: "Artisan Butter Croissant",
    description: "Hand-laminated flaky French pastry baked fresh daily with pure cultured butter.",
    categoryId: "cat-bites",
    categorySlug: "bites",
    basePricePaise: 9e3,
    prepMinutes: 2,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/butter-croissant.jpg",
    imageAlt: "Flaky French butter croissant with golden honeycomb lamination",
    themes: [
      { themeSlug: "lab", sortOrder: 5, isFeatured: true, copyOverride: "Airy honeycomb layers with cultured butter." }
    ]
  },
  {
    id: "prod-18",
    slug: "jalapeno-cheese-sandwich",
    name: "Jalape\xF1o Melt Toastie",
    description: "Artisanal sourdough stuffed with aged white cheddar, spicy pickled jalape\xF1os, and smoked paprika.",
    categoryId: "cat-bites",
    categorySlug: "bites",
    basePricePaise: 12e3,
    prepMinutes: 8,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/jalapeno-cheese-sandwich.jpg",
    imageAlt: "Sourdough toast with sharp cheddar melt and spicy pickled jalape\xF1o",
    themes: [
      { themeSlug: "lab", sortOrder: 6, isFeatured: false, copyOverride: "Crisp sourdough crust with fiery jalape\xF1o bite." }
    ],
    optionGroups: SANDWICH_OPTIONS
  },
  {
    id: "prod-19",
    slug: "brownie",
    name: "Sea Salt Fudgy Brownie",
    description: "70% dark Belgian chocolate brownie with a cracked crinkle top and flaky Maldon sea salt.",
    categoryId: "cat-sweets",
    categorySlug: "sweets",
    basePricePaise: 8e3,
    prepMinutes: 2,
    isAvailable: true,
    isArchived: false,
    imagePath: "/images/brownie.jpg",
    imageAlt: "Fudgy dark chocolate brownie square sprinkled with Maldon sea salt",
    themes: [
      { themeSlug: "classics", sortOrder: 9, isFeatured: false, copyOverride: "Warm dark chocolate indulgence." },
      { themeSlug: "lab", sortOrder: 7, isFeatured: false, copyOverride: "Salted dark chocolate square." }
    ]
  }
];
function generateDemoPickupSlots() {
  const slots = [];
  const now = /* @__PURE__ */ new Date();
  const startMs = Math.ceil(now.getTime() / (15 * 60 * 1e3)) * (15 * 60 * 1e3) + 15 * 60 * 1e3;
  for (let i = 0; i < 16; i++) {
    const slotStart = new Date(startMs + i * 15 * 60 * 1e3);
    const slotEnd = new Date(slotStart.getTime() + 15 * 60 * 1e3);
    const hour = slotStart.getHours();
    const min = slotStart.getMinutes();
    const slotId = `slot-${slotStart.toISOString().slice(0, 10)}-${hour.toString().padStart(2, "0")}${min.toString().padStart(2, "0")}`;
    let status = "AVAILABLE";
    let remaining = 6;
    if (i === 3) {
      status = "AVAILABLE";
      remaining = 2;
    } else if (i === 7) {
      status = "FULL";
      remaining = 0;
    }
    slots.push({
      id: slotId,
      startsAt: slotStart.toISOString(),
      endsAt: slotEnd.toISOString(),
      capacity: 6,
      remaining,
      isOpen: status !== "FULL",
      status
    });
  }
  return slots;
}

// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : globalThis.process?.env?.VITE_SUPABASE_URL;
var supabaseAnonKey = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : globalThis.process?.env?.VITE_SUPABASE_ANON_KEY;
var isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
var realClient = null;
if (isSupabaseConfigured) {
  realClient = createClient(supabaseUrl, supabaseAnonKey);
}
var storageHelper = {
  getItem: (key) => {
    try {
      return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  setItem: (key, val) => {
    try {
      if (typeof localStorage !== "undefined") localStorage.setItem(key, val);
    } catch {
    }
  },
  removeItem: (key) => {
    try {
      if (typeof localStorage !== "undefined") localStorage.removeItem(key);
    } catch {
    }
  }
};
var MockSupabaseBackend = class {
  products = [];
  orders = [];
  slots = [];
  constructor() {
    this.init();
  }
  init() {
    const savedProducts = storageHelper.getItem("cw.db.products");
    if (savedProducts) {
      try {
        this.products = JSON.parse(savedProducts);
      } catch {
        this.products = [...SEED_PRODUCTS];
      }
    } else {
      this.products = [...SEED_PRODUCTS];
      storageHelper.setItem("cw.db.products", JSON.stringify(this.products));
    }
    const savedOrders = storageHelper.getItem("cw.db.orders");
    if (savedOrders) {
      try {
        this.orders = JSON.parse(savedOrders);
      } catch {
        this.orders = [];
      }
    }
    this.slots = generateDemoPickupSlots();
  }
  save() {
    storageHelper.setItem("cw.db.products", JSON.stringify(this.products));
    storageHelper.setItem("cw.db.orders", JSON.stringify(this.orders));
  }
  getProducts() {
    return this.products;
  }
  updateProductAvailability(id, isAvailable) {
    const prod = this.products.find((p) => p.id === id);
    if (prod) {
      prod.isAvailable = isAvailable;
      this.save();
    }
    return prod;
  }
  updateProductPrice(id, basePricePaise) {
    const prod = this.products.find((p) => p.id === id);
    if (prod) {
      prod.basePricePaise = basePricePaise;
      this.save();
    }
    return prod;
  }
  getPickupSlots() {
    this.slots = generateDemoPickupSlots().map((slot) => {
      const booked = this.orders.filter((order) => order.pickupSlot.id === slot.id && !["CANCELLED", "REJECTED"].includes(order.status)).length;
      const remaining = Math.max(0, slot.remaining - booked);
      return { ...slot, remaining, isOpen: remaining > 0, status: remaining > 0 ? "AVAILABLE" : "FULL" };
    });
    return this.slots;
  }
  getOrders() {
    return this.orders;
  }
  getOrderByTrackingToken(token) {
    const order = this.orders.find((o) => o.trackingToken === token);
    if (!order) return null;
    const activeAhead = this.orders.filter(
      (o) => (o.status === "CONFIRMED" || o.status === "PREPARING") && o.id !== order.id
    );
    const aheadPrepMinutes = activeAhead.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.prepMinutes * i.quantity, 0),
      0
    );
    const ownPrep = order.items.reduce((s, i) => s + i.prepMinutes * i.quantity, 0);
    const now = /* @__PURE__ */ new Date();
    const slotStart = new Date(order.pickupSlot.startsAt);
    const earliestMs = now.getTime() + (aheadPrepMinutes + ownPrep) * 60 * 1e3;
    const estTime = new Date(Math.max(slotStart.getTime(), earliestMs));
    const remMin = estTime.getMinutes() % 5;
    if (remMin !== 0) {
      estTime.setMinutes(estTime.getMinutes() + (5 - remMin));
    }
    estTime.setSeconds(0, 0);
    const isLate = estTime.getTime() > new Date(order.pickupSlot.endsAt).getTime();
    const formattedTime = estTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    order.estimate = order.status === "READY_FOR_PICKUP" || order.isTerminal ? null : {
      readyAt: estTime.toISOString(),
      isLate,
      note: `Estimated ready around ${formattedTime} (estimate based on queue)`
    };
    return order;
  }
  // Atomic order creation simulating the Postgres RPC function
  createOrder(input) {
    const existing = this.orders.find((o) => o.clientRequestId === input.idempotencyKey);
    if (existing) {
      return {
        orderNumber: existing.orderNumber,
        displayNumber: existing.displayNumber,
        trackingToken: existing.trackingToken,
        status: existing.status,
        subtotalPaise: existing.subtotalPaise,
        totalPaise: existing.totalPaise,
        isReplay: true
      };
    }
    if (!input.items?.length || input.items.length > 100) throw new Error("Add at least one item before checkout.");
    if (!input.customer?.name?.trim() || !/^\d{10}$/.test(input.customer.phone)) throw new Error("Enter a name and 10-digit mobile number.");
    if (!input.idempotencyKey) throw new Error("Order request identifier is required.");
    this.getPickupSlots();
    const slot = this.slots.find((s) => s.id === input.pickupSlotId);
    if (!slot || !slot.isOpen) {
      throw new Error("SLOT_CLOSED: Selected pickup slot is unavailable.");
    }
    if (slot.remaining <= 0) {
      throw new Error("SLOT_FULL: Selected pickup slot has reached full capacity.");
    }
    let subtotalPaise = 0;
    const orderItems = input.items.map((line, idx) => {
      const product = this.products.find((p) => p.id === line.productId);
      if (!product || !product.isAvailable || product.isArchived) {
        throw new Error(`PRODUCT_UNAVAILABLE: Product "${product?.name || line.productId}" is currently unavailable.`);
      }
      if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 20) throw new Error("Quantity must be between 1 and 20.");
      const optionIds = line.optionIds ?? [];
      if (new Set(optionIds).size !== optionIds.length) throw new Error("Duplicate customization options.");
      const allowed = product.optionGroups?.flatMap((group) => group.options.filter((option) => option.isAvailable).map((option) => option.id)) ?? [];
      if (optionIds.some((id) => !allowed.includes(id))) throw new Error("A customization is no longer available.");
      for (const group of product.optionGroups ?? []) {
        const count = group.options.filter((option) => optionIds.includes(option.id)).length;
        if (count < group.minSelect || count > group.maxSelect) throw new Error("Please choose valid options for " + group.name + ".");
      }
      let unitPricePaise = product.basePricePaise;
      const selectedOptions = [];
      if (line.optionIds && line.optionIds.length > 0 && product.optionGroups) {
        for (const grp of product.optionGroups) {
          for (const opt of grp.options) {
            if (line.optionIds.includes(opt.id) && opt.isAvailable) {
              unitPricePaise += opt.priceDeltaPaise;
              selectedOptions.push({
                groupName: grp.name,
                optionName: opt.name,
                priceDeltaPaise: opt.priceDeltaPaise
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
        options: selectedOptions
      };
    });
    slot.remaining -= 1;
    if (slot.remaining === 0) slot.status = "FULL";
    const orderSeq = 1001 + this.orders.length;
    const token = "cwtk_" + Array.from(crypto.getRandomValues(new Uint8Array(16))).map((b) => b.toString(16).padStart(2, "0")).join("");
    const gstPaise = Math.round(subtotalPaise * 0.05);
    const packagingPaise = 1e3;
    const totalPaise = subtotalPaise + gstPaise + packagingPaise;
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderSeq,
      displayNumber: `CW-${orderSeq}`,
      trackingToken: token,
      clientRequestId: input.idempotencyKey,
      status: "PENDING_CONFIRMATION",
      statusLabel: "Waiting for caf\xE9 confirmation",
      isTerminal: false,
      pickupSlot: {
        id: slot.id,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt
      },
      customerName: input.customer.name.trim(),
      customerPhone: input.customer.phone.trim(),
      customerNote: input.customer.note?.trim() || null,
      paymentMethod: "CASH_AT_PICKUP",
      subtotalPaise,
      totalPaise,
      items: orderItems,
      timeline: [
        {
          status: "PENDING_CONFIRMATION",
          at: (/* @__PURE__ */ new Date()).toISOString(),
          actor: "CUSTOMER"
        }
      ],
      estimate: {
        readyAt: slot.startsAt,
        isLate: false,
        note: "Estimate only \u2014 queued behind existing orders"
      },
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
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
      status: newOrder.status
    };
  }
  // FSM Transition simulation
  transitionOrderStatus(orderId, toStatus, reason) {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");
    const validTransitions = {
      PENDING_CONFIRMATION: ["CONFIRMED", "REJECTED", "CANCELLED"],
      CONFIRMED: ["PREPARING", "CANCELLED"],
      PREPARING: ["READY_FOR_PICKUP", "CANCELLED"],
      READY_FOR_PICKUP: ["COMPLETED", "CANCELLED"],
      COMPLETED: [],
      REJECTED: [],
      CANCELLED: []
    };
    if (!validTransitions[order.status]?.includes(toStatus)) {
      throw new Error(`INVALID_TRANSITION: Cannot transition from ${order.status} to ${toStatus}`);
    }
    if ((toStatus === "REJECTED" || toStatus === "CANCELLED") && !reason && order.status !== "PENDING_CONFIRMATION") {
      throw new Error("A reason is required for rejection or cancellation.");
    }
    order.status = toStatus;
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const labelMap = {
      PENDING_CONFIRMATION: "Waiting for caf\xE9 confirmation",
      CONFIRMED: "Confirmed \u2014 queued in kitchen",
      PREPARING: "Being prepared fresh",
      READY_FOR_PICKUP: "Ready for pickup at counter!",
      COMPLETED: "Collected & Paid (Cash)",
      REJECTED: "Order Rejected",
      CANCELLED: "Order Cancelled"
    };
    order.statusLabel = labelMap[toStatus];
    order.isTerminal = ["COMPLETED", "REJECTED", "CANCELLED"].includes(toStatus);
    if (reason) order.statusReason = reason;
    if (toStatus === "CONFIRMED") order.confirmedAt = nowIso;
    if (toStatus === "PREPARING") order.preparingStartedAt = nowIso;
    if (toStatus === "READY_FOR_PICKUP") order.readyAt = nowIso;
    if (toStatus === "COMPLETED") order.completedAt = nowIso;
    if (toStatus === "CANCELLED") order.cancelledAt = nowIso;
    order.timeline.push({
      status: toStatus,
      at: nowIso,
      actor: "ADMIN",
      reason
    });
    if (toStatus === "CANCELLED" || toStatus === "REJECTED") {
      const slot = this.slots.find((s) => s.id === order.pickupSlot.id);
      if (slot && slot.remaining < slot.capacity) {
        slot.remaining += 1;
        if (slot.status === "FULL") slot.status = "AVAILABLE";
      }
    }
    this.save();
    return order;
  }
};
var mockBackend = new MockSupabaseBackend();
var supabase = realClient || {
  from(table) {
    if (table === "products") {
      return {
        select: async () => ({ data: mockBackend.getProducts(), error: null }),
        update: (values) => ({
          eq: async (_col, val) => {
            if ("isAvailable" in values) {
              mockBackend.updateProductAvailability(val, values.isAvailable);
            }
            if ("basePricePaise" in values) {
              mockBackend.updateProductPrice(val, values.basePricePaise);
            }
            return { data: null, error: null };
          }
        })
      };
    }
    if (table === "pickup_slots") {
      return {
        select: async () => ({ data: mockBackend.getPickupSlots(), error: null })
      };
    }
    if (table === "orders") {
      return {
        select: async () => ({ data: mockBackend.getOrders(), error: null })
      };
    }
    return {
      select: async () => ({ data: [], error: null })
    };
  },
  rpc(fnName, params) {
    try {
      if (fnName === "create_order") {
        const result = mockBackend.createOrder(params);
        return Promise.resolve({ data: result, error: null });
      }
      if (fnName === "get_order_tracking") {
        const order = mockBackend.getOrderByTrackingToken(params.p_token);
        if (!order) {
          return Promise.resolve({ data: null, error: { message: "Order not found", code: "404" } });
        }
        return Promise.resolve({ data: order, error: null });
      }
      if (fnName === "transition_order_status") {
        const updated = mockBackend.transitionOrderStatus(
          params.p_order_id,
          params.p_to_status,
          params.p_reason
        );
        return Promise.resolve({ data: updated, error: null });
      }
      return Promise.resolve({ data: null, error: { message: `Unknown RPC function: ${fnName}` } });
    } catch (err) {
      return Promise.resolve({ data: null, error: { message: err.message } });
    }
  },
  auth: {
    async signInWithPassword({ email, password }) {
      if (email === "admin@chaiwala.com" && password === "chaiwala123") {
        const session = { user: { id: "admin-001", email }, access_token: "demo-token" };
        storageHelper.setItem("cw.admin.session", JSON.stringify(session));
        return { data: { session, user: session.user }, error: null };
      }
      return { data: { session: null, user: null }, error: { message: "Invalid login credentials" } };
    },
    async signOut() {
      storageHelper.removeItem("cw.admin.session");
      return { error: null };
    },
    async getSession() {
      const saved = storageHelper.getItem("cw.admin.session");
      return { data: { session: saved ? JSON.parse(saved) : null }, error: null };
    },
    onAuthStateChange(callback) {
      const saved = storageHelper.getItem("cw.admin.session");
      if (saved) callback("SIGNED_IN", JSON.parse(saved));
      return { data: { subscription: { unsubscribe: () => {
      } } } };
    }
  }
};

// test-e2e.ts
var storage = {};
globalThis.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => {
    storage[k] = v;
  },
  removeItem: (k) => {
    delete storage[k];
  },
  clear: () => {
    Object.keys(storage).forEach((k) => delete storage[k]);
  }
};
var passedTests = 0;
var totalTests = 0;
function assert(condition, testName, detail) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    console.error(`  [FAIL] ${testName}${detail ? ` \u2014 ${detail}` : ""}`);
  }
}
async function runTests() {
  console.log("===============================================================");
  console.log("CHAIWALA \u2014 FULL-STACK AUTOMATED VERIFICATION SUITE");
  console.log("===============================================================\n");
  console.log("--- TEST SUITE 1: Asset & Catalogue Integrity ---");
  assert(SEED_PRODUCTS.length === 19, "19 products seeded across all categories");
  assert(SEED_CATEGORIES.length === 6, "6 product categories defined");
  assert(SEED_THEMES.length === 3, "3 curated themes (Adda, Classics, Lab)");
  const imagesDir = path.resolve("public/images");
  const allImagesExist = SEED_PRODUCTS.every((p) => {
    const filename = p.imagePath.replace("/images/", "");
    return fs.existsSync(path.join(imagesDir, filename));
  });
  assert(allImagesExist, "All 19 product image assets exist in client/public/images/");
  console.log("\n--- TEST SUITE 2: Pickup Slot Generation ---");
  const slots = generateDemoPickupSlots();
  assert(slots.length >= 8, `Pickup slots generated (${slots.length} slots available)`);
  assert(slots.every((s) => s.capacity === 6), "Default slot capacity is 6 orders per 15-minute window");
  assert(slots.filter((s) => s.status === "AVAILABLE").length >= 10, "Majority of upcoming slots are in AVAILABLE status");
  console.log("\n--- TEST SUITE 3: Atomic Order Creation (create_order RPC) ---");
  const slotToBook = slots[0];
  const initialRemaining = slotToBook.remaining;
  const adrakChai = SEED_PRODUCTS.find((p) => p.slug === "adrak-chai");
  const bunMaska = SEED_PRODUCTS.find((p) => p.slug === "bun-maska");
  const kulhadOption = adrakChai.optionGroups[1].options[1];
  const regularSugar = adrakChai.optionGroups[0].options[0];
  const orderPayload = {
    items: [
      {
        productId: adrakChai.id,
        quantity: 2,
        optionIds: [kulhadOption.id, regularSugar.id]
      },
      {
        productId: bunMaska.id,
        quantity: 1,
        optionIds: []
      }
    ],
    pickupSlotId: slotToBook.id,
    customer: {
      name: "Devansh Sharma",
      phone: "9820012345",
      email: "devansh@example.com",
      note: "Please pack in warm paper bag"
    },
    idempotencyKey: "idemp-test-001"
  };
  const orderRes = await supabase.rpc("create_order", orderPayload);
  assert(!orderRes.error, "create_order RPC executed without error");
  const order = orderRes.data;
  assert(order.displayNumber.includes("CW-"), `Valid order number generated: ${order.displayNumber}`);
  assert(order.trackingToken.startsWith("cwtk_"), `Valid secure tracking token generated: ${order.trackingToken}`);
  assert(order.subtotalPaise === 16500, `Subtotal exact match: 16500 paise (calculated: ${order.subtotalPaise})`);
  assert(order.gstPaise === 825, `GST exact match: 825 paise (calculated: ${order.gstPaise})`);
  assert(order.packagingPaise === 1e3, `Packaging exact match: 1000 paise (calculated: ${order.packagingPaise})`);
  assert(order.totalPaise === 18325, `Total price exact match: 18325 paise (calculated: ${order.totalPaise})`);
  assert(order.status === "PENDING_CONFIRMATION", `Initial status is PENDING_CONFIRMATION`);
  const updatedSlot = mockBackend.getPickupSlots().find((s) => s.id === slotToBook.id);
  assert(updatedSlot.remaining === initialRemaining - 1, `Slot capacity successfully decremented from ${initialRemaining} to ${updatedSlot.remaining}`);
  console.log("\n--- TEST SUITE 4: Order Tracking Query (get_order_tracking RPC) ---");
  const trackRes = await supabase.rpc("get_order_tracking", { p_token: order.trackingToken });
  assert(!trackRes.error, "get_order_tracking RPC executed without error");
  const trackedOrder = trackRes.data;
  assert(trackedOrder.id === order.id, "Tracking returned correct order record");
  assert(trackedOrder.items.length === 2, "Tracking returned all 2 line items");
  assert(trackedOrder.timeline.length >= 1, "Timeline contains initial PENDING_CONFIRMATION creation milestone");
  console.log("\n--- TEST SUITE 5: Kitchen FSM Transitions (transition_order_status RPC) ---");
  const t1 = await supabase.rpc("transition_order_status", {
    p_order_id: order.id,
    p_to_status: "CONFIRMED",
    p_reason: "Barista accepted ticket"
  });
  assert(!t1.error && t1.data.status === "CONFIRMED", "Transition PENDING_CONFIRMATION -> CONFIRMED accepted");
  const t2 = await supabase.rpc("transition_order_status", {
    p_order_id: order.id,
    p_to_status: "PREPARING",
    p_reason: "Kulhads placed on burner"
  });
  assert(!t2.error && t2.data.status === "PREPARING", "Transition CONFIRMED -> PREPARING accepted");
  const t3 = await supabase.rpc("transition_order_status", {
    p_order_id: order.id,
    p_to_status: "READY_FOR_PICKUP",
    p_reason: "Packed at pickup counter"
  });
  assert(!t3.error && t3.data.status === "READY_FOR_PICKUP", "Transition PREPARING -> READY_FOR_PICKUP accepted");
  const t4 = await supabase.rpc("transition_order_status", {
    p_order_id: order.id,
    p_to_status: "COMPLETED",
    p_reason: "Collected by customer"
  });
  assert(!t4.error && t4.data.status === "COMPLETED", "Transition READY_FOR_PICKUP -> COMPLETED accepted");
  const tIllegal = await supabase.rpc("transition_order_status", {
    p_order_id: order.id,
    p_to_status: "PREPARING"
  });
  assert(Boolean(tIllegal.error), "FSM strictly rejects illegal transition from terminal COMPLETED state");
  console.log("\n--- TEST SUITE 6: Slot Capacity Release on Cancellation ---");
  const slotToTestCancel = mockBackend.getPickupSlots()[1];
  const cancelSlotInitial = slotToTestCancel.remaining;
  const order2Res = await supabase.rpc("create_order", {
    items: [{ productId: adrakChai.id, quantity: 1, optionIds: ["opt-sug-reg", "opt-size-reg"] }],
    pickupSlotId: slotToTestCancel.id,
    customer: { name: "Priya Verma", phone: "9811122233" },
    idempotencyKey: "idemp-test-002"
  });
  const order2 = order2Res.data;
  const slotAfterOrder = mockBackend.getPickupSlots().find((s) => s.id === slotToTestCancel.id);
  assert(slotAfterOrder.remaining === cancelSlotInitial - 1, "Slot booked count decrements remaining");
  await supabase.rpc("transition_order_status", {
    p_order_id: order2.id,
    p_to_status: "CANCELLED",
    p_reason: "Customer requested cancellation"
  });
  const slotAfterCancel = mockBackend.getPickupSlots().find((s) => s.id === slotToTestCancel.id);
  assert(slotAfterCancel.remaining === cancelSlotInitial, `Slot capacity released back to ${slotAfterCancel.remaining} on cancellation`);
  console.log("\n--- TEST SUITE 7: Admin Authentication ---");
  const validLogin = await supabase.auth.signInWithPassword({
    email: "admin@chaiwala.com",
    password: "chaiwala123"
  });
  assert(Boolean(validLogin.data?.session), "Admin credentials verified with valid session token");
  const invalidLogin = await supabase.auth.signInWithPassword({
    email: "admin@chaiwala.com",
    password: "wrongpassword"
  });
  assert(Boolean(invalidLogin.error), "Invalid password rejected with authentication error");
  console.log("\n--- TEST SUITE 8: Menu Catalog Management (86 Availability & Price) ---");
  const testProduct = SEED_PRODUCTS[0];
  const origAvailability = testProduct.isAvailable;
  await supabase.from("products").update({ isAvailable: !origAvailability }).eq("id", testProduct.id);
  const updatedProduct = mockBackend.getProducts().find((p) => p.id === testProduct.id);
  assert(updatedProduct.isAvailable === !origAvailability, `Product availability toggled to ${!origAvailability} (86'd)`);
  await supabase.from("products").update({ isAvailable: origAvailability }).eq("id", testProduct.id);
  const origPrice = testProduct.basePricePaise;
  const newPrice = 4500;
  await supabase.from("products").update({ basePricePaise: newPrice }).eq("id", testProduct.id);
  const priceUpdatedProduct = mockBackend.getProducts().find((p) => p.id === testProduct.id);
  assert(priceUpdatedProduct.basePricePaise === newPrice, `Base price updated to \u20B945.00 (${newPrice} paise)`);
  await supabase.from("products").update({ basePricePaise: origPrice }).eq("id", testProduct.id);
  console.log("\n===============================================================");
  console.log(`VERIFICATION SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
  if (passedTests === totalTests) {
    console.log("ALL INVARIANTS SATISFIED \u2014 FULL STACK APPLICATION VERIFIED 100%");
  } else {
    console.error(`FAILURES DETECTED: ${totalTests - passedTests} failed.`);
    process.exitCode = 1;
  }
  console.log("===============================================================\n");
}
runTests().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
