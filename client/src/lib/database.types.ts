export type MoodSlug = 'adda' | 'classics' | 'lab';

export type OrderStatus =
  | 'PENDING_CONFIRMATION'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

export type ActorType = 'CUSTOMER' | 'ADMIN' | 'SYSTEM';
export type PaymentMethod = 'CASH_AT_PICKUP';

export interface Theme {
  id: string;
  slug: MoodSlug;
  name: string;
  sort_order: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
}

export interface Option {
  id: string;
  groupId: string;
  name: string;
  priceDeltaPaise: number;
  isDefault: boolean;
  isAvailable: boolean;
  sortOrder: number;
}

export interface OptionGroup {
  id: string;
  productId: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  sortOrder: number;
  options: Option[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string;
  categorySlug: string;
  basePricePaise: number;
  prepMinutes: number;
  isAvailable: boolean;
  isArchived: boolean;
  imagePath: string;
  imageAlt: string;
  themes: {
    themeSlug: MoodSlug;
    sortOrder: number;
    isFeatured: boolean;
    copyOverride: string | null;
  }[];
  optionGroups?: OptionGroup[];
}

export interface PickupSlot {
  id: string;
  startsAt: string; // ISO-8601 UTC
  endsAt: string;   // ISO-8601 UTC
  capacity: number;
  remaining: number;
  isOpen: boolean;
  status: 'AVAILABLE' | 'FULL' | 'CLOSED' | 'PAST_OR_TOO_SOON';
}

export interface OrderItemOption {
  groupName: string;
  optionName: string;
  priceDeltaPaise: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPricePaise: number;
  quantity: number;
  lineTotalPaise: number;
  prepMinutes: number;
  options: OrderItemOption[];
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  at: string;
  actor: ActorType;
  reason?: string | null;
}

export interface OrderEstimate {
  readyAt: string | null;
  isLate: boolean;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  displayNumber: string; // CW-####
  trackingToken: string;
  clientRequestId: string;
  status: OrderStatus;
  statusLabel: string;
  isTerminal: boolean;
  pickupSlot: {
    id: string;
    startsAt: string;
    endsAt: string;
  };
  customerName: string;
  customerPhone: string;
  customerNote?: string | null;
  paymentMethod: PaymentMethod;
  subtotalPaise: number;
  totalPaise: number;
  items: OrderItem[];
  timeline: OrderTimelineEntry[];
  estimate: OrderEstimate | null;
  statusReason?: string | null;
  createdAt: string;
  confirmedAt?: string | null;
  preparingStartedAt?: string | null;
  readyAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
}
