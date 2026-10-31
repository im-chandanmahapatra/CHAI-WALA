import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Check, ChevronRight, Clock3, Headphones, Minus, Pause, Play, Plus, ShoppingBag, Sparkles, Volume2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Option, PickupSlot, Product } from '../lib/database.types';
import { SEED_PRODUCTS } from '../lib/seed-data';
import { isSupabaseConfigured } from '../lib/supabase';
import { loadCatalogue, loadPickupWindows, placeOrder } from '../lib/ordering';

type EraKey = 'adda' | 'cafe' | 'now';
type OrderResult = { displayNumber: string; trackingToken: string; status: string };

const money = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const defaults = (product: Product) => product.optionGroups?.flatMap((group) => group.options.filter((option) => option.isDefault && option.isAvailable)) ?? [];
const formatSlot = (slot: PickupSlot) => `${new Date(slot.startsAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })} – ${new Date(slot.endsAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}`;

const eras: Record<EraKey, { number: string; label: string; title: string; roman: string; body: string; signal: string; image: string; ids: string[]; youtubeId: string; youtubeUrl: string; }> = {
  adda: { number: '01', label: '90s ADDA', title: 'Kadak. Seedha. Apna.', roman: 'Chai ke saath woh purani baat.', body: 'Ginger, cardamom, biscuit tin aur woh extra do minute jo koi jaldi mein nahi leta tha.', signal: 'Cassette warmth · Classic radio', image: '/images/campaign/era-adda.png', ids: ['prod-01', 'prod-03', 'prod-04', 'prod-02', 'prod-05', 'prod-06'], youtubeId: 'qVYJ-nn8TV8', youtubeUrl: 'https://youtu.be/qVYJ-nn8TV8' },
  cafe: { number: '02', label: '2000s CAFÉ', title: 'After class, one more cup.', roman: 'Cold coffee bhi, cutting chai bhi.', body: 'College table, café flash aur woh playlist jo ek hi gaana baar-baar chalati thi.', signal: 'Café flash · 2000s playlist', image: '/images/campaign/era-cafe.png', ids: ['prod-01', 'prod-07', 'prod-08', 'prod-09', 'prod-13', 'prod-19'], youtubeId: 'cxEv8whJhfI', youtubeUrl: 'https://youtu.be/cxEv8whJhfI' },
  now: { number: '03', label: 'GEN Z · NOW', title: 'New flavour. Same pause.', roman: 'Matcha, boba, aur chai — sab apni jagah.', body: 'Aaj ka counter zyada visual hai, lekin drink ke beech ka pause ab bhi real hai.', signal: 'Bright signal · New sound', image: '/images/matcha-latte.jpg', ids: ['prod-15', 'prod-16', 'prod-14', 'prod-08', 'prod-19'], youtubeId: '6IZTssBAXjo', youtubeUrl: 'https://youtu.be/6IZTssBAXjo' },
};

function Logo({ inverted = false }: { inverted?: boolean }) {
  return <a href="#top" className={`cw-logo ${inverted ? 'inverted' : ''}`} aria-label="Chaiwala home"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M11 8v17c0 10 5.2 15 13 15s13-5 13-15V8" /><path d="M18 8v15c0 4 2.2 6.8 6 6.8s6-2.8 6-6.8V8" /><path d="M24 4c-2 2.1-2 4.2 0 6.3M31 4c-2 2.1-2 4.2 0 6.3" /></svg><span><b>CHAIWALA</b><small>chai across generations</small></span></a>;
}

export const OrderPage: React.FC = () => {
  const { items, addItem, updateQuantity, removeItem, clearCart, subtotalPaise, itemCount } = useCart();
  const introRef = useRef<HTMLElement>(null);
  const [catalogue, setCatalogue] = useState<Product[]>(isSupabaseConfigured ? [] : SEED_PRODUCTS);
  const [catalogueError, setCatalogueError] = useState('');
  useEffect(() => { loadCatalogue().then(setCatalogue).catch(() => setCatalogueError('Menu load nahi hua. Please refresh to try again.')); }, []);
  const [customProduct, setCustomProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [slotLoading, setSlotLoading] = useState(false);
  const [slotError, setSlotError] = useState('');
  const [introDone, setIntroDone] = useState(false);
  const [playingEra, setPlayingEra] = useState<EraKey | null>(null);
  const requestKey = useRef(crypto.randomUUID());
  const submitting = useRef(false);
  const advanceIntro = () => { setIntroDone(true); document.getElementById('eras')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); };
  const chooseEra = (key: EraKey) => { setEra(key); setPlayingEra(null); document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' }); };
  const openProduct = (product: Product) => { setCustomProduct(product); setSelectedOptions(defaults(product)); setQuantity(1); };
  const loadSlots = async () => {
    setSlotLoading(true); setSlotError('');
    try {
      const data = await loadPickupWindows();
      const available = (data ?? []).filter((slot: PickupSlot) => slot.status === 'AVAILABLE' && slot.remaining > 0 && new Date(slot.startsAt).getTime() > Date.now());
      setSlots(available); setSlotId(current => available.some((slot: PickupSlot) => slot.id === current) ? current : available[0]?.id ?? '');
    } catch { setSlotError('Pickup windows load nahi hui. Retry karo.'); } finally { setSlotLoading(false); }
  };
  const [era, setEra] = useState<EraKey>('adda'); const [cartOpen, setCartOpen] = useState(false); const [checkoutOpen, setCheckoutOpen] = useState(false); 
  const [slots, setSlots] = useState<PickupSlot[]>([]); const [slotId, setSlotId] = useState(''); const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [note, setNote] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [confirmation, setConfirmation] = useState<OrderResult | null>(null);

  useEffect(() => { if (checkoutOpen) { void loadSlots(); const timer = window.setInterval(loadSlots, 30000); return () => clearInterval(timer); } }, [checkoutOpen]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.location.hash) { setIntroDone(true); return; }
    let frame = 0; const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min(1, (now - start) / 4500);
      introRef.current?.style.setProperty('--scroll-progress', String(progress));
      if (progress < 1) frame = requestAnimationFrame(animate);
      else { setIntroDone(true); if (window.scrollY < window.innerHeight * .5) document.getElementById('eras')?.scrollIntoView({ behavior: 'smooth' }); }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!(customProduct || cartOpen || checkoutOpen || confirmation)) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => document.querySelector<HTMLElement>('[role="dialog"] button')?.focus(), 0);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submitting.current) { setCustomProduct(null); setCartOpen(false); setCheckoutOpen(false); setConfirmation(null); }
      if (event.key === 'Tab') {
        const nodes = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"] button:not(:disabled), [role="dialog"] input:not(:disabled), [role="dialog"] a[href]'));
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(timer); document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [customProduct, cartOpen, checkoutOpen, confirmation]);

  useEffect(() => { const params = new URLSearchParams(window.location.search); const table = params.get('table'); const campaign = params.get('campaign'); if ((table && !/^[A-Za-z0-9_-]{1,32}$/.test(table)) || (campaign && !/^[A-Za-z0-9_-]{1,40}$/.test(campaign))) window.history.replaceState({}, '', window.location.pathname); }, []);

  const featured = useMemo(() => eras[era].ids.map((id) => catalogue.find((product) => product.slug === SEED_PRODUCTS.find(seed => seed.id === id)?.slug)).filter(Boolean) as Product[], [era, catalogue]);
  const gst = Math.round(subtotalPaise * .05); const packaging = items.length ? 1000 : 0; const total = subtotalPaise + gst + packaging;
  const submit = async (event: FormEvent) => { event.preventDefault(); if (submitting.current) return; setError(''); if (!items.length) return setError('Pehle bag mein kuch add karo.'); if (!name.trim()) return setError('Pickup ticket ke liye naam likho.'); if (phone.replace(/\D/g, '').length !== 10) return setError('10-digit mobile number likho.'); if (!slotId) return setError('Ek pickup window choose karo.'); submitting.current = true; setBusy(true); try { const result = await placeOrder( { items: items.map((item) => ({ productId:item.productId, quantity:item.quantity, optionIds:item.options.map((option) => option.optionId) })), pickupSlotId:slotId, customer:{ name:name.trim(), phone:phone.replace(/\D/g, ''), note:note.trim() || undefined }, idempotencyKey:requestKey.current }); setConfirmation(result); requestKey.current = crypto.randomUUID(); clearCart(); setCartOpen(false); setCheckoutOpen(false); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Counter order accept nahi kar paaya. Dobara try karo.'); } finally { submitting.current = false; setBusy(false); } };

  return <div id="top" className="chaiwala-app" data-era={era}>
    <a className="skip-link" href="#eras">Skip cinematic intro</a>
    <header className="cw-header"><Logo /><nav aria-label="Primary"><a href="#eras">Memories</a><a href="#menu">Menu</a><a href="#sound">Sound</a></nav><button className="bag-button" onClick={() => setCartOpen(true)}><ShoppingBag size={17} /> <span>Bag</span><b>{itemCount}</b></button></header>

    <main id="main-content">
      <section ref={introRef} className={`cinematic-intro ${introDone ? 'intro-complete' : ''}`} aria-label="Chaiwala cinematic opening"><div className="intro-stage"><div className="intro-image" /><div className="intro-vignette" /><div className="intro-stream" aria-hidden="true" /><div className="intro-steam steam-one" aria-hidden="true" /><div className="intro-steam steam-two" aria-hidden="true" /><div className="intro-copy intro-copy-one"><p>EK CUP KE ANDAR</p><h1>Kitni<br /><i>yaadein</i> hain?</h1></div><div className="intro-copy intro-copy-two"><p>CHAIWALA PRESENTS</p><h2>One counter.<br />Three generations.</h2></div><button type="button" className="intro-scroll" onClick={advanceIntro}><span>SCROLL TO YOUR CHAI WORLD</span><ArrowDown size={17} /></button></div></section>

      <section id="eras" className="eras-section" aria-labelledby="eras-title"><div className="eras-heading"><p className="kicker">CHOOSE A MEMORY, NOT A CATEGORY</p><h2 id="eras-title">Aaj tum kis<br /><i>chai mood</i> mein ho?</h2><p>Ek Chaiwala counter. Har era ka apna soundtrack, apni visual language, aur apni comfort list.</p></div><div className="era-selector" role="group" aria-label="Choose your generation">{(Object.keys(eras) as EraKey[]).map((key) => { const item = eras[key]; return <button key={key} aria-pressed={era === key} className="era-card" onClick={() => chooseEra(key)}><span className="era-number">{item.number}</span><img src={item.image} alt="" /><span className="era-shade" /><span className="era-content"><small>{item.label}{era === key ? ' · SELECTED' : ''}</small><strong>{item.title}</strong><em>{item.roman}</em><span className="era-arrow"><ArrowUpRight size={18} /></span></span></button>; })}</div></section>

      <section id="story" className="selected-era" aria-live="polite"><div className="era-poster"><img src={eras[era].image} alt="" /><div className="poster-badge"><span>{eras[era].number}</span><span>CHAIWALA<br />MEMORY CLUB</span></div></div><div className="era-story"><p className="kicker">{eras[era].label}</p><h2>{eras[era].title}</h2><p className="era-roman">{eras[era].roman}</p><p className="era-body">{eras[era].body}</p><div className="signal"><Sparkles size={16} /><span>{eras[era].signal}</span></div><a href="#menu" className="underlink">Is world ka menu dekho <ChevronRight size={17} /></a></div></section>

      <section id="sound" className="sound-preview" aria-labelledby="sound-title"><div className="sound-copy"><p className="kicker">CHAIWALA RADIO</p><h2 id="sound-title">Sound bhi<br /><i>memory</i> hai.</h2><p><b>{eras[era].label}</b> ke liye chosen soundtrack. Play dabao aur apne chai world mein raho.</p><div className="sound-actions"><button className="sound-button" onClick={() => setPlayingEra(current => current === era ? null : era)}>{playingEra === era ? <Pause size={18} /> : <Play size={18} />}{playingEra === era ? 'Pause soundtrack' : 'Play soundtrack'}</button><a href={eras[era].youtubeUrl} target="_blank" rel="noreferrer">YouTube par kholo <ArrowUpRight size={15} /></a></div></div><div className="sound-player"><div className="sound-player-label"><Headphones size={16} /><span>{eras[era].label} · CHAIWALA RADIO</span></div>{playingEra === era ? <iframe key={eras[era].youtubeId} title={`${eras[era].label} soundtrack`} src={`https://www.youtube-nocookie.com/embed/${eras[era].youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <button className="sound-cover" onClick={() => setPlayingEra(era)}><img src={eras[era].image} alt="" /><span><Play size={24} /> Play {eras[era].label}</span></button>}</div></section>

      <section id="menu" className="menu-world" aria-labelledby="menu-title"><div className="menu-top"><div><p className="kicker">CURATED FOR {eras[era].label}</p><h2 id="menu-title">The <i>good stuff.</i></h2></div><p>Tumhari generation ke favourites. Kisi aur mood mein ho? Yahin se apna menu switch karo.</p></div><div className="menu-era-switch" role="group" aria-label="Menu generation">{(Object.keys(eras) as EraKey[]).map(key => <button key={key} aria-pressed={era === key} onClick={() => setEra(key)}>{eras[key].label}</button>)}</div>{catalogueError && <p role="alert">{catalogueError}</p>}<div className="product-editorial">{featured.map((product, index) => <article className="product-card" key={product.id}><span className="product-index">0{index + 1}</span><img src={product.imagePath} loading="lazy" alt={product.imageAlt} /><div className="product-info"><div><h3>{product.name}</h3><p>{product.description}</p></div><div className="product-bottom"><strong>{money(product.basePricePaise)}</strong><button disabled={!product.isAvailable} onClick={() => openProduct(product)}>{product.isAvailable ? <><Plus size={17} /> Customize & add</> : 'Sold out'}</button></div></div></article>)}</div><p className="menu-note">Apni pasand ka size, sweetness aur quantity choose karo. Generation change karne par bag safe rahega.</p></section>

      <section className="ritual-section"><p className="kicker">THE ORDER RITUAL</p><div className="ritual-grid"><div><span>01</span><h3>Memory choose karo.</h3><p>90s, 2000s ya Now — it only changes the experience, not the freedom to order.</p></div><div><span>02</span><h3>Apna cup add karo.</h3><p>Bag always stays with you. Quantity aur total clearly visible rahega.</p></div><div><span>03</span><h3>Warm pickup.</h3><p>Available slot choose karo. Counter par pay karke collect karo.</p></div></div></section>
    </main>

    <footer className="after-footer"><div><Logo inverted /><p className="footer-line">After the last sip, conversation stays.</p></div><div className="footer-worlds"><a href="#story" onClick={() => setEra('adda')}>01 · 90s Adda</a><a href="#story" onClick={() => setEra('cafe')}>02 · 2000s Café</a><a href="#story" onClick={() => setEra('now')}>03 · Gen Z</a></div><div className="footer-meta"><span>CHAIWALA MEMORY CLUB</span><span>One counter. Everyone belongs.</span><span>© 2026</span></div></footer>

    {itemCount > 0 && <button className="mobile-bag" onClick={() => setCartOpen(true)}><ShoppingBag size={19} /> Bag kholo <b>{money(total)}</b><span>{itemCount}</span></button>}
    {customProduct && <aside className="sheet-backdrop" role="dialog" aria-modal="true" aria-labelledby="custom-title"><div className="cart-sheet custom-sheet"><button className="close-sheet" aria-label="Close customization" onClick={() => setCustomProduct(null)}><X /></button><img className="custom-photo" src={customProduct.imagePath} alt={customProduct.imageAlt} /><p className="kicker">MAKE IT YOURS</p><h2 id="custom-title">{customProduct.name}</h2><p>{customProduct.description}</p>{customProduct.optionGroups?.map(group => <fieldset key={group.id}><legend>{group.name} <small>({group.minSelect ? 'Required' : 'Optional'} · up to {group.maxSelect})</small></legend><div className="option-list">{group.options.map(option => <label key={option.id} className={selectedOptions.some(o => o.id === option.id) ? 'selected' : ''}><input type={group.maxSelect === 1 && group.minSelect > 0 ? 'radio' : 'checkbox'} name={group.id} disabled={!option.isAvailable} checked={selectedOptions.some(o => o.id === option.id)} onChange={() => setSelectedOptions(current => {
  const chosen = current.some(o => o.id === option.id);
  if (chosen && group.minSelect === 0) return current.filter(o => o.id !== option.id);
  if (group.maxSelect === 1) return [...current.filter(o => !group.options.some(g => g.id === o.id)), option];
  if (chosen) return current.filter(o => o.id !== option.id);
  return current.filter(o => group.options.some(g => g.id === o.id)).length < group.maxSelect ? [...current, option] : current;
})} /><span>{option.name}</span><b>{option.priceDeltaPaise ? '+' + money(option.priceDeltaPaise) : 'Included'}</b></label>)}</div></fieldset>)}<div className="custom-quantity"><span>Quantity</span><div className="quantity"><button disabled={quantity <= 1} aria-label="Decrease quantity" onClick={() => setQuantity(q => q - 1)}><Minus size={16} /></button><span>{quantity}</span><button disabled={quantity >= 20} aria-label="Increase quantity" onClick={() => setQuantity(q => q + 1)}><Plus size={16} /></button></div></div><button className="primary-action wide" disabled={customProduct.optionGroups?.some(g => selectedOptions.filter(o => g.options.some(opt => opt.id === o.id)).length < g.minSelect)} onClick={() => { addItem(customProduct, selectedOptions, quantity); setCustomProduct(null); setCartOpen(true); }}>Add to bag · {money((customProduct.basePricePaise + selectedOptions.reduce((sum, option) => sum + option.priceDeltaPaise, 0)) * quantity)}</button></div></aside>}
    {cartOpen && <aside className="sheet-backdrop" role="dialog" aria-modal="true" aria-labelledby="bag-title"><div className="cart-sheet"><button className="close-sheet" aria-label="Close bag" onClick={() => setCartOpen(false)}><X /></button><p className="kicker">YOUR CHAIWALA BAG</p><h2 id="bag-title">Ready when<br /><i>you are.</i></h2>{items.length ? <><div className="cart-lines">{items.map((item) => <div className="cart-line" key={item.id}><div><b>{item.productName}</b><small>{item.options.map((option) => option.optionName).join(' · ')}</small><strong>{money(item.lineTotalPaise)}</strong></div><div className="quantity"><button aria-label={`Remove one ${item.productName}`} onClick={() => updateQuantity(item.id,item.quantity - 1)}><Minus size={14} /></button><span>{item.quantity}</span><button aria-label={`Add one ${item.productName}`} onClick={() => updateQuantity(item.id,item.quantity + 1)}><Plus size={14} /></button></div><button className="remove-line" onClick={() => removeItem(item.id)}>Remove</button></div>)}</div><div className="bill"><p><span>Subtotal</span><span>{money(subtotalPaise)}</span></p><p><span>GST (5%)</span><span>{money(gst)}</span></p><p><span>Packaging</span><span>{money(packaging)}</span></p><p className="bill-total"><span>Total at counter</span><b>{money(total)}</b></p></div><button className="primary-action wide" onClick={() => {setCartOpen(false);setError('');setCheckoutOpen(true);}}>Pickup choose karo <ChevronRight size={18} /></button></> : <div className="empty-bag"><p>Bag abhi khaali hai. Apna pehla cup choose karo.</p><button className="primary-action wide" onClick={() => { setCartOpen(false); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); }}>Explore menu</button></div>}</div></aside>}
    {checkoutOpen && <aside className="sheet-backdrop" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><form className="checkout-sheet" onSubmit={submit}><button type="button" className="close-sheet" aria-label="Close checkout" onClick={() => setCheckoutOpen(false)}><X /></button><p className="kicker">PICKUP CHECKOUT</p><h2 id="checkout-title">Almost<br /><i>there.</i></h2><fieldset><legend><Clock3 size={17} /> Pickup window</legend>{slotLoading && <p role="status">Checking pickup windows…</p>}{slotError && <p role="alert">{slotError} <button type="button" onClick={loadSlots}>Retry</button></p>}{!slotLoading && !slotError && !slots.length && <p role="status">Abhi pickup windows available nahi hain. <button type="button" onClick={loadSlots}>Refresh windows</button></p>}<div className="slots">{slots.map((slot) => <label key={slot.id} className={slotId === slot.id ? 'selected' : ''}><input type="radio" name="slot" checked={slotId === slot.id} onChange={() => setSlotId(slot.id)} /><span>{formatSlot(slot)}</span><small>{slot.remaining} of {slot.capacity} slots left</small></label>)}</div></fieldset><label className="field">Naam<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ticket par kya naam hoga?" /></label><label className="field">Mobile<input required inputMode="numeric" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="10-digit mobile number" /></label><label className="field">Pickup note <small>(optional)</small><input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Kuch special note?" /></label><p className="checkout-total">Total · <strong>{money(total)}</strong></p><button type="button" className="back-to-bag" onClick={() => { setCheckoutOpen(false); setCartOpen(true); }}>← Edit bag</button><p className="pay-note">Pay cash ya UPI at the counter. </p>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-action wide" disabled={busy || slotLoading || !slotId || !!slotError}>{busy ? 'Order bhej rahe hain…' : `Order place karo · ${money(total)}`}</button></form></aside>}
    {confirmation && <aside className="sheet-backdrop confirmation-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirmation-title"><div className="confirmation"><div className="ticket-check"><Check /></div><p className="kicker">ORDER SENT</p><h2 id="confirmation-title">Chai is<br /><i>on the way.</i></h2><p>Ticket <b>{confirmation.displayNumber}</b> café confirmation ka wait kar raha hai. Pickup par cash ya UPI se pay karna.</p><p className="tracking">Tracking reference: {confirmation.trackingToken}</p><button className="primary-action wide" onClick={() => setConfirmation(null)}>Back to Chaiwala</button></div></aside>}
  </div>;
};
