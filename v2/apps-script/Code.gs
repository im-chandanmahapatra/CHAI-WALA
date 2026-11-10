/**
 * Chaiwala v2 — Google Apps Script backend
 * ------------------------------------------------------------
 * The "no server" server. Deploy as a Web App (Execute as: Me,
 * Who has access: Anyone). Your Razorpay secret never leaves
 * Script Properties; the browser only ever sees the key id.
 *
 * Script Properties to set (Project Settings → Script properties):
 *   RZP_KEY_ID      rzp_test_xxxxxxxx
 *   RZP_KEY_SECRET  your Razorpay key secret
 *   TOKEN_SECRET    any long random string (signs ticket QR codes)
 *   COUNTER_PIN     4–6 digit PIN for staff counter mode
 *
 * Then run setup() once from the editor.
 */

const SHEET_ID = ''; // leave blank if this script is bound to the Sheet
const TZ = 'Asia/Kolkata';
const ACTIVE = ['PAID', 'BREWING', 'READY'];
const NEXT = { PAID: 'BREWING', BREWING: 'READY', READY: 'COLLECTED' };

// Orders sheet columns (1-based)
const C = { id: 1, created: 2, token: 3, era: 4, name: 5, phone: 6, items: 7, amount: 8,
  rzpOrder: 9, payment: 10, status: 11, paidAt: 12, readyAt: 13, collectedAt: 14, eta: 15 };
const ORDER_HEADERS = ['orderId', 'createdAt', 'token', 'era', 'name', 'phone', 'itemsJSON', 'amountPaise',
  'rzpOrderId', 'paymentId', 'status', 'paidAt', 'readyAt', 'collectedAt', 'etaMin'];

/* ---------------- HTTP entry points ---------------- */

function doGet(e) {
  const p = (e && e.parameter) || {};
  return respond_(() => {
    switch (p.action) {
      case 'menu': return getMenu_();
      case 'queue': return queueInfo_();
      case 'status': return status_(p.ticket);
      case 'lookup': return lookup_(p.phone);
      case 'board': return board_();
      default: return { service: 'chaiwala-v2', time: new Date().toISOString() };
    }
  });
}

function doPost(e) {
  return respond_(() => {
    // Body arrives as text/plain (avoids a CORS preflight Apps Script can't answer).
    const b = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    switch (b.action) {
      case 'create': return createOrder_(b);
      case 'verify': return verifyPayment_(b);
      case 'counter.list': requirePin_(b.pin); return counterList_();
      case 'counter.advance': requirePin_(b.pin); return advance_(b.orderId, b.to);
      case 'counter.collect': requirePin_(b.pin); return collect_(b.ticket);
      case 'counter.collectToken': requirePin_(b.pin); return collectByToken_(b.token);
      default: throw new Error('Unknown action');
    }
  });
}

function respond_(fn) {
  let out;
  try { out = Object.assign({ ok: true }, fn()); }
  catch (err) { out = { ok: false, error: String(err && err.message || err) }; }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------------- Menu (the Sheet is the source of truth) ---------------- */

function getMenu_() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get('menu');
  if (hit) return JSON.parse(hit);
  const items = rows_('Menu').map(r => ({
    id: String(r.id), name: String(r.name), era: String(r.era), category: String(r.category),
    pricePaise: Math.round(Number(r.price) * 100), prep: Number(r.prep) || 3,
    available: r.available === true || String(r.available).toUpperCase() === 'TRUE',
    options: String(r.options || '').split(',').map(s => s.trim()).filter(Boolean),
  }));
  const groups = {};
  rows_('Options').forEach(r => {
    const g = String(r.group);
    groups[g] = groups[g] || { id: g, type: String(r.type || 'one'), options: [] };
    groups[g].options.push({ id: String(r.id), label: String(r.label), deltaPaise: Math.round(Number(r.delta || 0) * 100) });
  });
  const menu = { items, groups };
  cache.put('menu', JSON.stringify(menu), 60); // owner edits show up within a minute
  return menu;
}

/** Recalculates every line from the Sheet. The browser's prices are never trusted. */
function priceCart_(cart) {
  if (!Array.isArray(cart) || !cart.length || cart.length > 20) throw new Error('Your bag is empty or too large.');
  const menu = getMenu_();
  const byId = {}; menu.items.forEach(i => byId[i.id] = i);
  let total = 0, prep = 0;
  const lines = cart.map(line => {
    const item = byId[line.id];
    if (!item) throw new Error('An item in your bag no longer exists.');
    if (!item.available) throw new Error(item.name + ' just sold out. Please remove it.');
    const qty = Math.floor(Number(line.qty));
    if (!(qty >= 1 && qty <= 10)) throw new Error('Quantity must be between 1 and 10.');
    const chosen = Array.isArray(line.opts) ? line.opts.map(String) : [];
    let unit = item.pricePaise; const labels = [];
    item.options.forEach(gid => {
      const g = menu.groups[gid]; if (!g) return;
      let picks = g.options.filter(o => chosen.indexOf(o.id) !== -1);
      if (g.type === 'one') { if (picks.length > 1) throw new Error('Pick one ' + gid + ' option.'); if (!picks.length) picks = [g.options[0]]; }
      picks.forEach(o => { unit += o.deltaPaise; labels.push(o.label); });
    });
    const known = {}; item.options.forEach(gid => (menu.groups[gid] ? menu.groups[gid].options : []).forEach(o => known[o.id] = 1));
    chosen.forEach(id => { if (!known[id]) throw new Error('Invalid option for ' + item.name + '.'); });
    total += unit * qty; prep = Math.max(prep, item.prep);
    return { id: item.id, name: item.name, qty, opts: labels, unitPaise: unit };
  });
  return { lines, total, prep };
}

/* ---------------- Orders + Razorpay ---------------- */

function createOrder_(b) {
  const name = String(b.name || '').trim();
  const phone = String(b.phone || '').replace(/\D/g, '').slice(-10);
  if (name.length < 2 || name.length > 40) throw new Error('Please enter your name.');
  if (!/^[6-9]\d{9}$/.test(phone)) throw new Error('Please enter a valid 10-digit mobile number.');
  const era = b.era === 'cafe' ? 'cafe' : 'adda';
  const priced = priceCart_(b.items);
  if (priced.total < 100) throw new Error('Order total is too low.');

  const orderId = 'CW' + Utilities.formatDate(new Date(), TZ, 'yyMMdd') + '-' + Utilities.getUuid().slice(0, 6).toUpperCase();
  const rzp = razorpay_('post', '/orders', {
    amount: priced.total, currency: 'INR', receipt: orderId,
    notes: { orderId: orderId, name: name },
  });
  sheet_('Orders').appendRow([orderId, new Date(), '', era, name, "'" + phone, JSON.stringify(priced.lines),
    priced.total, rzp.id, '', 'CREATED', '', '', '', priced.prep]);
  return { orderId, ticket: ticketFor_(orderId), rzpOrderId: rzp.id, amount: priced.total,
    keyId: prop_('RZP_KEY_ID'), lines: priced.lines };
}

function verifyPayment_(b) {
  const row = findRow_(b.orderId);
  if (!row) throw new Error('Order not found.');
  const rzpOrderId = row.get(C.rzpOrder); // from OUR sheet, never from the browser
  const expected = hmacHex_(rzpOrderId + '|' + b.razorpay_payment_id, prop_('RZP_KEY_SECRET'));
  if (expected !== String(b.razorpay_signature)) throw new Error('Payment could not be verified.');
  ensureCaptured_(b.razorpay_payment_id, row.get(C.amount));
  markPaid_(b.orderId, b.razorpay_payment_id);
  return status_(ticketFor_(b.orderId));
}

/** If auto-capture is off in the dashboard, capture here so the money actually settles. */
function ensureCaptured_(paymentId, amount) {
  const p = razorpay_('get', '/payments/' + paymentId);
  if (p.status === 'authorized') razorpay_('post', '/payments/' + paymentId + '/capture', { amount: Number(amount), currency: 'INR' });
  else if (p.status !== 'captured') throw new Error('Payment is ' + p.status + '.');
}

/** Assigns the next daily token under a lock so two payments in the same second never collide. */
function markPaid_(orderId, paymentId) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const row = findRow_(orderId);
    if (row.get(C.token)) return row.get(C.token); // idempotent: verify + reconcile can both arrive
    const day = Utilities.formatDate(new Date(), TZ, 'yyyyMMdd');
    const props = PropertiesService.getScriptProperties();
    const n = Number(props.getProperty('seq_' + day) || 0) + 1;
    props.setProperty('seq_' + day, String(n));
    const token = (row.get(C.era) === 'cafe' ? 'C' : 'A') + '-' + ('00' + n).slice(-3);
    const q = queueInfo_();
    row.set(C.token, token); row.set(C.payment, paymentId); row.set(C.status, 'PAID');
    row.set(C.paidAt, new Date()); row.set(C.eta, Math.max(Number(row.get(C.eta)) || 3, q.eta));
    return token;
  } finally { lock.releaseLock(); }
}

/**
 * Time-driven every 5 minutes (setup() installs it). Catches people who paid and closed
 * the tab before verify ran. Apps Script cannot read webhook headers, so instead of
 * trusting a webhook we ask Razorpay directly, server to server.
 */
function reconcile() {
  const sh = sheet_('Orders');
  const data = sh.getDataRange().getValues();
  const cutoff = Date.now() - 3 * 3600 * 1000;
  for (let i = 1; i < data.length; i++) {
    const r = data[i];
    if (r[C.status - 1] !== 'CREATED' || new Date(r[C.created - 1]).getTime() < cutoff) continue;
    reconcileOne_(r[C.id - 1], r[C.rzpOrder - 1], r[C.amount - 1]);
  }
}

function reconcileOne_(orderId, rzpOrderId, amount) {
  const res = razorpay_('get', '/orders/' + rzpOrderId + '/payments');
  const pays = (res.items || []);
  const ok = pays.filter(p => p.status === 'captured')[0] || pays.filter(p => p.status === 'authorized')[0];
  if (!ok) return false;
  if (ok.status === 'authorized') razorpay_('post', '/payments/' + ok.id + '/capture', { amount: Number(amount), currency: 'INR' });
  markPaid_(orderId, ok.id);
  return true;
}

/* ---------------- Status, lookup, queue ---------------- */

function status_(ticket) {
  const orderId = checkTicket_(ticket);
  let row = findRow_(orderId);
  if (!row) throw new Error('Order not found.');
  // Customer reopened the page before the 5-minute sweep: check Razorpay now (rate-limited).
  if (row.get(C.status) === 'CREATED') {
    const cache = CacheService.getScriptCache();
    if (!cache.get('rc_' + orderId)) {
      cache.put('rc_' + orderId, '1', 20);
      try { if (reconcileOne_(orderId, row.get(C.rzpOrder), row.get(C.amount))) row = findRow_(orderId); } catch (e) { /* retry next poll */ }
    }
  }
  return view_(row, true);
}

function view_(row, withQueue) {
  const st = row.get(C.status);
  const out = {
    orderId: row.get(C.id), ticket: ticketFor_(row.get(C.id)), token: row.get(C.token), status: st,
    era: row.get(C.era), name: row.get(C.name), items: JSON.parse(row.get(C.items) || '[]'),
    amount: row.get(C.amount), eta: Number(row.get(C.eta)) || 5,
    paidAt: iso_(row.get(C.paidAt)), readyAt: iso_(row.get(C.readyAt)), collectedAt: iso_(row.get(C.collectedAt)),
  };
  if (withQueue && (st === 'PAID' || st === 'BREWING')) {
    const paid = new Date(row.get(C.paidAt)).getTime();
    out.ahead = todayRows_().filter(r => ACTIVE.slice(0, 2).indexOf(r[C.status - 1]) !== -1 && new Date(r[C.paidAt - 1]).getTime() < paid).length;
  }
  return out;
}

function lookup_(phone) {
  phone = String(phone || '').replace(/\D/g, '').slice(-10);
  if (!/^[6-9]\d{9}$/.test(phone)) throw new Error('Enter the 10-digit number you ordered with.');
  const found = todayRows_().filter(r => String(r[C.phone - 1]).replace(/\D/g, '') === phone && r[C.token - 1])
    .map(r => ({ token: r[C.token - 1], status: r[C.status - 1], ticket: ticketFor_(r[C.id - 1]) }));
  return { orders: found };
}

function queueInfo_() {
  const active = todayRows_().filter(r => r[C.status - 1] === 'PAID' || r[C.status - 1] === 'BREWING');
  const cfg = config_();
  const eta = Math.round(cfg.baseMinutes + active.length * cfg.minutesPerOrder);
  return { ahead: active.length, eta: Math.max(cfg.baseMinutes, eta) };
}

function board_() {
  const rows = todayRows_();
  const pick = st => rows.filter(r => r[C.status - 1] === st).map(r => r[C.token - 1]);
  return { brewing: pick('PAID').concat(pick('BREWING')), ready: pick('READY') };
}

/* ---------------- Counter (staff) ---------------- */

function requirePin_(pin) {
  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get('pinfail') || 0);
  if (fails >= 8) throw new Error('Too many wrong PINs. Wait 5 minutes.');
  if (String(pin) !== String(prop_('COUNTER_PIN'))) { cache.put('pinfail', String(fails + 1), 300); throw new Error('Wrong PIN.'); }
}

function counterList_() {
  const sh = sheet_('Orders');
  const data = sh.getDataRange().getValues();
  const today = Utilities.formatDate(new Date(), TZ, 'yyyyMMdd');
  const out = [];
  for (let i = 1; i < data.length; i++) {
    const r = data[i]; if (!r[C.token - 1]) continue;
    if (Utilities.formatDate(new Date(r[C.created - 1]), TZ, 'yyyyMMdd') !== today) continue;
    out.push({ orderId: r[C.id - 1], token: r[C.token - 1], status: r[C.status - 1], name: r[C.name - 1],
      items: JSON.parse(r[C.items - 1] || '[]'), amount: r[C.amount - 1], paidAt: iso_(r[C.paidAt - 1]) });
  }
  return { orders: out, queue: queueInfo_() };
}

function advance_(orderId, to) {
  const row = findRow_(orderId); if (!row) throw new Error('Order not found.');
  const from = row.get(C.status);
  if (NEXT[from] !== to) throw new Error('Cannot move ' + from + ' to ' + to + '.');
  row.set(C.status, to);
  if (to === 'READY') row.set(C.readyAt, new Date());
  if (to === 'COLLECTED') row.set(C.collectedAt, new Date());
  return view_(row, false);
}

function collect_(ticket) { return collectRow_(findRow_(checkTicket_(ticket))); }

function collectByToken_(token) {
  token = String(token || '').toUpperCase().replace(/\s/g, '');
  const sh = sheet_('Orders'); const data = sh.getDataRange().getValues();
  const today = Utilities.formatDate(new Date(), TZ, 'yyyyMMdd');
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][C.token - 1] === token && Utilities.formatDate(new Date(data[i][C.created - 1]), TZ, 'yyyyMMdd') === today)
      return collectRow_(rowAt_(sh, i + 1));
  }
  throw new Error('No token ' + token + ' today.');
}

function collectRow_(row) {
  if (!row) throw new Error('Order not found.');
  const st = row.get(C.status);
  if (st === 'COLLECTED') return Object.assign(view_(row, false), { already: true });
  if (ACTIVE.indexOf(st) === -1) throw new Error('This order is not paid.');
  row.set(C.status, 'COLLECTED'); row.set(C.collectedAt, new Date());
  return view_(row, false);
}

/* ---------------- Tickets (signed QR payload) ---------------- */

function ticketFor_(orderId) { return orderId + '.' + hmacHex_(orderId, prop_('TOKEN_SECRET')).slice(0, 16); }
function checkTicket_(ticket) {
  const parts = String(ticket || '').split('.');
  if (parts.length !== 2 || ticketFor_(parts[0]) !== ticket) throw new Error('This ticket is not valid.');
  return parts[0];
}

/* ---------------- Helpers ---------------- */

function razorpay_(method, path, body) {
  const auth = Utilities.base64Encode(prop_('RZP_KEY_ID') + ':' + prop_('RZP_KEY_SECRET'));
  const opt = { method: method, headers: { Authorization: 'Basic ' + auth }, muteHttpExceptions: true };
  if (body) { opt.contentType = 'application/json'; opt.payload = JSON.stringify(body); }
  const res = UrlFetchApp.fetch('https://api.razorpay.com/v1' + path, opt);
  const json = JSON.parse(res.getContentText() || '{}');
  if (res.getResponseCode() >= 300) throw new Error((json.error && json.error.description) || 'Payment service error.');
  return json;
}

function hmacHex_(msg, key) {
  if (!key) throw new Error('Server is not configured (missing secret).');
  return Utilities.computeHmacSha256Signature(msg, key).map(b => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');
}

function prop_(k) { return PropertiesService.getScriptProperties().getProperty(k); }
function ss_() { return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet(); }
function sheet_(name) { const s = ss_().getSheetByName(name); if (!s) throw new Error('Missing sheet ' + name + '. Run setup().'); return s; }
function iso_(v) { return v ? new Date(v).toISOString() : null; }

function rows_(name) {
  const v = sheet_(name).getDataRange().getValues();
  const h = v.shift();
  return v.filter(r => r[0] !== '').map(r => { const o = {}; h.forEach((k, i) => o[k] = r[i]); return o; });
}

function config_() {
  const o = { baseMinutes: 4, minutesPerOrder: 1.5 };
  try { rows_('Config').forEach(r => { if (r.key in o) o[r.key] = Number(r.value); }); } catch (e) { /* defaults */ }
  return o;
}

function todayRows_() {
  const today = Utilities.formatDate(new Date(), TZ, 'yyyyMMdd');
  return sheet_('Orders').getDataRange().getValues().slice(1)
    .filter(r => r[0] && Utilities.formatDate(new Date(r[C.created - 1]), TZ, 'yyyyMMdd') === today);
}

function findRow_(orderId) {
  if (!orderId) return null;
  const sh = sheet_('Orders');
  const cell = sh.getRange(1, C.id, sh.getLastRow(), 1).createTextFinder(String(orderId)).matchEntireCell(true).findNext();
  return cell ? rowAt_(sh, cell.getRow()) : null;
}

function rowAt_(sh, r) {
  const vals = sh.getRange(r, 1, 1, ORDER_HEADERS.length).getValues()[0];
  return { get: c => vals[c - 1], set: (c, v) => { vals[c - 1] = v; sh.getRange(r, c).setValue(v); } };
}

/* ---------------- One-time setup ---------------- */

function setup() {
  const ss = ss_();
  const make = (name, headers, rows) => {
    let s = ss.getSheetByName(name);
    if (!s) s = ss.insertSheet(name);
    if (s.getLastRow() === 0) {
      s.appendRow(headers); s.setFrozenRows(1); s.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      if (rows && rows.length) s.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }
    return s;
  };
  make('Menu', ['id', 'name', 'era', 'category', 'price', 'prep', 'available', 'options'], MENU_SEED);
  make('Options', ['group', 'type', 'id', 'label', 'delta'], OPTION_SEED);
  make('Orders', ORDER_HEADERS, []);
  make('Config', ['key', 'value', 'note'], [
    ['baseMinutes', 4, 'Minimum wait shown to customers'],
    ['minutesPerOrder', 1.5, 'Added per order already in the queue'],
  ]);
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'reconcile').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('reconcile').timeBased().everyMinutes(5).create();
  ['RZP_KEY_ID', 'RZP_KEY_SECRET', 'TOKEN_SECRET', 'COUNTER_PIN'].forEach(k => { if (!prop_(k)) Logger.log('⚠ Set script property ' + k); });
  Logger.log('Chaiwala v2 sheets ready.');
}

// price in rupees; owner edits these in the Menu tab afterwards
const MENU_SEED = [
  ['adrak-chai', 'Adrak Chai', 'adda', 'chai', 40, 4, true, 'sugar,size_adda'],
  ['elaichi-chai', 'Elaichi Chai', 'adda', 'chai', 40, 4, true, 'sugar,size_adda'],
  ['masala-chai', 'Masala Chai', 'adda', 'chai', 45, 4, true, 'sugar,size_adda'],
  ['cutting-chai', 'Cutting Chai', 'adda', 'chai', 25, 3, true, 'sugar,size_adda'],
  ['bun-maska', 'Bun Maska', 'adda', 'bites', 45, 3, true, ''],
  ['biscuit-plate', 'Biscuit Plate', 'adda', 'bites', 30, 2, true, ''],
  ['hot-coffee', 'Hot Filter Coffee', 'cafe', 'coffee', 60, 4, true, 'sugar,size_cafe'],
  ['hot-chocolate', 'Artisan Hot Chocolate', 'cafe', 'coffee', 95, 5, true, ''],
  ['lemon-tea', 'Fresh Lemon Tea', 'cafe', 'tea', 50, 3, true, ''],
  ['ginger-tea', 'Herbal Ginger Tea', 'cafe', 'tea', 50, 3, true, ''],
  ['matcha-latte', 'Uji Matcha Oat Latte', 'cafe', 'cold', 140, 5, true, 'sugar,size_cafe'],
  ['iced-coffee', 'Citrus Tonic Cold Brew', 'cafe', 'cold', 100, 5, true, ''],
  ['boba-tea', 'Brown Sugar Pearl Boba', 'cafe', 'cold', 150, 6, true, 'boba'],
  ['cold-coffee', 'Classic Cold Coffee', 'cafe', 'cold', 90, 5, true, ''],
  ['butter-croissant', 'Artisan Butter Croissant', 'cafe', 'bites', 90, 2, true, ''],
  ['veg-grilled-sandwich', 'Veg Grilled Sandwich', 'cafe', 'bites', 90, 8, true, 'cheese'],
  ['jalapeno-cheese-sandwich', 'Jalapeño Melt Toastie', 'cafe', 'bites', 120, 8, true, 'cheese'],
  ['chocolate-pastry', 'Belgian Truffle Pastry', 'cafe', 'sweets', 85, 2, true, ''],
  ['brownie', 'Sea Salt Fudgy Brownie', 'cafe', 'sweets', 80, 2, true, ''],
];

const OPTION_SEED = [
  ['sugar', 'one', 'sugar.reg', 'Regular', 0],
  ['sugar', 'one', 'sugar.less', 'Less sugar', 0],
  ['sugar', 'one', 'sugar.none', 'No sugar', 0],
  ['size_adda', 'one', 'size.cut', 'Cutting · 120 ml', 0],
  ['size_adda', 'one', 'size.kulhad', 'Kulhad · 220 ml', 20],
  ['size_cafe', 'one', 'size.reg', 'Regular', 0],
  ['size_cafe', 'one', 'size.lg', 'Large', 20],
  ['cheese', 'many', 'cheese.extra', 'Extra cheese', 20],
  ['boba', 'many', 'boba.pearls', 'Brown sugar pearls', 0],
  ['boba', 'many', 'boba.lychee', 'Lychee jelly', 15],
];
