import { getSupabase, isSupabaseConfigured } from './supabase';
import { Product, PickupSlot } from './database.types';
import { SEED_PRODUCTS } from './seed-data';

// Boundary between the camelCase UI model and the checked-in SQL schema.
export async function loadCatalogue(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    const { data } = await ((await getSupabase()) as any).from('products').select();
    return data.map((product: Product) => {
      const seed = SEED_PRODUCTS.find(item => item.id === product.id);
      return seed ? { ...product, imagePath: seed.imagePath, imageAlt: seed.imageAlt,
        optionGroups: product.optionGroups?.map(group => ({ ...group, options: group.options.map(option => ({ ...option,
          name: product.categorySlug !== 'chai' && option.name === 'Cutting (120ml)' ? 'Regular cup'
            : product.categorySlug !== 'chai' && option.name === 'Kulhad Mug (220ml)' ? 'Large cup' : option.name,
        })) })),
      } : product;
    });
  }
  const { data, error } = await ((await getSupabase()) as any).from('products').select('*, option_groups(*, option_choices(*))');
  if (error) throw new Error(error.message);
  return (data ?? []).flatMap((row: any) => {
    const seed = SEED_PRODUCTS.find(product => product.slug === row.slug);
    if (!seed) return [];
    return [{
      ...seed, id: row.id, name: row.name, description: row.description,
      basePricePaise: row.base_price_paise, prepMinutes: row.prep_minutes,
      isAvailable: row.is_available,
      optionGroups: (row.option_groups ?? []).map((group: any) => ({
        id: group.id, productId: row.id, name: group.name, minSelect: group.min_select,
        maxSelect: group.max_select, sortOrder: group.display_order,
        options: (group.option_choices ?? []).map((option: any) => ({
          id: option.id, groupId: group.id, name: option.name, priceDeltaPaise: option.price_delta_paise,
          isDefault: option.is_default, isAvailable: option.is_available, sortOrder: option.display_order,
        })),
      })),
    }];
  });
}

export async function loadPickupWindows(): Promise<PickupSlot[]> {
  const { data, error } = await ((await getSupabase()) as any).from('pickup_slots').select();
  if (error) throw new Error(error.message);
  if (!isSupabaseConfigured) return data ?? [];
  return (data ?? []).map((row: any) => ({
    id: row.id, startsAt: row.slot_time,
    endsAt: new Date(new Date(row.slot_time).getTime() + 15 * 60000).toISOString(),
    capacity: row.capacity, remaining: Math.max(0, row.capacity - row.booked),
    isOpen: row.booked < row.capacity,
    status: row.booked >= row.capacity ? 'FULL' : new Date(row.slot_time).getTime() <= Date.now() ? 'PAST_OR_TOO_SOON' : 'AVAILABLE',
  }));
}

export async function placeOrder(input: {
  items: { productId: string; quantity: number; optionIds: string[] }[];
  pickupSlotId: string; customer: { name: string; phone: string; note?: string }; idempotencyKey: string;
}) {
  const payload = isSupabaseConfigured ? {
    p_slot_id: input.pickupSlotId, p_customer_name: input.customer.name,
    p_customer_phone: input.customer.phone, p_customer_email: null,
    p_customer_notes: input.customer.note ?? null,
    p_items: input.items.map(item => ({ productId: item.productId, quantity: item.quantity,
      options: item.optionIds.map(choiceId => ({ choiceId })) })),
  } : input;
  const { data, error } = await ((await getSupabase()) as any).rpc('create_order', payload);
  if (error) throw new Error(error.message);
  if (!data?.trackingToken) throw new Error('Order confirmation is missing. Please check before retrying.');
  return { ...data, displayNumber: data.displayNumber ?? data.orderNumber };
}
