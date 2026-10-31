import { Theme, Category, Product, OptionGroup, PickupSlot } from './database.types';

export const SEED_THEMES: Theme[] = [
  { id: 'theme-adda', slug: 'adda', name: 'Classic Adda', sort_order: 1 },
  { id: 'theme-classics', slug: 'classics', name: 'Café Classics', sort_order: 2 },
  { id: 'theme-lab', slug: 'lab', name: 'Trend Lab', sort_order: 3 },
];

export const SEED_CATEGORIES: Category[] = [
  { id: 'cat-chai', slug: 'chai', name: 'Chai', sort_order: 1 },
  { id: 'cat-coffee', slug: 'coffee', name: 'Coffee & Cocoa', sort_order: 2 },
  { id: 'cat-tea', slug: 'tea', name: 'Tea', sort_order: 3 },
  { id: 'cat-cold', slug: 'cold', name: 'Cold & Iced', sort_order: 4 },
  { id: 'cat-bites', slug: 'bites', name: 'Bites & Buns', sort_order: 5 },
  { id: 'cat-sweets', slug: 'sweets', name: 'Sweets', sort_order: 6 },
];

const BEVERAGE_OPTIONS: OptionGroup[] = [
  {
    id: 'grp-sugar',
    productId: '',
    name: 'Sugar Level',
    minSelect: 1,
    maxSelect: 1,
    sortOrder: 1,
    options: [
      { id: 'opt-sug-reg', groupId: 'grp-sugar', name: 'Regular Sweet', priceDeltaPaise: 0, isDefault: true, isAvailable: true, sortOrder: 1 },
      { id: 'opt-sug-less', groupId: 'grp-sugar', name: 'Less Sugar', priceDeltaPaise: 0, isDefault: false, isAvailable: true, sortOrder: 2 },
      { id: 'opt-sug-none', groupId: 'grp-sugar', name: 'No Sugar / Khari', priceDeltaPaise: 0, isDefault: false, isAvailable: true, sortOrder: 3 },
    ],
  },
  {
    id: 'grp-size',
    productId: '',
    name: 'Cup Size',
    minSelect: 1,
    maxSelect: 1,
    sortOrder: 2,
    options: [
      { id: 'opt-size-reg', groupId: 'grp-size', name: 'Cutting (120ml)', priceDeltaPaise: 0, isDefault: true, isAvailable: true, sortOrder: 1 },
      { id: 'opt-size-large', groupId: 'grp-size', name: 'Kulhad Mug (220ml)', priceDeltaPaise: 2000, isDefault: false, isAvailable: true, sortOrder: 2 },
    ],
  },
];

const SANDWICH_OPTIONS: OptionGroup[] = [
  {
    id: 'grp-cheese',
    productId: '',
    name: 'Add-ons',
    minSelect: 0,
    maxSelect: 1,
    sortOrder: 1,
    options: [
      { id: 'opt-extra-cheese', groupId: 'grp-cheese', name: 'Extra Amul Cheese Slice', priceDeltaPaise: 2000, isDefault: false, isAvailable: true, sortOrder: 1 },
    ],
  },
];

const BOBA_OPTIONS: OptionGroup[] = [
  {
    id: 'grp-boba',
    productId: '',
    name: 'Boba Toppings',
    minSelect: 0,
    maxSelect: 2,
    sortOrder: 1,
    options: [
      { id: 'opt-tapioca', groupId: 'grp-boba', name: 'Brown Sugar Pearls', priceDeltaPaise: 0, isDefault: true, isAvailable: true, sortOrder: 1 },
      { id: 'opt-coconut-jelly', groupId: 'grp-boba', name: 'Coconut Lychee Jelly', priceDeltaPaise: 1500, isDefault: false, isAvailable: true, sortOrder: 2 },
    ],
  },
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    slug: 'adrak-chai',
    name: 'Adrak Chai',
    description: 'Fresh crushed ginger simmered slow with robust Assam CTC and creamy milk.',
    categoryId: 'cat-chai',
    categorySlug: 'chai',
    basePricePaise: 4000,
    prepMinutes: 4,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/adrak-chai.jpg',
    imageAlt: 'Steaming glass of Adrak Chai with ginger slices on stainless steel saucer',
    themes: [
      { themeSlug: 'adda', sortOrder: 1, isFeatured: true, copyOverride: 'Street-side morning energy, sharp crushed ginger bite.' },
      { themeSlug: 'classics', sortOrder: 4, isFeatured: false, copyOverride: 'Comforting ginger milk tea brewed in traditional pots.' },
    ],
    optionGroups: BEVERAGE_OPTIONS,
  },
  {
    id: 'prod-02',
    slug: 'elaichi-chai',
    name: 'Elaichi Chai',
    description: 'Fragrant green cardamom pods cracked fresh into rich slow-boiled milk tea.',
    categoryId: 'cat-chai',
    categorySlug: 'chai',
    basePricePaise: 4000,
    prepMinutes: 4,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/elaichi-chai.jpg',
    imageAlt: 'Cardamom chai in a handcrafted earthen terracotta kulhad cup',
    themes: [
      { themeSlug: 'adda', sortOrder: 2, isFeatured: true, copyOverride: 'Earthen kulhad aroma with fresh green cardamom.' },
    ],
    optionGroups: BEVERAGE_OPTIONS,
  },
  {
    id: 'prod-03',
    slug: 'masala-chai',
    name: 'Masala Chai',
    description: 'Seven-spice house masala blend: star anise, clove, cinnamon, black pepper, and nutmeg.',
    categoryId: 'cat-chai',
    categorySlug: 'chai',
    basePricePaise: 4500,
    prepMinutes: 4,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/masala-chai.jpg',
    imageAlt: 'Spiced Indian masala chai with whole star anise and cinnamon stick',
    themes: [
      { themeSlug: 'adda', sortOrder: 3, isFeatured: true, copyOverride: 'Our signature winter masala recipe, steeped deep.' },
    ],
    optionGroups: BEVERAGE_OPTIONS,
  },
  {
    id: 'prod-04',
    slug: 'cutting-chai',
    name: 'Cutting Chai',
    description: 'Half-measure of strong, sweet, concentrated tapri tea for the quick mid-day break.',
    categoryId: 'cat-chai',
    categorySlug: 'chai',
    basePricePaise: 2500,
    prepMinutes: 3,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/campaign/cutting-chai-v2.png',
    imageAlt: 'Traditional cutting chai in wire carriage rack',
    themes: [
      { themeSlug: 'adda', sortOrder: 5, isFeatured: false, copyOverride: 'The quick half-glass recharge.' },
    ],
    optionGroups: BEVERAGE_OPTIONS,
  },
  {
    id: 'prod-05',
    slug: 'bun-maska',
    name: 'Bun Maska',
    description: 'Soft bakery bun sliced and filled with melting salted Amul butter. Dip straight into chai.',
    categoryId: 'cat-bites',
    categorySlug: 'bites',
    basePricePaise: 4500,
    prepMinutes: 3,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/campaign/bun-maska-v2.png',
    imageAlt: 'Mumbai style bun maska sliced with luscious melting butter layers',
    themes: [
      { themeSlug: 'adda', sortOrder: 4, isFeatured: true, copyOverride: 'Irani café style, generous butter slab.' },
    ],
  },
  {
    id: 'prod-06',
    slug: 'biscuit-plate',
    name: 'Biscuit Plate',
    description: 'A pair of flaky Osmania butter biscuits and two cumin zeera crackers.',
    categoryId: 'cat-bites',
    categorySlug: 'bites',
    basePricePaise: 3000,
    prepMinutes: 2,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/biscuit-plate.jpg',
    imageAlt: 'Crisp cumin and Osmania biscuits on rustic plate',
    themes: [
      { themeSlug: 'adda', sortOrder: 6, isFeatured: false, copyOverride: 'Crisp sweet-and-salt tea dipping pairing.' },
    ],
  },
  {
    id: 'prod-07',
    slug: 'hot-coffee',
    name: 'Hot Filter Coffee',
    description: 'Traditional South Indian filter coffee decoction pulled with frothed whole milk.',
    categoryId: 'cat-coffee',
    categorySlug: 'coffee',
    basePricePaise: 6000,
    prepMinutes: 4,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/hot-coffee.jpg',
    imageAlt: 'Artisanal hot filter coffee in ceramic cup with silky foam',
    themes: [
      { themeSlug: 'classics', sortOrder: 1, isFeatured: true, copyOverride: 'High-crema chicory blend pulled with foam.' },
    ],
    optionGroups: BEVERAGE_OPTIONS,
  },
  {
    id: 'prod-08',
    slug: 'cold-coffee',
    name: 'Classic Cold Coffee',
    description: 'Thick, creamy blended iced coffee topped with chocolate dusting and espresso cream.',
    categoryId: 'cat-cold',
    categorySlug: 'cold',
    basePricePaise: 9000,
    prepMinutes: 5,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/cold-coffee.jpg',
    imageAlt: 'Chilled cold coffee in tall bistro glass with chocolate drip',
    themes: [
      { themeSlug: 'classics', sortOrder: 2, isFeatured: true, copyOverride: 'Chilled nostalgic café cold coffee.' },
      { themeSlug: 'lab', sortOrder: 4, isFeatured: false, copyOverride: 'Thick blended double-shot shake.' },
    ],
  },
  {
    id: 'prod-09',
    slug: 'lemon-tea',
    name: 'Fresh Lemon Tea',
    description: 'Clear steeped black tea with fresh hand-squeezed lemon and sweet mint.',
    categoryId: 'cat-tea',
    categorySlug: 'tea',
    basePricePaise: 5000,
    prepMinutes: 3,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/lemon-tea.jpg',
    imageAlt: 'Clear golden steeped lemon tea with lemon wheels and fresh mint',
    themes: [
      { themeSlug: 'classics', sortOrder: 5, isFeatured: false, copyOverride: 'Clean, citrusy, and refreshing.' },
    ],
  },
  {
    id: 'prod-10',
    slug: 'ginger-tea',
    name: 'Herbal Ginger Tea',
    description: 'Dairy-free infusion of fresh crushed ginger root with wild honey and lemon.',
    categoryId: 'cat-tea',
    categorySlug: 'tea',
    basePricePaise: 5000,
    prepMinutes: 3,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/ginger-tea.jpg',
    imageAlt: 'Steeping herbal ginger tea in contemporary glass teacup',
    themes: [
      { themeSlug: 'classics', sortOrder: 6, isFeatured: false, copyOverride: 'Gentle warmth for throat and mind.' },
    ],
  },
  {
    id: 'prod-11',
    slug: 'veg-grilled-sandwich',
    name: 'Veg Grilled Sandwich',
    description: 'Toasted white bread stuffed with spiced potato, cucumber, tomato, mint chutney, and molten cheese.',
    categoryId: 'cat-bites',
    categorySlug: 'bites',
    basePricePaise: 9000,
    prepMinutes: 8,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/veg-grilled-sandwich.jpg',
    imageAlt: 'Grilled vegetable club sandwich with golden char and melted cheese',
    themes: [
      { themeSlug: 'classics', sortOrder: 3, isFeatured: true, copyOverride: 'Mumbai street toastie style with green chutney.' },
    ],
    optionGroups: SANDWICH_OPTIONS,
  },
  {
    id: 'prod-12',
    slug: 'hot-chocolate',
    name: 'Artisan Hot Chocolate',
    description: 'Melted single-origin dark cocoa churned with steamed whole milk and vanilla bean.',
    categoryId: 'cat-coffee',
    categorySlug: 'coffee',
    basePricePaise: 9500,
    prepMinutes: 5,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/hot-chocolate.jpg',
    imageAlt: 'Rich dark hot chocolate with cocoa dusting in artisanal mug',
    themes: [
      { themeSlug: 'classics', sortOrder: 7, isFeatured: false, copyOverride: 'Pure chocolate decadence.' },
    ],
  },
  {
    id: 'prod-13',
    slug: 'chocolate-pastry',
    name: 'Belgian Truffle Pastry',
    description: 'Layered dark chocolate sponge with silky chocolate truffle ganache.',
    categoryId: 'cat-sweets',
    categorySlug: 'sweets',
    basePricePaise: 8500,
    prepMinutes: 2,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/chocolate-pastry.jpg',
    imageAlt: 'Belgian chocolate gateau slice with glossy mirror ganache',
    themes: [
      { themeSlug: 'classics', sortOrder: 8, isFeatured: false, copyOverride: 'Silky afternoon sweet bite.' },
    ],
  },
  {
    id: 'prod-14',
    slug: 'iced-coffee',
    name: 'Citrus Tonic Cold Brew',
    description: '16-hour slow steep cold brew poured over tonic water, crystal ice, and fresh orange peel.',
    categoryId: 'cat-cold',
    categorySlug: 'cold',
    basePricePaise: 10000,
    prepMinutes: 5,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/iced-coffee.jpg',
    imageAlt: 'Double espresso tonic with clear artisanal ice cubes and citrus twist',
    themes: [
      { themeSlug: 'lab', sortOrder: 1, isFeatured: true, copyOverride: 'Fizzy, crisp, double-shot cold brew.' },
    ],
  },
  {
    id: 'prod-15',
    slug: 'matcha-latte',
    name: 'Uji Matcha Oat Latte',
    description: 'Ceremonial grade Japanese green tea whisked with silky steamed oat milk.',
    categoryId: 'cat-cold',
    categorySlug: 'cold',
    basePricePaise: 14000,
    prepMinutes: 5,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/matcha-latte.jpg',
    imageAlt: 'Layered ceremonial Japanese matcha latte with oat milk in fluted glass',
    themes: [
      { themeSlug: 'lab', sortOrder: 2, isFeatured: true, copyOverride: 'Vibrant antioxidant layer with creamy oat milk.' },
    ],
    optionGroups: BEVERAGE_OPTIONS,
  },
  {
    id: 'prod-16',
    slug: 'boba-tea',
    name: 'Brown Sugar Pearl Boba',
    description: 'Rich roasted milk tea with warm brown sugar syrup and chewy black tapioca boba pearls.',
    categoryId: 'cat-cold',
    categorySlug: 'cold',
    basePricePaise: 15000,
    prepMinutes: 6,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/boba-tea.jpg',
    imageAlt: 'Brown sugar boba milk tea with chewy tapioca pearls and bamboo straw',
    themes: [
      { themeSlug: 'lab', sortOrder: 3, isFeatured: false, copyOverride: 'Taiwanese style brown sugar marbling.' },
    ],
    optionGroups: BOBA_OPTIONS,
  },
  {
    id: 'prod-17',
    slug: 'butter-croissant',
    name: 'Artisan Butter Croissant',
    description: 'Hand-laminated flaky French pastry baked fresh daily with pure cultured butter.',
    categoryId: 'cat-bites',
    categorySlug: 'bites',
    basePricePaise: 9000,
    prepMinutes: 2,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/butter-croissant.jpg',
    imageAlt: 'Flaky French butter croissant with golden honeycomb lamination',
    themes: [
      { themeSlug: 'lab', sortOrder: 5, isFeatured: true, copyOverride: 'Airy honeycomb layers with cultured butter.' },
    ],
  },
  {
    id: 'prod-18',
    slug: 'jalapeno-cheese-sandwich',
    name: 'Jalapeño Melt Toastie',
    description: 'Artisanal sourdough stuffed with aged white cheddar, spicy pickled jalapeños, and smoked paprika.',
    categoryId: 'cat-bites',
    categorySlug: 'bites',
    basePricePaise: 12000,
    prepMinutes: 8,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/jalapeno-cheese-sandwich.jpg',
    imageAlt: 'Sourdough toast with sharp cheddar melt and spicy pickled jalapeño',
    themes: [
      { themeSlug: 'lab', sortOrder: 6, isFeatured: false, copyOverride: 'Crisp sourdough crust with fiery jalapeño bite.' },
    ],
    optionGroups: SANDWICH_OPTIONS,
  },
  {
    id: 'prod-19',
    slug: 'brownie',
    name: 'Sea Salt Fudgy Brownie',
    description: '70% dark Belgian chocolate brownie with a cracked crinkle top and flaky Maldon sea salt.',
    categoryId: 'cat-sweets',
    categorySlug: 'sweets',
    basePricePaise: 8000,
    prepMinutes: 2,
    isAvailable: true,
    isArchived: false,
    imagePath: '/images/brownie.jpg',
    imageAlt: 'Fudgy dark chocolate brownie square sprinkled with Maldon sea salt',
    themes: [
      { themeSlug: 'classics', sortOrder: 9, isFeatured: false, copyOverride: 'Warm dark chocolate indulgence.' },
      { themeSlug: 'lab', sortOrder: 7, isFeatured: false, copyOverride: 'Salted dark chocolate square.' },
    ],
  },
];

// Generate rolling 15-minute pickup slots starting from next 15-minute window
export function generateDemoPickupSlots(): PickupSlot[] {
  const slots: PickupSlot[] = [];
  const now = new Date();

  // Round up to next 15-minute interval + 15 min buffer
  const startMs = Math.ceil(now.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000) + 15 * 60 * 1000;

  for (let i = 0; i < 16; i++) {
    const slotStart = new Date(startMs + i * 15 * 60 * 1000);
    const slotEnd = new Date(slotStart.getTime() + 15 * 60 * 1000);

    const hour = slotStart.getHours();
    const min = slotStart.getMinutes();
    const slotId = `slot-${slotStart.toISOString().slice(0, 10)}-${hour.toString().padStart(2, '0')}${min.toString().padStart(2, '0')}`;

    let status: 'AVAILABLE' | 'FULL' | 'CLOSED' | 'PAST_OR_TOO_SOON' = 'AVAILABLE';
    let remaining = 6;

    if (i === 3) {
      // simulate one filling fast
      status = 'AVAILABLE';
      remaining = 2;
    } else if (i === 7) {
      // simulate one fully booked
      status = 'FULL';
      remaining = 0;
    }

    slots.push({
      id: slotId,
      startsAt: slotStart.toISOString(),
      endsAt: slotEnd.toISOString(),
      capacity: 6,
      remaining,
      isOpen: status !== 'FULL',
      status,
    });
  }

  return slots;
}
