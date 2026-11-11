"""Landing page (/v2/) and order page (/v2/order/) generators. Imported by build.py."""
from build import (ARROW, CUP, ERAS, FAQ, SITE_NAME, SITE_URL, business_ld, crumbs_ld, esc, head, site_footer, static_header, write)

ICON = {
    "upi": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M10 6h4M9.5 14l2 2 3.5-4"/></svg>',
    "qr": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3M21 14v7h-7"/></svg>',
    "user": '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/><path d="M3 3l18 18"/></svg>',
}
ERA_COPY = {
    "adda": ("The <em>Adda</em>", "1900s · The Adda", "Street-side chai the old way: Assam CTC simmered over a slow flame, hand-crushed ginger, cardamom cracked fresh, and buttered buns for dunking."),
    "y2k": ("The Coffee <em>House</em>", "2000s · The Coffee House", "The café you bunked class for: frothy cold coffee, hot chocolate on rainy afternoons, grilled sandwiches and a brownie to split."),
    "cafe": ("The <em>Café</em>", "2020s · The Café", "Today's counter: ceremonial matcha, sixteen-hour cold brew over tonic, brown sugar boba and laminated croissants."),
}
ERA_MEDIA = {"adda": "scene-1900s-sm.webp", "y2k": "cold-coffee.webp", "cafe": "scene-2020s-sm.webp"}
ERA_MEDIA_ALT = {
    "adda": "A lantern-lit chai stall on an old city street at dusk",
    "y2k": "Tall glass of blended cold coffee with a chocolate drizzle",
    "cafe": "A bright modern café with plants and arched windows",
}
ERA_YEAR = {"adda": "1900s", "y2k": "2000s", "cafe": "2020s"}


def page_order(menu):
    title = "Order online: pay by UPI, collect with a token | Chaiwala"
    desc = "Build your order from three eras of chai and coffee, pay with UPI, cards or wallets through Razorpay, and collect it at the counter with a QR token."
    items = [("Home", ""), ("Order", "order/")]
    fallback = (f'{static_header("../", "order/")}<main class="shell"><section class="page-hero"><span class="eyebrow">Order online</span>'
                f'<h1>Start an <em>order</em></h1><p>The ordering counter needs JavaScript. You can still browse the <a href="../menu/">full menu</a> '
                f'or read <a href="../how-it-works/">how token ordering works</a>.</p></section></main>')
    body = (f'<body data-page="order">\n<a class="sr-only" href="#menu">Skip to menu</a>\n<div id="app">{fallback}</div>\n'
            f'<div class="toasts" id="toasts" aria-live="polite"></div>\n<script src="../assets/app.js" defer></script>\n</body>\n</html>\n')
    write("order/index.html", head("../", "order/", title, desc, "home.jpg", "Chaiwala ordering: three eras of chai and coffee", ld=[crumbs_ld(items)]) + body)


def page_landing(menu):
    title = "Chaiwala | Chai across generations, ordered online"
    desc = "A three-era chai and coffee counter. Order from the 1900s adda, the 2000s coffee house or today's café, pay with UPI, and collect with a QR token."
    by = {m["id"]: m for m in menu}
    lo = min(m["price"] for m in menu)
    website = {"@context": "https://schema.org", "@type": "WebSite", "@id": SITE_URL + "#site", "name": SITE_NAME, "url": SITE_URL,
               "inLanguage": "en-IN", "publisher": {"@id": SITE_URL + "#cafe"}}
    fan = ""
    for i, (k, pid) in enumerate([("adda", "masala-chai"), ("y2k", "cold-coffee"), ("cafe", "matcha-latte")]):
        m = by[pid]; prio = 'fetchpriority="high"' if i == 1 else 'loading="eager"'
        name = {"adda": "The Adda", "y2k": "The Coffee House", "cafe": "The Café"}[k]
        fan += (f'<a class="fan-card c{i + 1}" href="order/?era={k}" aria-label="Order from the {ERA_YEAR[k]}: {name}">'
                f'<img src="img/{m["image"]}" alt="{esc(m["alt"])}" width="800" height="1000" {prio} decoding="async">'
                f'<span class="fan-label"><b>{ERA_YEAR[k]}</b><span>{name}</span></span></a>')
    eras = ""
    for key, year, name, _ in ERAS:
        em, label, blurb = ERA_COPY[key]
        lst = [m for m in menu if m["era"] == key]
        dishes = "".join(f'<li><span>{esc(m["name"])}</span><span>₹{m["price"]}</span></li>' for m in lst[:4])
        eras += (f'<article class="lp-era rv" data-era="{key}" data-label="{esc(label)}" aria-labelledby="era-{key}">'
                 f'<img class="lp-era-img" src="img/{ERA_MEDIA[key]}" alt="{esc(ERA_MEDIA_ALT[key])}" width="900" height="560" loading="lazy" decoding="async">'
                 f'<span class="eyebrow">{year}</span><h3 id="era-{key}">{em}</h3><p>{esc(blurb)}</p><ul class="lp-dishlist">{dishes}</ul>'
                 f'<div class="lp-era-foot"><a class="btn btn-primary" href="order/?era={key}">Order from the {year} {ARROW}</a>'
                 f'<span class="lp-from">From ₹{min(m["price"] for m in lst)}</span></div></article>')
    frames = "".join(f'<img data-era="{k}" class="{"on" if k == "adda" else ""}" src="img/{ERA_MEDIA[k]}" alt="{esc(ERA_MEDIA_ALT[k])}" width="900" height="900" loading="lazy" decoding="async">' for k, *_ in ERAS)
    bento = ""
    for i, d in enumerate(["masala-chai", "bun-maska", "cold-coffee", "brownie", "matcha-latte"]):
        m = by[d]
        bento += (f'<a class="lp-dish rv{" big" if i == 0 else ""}" href="order/?add={d}" aria-label="Order {esc(m["name"])}, ₹{m["price"]}">'
                  f'<img src="img/{m["image"]}" alt="{esc(m["alt"])}" width="800" height="1000" loading="lazy" decoding="async">'
                  f'<span class="info"><span><b>{esc(m["name"])}</b><small>{ERA_YEAR[m["era"]]}</small></span><span class="price">₹{m["price"]}</span></span></a>')
    faq = "".join(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in FAQ[:4])
    body = f"""<body data-page="landing" class="lp">
<a class="sr-only" href="#main">Skip to content</a>
<header class="top" id="top"><div class="shell"><a class="brand" href="./" aria-label="Chaiwala home">{CUP}<span><b>Chaiwala</b><small>Chai across generations</small></span></a>
<nav class="nav" aria-label="Main"><a href="#eras">Eras</a><a href="menu/">Menu</a><a href="how-it-works/">How it works</a></nav>
<a class="btn btn-primary btn-sm cta-sm" href="order/">Start an order {ARROW}</a></div></header>
<main id="main">
<section class="lp-hero" aria-labelledby="lpTitle"><div class="shell lp-hero-grid">
  <div class="lp-hero-copy">
    <span class="eyebrow">Chai · coffee · three eras</span>
    <h1 id="lpTitle">Chai across <em>generations.</em></h1>
    <p class="lp-lead">Order from the 1900s adda, the 2000s coffee house or today's café. Pay with UPI, then collect at the counter with a token on your phone. No login, no queue.</p>
    <div class="lp-ctas"><a class="btn btn-primary" href="order/">Start an order {ARROW}</a><a class="btn btn-ghost" href="menu/">See the menu</a></div>
    <ul class="lp-facts"><li>{ICON["upi"]}UPI, cards and wallets via Razorpay</li><li>{ICON["qr"]}A QR token that works once</li><li>{ICON["user"]}No account needed</li></ul>
  </div>
  <div class="lp-fan" role="group" aria-label="Choose an era">{fan}<span class="lp-fan-hint" aria-hidden="true">Pick an era</span></div>
</div></section>

<section class="lp-expand" aria-label="Our tagline"><div class="lp-expand-sticky">
  <figure class="lp-expand-media"><img src="img/scene-1900s.webp" srcset="img/scene-1900s-sm.webp 900w, img/scene-1900s.webp 1800w" sizes="100vw" alt="A lantern-lit chai stall on an old city street at dusk, a glass of chai and a brass kettle on the counter" width="1800" height="1005" loading="lazy" decoding="async"></figure>
  <div class="lp-expand-copy"><span class="eyebrow">Since the first adda</span><p class="lp-quote">Waqt badla. <em>Baithak wahi.</em></p><p>Time changes. The gathering remains. The kettle, the conversation and the glass passed across the counter have outlived every decade. We just took the queue out of it.</p></div>
  <span class="lp-expand-hint" aria-hidden="true">Scroll</span>
</div></section>

<section class="lp-sec" id="eras" aria-labelledby="erasTitle"><div class="shell">
  <header class="lp-sec-head rv"><span class="eyebrow">Three eras · one counter</span><h2 id="erasTitle">Pick a decade. <em>Pour a cup.</em></h2>
  <p>Each era has its own menu, its own soundtrack and its own token. Order from one, or mix all three in the same order.</p></header>
  <div class="lp-eras-grid"><div class="lp-eras-media" aria-hidden="true"><div class="lp-eras-frame"><span class="tag">1900s · The Adda</span>{frames}</div></div>
  <div class="lp-eras-list">{eras}</div></div>
</div></section>

<section class="lp-sec" aria-labelledby="howTitle"><div class="shell lp-how-grid">
  <div><header class="lp-sec-head rv"><span class="eyebrow">How it works</span><h2 id="howTitle">Thirty seconds, <em>then chai.</em></h2></header>
  <ol class="lp-steps rv"><li><div><b>Pick</b><p>Tap a drink to set sugar and size right on its card. Your kulhad fills up as you add.</p></div></li>
  <li><div><b>Pay</b><p>Slide to pay. Razorpay opens with UPI, cards and wallets, and the counter confirms the payment itself.</p></div></li>
  <li><div><b>Collect</b><p>Your token updates live from Paid to Brewing to Ready. Show the QR at the counter and it is yours.</p></div></li></ol>
  <p class="dim" style="margin-top:18px">More detail in <a href="how-it-works/">how token ordering works</a>.</p></div>
  <div class="rv"><div class="lp-pass" role="img" aria-label="Example token pass showing token A-042 with a QR code">
    <div class="tp"><span class="eyebrow">Chaiwala · 1900s adda</span><div class="big">A-042</div><div class="who">Your name here</div></div>
    <div class="perf"></div>
    <div class="qr-row"><div class="qr"><img src="img/token-qr.svg" alt="Example QR code" width="98" height="98"></div><p>Works once. The first scan marks it collected.</p></div>
    <div class="bars"><span class="on">Paid</span><span class="on">Brewing</span><span>Ready</span></div>
  </div><p class="lp-pass-note">Example token</p></div>
</div></section>

<section class="lp-sec" aria-labelledby="dishTitle"><div class="shell">
  <header class="lp-sec-head rv"><span class="eyebrow">Signatures</span><h2 id="dishTitle">The cups people <em>come back for.</em></h2></header>
  <div class="lp-bento">{bento}</div>
  <div class="lp-more"><a class="btn btn-ghost" href="menu/">See the full menu {ARROW}</a></div>
</div></section>

<section class="lp-sec" aria-labelledby="soundTitle"><div class="shell"><div class="lp-sound-card rv">
  <div><span class="eyebrow">No. 03 · Sound system</span><h2 id="soundTitle">Every era has its own <em>soundtrack.</em></h2>
  <p>A Bollywood cassette for the adda, a burnt CD for the coffee house, new releases for the café. Press play while your token brews.</p>
  <a class="btn btn-ghost" href="order/#soundSec">Listen while you order {ARROW}</a></div>
  <div class="lp-media-row" aria-hidden="true"><figure><div class="lp-tape"></div><figcaption>1900s · tape</figcaption></figure><figure><div class="lp-cd"></div><figcaption>2000s · CD</figcaption></figure><figure><div class="lp-vinyl"></div><figcaption>2020s · vinyl</figcaption></figure></div>
</div></div></section>

<section class="lp-sec" aria-labelledby="faqTitle"><div class="shell lp-faq-grid">
  <header class="lp-sec-head rv"><span class="eyebrow">Questions</span><h2 id="faqTitle">Good to <em>know.</em></h2><p>Everything else is in <a href="how-it-works/">how it works</a>.</p></header>
  <div class="faq rv">{faq}</div>
</div></section>

<section class="lp-final" aria-labelledby="finalTitle"><div class="shell rv"><span class="eyebrow">Prices from ₹{lo}</span>
  <h2 id="finalTitle">Your chai is <em>a tap away.</em></h2>
  <p>Choose an era, pay with UPI, and pick it up with your token.</p>
  <div class="lp-ctas"><a class="btn btn-primary" href="order/">Start an order {ARROW}</a><a class="btn btn-ghost" href="menu/">See the menu</a></div>
</div></section>
</main>
<a class="lp-token-pill" id="lpToken" href="order/" hidden><span class="dot"></span>Your token <b>…</b> {ARROW}</a>
{site_footer("")}
<script src="assets/landing.js" defer></script>
</body>
</html>
"""
    write("index.html", head("", "", title, desc, "home.jpg", "Chaiwala: three eras of chai and coffee, ordered online and collected with a token",
                             ld=[website, business_ld(menu)], boot=False) + body)
