/* Chaiwala landing page: small, dependency-free motion layer.
   Everything degrades to the static final state with prefers-reduced-motion or without JS. */
(function () {
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // v2.0 links used /v2/#counter and /v2/#board
  if (location.hash === '#counter' || location.hash === '#board') { location.replace(location.hash.slice(1) + '/'); return; }

  // header border after scrolling
  var top = $('#top');
  var onScrollHeader = function () { if (top) top.classList.toggle('scrolled', scrollY > 8); };
  addEventListener('scroll', onScrollHeader, { passive: true }); onScrollHeader();

  // 1. era fan: deal the cards in once the photos are ready
  var fan = $('.lp-fan');
  if (fan && !RM) {
    fan.classList.add('stacked');
    var imgs = $$('img', fan), left = imgs.length;
    var deal = function () { requestAnimationFrame(function () { setTimeout(function () { fan.classList.remove('stacked'); }, 120); }); };
    imgs.forEach(function (im) { if (im.complete) { if (!--left) deal(); } else { im.addEventListener('load', function () { if (!--left) deal(); }); im.addEventListener('error', function () { if (!--left) deal(); }); } });
    setTimeout(function () { fan.classList.remove('stacked'); }, 1500); // never stay stacked
  }

  // 2. scroll-expanding story: scale .62 → 1, corner radius 34px → 0, copy fades in
  var ex = $('.lp-expand');
  if (ex && !RM) {
    var media = $('.lp-expand-media', ex), raf = 0;
    var paint = function () {
      raf = 0;
      var r = ex.getBoundingClientRect(), total = ex.offsetHeight - innerHeight;
      var p = Math.min(1, Math.max(0, -r.top / (total || 1)));
      var grow = Math.min(1, p / 0.55);                       // first 55%: the photo opens up
      var ease = 1 - Math.pow(1 - grow, 3);
      var s = 0.62 + 0.38 * ease;
      var o = Math.min(1, Math.max(0, (p - 0.45) / 0.3));     // then the words arrive
      ex.style.setProperty('--s', s.toFixed(4));
      ex.style.setProperty('--r', (34 * (1 - ease)).toFixed(2) + 'px');
      ex.style.setProperty('--o', o.toFixed(3));
      media.style.boxShadow = ease > .98 ? 'none' : '';
    };
    addEventListener('scroll', function () { raf = raf || requestAnimationFrame(paint); }, { passive: true });
    addEventListener('resize', paint); paint();
  } else if (ex) { ex.style.setProperty('--s', 1); ex.style.setProperty('--r', '0px'); ex.style.setProperty('--o', 1); }

  // 3. three eras: the sticky photo follows the era you are reading
  var frame = $('.lp-eras-frame');
  if (frame && 'IntersectionObserver' in window) {
    var tag = $('.tag', frame);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var era = e.target.getAttribute('data-era');
        $$('img', frame).forEach(function (im) { im.classList.toggle('on', im.getAttribute('data-era') === era); });
        if (tag) tag.textContent = e.target.getAttribute('data-label');
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    $$('.lp-era').forEach(function (a) { io.observe(a); });
  }

  // 4. reveal on scroll
  var rv = $$('.rv');
  if (RM || !('IntersectionObserver' in window)) rv.forEach(function (el) { el.classList.add('in'); });
  else {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    rv.forEach(function (el) { ro.observe(el); });
  }

  // 5. returning customer with an active token today → a quiet shortcut back to it
  try {
    var today = new Date().toLocaleDateString('en-CA');
    var t = (JSON.parse(localStorage.getItem('cw2.tickets')) || []).filter(function (x) { return x.day === today && x.token; })[0];
    var pill = $('#lpToken');
    if (t && pill) { $('b', pill).textContent = t.token; pill.hidden = false; requestAnimationFrame(function () { pill.classList.add('show'); }); }
  } catch (e) { /* storage unavailable */ }
})();
