/* =========================================================
   CONFIG — paste your Apps Script Web App URL to go live.
   Leave blank = demo mode (everything runs on this device).
   ========================================================= */
const CONFIG = {
  GAS_URL: '',                       // e.g. 'https://script.google.com/macros/s/AKfy.../exec'
  DEMO_PIN: '2580',
};
/* v2/assets/app.js → ROOT = v2/. Photos live in v2/img, music is shared with v1. */
const ROOT = new URL('../', document.currentScript ? document.currentScript.src : location.href);
const PAGE = document.body.dataset.page || 'order';
const href = p => new URL(p, ROOT).href;
const DEMO = !CONFIG.GAS_URL;

/* ---------- tiny utilities ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rupees = p => '₹' + (p / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 });
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const wait = ms => new Promise(r => setTimeout(r, ms));
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const img = p => href('img/' + p);
const aud = p => href('../client/public/audio/' + p.replace(/^\/?audio\//, ''));
// Only after the visitor has interacted: Chrome blocks (and logs) vibrate() before that.
const haptic = (p = 8) => { try { if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(p); } catch {} };
const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

/* =========================================================
   Spring physics → CSS linear() easing (same model Framer Motion uses:
   stiffness, damping, mass). Computed once, used by CSS and WAAPI.
   ========================================================= */
function spring(stiffness, damping, mass = 1) {
  const w0 = Math.sqrt(stiffness / mass), z = damping / (2 * Math.sqrt(stiffness * mass));
  const wd = w0 * Math.sqrt(Math.max(1e-6, 1 - z * z));
  const x = t => z < 1 ? 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t)) : 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  let T = 0.2; for (let t = 0; t < 4; t += 1 / 120) if (Math.abs(1 - x(t)) > 0.002) T = t;
  const n = 56, pts = []; for (let i = 0; i <= n; i++) pts.push(+x(T * i / n).toFixed(4)); pts[n] = 1;
  return { ease: `linear(${pts.join(', ')})`, ms: Math.round(T * 1000) };
}
const SPR = {};
(() => {
  const ok = CSS.supports('transition-timing-function', 'linear(0, 1)');
  const presets = { soft: [140, 18], snappy: [320, 30], bounce: [260, 14] };
  for (const [k, [s, d]] of Object.entries(presets)) {
    const sp = spring(s, d);
    SPR[k] = ok ? sp : { ease: getComputedStyle(document.documentElement).getPropertyValue('--ease-' + k), ms: sp.ms };
    if (ok) { document.documentElement.style.setProperty('--ease-' + k, sp.ease); document.documentElement.style.setProperty('--dur-' + k, sp.ms + 'ms'); }
  }
})();
function anim(el, frames, preset = 'soft', opts = {}) {
  if (!el || !el.animate) return Promise.resolve();
  const s = SPR[preset];
  const a = el.animate(frames, { duration: RM ? 1 : (opts.duration || s.ms), easing: opts.easing || s.ease, fill: opts.fill || 'none', delay: opts.delay || 0 });
  return a.finished.catch(() => {});
}

/* =========================================================
   Menu data (mirrors the Sheet; in live mode the Sheet wins)
   ========================================================= */
let GROUPS = {
  sugar: { type: 'one', label: 'Sugar', options: [{ id: 'sugar.reg', label: 'Regular', deltaPaise: 0 }, { id: 'sugar.less', label: 'Less sugar', deltaPaise: 0 }, { id: 'sugar.none', label: 'No sugar', deltaPaise: 0 }] },
  size_adda: { type: 'one', label: 'Size', options: [{ id: 'size.cut', label: 'Cutting · 120 ml', deltaPaise: 0 }, { id: 'size.kulhad', label: 'Kulhad · 220 ml', deltaPaise: 2000 }] },
  size_cafe: { type: 'one', label: 'Size', options: [{ id: 'size.reg', label: 'Regular', deltaPaise: 0 }, { id: 'size.lg', label: 'Large', deltaPaise: 2000 }] },
  cheese: { type: 'many', label: 'Add-ons', options: [{ id: 'cheese.extra', label: 'Extra cheese', deltaPaise: 2000 }] },
  boba: { type: 'many', label: 'Toppings', options: [{ id: 'boba.pearls', label: 'Brown sugar pearls', deltaPaise: 0 }, { id: 'boba.lychee', label: 'Lychee jelly', deltaPaise: 1500 }] },
};
const M = (id, name, era, category, price, prep, image, alt, blurb, options = []) => ({ id, name, era, category, pricePaise: price * 100, prep, image, alt, blurb, options, available: true });
let MENU = [
  M('masala-chai', 'Masala Chai', 'adda', 'chai', 45, 4, 'masala-chai.webp', 'Masala chai in a white cup with spiced biscuits', 'Seven-spice house masala, steeped deep over a slow flame.', ['sugar', 'size_adda']),
  M('adrak-chai', 'Adrak Chai', 'adda', 'chai', 40, 4, 'adrak-chai.webp', 'Steaming glass of adrak chai with ginger slices on a steel saucer', 'Hand-crushed ginger and Assam CTC. The street-side morning bite.', ['sugar', 'size_adda']),
  M('elaichi-chai', 'Elaichi Chai', 'adda', 'chai', 40, 4, 'elaichi-chai.webp', 'Cardamom chai in an earthen kulhad cup surrounded by green cardamom pods', 'Green cardamom cracked fresh into rich slow-boiled milk tea.', ['sugar', 'size_adda']),
  M('cutting-chai', 'Cutting Chai', 'adda', 'chai', 25, 3, 'cutting-chai.webp', 'Half glass of strong cutting chai on a saucer', 'The quick half-glass recharge. Strong, sweet, tapri style.', ['sugar', 'size_adda']),
  M('bun-maska', 'Bun Maska', 'adda', 'bites', 45, 3, 'bun-maska.webp', 'Soft bakery bun split and filled with melting butter', 'Soft bakery bun with a generous slab of salted butter. Dip it.'),
  M('biscuit-plate', 'Biscuit Plate', 'adda', 'bites', 30, 2, 'biscuit-plate.webp', 'Osmania butter biscuits and cumin crackers on a rustic plate', 'Osmania butter biscuits and cumin crackers for dunking.'),
  M('cold-coffee', 'Classic Cold Coffee', 'y2k', 'cold', 90, 5, 'cold-coffee.webp', 'Tall glass of blended cold coffee with a chocolate drizzle', 'Thick, frothy, blended. The coffee-house shake you split two ways.'),
  M('hot-coffee', 'Hot Filter Coffee', 'y2k', 'coffee', 60, 4, 'hot-coffee.webp', 'Hot filter coffee in a ceramic cup with silky foam', 'South Indian decoction pulled high with frothed milk.', ['sugar', 'size_cafe']),
  M('hot-chocolate', 'Hot Chocolate', 'y2k', 'coffee', 95, 5, 'hot-chocolate.webp', 'Mug of dark hot chocolate dusted with cocoa', 'Dark cocoa churned with steamed milk. Rainy-day essential.'),
  M('veg-grilled-sandwich', 'Veg Grilled Sandwich', 'y2k', 'bites', 90, 8, 'veg-grilled-sandwich.webp', 'Grilled vegetable sandwich with a golden crust and melted cheese', 'Bombay-style toastie with green chutney and molten cheese.', ['cheese']),
  M('chocolate-pastry', 'Truffle Pastry', 'y2k', 'sweets', 85, 2, 'chocolate-pastry.webp', 'Slice of layered chocolate truffle pastry with glossy ganache', 'Dark sponge layered with silky truffle ganache.'),
  M('brownie', 'Sea Salt Brownie', 'y2k', 'sweets', 80, 2, 'brownie.webp', 'Fudgy dark chocolate brownie square with flaky sea salt', '70% dark chocolate with a crackle top and flaky salt.'),
  M('matcha-latte', 'Uji Matcha Oat Latte', 'cafe', 'cold', 140, 5, 'matcha-latte.webp', 'Layered matcha latte with oat milk in a fluted glass', 'Ceremonial grade matcha whisked over silky oat milk.', ['sugar', 'size_cafe']),
  M('iced-coffee', 'Citrus Tonic Cold Brew', 'cafe', 'cold', 100, 5, 'iced-coffee.webp', 'Espresso tonic over clear ice with an orange twist', '16-hour cold brew over tonic, crystal ice and orange peel.'),
  M('boba-tea', 'Brown Sugar Pearl Boba', 'cafe', 'cold', 150, 6, 'boba-tea.webp', 'Brown sugar boba milk tea with tapioca pearls and a straw', 'Roasted milk tea, warm brown sugar marbling, chewy pearls.', ['boba']),
  M('lemon-tea', 'Fresh Lemon Tea', 'cafe', 'tea', 50, 3, 'lemon-tea.webp', 'Golden lemon tea with lemon wheels and fresh mint', 'Clear black tea, hand-squeezed lemon and sweet mint.'),
  M('ginger-tea', 'Herbal Ginger Tea', 'cafe', 'tea', 50, 3, 'ginger-tea.webp', 'Herbal ginger tea steeping in a glass teacup', 'Dairy-free ginger root infusion with honey and lemon.'),
  M('butter-croissant', 'Butter Croissant', 'cafe', 'bites', 90, 2, 'butter-croissant.webp', 'Flaky butter croissant showing honeycomb layers', 'Hand-laminated, honeycomb layers, cultured butter.'),
  M('jalapeno-cheese-sandwich', 'Jalapeño Melt Toastie', 'cafe', 'bites', 120, 8, 'jalapeno-cheese-sandwich.webp', 'Sourdough toastie with melted cheddar and pickled jalapeño', 'Sourdough, aged cheddar and pickled jalapeño heat.', ['cheese']),
];
const CATS = { chai: 'Chai', bites: 'Bites & buns', cold: 'Cold & iced', coffee: 'Coffee & cocoa', tea: 'Tea', sweets: 'Sweets' };
const ERA_KEYS = ['adda', 'y2k', 'cafe'];
const ERA = {
  adda: {
    year: '1900s', name: 'The Adda', chapter: 'Chapter I · The 1900s', title: 'The original <em>adda.</em>',
    sub: 'Slow-simmered chai, poured for long conversations. Pay with UPI, pick up with a token.',
    scene: 'scene-1900s', sceneAlt: 'A lantern-lit chai stall on an old city street at dusk, a glass of chai and a brass kettle on the counter',
    featured: ['masala-chai', 'adrak-chai', 'bun-maska', 'elaichi-chai'],
    words: ['Assam CTC', 'Hand-crushed ginger', 'Clay kulhads', 'Brass kettles', 'Bun maska', 'Slow flame', 'Seven spices'],
    pairs: [['Morning tapri', 'cutting-chai', 'bun-maska'], ['Evening adda', 'masala-chai', 'biscuit-plate'], ['Ginger & butter', 'adrak-chai', 'bun-maska']],
    soundTitle: 'Evergreen <em>Bollywood</em>, on tape.', soundSub: 'A 90-minute cassette of film songs, from Kalaakaar to Kuch Kuch Hota Hai. It plays while your chai brews, and nothing downloads until you press play.',
    player: 'cassette', deck: ['WM-1900 · Stereo cassette', 'Type I · 90 min'], queue: 'On this tape', pass: '1900s adda', stamp: 'Adda', prefix: 'A', theme: '#0E0A07',
  },
  y2k: {
    year: '2000s', name: 'The Coffee House', chapter: 'Chapter II · The 2000s', title: 'The coffee-house <em>years.</em>',
    sub: 'Cold coffee, hot chocolate and grilled sandwiches, the café you bunked class for. Pay with UPI, pick up with a token.',
    scene: 'collage', sceneAlt: '',
    featured: ['cold-coffee', 'hot-chocolate', 'veg-grilled-sandwich', 'brownie'],
    words: ['Frothy cold coffee', 'Grilled sandwiches', 'Hot chocolate', 'Fudge brownies', 'Mixtapes', 'Burnt CDs', 'Bunked lectures'],
    pairs: [['Coffee date', 'cold-coffee', 'brownie'], ['Rainy afternoon', 'hot-chocolate', 'chocolate-pastry'], ['Canteen classic', 'hot-coffee', 'veg-grilled-sandwich']],
    soundTitle: 'The <em>Discman</em> years.', soundSub: 'Songs from 2007 to 2015, burnt onto one disc for the walk to college. Nothing downloads until you press play.',
    player: 'discman', deck: ['CD-2000 · Anti-skip', 'Compact disc'], queue: 'On this disc', pass: '2000s coffee house', stamp: '2000s', prefix: 'Y', theme: '#0A0C11',
  },
  cafe: {
    year: '2020s', name: 'The Café', chapter: 'Chapter III · The 2020s', title: 'The new <em>café.</em>',
    sub: 'Cold brew, matcha and pastry for the in-between hours. No login, no queue.',
    scene: 'scene-2020s', sceneAlt: 'A bright modern café with plants and arched windows, an iced coffee and a burger on a marble table',
    featured: ['matcha-latte', 'iced-coffee', 'boba-tea', 'butter-croissant'],
    words: ['Ceremonial matcha', '16-hour cold brew', 'Oat milk', 'Laminated butter', 'Brown sugar pearls', 'Tonic fizz'],
    pairs: [['Study break', 'matcha-latte', 'butter-croissant'], ['Lunch counter', 'jalapeno-cheese-sandwich', 'lemon-tea'], ['Fizz & flake', 'iced-coffee', 'butter-croissant']],
    soundTitle: 'Café <em>radio</em>, made for waiting.', soundSub: 'New-school Bollywood from 2016 to now, for the in-between hours. Nothing downloads until you press play.',
    player: 'turntable', deck: ['Café radio · Now playing', 'Local library'], queue: 'Up next', pass: '2020s café', stamp: 'Café', prefix: 'C', theme: '#F4F1EB',
  },
};
const byId = id => MENU.find(m => m.id === id);

/* 1900s cassette: one continuous recording, split into chapters (credits only). */
const ADDA_TRACKS = [{"title": "Neele Neele Ambar Par", "artist": "Kishore Kumar", "music": "Kalyanji-Anandji", "words": "Indeevar", "film": "Kalaakaar", "year": "1983", "start": 0, "dur": 318, "aura": "#1E3A8A"},
  {"title": "Ae Kash Ke Hum", "artist": "Kumar Sanu", "music": "Jatin-Lalit", "words": "Majrooh Sultanpuri", "film": "Kabhi Haan Kabhi Naa", "year": "1994", "start": 318, "dur": 306, "aura": "#D97706"},
  {"title": "Yeh Ladka Hai Allah", "artist": "Udit Narayan, Alka Yagnik", "music": "Jatin-Lalit", "words": "Sameer Anjaan", "film": "Kabhi Khushi Kabhie Gham", "year": "2001", "start": 624, "dur": 324, "aura": "#059669"},
  {"title": "Saajanji Ghar Aaye", "artist": "Kumar Sanu, Alka Yagnik, Kavita K.", "music": "Jatin-Lalit", "words": "Sameer Anjaan", "film": "Kuch Kuch Hota Hai", "year": "1998", "start": 948, "dur": 433, "aura": "#DB2777"},
  {"title": "Tujhe Yaad Na Meri Aayee", "artist": "Udit Narayan, Alka Yagnik, Manpreet A.", "music": "Jatin-Lalit", "words": "Sameer Anjaan", "film": "Kuch Kuch Hota Hai", "year": "1998", "start": 1381, "dur": 421, "aura": "#DC2626"},
  {"title": "Say Shava Shava", "artist": "Aadesh Shrivastava, Sudesh Bhosle, Sunidhi C.", "music": "Aadesh Shrivastava", "words": "Sameer Anjaan", "film": "Kabhi Khushi Kabhie Gham", "year": "2001", "start": 1802, "dur": 408, "aura": "#EA580C"},
  {"title": "Raat Ka Nasha", "artist": "K.S. Chithra", "music": "Anu Malik", "words": "Gulzar", "film": "Asoka", "year": "2001", "start": 2210, "dur": 312, "aura": "#4338CA"},
  {"title": "Babuji Zara Dheere Chalo", "artist": "Sonu Kakkar, Sukhwinder Singh", "music": "Sandeep Chowta", "words": "Abbas Tyrewala", "film": "Dum", "year": "2003", "start": 2522, "dur": 297, "aura": "#C2410C"},
  {"title": "Woh To Hai Albela", "artist": "Kumar Sanu, Devaki Pandit", "music": "Jatin-Lalit", "words": "Majrooh Sultanpuri", "film": "Kabhi Haan Kabhi Naa", "year": "1994", "start": 2819, "dur": 307, "aura": "#CA8A04"},
  {"title": "San Sanana", "artist": "Alka Yagnik, Hema Sardesai", "music": "Anu Malik", "words": "Anand Bakshi", "film": "Asoka", "year": "2001", "start": 3126, "dur": 354, "aura": "#0D9488"},
  {"title": "Banke Tera Jogi", "artist": "Sonu Nigam, Alka Yagnik", "music": "Jatin-Lalit", "words": "Javed Akhtar", "film": "Phir Bhi Dil Hai Hindustani", "year": "2000", "start": 3480, "dur": 281, "aura": "#E11D48"},
  {"title": "Aye Zindagi Gale Lagaa Le", "artist": "Suresh Wadkar", "music": "Ilaiyaraaja", "words": "Gulzar", "film": "Sadma", "year": "1983", "start": 3761, "dur": 329, "aura": "#65A30D"},
  {"title": "Woh Pehli Baar", "artist": "Shaan", "music": "Vishal-Shekhar", "words": "Raj Kaushal", "film": "Pyaar Mein Kabhi Kabhi", "year": "1999", "start": 4090, "dur": 259, "aura": "#0284C7"},
  {"title": "Dil Pardesi Ho Gayaa", "artist": "Sonu Nigam, Alka Yagnik", "music": "Usha Khanna", "words": "Saawan Kumar", "film": "Dil Pardesi Ho Gayaa", "year": "2003", "start": 4349, "dur": 345, "aura": "#B45309"},
  {"title": "Neele Neele Ambar Par (Female)", "artist": "Sadhana Sargam", "music": "Kalyanji-Anandji", "words": "Indeevar", "film": "Kalaakaar", "year": "1983", "start": 4694, "dur": 260, "aura": "#2563EB"}];


/** Same pricing rules as Code.gs → priceCart_(). The server re-runs this; the UI only previews. */
function priceLine(line) {
  const item = byId(line.id); if (!item) return null;
  let unit = item.pricePaise; const labels = [];
  for (const gid of item.options) {
    const g = GROUPS[gid]; if (!g) continue;
    let picks = g.options.filter(o => line.opts.includes(o.id));
    if (g.type === 'one' && !picks.length) picks = [g.options[0]];
    picks.forEach(o => { unit += o.deltaPaise; labels.push(o.label); });
  }
  return { item, unit, labels, total: unit * line.qty };
}

/* =========================================================
   State
   ========================================================= */
const S = {
  era: ERA_KEYS.includes(ls.get('cw2.era', 'adda')) ? ls.get('cw2.era', 'adda') : 'adda',
  cart: ls.get('cw2.cart', []),               // [{key,id,qty,opts}]
  profile: ls.get('cw2.profile', { name: '', phone: '' }),
  tickets: ls.get('cw2.tickets', []),          // [{ticket, token, day}]
  open: null,                                  // expanded card id
  draft: {},                                   // id -> {opts, qty}
  last: {},                                    // ticket -> last status
};
const today = () => new Date().toLocaleDateString('en-CA');
S.tickets = S.tickets.filter(t => t.day === today());
const save = () => { ls.set('cw2.cart', S.cart); ls.set('cw2.tickets', S.tickets); ls.set('cw2.era', S.era); };
const cartCount = () => S.cart.reduce((a, l) => a + l.qty, 0);
const cartTotal = () => S.cart.reduce((a, l) => a + (priceLine(l)?.total || 0), 0);

/* =========================================================
   API — live (Apps Script) or demo (this device)
   ========================================================= */
const Live = {
  async get(action, params = {}) {
    const r = await fetch(CONFIG.GAS_URL + '?' + new URLSearchParams({ action, ...params }));
    const j = await r.json(); if (!j.ok) throw new Error(j.error || 'Request failed'); return j;
  },
  async post(body) {
    const r = await fetch(CONFIG.GAS_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) });
    const j = await r.json(); if (!j.ok) throw new Error(j.error || 'Request failed'); return j;
  },
  menu: () => Live.get('menu'),
  queue: () => Live.get('queue'),
  status: t => Live.get('status', { ticket: t }),
  lookup: p => Live.get('lookup', { phone: p }),
  board: () => Live.get('board'),
  create: b => Live.post({ action: 'create', ...b }),
  verify: b => Live.post({ action: 'verify', ...b }),
  counter: {
    list: pin => Live.post({ action: 'counter.list', pin }),
    advance: (pin, orderId, to) => Live.post({ action: 'counter.advance', pin, orderId, to }),
    collect: (pin, ticket) => Live.post({ action: 'counter.collect', pin, ticket }),
    collectToken: (pin, token) => Live.post({ action: 'counter.collectToken', pin, token }),
  },
};

const Demo = (() => {
  const K = 'cw2.demo';
  const db = () => ls.get(K, { day: today(), seq: 0, orders: [] });
  const put = d => { ls.set(K, d); };
  const fresh = () => { const d = db(); if (d.day !== today()) { const n = { day: today(), seq: 0, orders: [] }; put(n); return n; } return d; };
  const view = o => ({ ...o, ticket: o.orderId + '.demo' });
  const queue = d => { const a = d.orders.filter(o => o.status === 'PAID' || o.status === 'BREWING').length; return { ahead: a, eta: Math.round(4 + a * 1.5) }; };
  const find = (d, t) => d.orders.find(o => o.orderId + '.demo' === t);
  const lag = (ms = 380) => wait(ms + Math.random() * 300);   // feel like a real network
  return {
    async menu() { return null; },
    async queue() { await lag(150); return queue(fresh()); },
    async create(b) {
      await lag();
      if (!b.items.length) throw new Error('Your bag is empty.');
      let total = 0, prep = 0;
      const lines = b.items.map(l => { const p = priceLine(l); if (!p) throw new Error('Unknown item'); total += p.total; prep = Math.max(prep, p.item.prep); return { id: l.id, name: p.item.name, qty: l.qty, opts: p.labels, unitPaise: p.unit }; });
      const d = fresh();
      const orderId = 'CW' + today().replace(/-/g, '').slice(2) + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      d.orders.push({ orderId, era: b.era, name: b.name, phone: b.phone, items: lines, amount: total, status: 'CREATED', created: Date.now(), eta: prep });
      put(d);
      return { orderId, ticket: orderId + '.demo', rzpOrderId: 'order_demo', amount: total, lines };
    },
    async verify(b) {
      await lag(700);
      const d = fresh(); const o = d.orders.find(x => x.orderId === b.orderId); if (!o) throw new Error('Order not found');
      if (!o.token) { d.seq++; o.token = (ERA[o.era] || ERA.adda).prefix + '-' + String(d.seq).padStart(3, '0'); o.status = 'PAID'; o.paidAt = Date.now(); o.eta = Math.max(o.eta, queue(d).eta); }
      put(d); return view(o);
    },
    async status(t) {
      const d = fresh(); const o = find(d, t); if (!o) throw new Error('This ticket is not valid.');
      const out = view(o);
      if (o.status === 'PAID' || o.status === 'BREWING') out.ahead = d.orders.filter(x => (x.status === 'PAID' || x.status === 'BREWING') && x.paidAt < o.paidAt).length;
      return out;
    },
    async lookup(p) { await lag(); return { orders: fresh().orders.filter(o => o.phone === p && o.token).map(o => ({ token: o.token, status: o.status, ticket: o.orderId + '.demo' })) }; },
    async board() { const d = fresh(); const pick = s => d.orders.filter(o => o.status === s).map(o => o.token); return { brewing: pick('PAID').concat(pick('BREWING')), ready: pick('READY') }; },
    counter: {
      async list(pin) { if (pin !== CONFIG.DEMO_PIN) throw new Error('Wrong PIN.'); ls.set('cw2.demo.counter', Date.now()); const d = fresh(); return { orders: d.orders.filter(o => o.token).map(view), queue: queue(d) }; },
      async advance(pin, orderId, to) {
        const d = fresh(); const o = d.orders.find(x => x.orderId === orderId);
        const NEXT = { PAID: 'BREWING', BREWING: 'READY', READY: 'COLLECTED' };
        if (!o || NEXT[o.status] !== to) throw new Error('Cannot move this order.');
        o.status = to; if (to === 'READY') o.readyAt = Date.now(); if (to === 'COLLECTED') o.collectedAt = Date.now(); put(d); return view(o);
      },
      async collect(pin, t) { const d = fresh(); return Demo._collect(d, find(d, t)); },
      async collectToken(pin, tk) { const d = fresh(); const o = d.orders.find(x => x.token === String(tk).toUpperCase()); if (!o) throw new Error('No token ' + tk + ' today.'); return Demo._collect(d, o); },
    },
    _collect(d, o) {
      if (!o) throw new Error('This ticket is not valid.');
      if (o.status === 'COLLECTED') return { ...view(o), already: true };
      if (!['PAID', 'BREWING', 'READY'].includes(o.status)) throw new Error('This order is not paid.');
      o.status = 'COLLECTED'; o.collectedAt = Date.now(); put(d); return view(o);
    },
    /** With no counter tab open, demo orders move on their own so the flow can be shown solo. */
    autopilot() {
      const alive = Date.now() - ls.get('cw2.demo.counter', 0) < 12000;
      if (alive) return;
      const d = fresh(); let changed = false;
      const mine = new Set(S.tickets.map(t => t.ticket));
      d.orders.forEach(o => {
        if (!mine.has(o.orderId + '.demo')) return;
        if (o.status === 'PAID' && Date.now() - o.paidAt > 7000) { o.status = 'BREWING'; o.brewAt = Date.now(); changed = true; }
        else if (o.status === 'BREWING' && Date.now() - (o.brewAt || o.paidAt) > 12000) { o.status = 'READY'; o.readyAt = Date.now(); changed = true; }
      });
      if (changed) put(d);
    },
  };
})();
const API = DEMO ? Demo : Live;

/* =========================================================
   Icons (stroke, 1.6)
   ========================================================= */
const I = {
  plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  left: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
  right: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
  x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  play: '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
  pause: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.3"/><rect x="14" y="5" width="4" height="14" rx="1.3"/></svg>',
  prev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 6.5v11a1 1 0 0 1-1.55.83L9 13.2V17a1 1 0 1 1-2 0V7a1 1 0 1 1 2 0v3.8l7.45-5.13A1 1 0 0 1 18 6.5z"/></svg>',
  next: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6.5v11a1 1 0 0 0 1.55.83L15 13.2V17a1 1 0 1 0 2 0V7a1 1 0 1 0-2 0v3.8L7.55 5.67A1 1 0 0 0 6 6.5z"/></svg>',
  vol: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h3.5L12 19V5L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  clock: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  lock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  scan: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M7 12h10"/></svg>',
  tv: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8"/></svg>',
  pick: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9h12l-1.5 10a2 2 0 0 1-2 1.7h-5a2 2 0 0 1-2-1.7z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H16.5M9 3c0 1.5 1 1.5 1 3M13 3c0 1.5 1 1.5 1 3"/></svg>',
  upi: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M10 6h4M9.5 14l2 2 3.5-4"/></svg>',
  ticket: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14 6v12" stroke-dasharray="2 2"/></svg>',
};
/* Brand mark: the kettle under the café arch (kettle knocked out, so it takes the era's accent colour). */
const LOGO = `<svg viewBox="34 22 132 172" class="logo-mark" width="26" height="34" aria-hidden="true" focusable="false"><defs><mask id="cwlogo" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect width="200" height="200" fill="#fff"/><g transform="translate(42.9,55.2) scale(0.7)"><g> <path d="M71 92 C60 26 140 26 129 92" fill="none" stroke="#000" stroke-width="8.5" stroke-linecap="round"/> <path d="M77 82 C81 69 119 69 123 82 Z" fill="#000"/><rect x="97" y="56" width="6" height="14" rx="3" fill="#000"/><circle cx="100" cy="55" r="6.5" fill="#000"/> <path d="M77 82 C70 98 56 110 56 129 C56 151 76 163 100 163 C124 163 144 151 144 129 C144 110 130 98 123 82 Z" fill="#000"/> <path d="M75 161 H125 L121 170 H79 Z" fill="#000"/> <path d="M63 138 C45 136 35 120 25 98 C23 94 19 92 13 92 L13 86 C22 85 29 89 33 96 C41 112 49 120 65 122 Z" fill="#000"/> <path d="M66 104 C85 98 115 98 134 104" fill="none" stroke="#000" stroke-width="2.2"/> <path d="M102.2 148.6Q95.4 148.6 92.4 144.3Q89.3 140.0 89.3 131.9Q89.3 128 90.3 123.7Q91.2 119.5 93.1 115.5Q94.9 111.5 97.4 108.3Q100 105.1 103.2 103.2Q106.5 101.3 110.2 101.3Q114.7 101.3 118.4 104.3Q119 104.8 118.8 105.7L116.9 115.4Q116.7 116.4 115.9 116.4Q115.2 116.4 115.2 115.4L115.1 112.9Q115 107.6 113.6 105.3Q112.2 103.1 109.5 103.1Q107 103.1 104.7 105.1Q102.4 107.1 100.5 110.5Q98.5 113.8 97 117.9Q95.5 122 94.6 126Q93.8 130.1 93.8 133.7Q93.8 139.4 95.6 143.1Q97.3 146.7 101.4 146.7Q103.8 146.7 105.7 145Q107.6 143.2 109.6 138.9L111 135.9Q111.3 135.1 112 135.1Q113.0 135.1 112.7 136.4L110.1 146.3Q109.9 147.3 109.1 147.5Q108 147.9 106 148.2Q103.9 148.6 102.2 148.6Z" fill="#000"/> </g></g></mask></defs><path d="M40 190 V88 A60 60 0 0 1 160 88 V190 Z" fill="currentColor" mask="url(#cwlogo)"/></svg>`;
const cupSVG = (fill = 0, size = 30) => `
<svg class="cupsvg" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true">
  <defs><clipPath id="cupclip${size}"><path d="M8 11h22l-2.6 21.5a3 3 0 0 1-3 2.5h-10.8a3 3 0 0 1-3-2.5z"/></clipPath></defs>
  <g clip-path="url(#cupclip${size})"><rect class="liquid" x="6" y="9" width="28" height="28" fill="var(--accent)" style="transform:scaleY(${fill})"/></g>
  <path d="M8 11h22l-2.6 21.5a3 3 0 0 1-3 2.5h-10.8a3 3 0 0 1-3-2.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M30 15h2.2a4 4 0 0 1 0 8H29" fill="none" stroke="currentColor" stroke-width="1.8"/>
  <path d="M15 4.5c0 2 1.6 2 1.6 4M21 4.5c0 2 1.6 2 1.6 4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>
</svg>`;

/* =========================================================
   Router
   ========================================================= */
function route() {
  stopStaff();
  // old #counter / #board links from v2.0 → the real pages
  if (PAGE === 'order' && (location.hash === '#counter' || location.hash === '#board')) { location.replace(href(location.hash.slice(1) + '/')); return; }
  document.documentElement.dataset.era = S.era;
  if (PAGE === 'counter') return renderCounter();
  if (PAGE === 'board') return renderBoard();
  renderHome();
}

/* =========================================================
   HOME
   ========================================================= */
function renderHome() {
  const E = ERA[S.era];
  document.documentElement.dataset.era = S.era;
  $('meta[name="theme-color"]').content = E.theme;
  const items = MENU.filter(m => m.era === S.era);
  const cats = [...new Set(items.map(m => m.category))];
  $('#app').innerHTML = `
  <header class="top" id="top"><div class="shell">
    <a class="brand" href="${href('./')}" aria-label="Chaiwala home">
      ${LOGO}
      <span><b>Chaiwala</b><small>Chai across generations</small></span>
    </a>
    <nav class="nav" aria-label="Main"><a href="${href('order/')}" aria-current="page">Order</a><a href="${href('menu/')}">Menu</a><a href="${href('how-it-works/')}">How it works</a></nav>
    <div class="seg" role="group" aria-label="Choose an era">
      <span class="pill"></span>
      ${ERA_KEYS.map(k => `<button data-act="era" data-era="${k}" aria-pressed="${S.era === k}">${ERA[k].year}</button>`).join('')}
    </div>
    <button class="icon-btn ${Radio.on ? 'radio-on' : ''}" id="radioBtn" data-act="radio" aria-label="Play era radio" aria-pressed="${Radio.on}"><span class="eq"><i></i><i></i><i></i></span></button>
  </div></header>
  <button class="live-chip" id="liveChip" data-act="open-token"></button>

  <main>
    <section class="era-banner" aria-labelledby="eraTitle">
      <div class="shell eb-grid">
        <div class="eb-copy">
          <span class="eyebrow">${E.chapter}</span>
          <h1 id="eraTitle">${E.title}</h1>
          <p>${E.sub}</p>
          <div class="eb-eras" role="group" aria-label="Switch era">${ERA_KEYS.map(k => `<button class="eb-era ${k === S.era ? 'on' : ''}" data-act="era" data-era="${k}" aria-pressed="${k === S.era}"><b>${ERA[k].year}</b><span>${ERA[k].name}</span></button>`).join('')}</div>
        </div>
        <div class="eb-media ${E.scene === 'collage' ? 'collage' : ''}">${E.scene === 'collage' ? collageHTML() : `<img src="${img(E.scene + '-sm.webp')}" srcset="${img(E.scene + '-sm.webp')} 900w, ${img(E.scene + '.webp')} 1800w" sizes="(min-width: 900px) 560px, 100vw" alt="${esc(E.sceneAlt)}" fetchpriority="high" width="900" height="503">`}
          ${DEMO ? '<span class="eb-tag">Demo mode · no real payments</span>' : ''}</div>
      </div>
      <div class="shell"><div class="sec-head feat-head"><div><span class="eyebrow">Signatures</span><h2>Start with <em>these</em></h2></div>
        <div class="arrows"><button class="icon-btn" data-act="rail" data-rail="featRail" data-dir="-1" aria-label="Previous signatures">${I.left}</button><button class="icon-btn" data-act="rail" data-rail="featRail" data-dir="1" aria-label="Next signatures">${I.right}</button></div></div></div>
      <div class="rail feat-rail" id="featRail">
        ${E.featured.map(id => { const m = byId(id); return `
        <article class="feat" aria-label="${esc(m.name)}">
          <div class="feat-img"><img src="${img(m.image)}" alt="${esc(m.alt)}" loading="lazy" decoding="async" width="800" height="1000"></div>
          <div class="feat-body"><h3>${esc(m.name)}</h3><p>${esc(m.blurb)}</p>
            <div class="feat-row"><span class="price-tag">${rupees(m.pricePaise)}</span>
              <span class="feat-btns">${m.options.length ? `<button class="btn btn-ghost btn-sm" data-act="customize" data-id="${m.id}">Customize</button>` : ''}
              <button class="btn btn-primary btn-sm" data-act="quick" data-id="${m.id}" ${m.available ? '' : 'disabled'} aria-label="Add ${esc(m.name)}">${m.available ? 'Add' : 'Sold out'}</button></span></div></div>
        </article>`; }).join('')}
      </div>
    </section>

    <div class="marquee" aria-hidden="true"><div class="track">${[...E.words, ...E.words].map(w => `<span>${w}</span>`).join('')}</div></div>

    <section class="sec">
      <div class="shell sec-head">
        <div><span class="eyebrow">Made to go together</span><h2>Perfect <em>pairs</em></h2></div>
        <div class="arrows" id="pairArrows"><button class="icon-btn" data-act="rail" data-rail="pairRail" data-dir="-1" aria-label="Previous">${I.left}</button><button class="icon-btn" data-act="rail" data-rail="pairRail" data-dir="1" aria-label="Next">${I.right}</button></div>
      </div>
      <div class="rail" id="pairRail">
        ${E.pairs.map(([name, a, b]) => { const A = byId(a), B = byId(b); return `
        <article class="pair">
          <div class="duo"><img src="${img(A.image)}" alt="${esc(A.alt)}" loading="lazy" width="110" height="110"><img src="${img(B.image)}" alt="${esc(B.alt)}" loading="lazy" width="110" height="110"><span class="plus" aria-hidden="true">+</span></div>
          <div><h4>${esc(name)}</h4><p>${esc(A.name)} with ${esc(B.name)}</p></div>
          <div class="row"><span class="price-tag">${rupees(A.pricePaise + B.pricePaise)}</span>
            <button class="btn btn-primary btn-sm" data-act="pair" data-a="${a}" data-b="${b}" ${A.available && B.available ? '' : 'disabled'}>Add pair ${I.plus}</button></div>
        </article>`; }).join('')}
      </div>
      <div class="dots" id="pairDots">${E.pairs.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>
    </section>

    <section class="sec" id="soundSec" aria-labelledby="soundTitle">
      <div class="shell">
        <div class="sec-head"><div><span class="eyebrow">No. 03 · Sound system</span><h2 id="soundTitle">${E.soundTitle}</h2></div></div>
        <p class="dim" style="max-width:56ch;margin:-2px 0 20px;font-size:15px">${E.soundSub}</p>
        <div class="sound" id="sound">
          <div class="deck">
            <div class="aura" aria-hidden="true"></div>
            <div class="deck-top"><span class="led"><i></i>${E.deck[0]}</span><span>${E.deck[1]}</span></div>
            ${E.player === 'cassette' ? cassetteSVG() : E.player === 'discman' ? discmanHTML() : discHTML()}
            <div class="np"><h4 id="rTitle">&nbsp;</h4><div class="by" id="rBy">&nbsp;</div><div class="credits" id="rCredits"></div></div>
            <div class="seek"><span id="rCur">0:00</span><input type="range" class="bar" id="rSeek" min="0" max="100" value="0" step="1" aria-label="Seek within the song"><span id="rDur">0:00</span></div>
            <div class="controls">
              <div class="left"><label class="vol">${I.vol}<input type="range" class="bar" id="rVol" min="0" max="1" step="0.01" aria-label="Volume"></label></div>
              <div class="transport"><button class="icon-btn" data-act="r-prev" aria-label="Previous song">${I.prev}</button><button class="play" id="rPlay" data-act="r-play" aria-label="Play">${I.play}</button><button class="icon-btn" data-act="r-next" aria-label="Next song">${I.next}</button></div>
              <div></div>
            </div>
          </div>
          <aside class="queue" aria-label="Song list">
            <header><b>${E.queue}</b><span id="qCount"></span></header>
            <div class="q-list short" id="qList"></div>
            <button class="btn btn-ghost btn-sm q-more" id="qMore" data-act="r-more">Show all</button>
          </aside>
        </div>
      </div>
    </section>

    <section class="sec" id="menu">
      <div class="shell">
        <div class="sec-head"><div><span class="eyebrow">The counter</span><h2>Today's <em>menu</em></h2></div><a class="btn btn-ghost btn-sm" href="${href('menu/')}">Full menu ${I.arrow}</a></div>
        <div class="tabs-wrap"><nav class="tabs" id="tabs" aria-label="Categories">
          ${cats.map((c, i) => `<button data-act="tab" data-cat="${c}" aria-current="${i === 0}">${CATS[c]}</button>`).join('')}
        </nav></div>
        ${cats.map(c => { const list = items.filter(m => m.category === c); return `
        <div class="cat" id="cat-${c}" data-cat="${c}">
          <h3 class="cat-title">${CATS[c]} <small>${String(list.length).padStart(2, '0')}</small></h3>
          <div class="grid">${list.map(cardHTML).join('')}</div>
        </div>`; }).join('')}
      </div>
    </section>

    <section class="sec"><div class="shell">
      <div class="sec-head"><div><span class="eyebrow">No login. No queue.</span><h2>How it <em>works</em></h2></div><a class="btn btn-ghost btn-sm" href="${href('how-it-works/')}">Details ${I.arrow}</a></div>
      <div class="how">
        <div>${I.pick}<b>Pick</b><span>Tap, tweak, add. Your kulhad fills up.</span></div>
        <div>${I.upi}<b>Pay</b><span>UPI, card or wallet via Razorpay.</span></div>
        <div>${I.ticket}<b>Collect</b><span>Show your token. We scan, you sip.</span></div>
      </div>
    </div></section>
  </main>

  <footer><div class="shell">
    <div class="row">
      <button class="link" data-act="lookup">Find my token</button>
      <a href="${href('./')}">Home</a>
      <a href="${href('menu/')}">Full menu</a>
      <a href="${href('how-it-works/')}">How it works</a>
      <a href="${href('counter/')}">Staff · counter mode</a>
      <a href="${href('board/')}" target="_blank" rel="noopener">Now-serving board</a>
      ${DEMO ? '<span class="badge">Demo · no real payments</span>' : '<span class="badge">' + I.lock + ' Payments by Razorpay</span>'}
    </div>
    <p style="margin-top:18px">Chaiwala — chai across generations. Prices are confirmed by the counter at checkout.</p>
  </div></footer>

  <button class="dock" id="dock" data-act="open-bag" aria-label="Review your order">
    <span class="cup">${cupSVG(0, 34)}</span>
    <span class="txt"><b id="dockCount">0 items</b><span id="dockTotal">₹0</span></span>
    <span class="go">Review ${I.arrow}</span>
  </button>

  <div class="scrim" id="scrim" data-act="close-sheet"></div>
  <section class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
    <div class="grab" id="grab"><i></i></div>
    <div class="sheet-head" id="sheetHead"><h3 id="sheetTitle">Your order</h3><button class="icon-btn" data-act="close-sheet" aria-label="Close">${I.x}</button></div>
    <div class="sheet-body" id="sheetBody"></div>
  </section>
  <div class="modal" id="payModal"></div>
  <div class="brew" id="brew" aria-live="assertive"></div>
  <div class="token-view" id="tokenView" role="dialog" aria-modal="true" aria-label="Your token"></div>`;

  updateDock(false);
  initCoverflow('pairRail', 'pairDots'); initTabs(); initSheetDrag(); initHeader();
  updateLiveChip();
  Radio.mount();
}

function cardHTML(m) {
  const inBag = S.cart.filter(l => l.id === m.id).reduce((a, l) => a + l.qty, 0);
  const open = S.open === m.id;
  return `
  <article class="card ${open ? 'open' : ''} ${m.available ? '' : 'sold'}" id="card-${m.id}">
    <button class="head" data-act="card" data-id="${m.id}" aria-expanded="${open}" aria-controls="x-${m.id}" ${m.available ? '' : 'disabled'}>
      <span class="thumb"><img src="${img(m.image)}" alt="${esc(m.alt)}" loading="lazy" decoding="async" width="96" height="96">${inBag ? `<span class="in-bag">${inBag}</span>` : ''}</span>
      <span class="meta">
        <span class="name">${esc(m.name)}</span>
        <span class="blurb">${esc(m.blurb)}</span>
        <span class="foot"><span class="price-tag">${rupees(m.pricePaise)}</span>${m.available ? `<span class="add-dot" aria-hidden="true">${I.plus}</span>` : '<span class="sold-tag">Sold out</span>'}</span>
      </span>
    </button>
    <div class="expand" id="x-${m.id}"><div>${open ? customHTML(m) : ''}</div></div>
  </article>`;
}

function customHTML(m) {
  const d = S.draft[m.id] || (S.draft[m.id] = { opts: m.options.flatMap(g => GROUPS[g]?.type === 'one' ? [GROUPS[g].options[0].id] : (g === 'boba' ? ['boba.pearls'] : [])), qty: 1 });
  const p = priceLine({ id: m.id, qty: d.qty, opts: d.opts });
  return `<div class="custom">
    ${m.options.map(gid => { const g = GROUPS[gid]; if (!g) return ''; return `
      <div class="grp"><label class="t">${esc(g.label || gid)}</label><div class="chips" role="group">
        ${g.options.map(o => `<button data-act="opt" data-id="${m.id}" data-g="${gid}" data-o="${o.id}" aria-pressed="${d.opts.includes(o.id)}">${esc(o.label)}${o.deltaPaise ? `<small>+${rupees(o.deltaPaise)}</small>` : ''}</button>`).join('')}
      </div></div>`; }).join('')}
    <div class="buy">
      <div class="stepper" role="group" aria-label="Quantity"><button data-act="dq" data-id="${m.id}" data-d="-1" aria-label="Fewer">−</button><span>${d.qty}</span><button data-act="dq" data-id="${m.id}" data-d="1" aria-label="More">+</button></div>
      <button class="btn btn-primary" data-act="add" data-id="${m.id}">Add · <span class="mono">${rupees(p.total)}</span></button>
    </div>
  </div>`;
}

/* ---------- header scroll state ---------- */
function initHeader() {
  const top = $('#top');
  const on = () => top.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', on, { passive: true }); on();
}

/* ---------- coverflow rail ---------- */
function initCoverflow(railId, dotsId) {
  const rail = $('#' + railId); if (!rail) return;
  const cards = $$('.pair', rail), dots = $$('i', $('#' + dotsId));
  let raf = 0;
  const paint = () => {
    raf = 0;
    const flat = rail.scrollWidth <= rail.clientWidth + 8;
    $('#' + dotsId).style.visibility = flat ? 'hidden' : '';
    const ar = $('#pairArrows'); if (ar) ar.style.visibility = flat ? 'hidden' : '';
    if (flat) { cards.forEach(el => { el.style.transform = ''; el.style.opacity = ''; }); return; }
    const c = rail.scrollLeft + rail.clientWidth / 2; let best = 0, bd = 1e9;
    cards.forEach((el, i) => {
      const d = (el.offsetLeft + el.offsetWidth / 2 - c) / el.offsetWidth;
      const a = Math.min(Math.abs(d), 1.5);
      el.style.transform = `scale(${1 - a * 0.07}) rotateY(${Math.max(-1, Math.min(1, d)) * -8}deg)`;
      el.style.opacity = 1 - Math.min(a, 1) * 0.4;
      if (Math.abs(d) < bd) { bd = Math.abs(d); best = i; }
    });
    dots.forEach((dt, i) => dt.classList.toggle('on', i === best));
  };
  rail.style.perspective = '900px';
  rail.addEventListener('scroll', () => { raf ||= requestAnimationFrame(paint); }, { passive: true });
  addEventListener('resize', paint); paint();
}

/* ---------- category tabs (scroll spy) ---------- */
function initTabs() {
  const tabs = $$('#tabs button');
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      tabs.forEach(t => t.setAttribute('aria-current', t.dataset.cat === e.target.dataset.cat));
      const t = tabs.find(t => t.dataset.cat === e.target.dataset.cat);
      t && t.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('.cat').forEach(c => io.observe(c));
}

/* =========================================================
   Cart actions
   ========================================================= */
function addToCart(id, opts = [], qty = 1, from) {
  const m = byId(id); if (!m || !m.available) return;
  if (!opts.length) opts = m.options.flatMap(g => GROUPS[g]?.type === 'one' ? [GROUPS[g].options[0].id] : (g === 'boba' ? ['boba.pearls'] : []));
  const key = id + '|' + [...opts].sort().join(',');
  const ex = S.cart.find(l => l.key === key);
  if (ex) ex.qty = Math.min(10, ex.qty + qty); else S.cart.push({ key, id, qty, opts: [...opts] });
  save(); haptic(10);
  fly(from, img(m.image));
  updateDock(true);
  refreshBadge(id);
}
function refreshBadge(id) {
  const card = $('#card-' + id); if (!card) return;
  const n = S.cart.filter(l => l.id === id).reduce((a, l) => a + l.qty, 0);
  const th = $('.thumb', card); let b = $('.in-bag', th);
  if (!n) { b && b.remove(); return; }
  if (!b) { b = document.createElement('span'); b.className = 'in-bag'; th.appendChild(b); }
  b.textContent = n; anim(b, [{ transform: 'scale(.4)' }, { transform: 'scale(1)' }], 'bounce');
}

function fly(from, src) {
  const dock = $('#dock'); if (!from || !dock || RM) return;
  const a = from.getBoundingClientRect();
  const wasHidden = !dock.classList.contains('show');
  const cup = $('.cup', dock).getBoundingClientRect();
  const tx = cup.left + cup.width / 2 - 27, ty = (wasHidden ? innerHeight - 50 : cup.top + cup.height / 2) - 27;
  const g = document.createElement('div'); g.className = 'ghost-fly'; g.style.backgroundImage = `url("${src}")`;
  g.style.left = (a.left + a.width / 2 - 27) + 'px'; g.style.top = (a.top + a.height / 2 - 27) + 'px';
  document.body.appendChild(g);
  const dx = tx - (a.left + a.width / 2 - 27), dy = ty - (a.top + a.height / 2 - 27);
  g.animate([
    { transform: 'translate(0,0) scale(.6)', opacity: 0 },
    { transform: `translate(${dx * .45}px,${dy * .45 - 90}px) scale(1.05)`, opacity: 1, offset: .45 },
    { transform: `translate(${dx}px,${dy}px) scale(.35)`, opacity: .9 },
  ], { duration: 720, easing: 'cubic-bezier(.5,0,.3,1)' }).finished.then(() => g.remove());
}

function updateDock(bump) {
  const dock = $('#dock'); if (!dock) return;
  const n = cartCount();
  dock.classList.toggle('show', n > 0);
  $('#dockCount').textContent = n + (n === 1 ? ' item' : ' items');
  $('#dockTotal').textContent = rupees(cartTotal()) + ' · ' + ERA[S.era].chapter.split('·')[1].trim();
  const liq = $('.liquid', dock); if (liq) liq.style.transform = `scaleY(${Math.min(1, 0.12 + n / 6)})`;
  if (bump && n) setTimeout(() => anim($('.cup', dock), [{ transform: 'scale(1)' }, { transform: 'scale(1.18) rotate(-6deg)' }, { transform: 'scale(1)' }], 'bounce'), 520);
}

/* =========================================================
   Card expand / customize in place
   ========================================================= */
function toggleCard(id) {
  const prev = S.open; S.open = prev === id ? null : id;
  if (prev && prev !== id) { const pc = $('#card-' + prev); if (pc) { pc.classList.remove('open'); $('.head', pc).setAttribute('aria-expanded', 'false'); setTimeout(() => { if (S.open !== prev) $('.expand>div', pc).innerHTML = ''; }, 500); } }
  const c = $('#card-' + id); if (!c) return;
  const m = byId(id);
  if (S.open === id) {
    $('.expand>div', c).innerHTML = customHTML(m);
    requestAnimationFrame(() => { c.classList.add('open'); $('.head', c).setAttribute('aria-expanded', 'true'); });
    setTimeout(() => { const r = c.getBoundingClientRect(); if (r.bottom > innerHeight - 110) scrollBy({ top: r.bottom - innerHeight + 130, behavior: 'smooth' }); }, 380);
  } else { c.classList.remove('open'); $('.head', c).setAttribute('aria-expanded', 'false'); }
}
function rerenderCustom(id) { const c = $('#card-' + id); if (c) $('.expand>div', c).innerHTML = customHTML(byId(id)); $('.custom', c).style.transition = 'none'; }

/* =========================================================
   Bottom sheet (order) + drag to dismiss
   ========================================================= */
let etaInfo = null;
function openSheet() {
  renderSheet();
  $('#scrim').classList.add('show'); $('#sheet').classList.add('show');
  document.body.style.overflow = 'hidden';
  API.queue().then(q => { etaInfo = q; const e = $('#etaBox'); if (e) e.outerHTML = etaHTML(); }).catch(() => {});
  setTimeout(() => $('#sheet .icon-btn')?.focus({ preventScroll: true }), 200);
}
function closeSheet() {
  $('#scrim')?.classList.remove('show'); const s = $('#sheet'); if (!s) return;
  s.classList.remove('show'); s.style.transform = ''; document.body.style.overflow = '';
}
const etaHTML = () => {
  const prep = Math.max(0, ...S.cart.map(l => byId(l.id)?.prep || 0));
  const eta = etaInfo ? Math.max(etaInfo.eta, prep) : null;
  return `<div class="eta" id="etaBox">${I.clock}<div><b>${eta ? `Ready in about ${eta} min` : 'Checking the counter…'}</b>
    <span>${etaInfo ? (etaInfo.ahead ? `${etaInfo.ahead} order${etaInfo.ahead > 1 ? 's' : ''} ahead of you` : 'No queue right now. Perfect timing.') : 'Live queue from the counter'}</span></div></div>`;
};
function renderSheet() {
  const body = $('#sheetBody'); if (!body) return;
  if (!S.cart.length) { body.innerHTML = `<div class="empty">${cupSVG(0, 56)}<p>Your kulhad is empty.<br>Add something warm.</p><button class="btn btn-ghost" data-act="close-sheet">Back to menu</button></div>`; return; }
  const total = cartTotal(), P = S.profile;
  body.innerHTML = `
    ${S.cart.map(l => { const p = priceLine(l); if (!p) return ''; return `
      <div class="line">
        <img src="${img(p.item.image)}" alt="${esc(p.item.alt)}" width="52" height="52">
        <div><b>${esc(p.item.name)}</b><small>${esc(p.labels.join(' · ') || ' ')}</small></div>
        <div class="r"><span class="price-tag">${rupees(p.total)}</span>
          <div class="stepper sm"><button data-act="lq" data-k="${esc(l.key)}" data-d="-1" aria-label="Fewer">−</button><span>${l.qty}</span><button data-act="lq" data-k="${esc(l.key)}" data-d="1" aria-label="More">+</button></div></div>
      </div>`; }).join('')}
    ${etaHTML()}
    <div class="fields">
      <label class="field" id="fName"><input id="inName" autocomplete="given-name" placeholder=" " maxlength="40" value="${esc(P.name)}"><span>Name on the token</span></label>
      <label class="field tel" id="fPhone"><input id="inPhone" inputmode="numeric" autocomplete="tel-national" placeholder=" " maxlength="10" value="${esc(P.phone)}"><span>Mobile number</span><i class="pre">+91</i></label>
    </div>
    <div class="totals">
      <div><span>Items</span><span class="mono">${rupees(total)}</span></div>
      <div><span>Convenience fee</span><span class="mono">₹0</span></div>
      <div class="grand"><span>To pay</span><span class="mono">${rupees(total)}</span></div>
    </div>
    <div class="slide-pay" id="slidePay">
      <div class="fill"></div><span class="label">Slide to pay ${rupees(total)}</span>
      <button class="knob" id="knob" aria-label="Pay ${rupees(total)}">${I.arrow}</button>
    </div>
    <div class="secure">${I.lock} ${DEMO ? 'Demo mode · no money moves' : 'Secured by Razorpay · UPI, cards, wallets'}</div>`;
  initSlider();
}
function initSheetDrag() {
  const sheet = $('#sheet'); if (!sheet) return;
  let y0 = null, dy = 0, t0 = 0;
  const start = e => { y0 = e.clientY; dy = 0; t0 = performance.now(); sheet.classList.add('dragging'); e.target.setPointerCapture?.(e.pointerId); };
  const move = e => { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); sheet.style.transform = `translateY(${dy}px)`; };
  const end = () => {
    if (y0 === null) return; sheet.classList.remove('dragging');
    const v = dy / Math.max(1, performance.now() - t0);
    if (dy > 140 || v > .6) closeSheet(); else sheet.style.transform = '';
    y0 = null;
  };
  ['grab', 'sheetHead'].forEach(id => { const h = $('#' + id); h.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; start(e); }); h.addEventListener('pointermove', move); h.addEventListener('pointerup', end); h.addEventListener('pointercancel', end); });
}

/* ---------- slide to pay ---------- */
function initSlider() {
  const wrap = $('#slidePay'), knob = $('#knob'); if (!wrap) return;
  const fill = $('.fill', wrap), label = $('.label', wrap);
  let x0 = null, dx = 0, max = 0, moved = false;
  const set = v => { knob.style.transform = `translateX(${v}px)`; fill.style.transform = `scaleX(${(v + 57) / wrap.clientWidth})`; label.style.opacity = 1 - v / max * 1.4; };
  knob.addEventListener('pointerdown', e => { if (wrap.classList.contains('busy')) return; x0 = e.clientX; max = wrap.clientWidth - 62; moved = false; knob.setPointerCapture(e.pointerId); knob.style.transition = 'none'; fill.style.transition = 'none'; unlockAudio(); });
  knob.addEventListener('pointermove', e => { if (x0 === null) return; dx = Math.max(0, Math.min(max, e.clientX - x0)); if (dx > 4) moved = true; set(dx); });
  const release = () => {
    if (x0 === null) return; x0 = null;
    knob.style.transition = `transform var(--dur-soft) var(--ease-soft)`; fill.style.transition = `transform var(--dur-soft) var(--ease-soft)`;
    if (dx > max * 0.8) { set(max); haptic(20); checkout(); }
    else { set(0); label.style.opacity = 1; if (!moved) anim(knob, [{ transform: 'translateX(0)' }, { transform: 'translateX(26px)' }, { transform: 'translateX(0)' }], 'bounce'); }
    dx = 0;
  };
  knob.addEventListener('pointerup', release); knob.addEventListener('pointercancel', release);
  knob.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); unlockAudio(); checkout(); } });
}
function resetSlider(text) {
  const w = $('#slidePay'); if (!w) return;
  w.classList.remove('busy'); const k = $('#knob'); k.style.transform = 'translateX(0)'; $('.fill', w).style.transform = 'scaleX(0)';
  const l = $('.label', w); l.style.opacity = 1; l.textContent = text || 'Slide to pay ' + rupees(cartTotal());
}

/* =========================================================
   Checkout → pay → verify → token
   ========================================================= */
function validate() {
  const name = $('#inName').value.trim(), phone = $('#inPhone').value.replace(/\D/g, '');
  const err = (id, msg) => { const f = $('#' + id); f.classList.toggle('err', !!msg); $('.msg', f)?.remove(); if (msg) f.insertAdjacentHTML('beforeend', `<small class="msg" role="alert">${msg}</small>`); };
  const en = name.length < 2 ? 'Add a name so we can call you.' : '';
  const ep = /^[6-9]\d{9}$/.test(phone) ? '' : 'Enter a 10-digit mobile number.';
  err('fName', en); err('fPhone', ep);
  if (en || ep) { anim($('#' + (en ? 'fName' : 'fPhone')), [{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], 'snappy'); return null; }
  S.profile = { name, phone }; ls.set('cw2.profile', S.profile);
  return { name, phone };
}

let paying = false;
async function checkout() {
  if (paying) return;
  const who = validate(); if (!who) { resetSlider(); return; }
  paying = true;
  const w = $('#slidePay'); w.classList.add('busy'); $('.label', w).textContent = 'Opening secure checkout…';
  let order;
  try {
    order = await API.create({ era: S.era, name: who.name, phone: who.phone, items: S.cart.map(l => ({ id: l.id, qty: l.qty, opts: l.opts })) });
    rememberTicket(order.ticket, null);                       // so a closed tab can still recover the token
    const res = DEMO ? await demoPay(order) : await razorpayPay(order, who);
    showBrew();
    let st;
    try { [st] = await Promise.all([API.verify({ orderId: order.orderId, ...res }), wait(2300)]); }
    catch (e) { st = { ticket: order.ticket, status: 'CREATED' }; }  // reconcile will catch it
    S.cart = []; save(); updateDock(false); closeSheet();
    rememberTicket(st.ticket, st.token);
    await hideBrew();
    openToken(st.ticket, st, true);
    renderMenuBadges();
  } catch (e) {
    if (order && e.message !== 'dismissed') forgetTicket(order.ticket);
    if (e.message === 'dismissed') { toast('Payment cancelled. Your bag is still here.'); if (order) forgetTicket(order.ticket); }
    else toast(e.message || 'Something went wrong.');
    resetSlider();
  } finally { paying = false; }
}
function renderMenuBadges() { MENU.forEach(m => refreshBadge(m.id)); }

let rzpLoad;
function razorpayPay(o, who) {
  rzpLoad ||= new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://checkout.razorpay.com/v1/checkout.js'; s.onload = res; s.onerror = () => rej(new Error('Could not load Razorpay. Check your connection.')); document.head.appendChild(s); });
  return rzpLoad.then(() => new Promise((resolve, reject) => {
    const rz = new Razorpay({
      key: o.keyId, order_id: o.rzpOrderId, amount: o.amount, currency: 'INR',
      name: 'Chaiwala', description: 'Token order ' + o.orderId,
      prefill: { name: who.name, contact: '+91' + who.phone },
      notes: { orderId: o.orderId }, theme: { color: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() },
      handler: r => resolve(r), modal: { ondismiss: () => reject(new Error('dismissed')), confirm_close: true },
      retry: { enabled: true },
    });
    rz.on('payment.failed', r => toast(r.error?.description || 'Payment failed. Try another method.'));
    rz.open();
  }));
}

/** Demo-only checkout panel, clearly labelled. Lets you rehearse success and failure without keys. */
function demoPay(o) {
  return new Promise((resolve, reject) => {
    const m = $('#payModal');
    m.innerHTML = `<div class="box" role="dialog" aria-label="Demo payment">
      <div style="display:flex;justify-content:space-between;align-items:center"><span class="badge">Demo checkout · test only</span><button class="icon-btn" data-x aria-label="Cancel">${I.x}</button></div>
      <div class="amt">${rupees(o.amount)}</div><div class="dim" style="font-size:13px">Chaiwala · ${o.orderId}</div>
      <div class="methods" role="group" aria-label="Method">${['UPI', 'Card', 'Wallet'].map((x, i) => `<button aria-pressed="${!i}">${x}</button>`).join('')}</div>
      <button class="btn btn-primary" style="width:100%" data-ok>Pay ${rupees(o.amount)}</button>
      <button class="btn" style="width:100%;margin-top:6px;background:none;color:var(--ink-2)" data-fail>Simulate a failed payment</button>
    </div>`;
    requestAnimationFrame(() => m.classList.add('show'));
    const done = fn => { m.classList.remove('show'); setTimeout(() => m.innerHTML = '', 500); fn(); };
    m.onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.closest('.methods')) { $$('.methods button', m).forEach(x => x.setAttribute('aria-pressed', x === b)); return; }
      if (b.hasAttribute('data-ok')) done(() => resolve({ razorpay_payment_id: 'pay_demo_' + Date.now(), razorpay_order_id: o.rzpOrderId, razorpay_signature: 'demo' }));
      if (b.hasAttribute('data-fail')) done(() => reject(new Error('Payment failed (demo). Nothing was charged.')));
      if (b.hasAttribute('data-x')) done(() => reject(new Error('dismissed')));
    };
  });
}

/* ---------- brewing interstitial (covers the 1–3 s Apps Script round trip) ---------- */
const GLASS = {
  adda: 'M38 70h94l-10 98a12 12 0 0 1-12 10H60a12 12 0 0 1-12-10z',
  y2k: 'M56 50h58l-7 128a8 8 0 0 1-8 7H71a8 8 0 0 1-8-7z',
  cafe: 'M46 58h78l-6 116a8 8 0 0 1-8 7H60a8 8 0 0 1-8-7z',
};
function showBrew() {
  const b = $('#brew'); const adda = S.era === 'adda', y2k = S.era === 'y2k';
  b.innerHTML = `<div class="stage">
    <svg width="170" height="200" viewBox="0 0 170 200" aria-hidden="true">
      <defs><clipPath id="glass"><path d="${GLASS[S.era]}"/></clipPath></defs>
      <rect class="stream" x="82" y="0" width="6" height="${adda ? 120 : 110}" rx="3" fill="${y2k ? '#C49A6C' : 'var(--accent)'}"/>
      <g class="steam" stroke="var(--ink-3)" stroke-width="2.5" fill="none" stroke-linecap="round">
        <path d="M62 52c-8-10 8-14 0-26"/><path d="M85 48c-8-10 8-14 0-26"/><path d="M108 52c-8-10 8-14 0-26"/></g>
      <g clip-path="url(#glass)"><rect class="liquid-rise" x="20" y="${adda ? 86 : 74}" width="130" height="120" fill="${adda ? '#B9773A' : y2k ? '#C49A6C' : 'var(--accent)'}"/>
        <rect class="liquid-rise" x="20" y="${adda ? 86 : 74}" width="130" height="10" fill="${adda ? '#E3B57A' : y2k ? '#F1E2CF' : 'var(--accent-2)'}" opacity=".7"/></g>
      <path d="${GLASS[S.era]}" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>
      ${adda ? '<path d="M132 92h8a14 14 0 0 1 0 28h-12" fill="none" stroke="var(--ink)" stroke-width="2.5"/>' : y2k ? '<path d="M98 20l-12 160" stroke="var(--accent-2)" stroke-width="5" stroke-linecap="round"/><path d="M60 64h52" stroke="var(--ink)" stroke-opacity=".2" stroke-width="2"/>' : '<path d="M52 66h66" stroke="var(--ink)" stroke-opacity=".2" stroke-width="2"/>'}
    </svg>
    <div><h4 id="brewT">Confirming payment</h4><p id="brewS">Talking to the counter…</p></div></div>`;
  requestAnimationFrame(() => b.classList.add('show'));
  setTimeout(() => { const t = $('#brewS'); if (t) t.textContent = 'Signature verified. Pouring your token…'; }, 1100);
}
async function hideBrew() { const b = $('#brew'); if (!b) return; b.classList.remove('show'); await wait(300); b.innerHTML = ''; }

/* =========================================================
   Token pass
   ========================================================= */
function rememberTicket(ticket, token) {
  const ex = S.tickets.find(t => t.ticket === ticket);
  if (ex) ex.token = token || ex.token; else S.tickets.unshift({ ticket, token, day: today() });
  save();
}
function forgetTicket(ticket) { S.tickets = S.tickets.filter(t => t.ticket !== ticket); save(); }

const STEPS = ['PAID', 'BREWING', 'READY'];
const LABEL = { CREATED: 'Confirming your payment', PAID: 'Paid · in the queue', BREWING: 'Brewing now', READY: 'Ready · collect at the counter', COLLECTED: 'Collected · enjoy' };
let tokenOpen = null;
function openToken(ticket, data, reveal) {
  tokenOpen = ticket;
  const v = $('#tokenView'); if (!v) return;
  document.body.style.overflow = 'hidden';
  renderToken(data || { status: 'CREATED' }, reveal);
  requestAnimationFrame(() => v.classList.add('show'));
  if (!data) API.status(ticket).then(d => { if (tokenOpen === ticket) renderToken(d); }).catch(e => toast(e.message));
}
function closeToken() { tokenOpen = null; const v = $('#tokenView'); v?.classList.remove('show', 'ready'); document.body.style.overflow = ''; updateLiveChip(); }

function renderToken(d, reveal) {
  const v = $('#tokenView'); if (!v) return;
  const si = STEPS.indexOf(d.status === 'COLLECTED' ? 'READY' : d.status);
  const when = d.paidAt ? new Date(d.paidAt) : new Date();
  const ready = d.status === 'READY';
  v.classList.toggle('ready', ready);
  const sub = d.status === 'PAID' || d.status === 'BREWING'
    ? `About ${d.eta || 5} min${d.ahead != null ? ` · ${d.ahead ? d.ahead + ' ahead' : 'you are next'}` : ''}`
    : d.status === 'CREATED' ? 'This takes a few seconds. You can keep this page closed — we will find it.' : ready ? 'Show this pass at the counter.' : 'Thank you for visiting the adda.';
  v.innerHTML = `
    <div class="bar"><span class="eyebrow">${ready ? 'Your order is ready' : 'Your token'}</span><button class="icon-btn" data-act="close-token" aria-label="Close">${I.x}</button></div>
    <div class="wrap">
      <article class="pass ${reveal ? 'sheen' : ''}" id="pass">
        <div class="top-p"><div><span class="eyebrow">Chaiwala · ${(ERA[d.era] || ERA.adda).pass}</span>
          <div class="big">${esc(d.token || '— — —')}</div><div class="who">${esc(d.name || '')}</div></div>
          <span class="mono" style="font-size:11px;opacity:.55;text-align:right">${when.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}<br>${when.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span></div>
        ${d.token ? `<div class="stamp ${d.status === 'COLLECTED' ? 'served' : ''}" id="stamp"><span>${d.status === 'COLLECTED' ? 'Served' : 'Paid'}<b>${d.status === 'COLLECTED' ? '✓' : rupees(d.amount || 0)}</b>${(ERA[d.era] || ERA.adda).stamp}</span></div>` : ''}
        <div class="perf"></div>
        <div class="qr-row"><div class="qr" aria-label="QR code for the counter">${d.token ? qrSVG(d.ticket || tokenOpen) : ''}</div>
          <p>${d.token ? 'Show this at the counter. It works once — then it is marked collected.' : 'Your QR appears the moment payment is confirmed.'}</p></div>
        ${(d.items || []).length ? `<div class="items">${d.items.map(l => `<div><span>${l.qty} × ${esc(l.name)}${l.opts?.length ? `<br><small style="opacity:.6">${esc(l.opts.join(' · '))}</small>` : ''}</span><span class="mono">${rupees(l.unitPaise * l.qty)}</span></div>`).join('')}
          <div class="tot"><span>Paid</span><span class="mono">${rupees(d.amount || 0)}</span></div></div>` : ''}
        <div class="foot-p"><span>${esc(d.orderId || '')}</span><span>${DEMO ? 'DEMO' : 'VERIFIED'}</span></div>
      </article>
      <div class="status-line" aria-live="polite"><span class="dot ${ready || d.status === 'COLLECTED' ? 'ok' : ''}"></span><div><b>${LABEL[d.status] || d.status}</b><div class="dim" style="font-size:13px">${sub}</div></div></div>
      <div class="track"><div class="bars">${STEPS.map((s, i) => `<i class="${i <= si ? 'on' : ''}"><b></b></i>`).join('')}</div>
        <div class="lbls">${['Paid', 'Brewing', 'Ready'].map((s, i) => `<span class="${i <= si ? 'on' : ''}">${s}</span>`).join('')}</div></div>
      <div class="actions"><button class="btn btn-ghost" data-act="close-token">Order more</button><button class="btn btn-ghost" data-act="lookup">Find a token</button></div>
    </div>`;
  if (reveal && d.token) stampIn();
  S.last[tokenOpen] = d.status;
  initTilt();
}
function stampIn() {
  const p = $('#pass'), s = $('#stamp');
  anim(p, [{ transform: 'translateY(40px) scale(.94) rotateX(12deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], 'soft');
  anim(s, [{ transform: 'rotate(-14deg) scale(2.4)', opacity: 0 }, { transform: 'rotate(-14deg) scale(1)', opacity: .85 }], 'snappy', { delay: 520, fill: 'backwards' })
    .then(() => { haptic([18, 30, 12]); anim(p, [{ transform: 'translateY(0)' }, { transform: 'translateY(3px) scale(.995)' }, { transform: 'none' }], 'bounce'); });
}
function initTilt() {
  const p = $('#pass'); if (!p || RM || matchMedia('(hover:none)').matches) return;
  p.addEventListener('pointermove', e => { const r = p.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; p.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`; });
  p.addEventListener('pointerleave', () => { p.style.transition = 'transform .6s var(--ease-out)'; p.style.transform = ''; setTimeout(() => p.style.transition = '', 600); });
}

/**
 * Built-in QR encoder (byte mode, error-correction M, versions 1–6, ~100 chars).
 * No CDN: the pass must render even on a flaky campus network.
 */
const QR = (() => {
  const ECC = [0, 10, 16, 26, 18, 24, 16], BLK = [0, 1, 1, 1, 2, 2, 4], TOT = [0, 26, 44, 70, 100, 134, 172];
  const ALIGN = [[], [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34]];
  const mul = (x, y) => { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z & 255; };
  const divisor = d => { const r = Array(d - 1).fill(0).concat(1); let root = 1; for (let i = 0; i < d; i++) { for (let j = 0; j < r.length; j++) { r[j] = mul(r[j], root); if (j + 1 < r.length) r[j] ^= r[j + 1]; } root = mul(root, 2); } return r; };
  const rem = (data, div) => { const r = div.map(() => 0); for (const b of data) { const f = b ^ r.shift(); r.push(0); div.forEach((c, i) => r[i] ^= mul(c, f)); } return r; };
  return text => {
    const bytes = [...new TextEncoder().encode(text)];
    let v = 1; while (v <= 6 && TOT[v] - ECC[v] * BLK[v] < bytes.length + 2) v++;
    if (v > 6) throw new Error('QR payload too long');
    const cap = TOT[v] - ECC[v] * BLK[v], bits = [];
    const put = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    put(4, 4); put(bytes.length, 8); bytes.forEach(b => put(b, 8));
    put(0, Math.min(4, cap * 8 - bits.length)); while (bits.length % 8) bits.push(0);
    const data = []; for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(''), 2));
    for (let p = 0xEC; data.length < cap; p ^= 0xEC ^ 0x11) data.push(p);
    const nb = BLK[v], ec = ECC[v], short = nb - TOT[v] % nb, sLen = Math.floor(TOT[v] / nb) - ec, div = divisor(ec), blocks = [];
    for (let i = 0, k = 0; i < nb; i++) { const len = sLen + (i < short ? 0 : 1); const d = data.slice(k, k + len); k += len; blocks.push([d, rem(d, div)]); }
    const out = [];
    for (let i = 0; i <= sLen; i++) blocks.forEach(([d]) => { if (i < d.length) out.push(d[i]); });
    for (let i = 0; i < ec; i++) blocks.forEach(([, e]) => out.push(e[i]));
    const n = v * 4 + 17, mod = [...Array(n)].map(() => Array(n).fill(false)), fn = [...Array(n)].map(() => Array(n).fill(false));
    const set = (x, y, d) => { mod[y][x] = d; fn[y][x] = true; };
    for (let i = 0; i < n; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    [[3, 3], [n - 4, 3], [3, n - 4]].forEach(([cx, cy]) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const x = cx + dx, y = cy + dy; if (x >= 0 && x < n && y >= 0 && y < n) { const m = Math.max(Math.abs(dx), Math.abs(dy)); set(x, y, m !== 2 && m !== 4); } } });
    const al = ALIGN[v], L = al.length;
    for (let i = 0; i < L; i++) for (let j = 0; j < L; j++) { if ((i === 0 && j === 0) || (i === 0 && j === L - 1) || (i === L - 1 && j === 0)) continue; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(al[i] + dx, al[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); }
    const fmt = mask => { const d = (0 << 3) | mask; let r = d; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537); const b = ((d << 10) | r) ^ 0x5412, g = i => ((b >>> i) & 1) === 1;
      for (let i = 0; i <= 5; i++) set(8, i, g(i)); set(8, 7, g(6)); set(8, 8, g(7)); set(7, 8, g(8)); for (let i = 9; i < 15; i++) set(14 - i, 8, g(i));
      for (let i = 0; i < 8; i++) set(n - 1 - i, 8, g(i)); for (let i = 8; i < 15; i++) set(8, n - 15 + i, g(i)); set(8, n - 8, true); };
    fmt(0);
    let i = 0;
    for (let right = n - 1; right >= 1; right -= 2) { if (right === 6) right = 5;
      for (let vert = 0; vert < n; vert++) for (let j = 0; j < 2; j++) { const x = right - j, up = ((right + 1) & 2) === 0, y = up ? n - 1 - vert : vert;
        if (!fn[y][x] && i < out.length * 8) { mod[y][x] = ((out[i >>> 3] >>> (7 - (i & 7))) & 1) === 1; i++; } } }
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!fn[y][x] && (x + y) % 2 === 0) mod[y][x] = !mod[y][x];
    return mod;
  };
})();

/** Rounded-module QR drawn as SVG with soft "eyes" — premium look, still scanner-safe. */
function qrSVG(text) {
  let m; try { m = QR(text); } catch { return `<div class="mono" style="font-size:10px;word-break:break-all;color:#000">${esc(text)}</div>`; }
  const n = m.length; let r = '';
  const finder = (x, y) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  const ac = n > 21 ? n - 7 : -99;                       // alignment centre (versions 2–6 have one)
  const align = (x, y) => Math.abs(x - ac) <= 2 && Math.abs(y - ac) <= 2;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (m[y][x] && !finder(x, y) && !align(x, y)) r += `M${x} ${y}h1.02v1.02h-1.02z`;
  r = `<path d="${r}"/>`;   // square data modules: decoders need crisp edges; style lives in the eyes
  if (ac > 0) r += `<rect x="${ac - 1.5}" y="${ac - 1.5}" width="4" height="4" rx=".35" fill="none" stroke="#111" stroke-width="1"/><rect x="${ac}" y="${ac}" width="1" height="1" rx=".3"/>`;
  const eye = (x, y) => `<rect x="${x + .5}" y="${y + .5}" width="6" height="6" rx=".5" fill="none" stroke="#111" stroke-width="1"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx=".3"/>`;
  return `<svg viewBox="0 0 ${n} ${n}" fill="#111" shape-rendering="geometricPrecision">${r}${eye(0, 0)}${eye(n - 7, 0)}${eye(0, n - 7)}</svg>`;
}

/* ---------- live status polling + "ready" moment ---------- */
let audioCtx = null;
function unlockAudio() { try { audioCtx ||= new (window.AudioContext || window.webkitAudioContext)(); audioCtx.resume(); } catch {} }
function chime() {
  if (!audioCtx) return; const t = audioCtx.currentTime;
  [[1318.5, 0], [1760, .16], [2637, .32]].forEach(([f, d]) => {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t + d); g.gain.linearRampToValueAtTime(.18, t + d + .02); g.gain.exponentialRampToValueAtTime(.0001, t + d + .9);
    o.connect(g).connect(audioCtx.destination); o.start(t + d); o.stop(t + d + 1);
  });
}
async function poll() {
  if (PAGE !== 'order') return;
  if (DEMO) Demo.autopilot();
  const active = S.tickets.filter(t => !['COLLECTED'].includes(S.last[t.ticket]));
  for (const t of active.slice(0, 3)) {
    try {
      const d = await API.status(t.ticket);
      const prev = S.last[t.ticket];
      if (d.token && !t.token) rememberTicket(t.ticket, d.token);
      if (prev && prev !== d.status && d.status === 'READY') { haptic([200, 100, 200]); chime(); toast(`Token ${d.token} is ready at the counter`); }
      if (prev === 'CREATED' && d.status === 'PAID' && !paying && tokenOpen !== t.ticket) toast(`Payment confirmed · token ${d.token}`);
      S.last[t.ticket] = d.status; t.status = d.status;
      if (tokenOpen === t.ticket && prev !== d.status) renderToken(d, prev === 'CREATED' && !!d.token);
    } catch (e) { if (/not valid|not found/i.test(e.message)) forgetTicket(t.ticket); }
  }
  updateLiveChip();
}
function updateLiveChip() {
  const c = $('#liveChip'); if (!c) return;
  const t = S.tickets.find(t => t.token && S.last[t.ticket] !== 'COLLECTED') || S.tickets.find(t => !t.token);
  if (!t || tokenOpen || paying) { c.classList.remove('show'); return; }
  const st = S.last[t.ticket] || 'PAID';
  c.dataset.ticket = t.ticket; c.classList.toggle('ready', st === 'READY');
  c.innerHTML = `<span class="dot ${st === 'READY' ? 'ok' : ''}"></span><span class="mono">${esc(t.token || '…')}</span><span class="dim">${st === 'READY' ? 'Ready — show your pass' : st === 'BREWING' ? 'Brewing' : st === 'CREATED' ? 'Confirming payment' : 'In the queue'}</span>`;
  c.classList.add('show');
}
let pollTimer = null;
function startPolling() {
  clearInterval(pollTimer);
  pollTimer = setInterval(() => { if (!document.hidden) poll(); }, DEMO ? 2500 : 7000);
  poll();
}
addEventListener('storage', e => { if (e.key === 'cw2.demo') poll(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) poll(); });

/* ---------- lookup sheet ---------- */
function openLookup() {
  closeToken();
  const body = $('#sheetBody'); if (!body) return;
  $('#sheetTitle').textContent = 'Find my token';
  body.innerHTML = `<p class="dim" style="margin:0 0 6px">Enter the number you paid with. We will show today's tokens.</p>
    <div class="fields"><label class="field tel" id="fLook"><input id="inLook" inputmode="numeric" placeholder=" " maxlength="10" value="${esc(S.profile.phone)}"><span>Mobile number</span><i class="pre">+91</i></label></div>
    <button class="btn btn-primary" style="width:100%" data-act="do-lookup">Find tokens</button><div id="lookRes" style="margin-top:14px"></div>`;
  $('#scrim').classList.add('show'); $('#sheet').classList.add('show');
}
async function doLookup() {
  const p = $('#inLook').value.replace(/\D/g, ''); const out = $('#lookRes');
  if (!/^[6-9]\d{9}$/.test(p)) { out.innerHTML = '<p style="color:var(--danger)">Enter a 10-digit mobile number.</p>'; return; }
  out.innerHTML = '<p class="dim">Looking…</p>';
  try {
    const r = await API.lookup(p);
    out.innerHTML = r.orders.length ? r.orders.map(o => `<button class="line" style="width:100%;background:none;border:0;border-bottom:1px solid var(--line);text-align:left;grid-template-columns:auto 1fr auto" data-act="pick-ticket" data-t="${esc(o.ticket)}" data-tk="${esc(o.token)}">
      <span class="mono" style="font-size:22px;font-weight:600">${esc(o.token)}</span><small>${LABEL[o.status] || o.status}</small>${I.right}</button>`).join('') : '<p class="dim">No tokens today for that number.</p>';
  } catch (e) { out.innerHTML = `<p style="color:var(--danger)">${esc(e.message)}</p>`; }
}

/* =========================================================
   Era switch — circular reveal via View Transitions
   ========================================================= */
function setEra(era, btn) {
  if (era === S.era || !ERA[era]) return;
  const wasOn = Radio.on;
  const apply = () => { S.era = era; save(); S.open = null; Radio.swap(); renderHome(); if (wasOn) Radio.play(0); };
  if (!document.startViewTransition || RM) { apply(); return; }
  const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const vt = document.startViewTransition(apply);
  vt.finished.catch(() => {});
  vt.ready.catch(() => {}).then(() => document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] },
    { duration: 760, easing: 'cubic-bezier(.7,0,.25,1)', pseudoElement: '::view-transition-new(root)' }));
}

/* =========================================================
   Radio (lazy; nothing downloads until you press play)
   ========================================================= */
const fmtT = x => { x = Math.max(0, Math.floor(x || 0)); return Math.floor(x / 60) + ':' + String(x % 60).padStart(2, '0'); };
function cassetteSVG() {
  const reel = (cx, id) => `
    <circle class="tape" id="${id}" cx="${cx}" cy="139" r="31" fill="#3B2617"/>
    <g class="reel"><circle cx="${cx}" cy="139" r="15" fill="#EADCC0"/>
      ${[0, 60, 120, 180, 240, 300].map(a => `<rect x="${cx - 2}" y="125" width="4" height="7" rx="1.2" fill="#1C1410" transform="rotate(${a} ${cx} 139)"/>`).join('')}
      <circle cx="${cx}" cy="139" r="5.5" fill="#1C1410"/></g>`;
  return `<div class="cassette" aria-hidden="true"><svg viewBox="0 0 400 253">
    <rect x="2" y="2" width="396" height="249" rx="18" fill="#1E1611" stroke="rgba(212,166,87,.38)"/>
    <rect x="10" y="10" width="380" height="233" rx="13" fill="none" stroke="rgba(255,236,208,.05)"/>
    ${[[18, 18], [382, 18], [18, 235], [382, 235]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#120D09" stroke="rgba(255,236,208,.12)"/>`).join('')}
    <rect x="36" y="22" width="328" height="66" rx="8" fill="#EADCC0"/>
    <rect x="36" y="80" width="328" height="8" style="fill:var(--aura,#B9562F);transition:fill 1.2s"/>
    <rect x="104" y="100" width="192" height="78" rx="39" fill="#0A0705" stroke="rgba(255,236,208,.10)"/>
    <path d="M120 170 Q200 182 280 170" stroke="#3B2617" stroke-width="2" fill="none" opacity=".8"/>
    ${reel(150, 'tapeL')}${reel(250, 'tapeR')}
    <path d="M86 251 L106 206 H294 L314 251" fill="#15100C" stroke="rgba(212,166,87,.25)"/>
    <circle cx="150" cy="230" r="6" fill="#0A0705"/><circle cx="250" cy="230" r="6" fill="#0A0705"/>
    <rect x="186" y="224" width="28" height="12" rx="3" fill="#0A0705"/>
  </svg><div class="label" id="rLabel"><b>&nbsp;</b><span>&nbsp;</span></div></div>`;
}
function discmanHTML() {
  return `<div class="discman" aria-hidden="true"><div class="lid"><div class="cdwin"><div class="cd spinner"></div><div class="cdhub"></div></div>
    <div class="lcd"><span id="lcdT">TRACK 01</span><span class="lcd-mode">ANTI-SKIP</span><span id="lcdTime">00:00</span></div></div>
    <span class="dm-btn b1"></span><span class="dm-btn b2"></span><span class="dm-btn b3"></span></div>`;
}
function collageHTML() {
  const a = byId('cold-coffee'), b = byId('brownie'), c = byId('hot-chocolate');
  return `<div class="y2k-scene"><div class="orb o1"></div><div class="orb o2"></div><div class="cdart"></div>
    <figure class="ph p1"><img src="${img(a.image)}" alt="${esc(a.alt)}" fetchpriority="high" width="800" height="1200"></figure>
    <figure class="ph p2"><img src="${img(b.image)}" alt="${esc(b.alt)}" width="800" height="1200"></figure>
    <figure class="ph p3"><img src="${img(c.image)}" alt="${esc(c.alt)}" width="800" height="1200"></figure></div>`;
}
function discHTML() {
  return `<div class="turntable" aria-hidden="true"><div class="disc"><div class="center" id="rDisc">C</div></div>
    <svg class="arm" viewBox="0 0 100 100"><circle cx="86" cy="14" r="8" fill="var(--ink)" opacity=".9"/><circle cx="86" cy="14" r="3" fill="var(--bg)"/>
    <path d="M86 14 L58 66 L44 80" stroke="var(--ink)" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="34" y="76" width="16" height="10" rx="2.5" transform="rotate(-42 42 81)" fill="var(--ink)"/></svg></div>`;
}

/** One audio element, two libraries. 1900s = one long recording split by timestamps; 2020s = one file per song. */
const Radio = {
  el: null, on: false, idx: 0, lib: null, dragging: false, target: null, vol: ls.get('cw2.vol', 0.8),
  list() { if (S.era === 'adda') return ADDA_TRACKS; const L = this.lib || []; return S.era === 'y2k' ? L.filter(t => +t.year <= 2015) : L.filter(t => +t.year > 2015); },
  track() { return this.list()[this.idx]; },
  async ensureList() {
    if (S.era === 'adda' || this.lib) return;
    try {
      const m = await (await fetch(aud('2000s-manifest.json'))).json();
      this.lib = m.map(t => ({ title: t.title, artist: t.artist, music: t.composer, words: t.lyricist, film: t.movie, year: t.year, start: 0, dur: t.durationSeconds, aura: t.auraColor, src: t.src }));
    } catch { this.lib = []; }
  },
  audio() {
    if (this.el) return this.el;
    const a = new Audio(); a.preload = 'none'; a.volume = this.vol;
    a.addEventListener('timeupdate', () => this.tick());
    a.addEventListener('loadedmetadata', () => this.paintTime());
    a.addEventListener('ended', () => S.era === 'adda' ? this.play(0) : this.play(this.idx + 1));
    a.addEventListener('pause', () => { if (this.on && !a.ended) { this.on = false; this.paint(); } });
    a.addEventListener('error', () => { if (a.getAttribute('src')) { this.on = false; this.paint(); toast('This song could not load.'); } });
    return (this.el = a);
  },
  async play(i) {
    await this.ensureList();
    const L = this.list(); if (!L.length) { toast('Radio library not found.'); return; }
    const a = this.audio();
    if (i != null) this.idx = ((i % L.length) + L.length) % L.length;
    const t = this.track();
    const src = S.era === 'adda' ? aud('90s_playlist.mp3') : aud(t.src);
    if (a.getAttribute('src') !== src) a.src = src;
    const at = S.era === 'adda' ? t.start : 0;
    const inside = S.era === 'adda' && a.currentTime >= t.start && a.currentTime < t.start + t.dur;
    if (i != null || (S.era === 'adda' && !inside)) this.goto(at);
    this.on = true; this.paint();
    try { await a.play(); } catch (e) { this.on = false; this.paint(); if (e.name === 'NotAllowedError') toast('Tap play to start the audio.'); }
  },
  /** Seek, and keep the chapter detector from snapping back until the jump has landed. */
  goto(sec) {
    const a = this.audio(); this.target = sec;
    const go = () => { try { a.currentTime = sec; } catch {} };
    if (a.readyState >= 1) go(); else a.addEventListener('loadedmetadata', go, { once: true });
    setTimeout(() => { if (this.target === sec && Math.abs(a.currentTime - sec) > 3 && S.era === 'adda') toast('This server cannot seek audio. Run v2/serve.py (see README).'); }, 6000);
  },
  pause() { this.on = false; this.el && this.el.pause(); this.paint(); },
  toggle() { this.on ? this.pause() : this.play(); },
  next() { this.play(this.idx + 1); },
  prev() { const a = this.el, t = this.track(); if (a && t && this.pos() > 4) { this.goto(S.era === 'adda' ? t.start : 0); return; } this.play(this.idx - 1); },
  pos() { const a = this.el, t = this.track(); if (!a || !t) return 0; return S.era === 'adda' ? Math.max(0, a.currentTime - t.start) : a.currentTime; },
  dur() { const t = this.track(); if (!t) return 0; if (S.era === 'adda') return t.dur; const d = this.el && this.el.duration; return isFinite(d) && d > 0 ? d : t.dur; },
  tick() {
    const a = this.el; if (!a || !this.on) return;
    if (this.target != null) { if (Math.abs(a.currentTime - this.target) < 2) this.target = null; else return; }
    if (S.era === 'adda') {
      const ct = a.currentTime, i = ADDA_TRACKS.findIndex(t => ct >= t.start && ct < t.start + t.dur);
      if (i >= 0 && i !== this.idx) { this.idx = i; this.paint(); return; }
    }
    if (!this.dragging) this.paintTime();
  },
  seek(v) {
    const t = this.track(); if (!t) return;
    const target = (S.era === 'adda' ? t.start : 0) + v, a = this.audio();
    if (!a.getAttribute('src')) { this.play().then(() => this.goto(target)); return; }
    this.goto(target);
  },
  paintTime() {
    const bar = $('#rSeek'); if (!bar) return;
    const d = this.dur(), p = Math.min(this.pos(), d);
    bar.max = Math.max(1, Math.round(d)); bar.value = Math.round(p);
    bar.style.setProperty('--p', (d ? p / d * 100 : 0) + '%');
    bar.setAttribute('aria-valuetext', fmtT(p) + ' of ' + fmtT(d));
    $('#rCur').textContent = fmtT(p); $('#rDur').textContent = fmtT(d);
    const lc = $('#lcdTime'); if (lc) lc.textContent = fmtT(p).padStart(5, '0');
    const L = $('#tapeL'), Rt = $('#tapeR'), f = d ? p / d : 0;
    if (L) { L.style.transform = `scale(${1 - 0.45 * f})`; Rt.style.transform = `scale(${0.55 + 0.45 * f})`; }
  },
  paint() {
    const b = $('#radioBtn');
    if (b) { b.classList.toggle('radio-on', this.on); b.setAttribute('aria-pressed', this.on); b.setAttribute('aria-label', this.on ? 'Pause radio' : 'Play era radio'); }
    const root = $('#sound'); if (!root) return;
    root.classList.toggle('playing', this.on);
    const t = this.track(); if (!t) return;
    root.style.setProperty('--aura', t.aura || '');
    $('#rTitle').textContent = t.title; $('#rBy').textContent = t.artist;
    $('#rCredits').innerHTML = [t.film && `<span><b>${esc(t.film)}</b>${t.year ? ' · ' + esc(t.year) : ''}</span>`,
      t.music && `<span>Music · <b>${esc(t.music)}</b></span>`, t.words && `<span>Words · <b>${esc(t.words)}</b></span>`].filter(Boolean).join('');
    const lab = $('#rLabel');
    if (lab) { $('b', lab).textContent = t.title; $('span', lab).textContent = `Side ${this.idx < 8 ? 'A' : 'B'} · Track ${String(this.idx + 1).padStart(2, '0')} · ${t.year || ''}`; }
    const ctr = $('#rDisc'); if (ctr) ctr.textContent = (t.title || '?').trim()[0];
    const lt = $('#lcdT'); if (lt) lt.textContent = 'TRACK ' + String(this.idx + 1).padStart(2, '0');
    const pl = $('#rPlay'); pl.innerHTML = this.on ? I.pause : I.play; pl.setAttribute('aria-label', this.on ? 'Pause' : 'Play');
    $$('#qList .q-item').forEach((q, i) => {
      const cur = i === this.idx; q.setAttribute('aria-current', cur);
      $('.n', q).innerHTML = cur && this.on ? '<span class="eq radio-on" aria-hidden="true"><i></i><i></i><i></i></span>' : String(i + 1).padStart(2, '0');
    });
    this.paintTime();
  },
  renderQueue() {
    const q = $('#qList'); if (!q) return;
    const L = this.list();
    $('#qCount').textContent = L.length + ' songs';
    q.innerHTML = L.map((t, i) => `<button class="q-item" data-act="r-pick" data-i="${i}" aria-current="false" aria-label="Play ${esc(t.title)} by ${esc(t.artist)}">
      <span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t"><b>${esc(t.title)}</b><small>${esc(t.artist)}${t.year ? ' · ' + esc(t.year) : ''}</small></span><span class="d">${fmtT(t.dur)}</span></button>`).join('');
    const more = $('#qMore'); if (more) { more.style.display = L.length > 5 ? '' : 'none'; more.textContent = `Show all ${L.length} songs`; }
  },
  async mount() {
    await this.ensureList();
    if (!$('#sound')) return;
    if (this.idx >= this.list().length) this.idx = 0;
    this.renderQueue(); this.paint();
    const bar = $('#rSeek');
    bar.addEventListener('input', () => { this.dragging = true; bar.style.setProperty('--p', (bar.value / bar.max * 100) + '%'); $('#rCur').textContent = fmtT(+bar.value); });
    bar.addEventListener('change', () => { this.seek(+bar.value); this.dragging = false; });
    const v = $('#rVol');
    v.value = this.vol; v.style.setProperty('--p', this.vol * 100 + '%');
    v.addEventListener('input', () => { this.vol = +v.value; if (this.el) this.el.volume = this.vol; v.style.setProperty('--p', this.vol * 100 + '%'); ls.set('cw2.vol', this.vol); });
  },
  swap() { const a = this.el; this.on = false; if (a) { a.pause(); a.removeAttribute('src'); a.load(); } this.idx = 0; },
};

/* =========================================================
   Toasts
   ========================================================= */
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  $('#toasts').appendChild(t); requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3200);
}

/* =========================================================
   One delegated click handler
   ========================================================= */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act, id = b.dataset.id;
  unlockAudio();
  switch (a) {
    case 'era': setEra(b.dataset.era, b); break;
    case 'radio': Radio.toggle(); break;
    case 'r-play': Radio.toggle(); break;
    case 'r-prev': Radio.prev(); break;
    case 'r-next': Radio.next(); break;
    case 'r-pick': Radio.play(+b.dataset.i); break;
    case 'r-more': { const q = $('#qList'); q.classList.toggle('short'); b.textContent = q.classList.contains('short') ? `Show all ${Radio.list().length} tracks` : 'Show fewer'; break; }
    case 'to-menu': e.preventDefault(); $('#menu').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); break;
    case 'quick': addToCart(id, [], 1, b); break;
    case 'customize': $('#menu').scrollIntoView({ behavior: 'auto' }); setTimeout(() => { $('#card-' + id).scrollIntoView({ block: 'center', behavior: 'smooth' }); if (S.open !== id) toggleCard(id); }, 50); break;
    case 'pair': addToCart(b.dataset.a, [], 1, b); setTimeout(() => addToCart(b.dataset.b, [], 1, b), 160); toast('Pair added'); break;
    case 'rail': { const r = $('#' + b.dataset.rail); r.scrollBy({ left: +b.dataset.dir * r.clientWidth * .8, behavior: 'smooth' }); break; }
    case 'tab': { const c = $('#cat-' + b.dataset.cat); c && c.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); break; }
    case 'card': toggleCard(id); break;
    case 'opt': {
      const d = S.draft[id], g = GROUPS[b.dataset.g], o = b.dataset.o;
      if (g.type === 'one') d.opts = d.opts.filter(x => !g.options.some(go => go.id === x)).concat(o);
      else d.opts = d.opts.includes(o) ? d.opts.filter(x => x !== o) : d.opts.concat(o);
      rerenderCustom(id); haptic(5); break;
    }
    case 'dq': { const d = S.draft[id]; d.qty = Math.max(1, Math.min(10, d.qty + +b.dataset.d)); rerenderCustom(id); break; }
    case 'add': { const d = S.draft[id]; addToCart(id, d.opts, d.qty, $('#card-' + id + ' .thumb')); delete S.draft[id]; toggleCard(id); break; }
    case 'open-bag': $('#sheetTitle').textContent = 'Your order'; openSheet(); break;
    case 'close-sheet': closeSheet(); break;
    case 'lq': {
      const l = S.cart.find(x => x.key === b.dataset.k); if (!l) break;
      l.qty += +b.dataset.d; if (l.qty <= 0) S.cart = S.cart.filter(x => x !== l); if (l.qty > 10) l.qty = 10;
      save(); updateDock(false); renderSheet(); renderMenuBadges(); break;
    }
    case 'open-token': { const t = b.dataset.ticket; if (t) openToken(t, null, false); break; }
    case 'close-token': closeToken(); break;
    case 'lookup': openLookup(); break;
    case 'do-lookup': doLookup(); break;
    case 'pick-ticket': rememberTicket(b.dataset.t, b.dataset.tk); closeSheet(); openToken(b.dataset.t, null, false); break;
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (tokenOpen) closeToken(); else closeSheet(); } });

/* =========================================================
   STAFF: counter mode (#counter) — PIN, queue, scan
   ========================================================= */
let staffTimer = null, scanStream = null, scanLoop = 0;
function stopStaff() { clearInterval(staffTimer); stopScan(); }
function renderCounter() {
  document.documentElement.dataset.era = 'adda';
  const pin = sessionStorage.getItem('cw2.pin');
  if (!pin) return renderPin();
  $('#app').innerHTML = `<div class="staff">
    <div class="staff-top"><div class="shell">
      <h1 class="sr-only">Counter mode</h1>
      <a class="brand" href="${href('./')}" aria-label="Chaiwala home">${LOGO}<span><b>Counter</b><small>${DEMO ? 'demo · pin ' + CONFIG.DEMO_PIN : 'live'}</small></span></a>
      <button class="btn btn-primary btn-sm" data-s="scan">${I.scan} Scan</button>
      <a class="icon-btn" href="${href('board/')}" target="_blank" rel="noopener" aria-label="Open the now-serving TV board">${I.tv}</a>
      <button class="icon-btn" data-s="lock" aria-label="Lock">${I.lock}</button>
    </div></div>
    <div class="shell"><div class="stats" id="stats"></div><div class="cols" id="cols"><p class="dim">Loading orders…</p></div></div>
    <div id="scanRoot"></div></div>`;
  $('#app').onclick = staffClick;
  loadCounter(); staffTimer = setInterval(loadCounter, DEMO ? 2000 : 5000);
}
function renderPin() {
  let v = '';
  $('#app').innerHTML = `<div class="staff"><div class="pinpad">
    <span class="eyebrow">Staff only</span><h1>Counter mode</h1><p class="dim">${DEMO ? 'Demo PIN is ' + CONFIG.DEMO_PIN : 'Enter the counter PIN'}</p>
    <div class="pin-dots" id="pd">${'<i></i>'.repeat(4)}</div>
    <div class="keys">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map(k => k === '' ? '<span></span>' : `<button data-k="${k}">${k}</button>`).join('')}</div>
    <p style="margin-top:24px"><a href="${href('order/')}" style="color:var(--ink-2)">Back to ordering</a></p></div></div>`;
  const paint = () => $$('#pd i').forEach((d, i) => d.classList.toggle('on', i < v.length));
  $('#app').onclick = async e => {
    const k = e.target.closest('[data-k]')?.dataset.k; if (k === undefined) return;
    haptic(6);
    if (k === '⌫') v = v.slice(0, -1); else if (v.length < 4) v += k;
    paint();
    if (v.length === 4) {
      try { await API.counter.list(v); sessionStorage.setItem('cw2.pin', v); renderCounter(); }
      catch (err) { $('#pd').classList.add('shake'); haptic([40, 40, 40]); setTimeout(() => { $('#pd')?.classList.remove('shake'); v = ''; paint(); }, 450); toast(err.message); }
    }
  };
}
const ago = iso => { if (!iso) return ''; const m = Math.round((Date.now() - new Date(iso)) / 60000); return m < 1 ? 'just now' : m + ' min ago'; };
async function loadCounter() {
  const pin = sessionStorage.getItem('cw2.pin');
  let r; try { r = await API.counter.list(pin); } catch (e) { if (/pin/i.test(e.message)) { sessionStorage.removeItem('cw2.pin'); renderPin(); } return; }
  const cols = $('#cols'); if (!cols) return;
  const by = s => r.orders.filter(o => o.status === s);
  const served = by('COLLECTED').length;
  $('#stats').innerHTML = `<div><b>${by('PAID').length + by('BREWING').length}</b><span>In the queue</span></div><div><b>${by('READY').length}</b><span>Waiting pickup</span></div><div><b>${served}</b><span>Served today</span></div>`;
  const card = (o, act, label) => `<div class="ord"><div class="r1"><span class="tk">${esc(o.token)}</span><span class="dim" style="font-size:12px">${ago(o.paidAt)}</span></div>
    <div style="font-size:13px;margin-top:2px">${esc(o.name)}</div>
    <ul>${o.items.map(l => `<li><b>${l.qty}×</b> ${esc(l.name)}${l.opts?.length ? ' · ' + esc(l.opts.join(', ')) : ''}</li>`).join('')}</ul>
    ${act ? `<button class="btn ${act === 'COLLECTED' ? 'btn-ghost' : 'btn-primary'} btn-sm" data-s="adv" data-o="${o.orderId}" data-to="${act}">${label}</button>` : ''}</div>`;
  cols.innerHTML = `
    <div class="col"><h6><span class="dot"></span>New · paid</h6>${by('PAID').map(o => card(o, 'BREWING', 'Start brewing')).join('') || '<p class="dim">Nothing new.</p>'}</div>
    <div class="col"><h6>Brewing</h6>${by('BREWING').map(o => card(o, 'READY', 'Mark ready — notify')).join('') || '<p class="dim">Kettle is free.</p>'}</div>
    <div class="col"><h6><span class="dot ok"></span>Ready</h6>${by('READY').map(o => card(o, 'COLLECTED', 'Handed over')).join('') || '<p class="dim">No one waiting.</p>'}</div>`;
}
async function staffClick(e) {
  const b = e.target.closest('[data-s]'); if (!b) return;
  const pin = sessionStorage.getItem('cw2.pin');
  if (b.dataset.s === 'lock') { sessionStorage.removeItem('cw2.pin'); renderPin(); }
  if (b.dataset.s === 'adv') { b.disabled = true; try { await API.counter.advance(pin, b.dataset.o, b.dataset.to); haptic(10); } catch (err) { toast(err.message); } loadCounter(); }
  if (b.dataset.s === 'scan') openScan();
  if (b.dataset.s === 'close-scan') stopScan();
  if (b.dataset.s === 'manual') { const v = $('#manual').value.trim(); if (v) handleCode(v, true); }
}
function openScan() {
  $('#scanRoot').innerHTML = `<div class="scan"><video id="vid" playsinline muted></video><div class="frame"></div>
    <div class="panel"><div class="result" id="res"></div>
      <div class="row"><input id="manual" placeholder="Or type token  A-042" autocomplete="off"><button class="btn btn-primary" data-s="manual">Collect</button></div>
      <button class="btn" style="width:100%;margin-top:8px;background:#1b1b1b;color:#fff" data-s="close-scan">Done</button></div></div>`;
  startCamera();
}
async function startCamera() {
  try {
    scanStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    const v = $('#vid'); v.srcObject = scanStream; await v.play();
    let detector = null;
    if ('BarcodeDetector' in window) { try { detector = new BarcodeDetector({ formats: ['qr_code'] }); } catch {} }
    if (!detector && !window.jsQR) await new Promise(r => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js'; s.onload = r; s.onerror = r; document.head.appendChild(s); });
    const cv = document.createElement('canvas'), cx = cv.getContext('2d', { willReadFrequently: true });
    let busy = false, lastCode = '', lastAt = 0;
    const tick = async () => {
      if (!scanStream) return;
      if (!busy && v.readyState >= 2) {
        busy = true; let code = null;
        try {
          if (detector) { const r = await detector.detect(v); code = r[0]?.rawValue; }
          else if (window.jsQR) { cv.width = v.videoWidth / 2; cv.height = v.videoHeight / 2; cx.drawImage(v, 0, 0, cv.width, cv.height); code = jsQR(cx.getImageData(0, 0, cv.width, cv.height).data, cv.width, cv.height)?.data; }
        } catch {}
        if (code && (code !== lastCode || Date.now() - lastAt > 4000)) { lastCode = code; lastAt = Date.now(); await handleCode(code, false); }
        busy = false;
      }
      scanLoop = requestAnimationFrame(tick);
    };
    tick();
  } catch { showRes('warn', 'Camera unavailable — type the token below.'); }
}
function stopScan() { cancelAnimationFrame(scanLoop); scanStream?.getTracks().forEach(t => t.stop()); scanStream = null; const r = $('#scanRoot'); if (r) r.innerHTML = ''; }
function showRes(kind, msg) { const r = $('#res'); if (!r) return; r.className = 'result show ' + kind; r.textContent = msg; anim(r, [{ transform: 'scale(.96)', opacity: .4 }, { transform: 'none', opacity: 1 }], 'snappy'); }
async function handleCode(code, manual) {
  const pin = sessionStorage.getItem('cw2.pin');
  try {
    const r = manual ? await API.counter.collectToken(pin, code) : await API.counter.collect(pin, code);
    if (r.already) { haptic([60, 60, 60]); showRes('warn', `${r.token} was already collected at ${new Date(r.collectedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}. Do not hand over again.`); }
    else { haptic(30); showRes('ok', `✓ ${r.token} · ${r.name} — hand over ${r.items.map(l => l.qty + '× ' + l.name).join(', ')}`); }
    loadCounter();
  } catch (e) { haptic([80, 40, 80]); showRes('bad', e.message); }
}

/* ---------- TV board (#board) ---------- */
function renderBoard() {
  document.documentElement.dataset.era = 'adda';
  $('#app').innerHTML = `<div class="board"><header><h1>Chaiwala · Now serving</h1><span class="mono" id="clock"></span></header>
    <div class="two"><div><h6>Preparing</h6><div class="tks" id="bB"></div></div><div class="ready"><h6>Ready to collect</h6><div class="tks" id="bR"></div></div></div></div>`;
  let prev = '';
  const load = async () => {
    $('#clock').textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    try { const r = await API.board(); const k = JSON.stringify(r); if (k === prev) return; prev = k;
      $('#bB').innerHTML = r.brewing.map(t => `<span>${esc(t)}</span>`).join(''); $('#bR').innerHTML = r.ready.map(t => `<span>${esc(t)}</span>`).join(''); } catch {}
  };
  load(); staffTimer = setInterval(load, 4000);
}

/* =========================================================
   Boot
   ========================================================= */
(async function boot() {
  if (!DEMO) {
    try {
      const live = await API.menu();
      GROUPS = Object.fromEntries(Object.entries(live.groups).map(([k, g]) => [k, { ...g, label: GROUPS[k]?.label || k }]));
      MENU = live.items.map(i => { const local = byId(i.id) || {}; return { ...local, ...i, image: local.image || 'masala-chai.webp', alt: local.alt || i.name, blurb: local.blurb || '' }; });
    } catch (e) { toast('Menu is offline — showing saved prices.'); }
  }
  route();
  if (PAGE === 'order') {
    const q = new URLSearchParams(location.search), add = q.get('add'), m = add && byId(add), era = q.get('era');
    if (era && ERA[era] && era !== S.era && !m) { S.era = era; save(); renderHome(); }
    if (era || add) history.replaceState(null, '', location.pathname + location.hash);
    if (m) {
      if (m.era !== S.era) { S.era = m.era; save(); renderHome(); }
      setTimeout(() => { $('#cat-' + m.category)?.scrollIntoView({ behavior: 'auto' }); addToCart(m.id, [], 1, $('#card-' + m.id + ' .thumb')); toast(m.name + ' added to your order'); }, 150);
    }
  }
  startPolling();
})();
