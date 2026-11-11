"""
Chaiwala v2 static build.  Run from anywhere:   python v2/tools/build.py

Generates every page with its own title, description, canonical URL, social image,
JSON-LD and breadcrumbs, plus sitemap.xml, robots.txt, llms.txt and the 404 page.
Minifies app/app.js and app/app.css into assets/ with esbuild when it is available
(v2/node_modules/.bin/esbuild or on PATH); otherwise copies them unminified.
No source maps are produced.
"""
import datetime, html, json, os, re, shutil, subprocess, sys

V2 = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(V2)

# ---------------------------------------------------------------- site settings
# Change SITE_URL when a custom domain is connected (keep the trailing slash).
SITE_URL = "https://im-chandanmahapatra.github.io/CHAI-WALA/v2/"
SITE_NAME = "Chaiwala"
# Fill these in to complete the LocalBusiness listing. Empty values are left out of the schema.
BUSINESS = {
    "streetAddress": "",
    "addressLocality": "",
    "addressRegion": "",
    "postalCode": "",
    "addressCountry": "IN",
    "telephone": "",            # e.g. "+91 98765 43210"
    "openingHours": [],         # e.g. ["Mo-Sa 07:00-22:00", "Su 08:00-21:00"]
    "geo": None,                # e.g. {"latitude": 20.2961, "longitude": 85.8245}
}
TODAY = datetime.date.today().isoformat()

ERAS = [
    ("adda", "1900s", "The Adda", "Slow-simmered chai and bun maska from the old street-side adda."),
    ("y2k", "2000s", "The Coffee House", "Cold coffee, hot chocolate and grilled sandwiches from the coffee-house years."),
    ("cafe", "2020s", "The Café", "Matcha, cold brew, boba and laminated pastry for the in-between hours."),
]
CATS = {"chai": "Chai", "bites": "Bites & buns", "cold": "Cold & iced", "coffee": "Coffee & cocoa", "tea": "Tea", "sweets": "Sweets"}
ERA_TITLE_EM = {"adda": "The <em>Adda</em>", "y2k": "The Coffee <em>House</em>", "cafe": "The <em>Café</em>"}

esc = lambda s: html.escape(str(s), quote=True)
abs_url = lambda p: SITE_URL + p.lstrip("/")


def read_menu():
    src = open(os.path.join(V2, "app", "app.js"), encoding="utf-8").read()
    rows = re.findall(r"^\s*M\('([^']+)', '([^']+)', '([^']+)', '([^']+)', (\d+), (\d+), '([^']+)', '([^']+)', '([^']+)'", src, re.M)
    menu = [dict(id=r[0], name=r[1], era=r[2], cat=r[3], price=int(r[4]), prep=int(r[5]), image=r[6], alt=r[7], blurb=r[8]) for r in rows]
    if len(menu) < 10:
        sys.exit("build: could not read the menu from app/app.js")
    return menu


CUP = '<svg viewBox="34 22 132 172" class="logo-mark" width="26" height="34" aria-hidden="true" focusable="false"><defs><mask id="cwlogo" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect width="200" height="200" fill="#fff"/><g transform="translate(42.9,55.2) scale(0.7)"><g> <path d="M71 92 C60 26 140 26 129 92" fill="none" stroke="#000" stroke-width="8.5" stroke-linecap="round"/> <path d="M77 82 C81 69 119 69 123 82 Z" fill="#000"/><rect x="97" y="56" width="6" height="14" rx="3" fill="#000"/><circle cx="100" cy="55" r="6.5" fill="#000"/> <path d="M77 82 C70 98 56 110 56 129 C56 151 76 163 100 163 C124 163 144 151 144 129 C144 110 130 98 123 82 Z" fill="#000"/> <path d="M75 161 H125 L121 170 H79 Z" fill="#000"/> <path d="M63 138 C45 136 35 120 25 98 C23 94 19 92 13 92 L13 86 C22 85 29 89 33 96 C41 112 49 120 65 122 Z" fill="#000"/> <path d="M66 104 C85 98 115 98 134 104" fill="none" stroke="#000" stroke-width="2.2"/> <path d="M102.2 148.6Q95.4 148.6 92.4 144.3Q89.3 140.0 89.3 131.9Q89.3 128 90.3 123.7Q91.2 119.5 93.1 115.5Q94.9 111.5 97.4 108.3Q100 105.1 103.2 103.2Q106.5 101.3 110.2 101.3Q114.7 101.3 118.4 104.3Q119 104.8 118.8 105.7L116.9 115.4Q116.7 116.4 115.9 116.4Q115.2 116.4 115.2 115.4L115.1 112.9Q115 107.6 113.6 105.3Q112.2 103.1 109.5 103.1Q107 103.1 104.7 105.1Q102.4 107.1 100.5 110.5Q98.5 113.8 97 117.9Q95.5 122 94.6 126Q93.8 130.1 93.8 133.7Q93.8 139.4 95.6 143.1Q97.3 146.7 101.4 146.7Q103.8 146.7 105.7 145Q107.6 143.2 109.6 138.9L111 135.9Q111.3 135.1 112 135.1Q113.0 135.1 112.7 136.4L110.1 146.3Q109.9 147.3 109.1 147.5Q108 147.9 106 148.2Q103.9 148.6 102.2 148.6Z" fill="#000"/> </g></g></mask></defs><path d="M40 190 V88 A60 60 0 0 1 160 88 V190 Z" fill="currentColor" mask="url(#cwlogo)"/></svg>'  # brand mark (see v2/brand/)
ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
ERA_BOOT = "<script>try{var e=JSON.parse(localStorage.getItem('cw2.era'));if(['adda','y2k','cafe'].indexOf(e)>-1)document.documentElement.dataset.era=e}catch(_){}</script>"


def head(rel, path, title, desc, og, og_alt, noindex=False, ld=(), boot=True):
    canonical = abs_url(path)
    tags = [
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
        f"<title>{esc(title)}</title>",
        f'<meta name="description" content="{esc(desc)}">',
        f'<link rel="canonical" href="{canonical}">',
        '<meta name="robots" content="noindex, nofollow">' if noindex else '<meta name="robots" content="index, follow, max-image-preview:large">',
        '<meta name="theme-color" content="#0E0A07">',
        '<meta name="color-scheme" content="dark light">',
        '<meta property="og:type" content="website">',
        f'<meta property="og:site_name" content="{SITE_NAME}">',
        '<meta property="og:locale" content="en_IN">',
        f'<meta property="og:title" content="{esc(title)}">',
        f'<meta property="og:description" content="{esc(desc)}">',
        f'<meta property="og:url" content="{canonical}">',
        f'<meta property="og:image" content="{abs_url("og/" + og)}">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        f'<meta property="og:image:alt" content="{esc(og_alt)}">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{esc(title)}">',
        f'<meta name="twitter:description" content="{esc(desc)}">',
        f'<meta name="twitter:image" content="{abs_url("og/" + og)}">',
        f'<meta name="twitter:image:alt" content="{esc(og_alt)}">',
        f'<link rel="icon" href="{rel}icons/favicon.svg" type="image/svg+xml">',
        f'<link rel="icon" href="{rel}icons/favicon-32.png" sizes="32x32" type="image/png">',
        f'<link rel="apple-touch-icon" href="{rel}icons/apple-touch-icon.png">',
        f'<link rel="manifest" href="{rel}site.webmanifest">',
        f'<link rel="preload" href="{rel}fonts/jizBRFtNs2ka5fXjeivQ4LroWlx-6zUTjg.woff2" as="font" type="font/woff2" crossorigin>',
        f'<link rel="stylesheet" href="{rel}fonts/fonts.css">',
        f'<link rel="stylesheet" href="{rel}assets/app.css">',
        ERA_BOOT if boot else '',
    ]
    for block in ld:
        tags.append('<script type="application/ld+json">' + json.dumps(block, ensure_ascii=False, separators=(",", ":")) + "</script>")
    return "<!doctype html>\n<html lang=\"en-IN\" data-era=\"adda\">\n<head>\n" + "\n".join(tags) + "\n</head>\n"


def crumbs_ld(items):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": abs_url(p)} for i, (n, p) in enumerate(items)]}


def crumbs_html(rel, items):
    lis = []
    for i, (n, p) in enumerate(items):
        last = i == len(items) - 1
        lis.append(f'<li><span aria-current="page">{esc(n)}</span></li>' if last else f'<li><a href="{rel}{p}">{esc(n)}</a></li>')
    return f'<nav class="crumbs" aria-label="Breadcrumb"><ol>{"".join(lis)}</ol></nav>'


def static_header(rel, current):
    links = [("order/", "Order"), ("menu/", "Menu"), ("how-it-works/", "How it works")]
    nav = "".join(f'<a href="{rel}{p}"{" aria-current=\"page\"" if p == current else ""}>{t}</a>' for p, t in links)
    return (f'<header class="top" id="top"><div class="shell"><a class="brand" href="{rel}" aria-label="Chaiwala home">{CUP}'
            f'<span><b>Chaiwala</b><small>Chai across generations</small></span></a>'
            f'<nav class="nav" aria-label="Main">{nav}</nav><a class="btn btn-primary btn-sm cta-sm" href="{rel}order/">Start an order {ARROW}</a></div></header>')


def site_footer(rel):
    return (f'<footer class="site-foot"><div class="shell"><nav aria-label="Footer">'
            f'<a href="{rel}">Home</a><a href="{rel}order/">Order</a><a href="{rel}menu/">Menu</a><a href="{rel}how-it-works/">How it works</a>'
            f'<a href="{rel}counter/">Staff · counter mode</a><a href="{rel}board/">Now-serving board</a></nav>'
            f'<p>Chaiwala, chai across generations. Payments are processed by Razorpay.</p></div></footer>')


def business_ld(menu):
    lo, hi = min(m["price"] for m in menu), max(m["price"] for m in menu)
    b = {"@context": "https://schema.org", "@type": "CafeOrCoffeeShop", "@id": SITE_URL + "#cafe", "name": SITE_NAME, "url": SITE_URL,
         "description": "A three-era chai and coffee counter. Order online, pay with UPI through Razorpay, and collect with a signed QR token.",
         "image": [abs_url("og/home.jpg")], "logo": abs_url("icons/icon-512.png"),
         "servesCuisine": ["Indian", "Tea", "Coffee", "Bakery"], "priceRange": f"₹{lo}–₹{hi}", "currenciesAccepted": "INR",
         "paymentAccepted": "UPI, Credit card, Debit card, Wallet", "hasMenu": abs_url("menu/"), "acceptsReservations": False}
    addr = {k: v for k, v in BUSINESS.items() if k in ("streetAddress", "addressLocality", "addressRegion", "postalCode", "addressCountry") and v}
    if BUSINESS["streetAddress"] and BUSINESS["addressLocality"]:
        b["address"] = {"@type": "PostalAddress", **addr}
    if BUSINESS["telephone"]:
        b["telephone"] = BUSINESS["telephone"]
    if BUSINESS["openingHours"]:
        b["openingHours"] = BUSINESS["openingHours"]
    if BUSINESS["geo"]:
        b["geo"] = {"@type": "GeoCoordinates", **BUSINESS["geo"]}
    return b


def write(rel_path, text):
    path = os.path.join(V2, rel_path) if not rel_path.startswith("/") else os.path.join(REPO, rel_path.lstrip("/"))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print("  wrote", os.path.relpath(path, REPO))


# ---------------------------------------------------------------- pages
def page_menu(menu):
    title = "Menu: chai, coffee and bites from three eras | Chaiwala"
    desc = "The full Chaiwala menu with prices: 1900s adda chai and bun maska, 2000s cold coffee and brownies, 2020s matcha, cold brew and boba."
    items = [("Home", ""), ("Menu", "menu/")]
    sections, blocks = [], []
    for key, year, name, blurb in ERAS:
        era_items = [m for m in menu if m["era"] == key]
        cats = []
        for c in dict.fromkeys(m["cat"] for m in era_items):
            lst = [m for m in era_items if m["cat"] == c]
            cats.append({"@type": "MenuSection", "name": CATS[c], "hasMenuItem": [
                {"@type": "MenuItem", "name": m["name"], "description": m["blurb"], "image": abs_url("img/" + m["image"]),
                 "offers": {"@type": "Offer", "price": f'{m["price"]:.2f}', "priceCurrency": "INR"}} for m in lst]})
            lis = "".join(
                f'<li class="mitem"><img src="../img/{m["image"]}" alt="{esc(m["alt"])}" width="88" height="88" loading="lazy" decoding="async">'
                f'<div><h4>{esc(m["name"])}</h4><p>{esc(m["blurb"])}</p><div class="row"><span class="price-tag">₹{m["price"]}</span>'
                f'<a class="btn btn-primary btn-sm" href="../order/?add={m["id"]}" aria-label="Order {esc(m["name"])}, ₹{m["price"]}">Order</a></div></div></li>'
                for m in lst)
            blocks.append("")
            cats_html = f'<h3>{CATS[c]}</h3><ul class="mlist">{lis}</ul>'
            cats[-1]["_html"] = cats_html
        sections.append({"@type": "MenuSection", "name": f"{year}: {name}", "description": blurb, "hasMenuSection": [{k: v for k, v in c.items() if k != "_html"} for c in cats]})
        blocks[-1] = (f'<section class="era-block" id="{key}" aria-labelledby="h-{key}"><header><div><span class="eyebrow">{year}</span>'
                      f'<h2 id="h-{key}">{ERA_TITLE_EM[key]}</h2><p class="dim" style="margin:8px 0 0">{esc(blurb)}</p></div>'
                      f'<a class="btn btn-ghost btn-sm" href="../order/?era={key}">Order from the {year}</a></header>{"".join(c["_html"] for c in cats)}</section>')
    menu_ld = {"@context": "https://schema.org", "@type": "Menu", "@id": abs_url("menu/") + "#menu", "name": "Chaiwala menu", "url": abs_url("menu/"),
               "inLanguage": "en-IN", "hasMenuSection": sections}
    jump = " · ".join(f'<a href="#{k}">{y} · {n}</a>' for k, y, n, _ in ERAS)
    body = (f'<body data-page="menu">\n{static_header("../", "menu/")}\n<main class="shell">{crumbs_html("../", items)}'
            f'<section class="page-hero"><span class="eyebrow">Prices in rupees · tax included</span><h1>The <em>menu</em></h1>'
            f'<p>Three eras, one counter. Every item can be ordered online and collected with a token. Jump to {jump}.</p></section>'
            f'{"".join(blocks)}'
            f'<div class="cta-band"><b>Ready to order?</b><a class="btn btn-primary" href="../order/">Start your order {ARROW}</a></div>'
            f'<p class="dim" style="margin-top:18px">New to token ordering? Read <a href="../how-it-works/">how it works</a>.</p></main>\n'
            f'{site_footer("../")}\n</body>\n</html>\n')
    write("menu/index.html", head("../", "menu/", title, desc, "menu.jpg", "Chaiwala menu: masala chai, cold coffee and matcha from three eras",
                                  ld=[menu_ld, crumbs_ld(items)]) + body)


FAQ = [
    ("Do I need an account to order?", "No. You add items, type the name to call out and your mobile number, and pay. There is no sign-up or password."),
    ("How do I pay?", "Checkout is handled by Razorpay, so you can pay with UPI, a debit or credit card, or a wallet. Chaiwala never sees your card or UPI PIN."),
    ("What is the token?", "After payment you get a short code such as A-042 and a QR code on your phone. Show it at the counter and staff scan it to hand over your order."),
    ("Can someone else use a screenshot of my token?", "No. The QR code works once. The first scan marks the order as collected, and any later scan shows the time it was already collected."),
    ("What if I close the page after paying?", "Your token is saved on your phone, so reopening the page brings it back. You can also use Find my token with the mobile number you paid with."),
    ("How long will my order take?", "Before you pay, the order screen shows a live estimate based on how many orders are ahead of you. Your token then updates from Paid to Brewing to Ready."),
    ("What are the three eras?", "The menu is split into the 1900s adda, the 2000s coffee house and the 2020s café. Each has its own drinks, bites and music, and you can order from any of them."),
]


def page_how(menu):
    title = "How token ordering works | Chaiwala"
    desc = "Pick your order, pay with UPI through Razorpay and show a QR token at the counter. How no-login ordering works, plus answers to common questions."
    items = [("Home", ""), ("How it works", "how-it-works/")]
    faq_ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]}
    faq_html = "".join(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q, a in FAQ)
    body = (f'<body data-page="how">\n{static_header("../", "how-it-works/")}\n<main class="shell">{crumbs_html("../", items)}'
            f'<section class="page-hero"><span class="eyebrow">No login. No queue.</span><h1>How token ordering <em>works</em></h1>'
            f'<p>Chaiwala replaces the counter queue with a token on your phone. It takes about thirty seconds from opening the page to paying.</p></section>'
            f'<ol class="steps"><li><b>Pick</b>Choose from the <a href="../menu/">menu</a>. Tap a drink to set sugar and size right on its card.</li>'
            f'<li><b>Pay</b>Slide to pay. Razorpay opens with UPI, cards and wallets. The counter confirms the payment before issuing a token.</li>'
            f'<li><b>Collect</b>Your token updates live. When it says Ready, show the QR code at the counter and pick up your order.</li></ol>'
            f'<div class="prose"><h2>Why the price is always right</h2><p>The amount you pay is calculated by the counter from its own price list, not by your phone. '
            f'If an item sells out while you are ordering, you are told before any money moves.</p>'
            f'<h2>Questions</h2></div><div class="faq">{faq_html}</div>'
            f'<div class="cta-band"><b>See it for yourself.</b><a class="btn btn-primary" href="../order/">Start an order {ARROW}</a></div></main>\n'
            f'{site_footer("../")}\n</body>\n</html>\n')
    write("how-it-works/index.html", head("../", "how-it-works/", title, desc, "how-it-works.jpg", "A Chaiwala token pass with a QR code and the code A-042",
                                          ld=[faq_ld, crumbs_ld(items)]) + body)


def page_staff(slug, page, title, desc):
    body = (f'<body data-page="{page}">\n<div id="app"><main class="shell"><h1>{esc(title.split(" | ")[0])}</h1><p>Loading…</p></main></div>\n'
            f'<div class="toasts" id="toasts" aria-live="polite"></div>\n<script src="../assets/app.js" defer></script>\n</body>\n</html>\n')
    write(f"{slug}/index.html", head("../", f"{slug}/", title, desc, "home.jpg", "Chaiwala", noindex=True) + body)


def page_404():
    # Served by the host for any missing URL, at any depth, so every link is resolved from the URL at runtime.
    base_js = (
        "var b=location.pathname.indexOf('/CHAI-WALA/')===0?'/CHAI-WALA/v2/':'/v2/';"
        "['fonts/fonts.css','assets/app.css'].forEach(function(h){var l=document.createElement('link');l.rel='stylesheet';l.href=b+h;document.head.appendChild(l)});"
        "var i=document.createElement('link');i.rel='icon';i.type='image/svg+xml';i.href=b+'icons/favicon.svg';document.head.appendChild(i);"
        "try{var e=JSON.parse(localStorage.getItem('cw2.era'));if(['adda','y2k','cafe'].indexOf(e)>-1)document.documentElement.dataset.era=e}catch(_){}"
        "document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('[data-to]').forEach(function(a){a.href=b+a.getAttribute('data-to')})});"
    )
    doc = (f'<!doctype html>\n<html lang="en-IN" data-era="adda">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
           f'<title>Page not found | Chaiwala</title>\n<meta name="description" content="This page does not exist. Head back to the Chaiwala menu to order.">\n'
           f'<meta name="robots" content="noindex">\n<style>body{{margin:0;background:#0E0A07;color:#F3E7D3;font-family:system-ui,sans-serif}}</style>\n'
           f'<script>{base_js}</script>\n</head>\n'
           f'<body>\n<main class="nf"><div><div class="code" aria-hidden="true">404</div><h1>This cup is empty.</h1>'
           f'<p>The page you were looking for does not exist or has moved. Your order and any saved token are safe.</p>'
           f'<div class="row"><a class="btn btn-primary" data-to="order/" href="{SITE_URL}order/">Start an order</a><a class="btn btn-ghost" data-to="" href="{SITE_URL}">Home</a>'
           f'<a class="btn btn-ghost" data-to="menu/" href="{SITE_URL}menu/">See the menu</a>'
           f'</div></div></main>\n</body>\n</html>\n')
    write("/404.html", doc)


def seo_files(menu):
    urls = [("", "1.0"), ("order/", "0.9"), ("menu/", "0.9"), ("how-it-works/", "0.6")]
    sm = ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          "".join(f"  <url><loc>{abs_url(u)}</loc><lastmod>{TODAY}</lastmod><priority>{p}</priority></url>\n" for u, p in urls) + "</urlset>\n")
    write("sitemap.xml", sm)
    # robots.txt is only read at the root of a domain. This file is correct for a custom domain pointed at this repo.
    write("/robots.txt", "User-agent: *\nAllow: /\nDisallow: /v2/counter/\nDisallow: /v2/board/\n\nSitemap: " + abs_url("sitemap.xml") + "\n")
    lines = [f"# {SITE_NAME}", "", "> A three-era chai and coffee counter in India. Customers order online without an account, pay with UPI, cards or wallets through Razorpay, "
             "and collect their order at the counter by showing a single-use QR token.", "",
             "## Pages", "", f"- [Home]({SITE_URL}): what Chaiwala is, the three eras, how ordering works, signature dishes",
             f"- [Order]({abs_url('order/')}): the ordering page with the live menu, order summary and token pass",
             f"- [Menu]({abs_url('menu/')}): every item with prices in rupees, grouped by era",
             f"- [How it works]({abs_url('how-it-works/')}): the ordering, payment and token process, with FAQs", "", "## Menu", ""]
    for key, year, name, _ in ERAS:
        lines.append(f"### {year}: {name}")
        lines += [f"- {m['name']}: ₹{m['price']}. {m['blurb']}" for m in menu if m["era"] == key]
        lines.append("")
    lines += ["## Notes", "", "- Staff pages (/counter/, /board/) are not for customers and are excluded from indexing.", ""]
    llms = "\n".join(lines)
    write("llms.txt", llms)
    write("/llms.txt", llms)
    manifest = {"name": "Chaiwala", "short_name": "Chaiwala", "description": "Order chai, pay by UPI, pick up with a token.",
                "start_url": "./", "scope": "./", "display": "standalone", "background_color": "#0E0A07", "theme_color": "#0E0A07",
                "icons": [{"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
                          {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
                          {"src": "icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]}
    write("site.webmanifest", json.dumps(manifest, indent=2) + "\n")


def bundle():
    os.makedirs(os.path.join(V2, "assets"), exist_ok=True)
    cands = [os.path.join(V2, "node_modules", ".bin", "esbuild.cmd"), os.path.join(V2, "node_modules", ".bin", "esbuild"), shutil.which("esbuild")]
    esb = next((c for c in cands if c and os.path.exists(c)), None)
    for name in ("app.js", "app.css", "landing.js"):
        src, out = os.path.join(V2, "app", name), os.path.join(V2, "assets", name)
        if esb:
            subprocess.run([esb, src, "--minify", "--legal-comments=none", "--target=es2020,chrome100,safari15", f"--outfile={out}", "--log-level=warning"], check=True)
        else:
            shutil.copyfile(src, out)
        print(f"  {'minified' if esb else 'copied  '} assets/{name}: {os.path.getsize(src)//1024} KB -> {os.path.getsize(out)//1024} KB")
    for f in os.listdir(os.path.join(V2, "assets")):
        if f.endswith(".map"):
            os.remove(os.path.join(V2, "assets", f))


if __name__ == "__main__":
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    sys.modules.setdefault("build", sys.modules["__main__"])
    menu = read_menu()
    print(f"Chaiwala build · {len(menu)} menu items · {SITE_URL}")
    bundle()
    from pages_landing import page_landing, page_order  # noqa: E402 (imports this module's helpers)
    page_landing(menu); page_order(menu); page_menu(menu); page_how(menu)
    page_staff("counter", "counter", "Counter mode | Chaiwala staff", "Staff counter for Chaiwala: queue, status updates and QR token scanning.")
    page_staff("board", "board", "Now serving | Chaiwala", "Chaiwala now-serving board for the shop TV.")
    page_404(); seo_files(menu)
    print("done.")
