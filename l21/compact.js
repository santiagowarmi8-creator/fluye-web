/* Fluye 7.10.21 · landing compacta: entrada suave, pestañas, sección activa y precio mensual/anual. Sin scripts en línea (CSP). */
(function () {
  var d = document, root = d.documentElement, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');
  function ready(f) { if (d.readyState !== 'loading') f(); else d.addEventListener('DOMContentLoaded', f); }
  ready(function () {
    var rv = d.querySelectorAll('.rv');
    if (reduce || !('IntersectionObserver' in window)) rv.forEach(function (e) { e.classList.add('in'); });
    else {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });
      rv.forEach(function (e) { io.observe(e); });
    }
    // pestañas (teclado: flechas, Inicio, Fin)
    d.querySelectorAll('[role=tablist]').forEach(function (tl) {
      var tabs = [].slice.call(tl.querySelectorAll('[role=tab]'));
      function sel(t, focus) {
        tabs.forEach(function (x) { var on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; var p = d.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on; });
        if (focus) t.focus();
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { sel(t); });
        t.addEventListener('keydown', function (e) {
          var k = e.key, j = k === 'ArrowRight' ? i + 1 : k === 'ArrowLeft' ? i - 1 : k === 'Home' ? 0 : k === 'End' ? tabs.length - 1 : null;
          if (j === null) return; e.preventDefault(); sel(tabs[(j + tabs.length) % tabs.length], true);
        });
      });
    });
    // sección activa en la barra
    var links = [].slice.call(d.querySelectorAll('.sn a')), map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    if ('IntersectionObserver' in window) {
      var cur = null, so = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return; var a = map[e.target.id]; if (!a || a === cur) return;
          if (cur) cur.removeAttribute('aria-current'); a.setAttribute('aria-current', 'true'); cur = a;
          var sn = a.parentNode, l = a.offsetLeft - (sn.clientWidth - a.offsetWidth) / 2;
          if (sn.scrollWidth > sn.clientWidth) sn.scrollTo({ left: l, behavior: reduce ? 'auto' : 'smooth' });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      Object.keys(map).forEach(function (id) { var s = d.getElementById(id); if (s) so.observe(s); });
    }
    // mensual / anual
    d.querySelectorAll('.ivt button').forEach(function (b) {
      b.addEventListener('click', function () {
        var y = b.dataset.iv === 'year';
        d.querySelectorAll('.ivt button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        d.querySelectorAll('[data-m]').forEach(function (e) { e.textContent = y ? e.dataset.y : e.dataset.m; });
      });
    });
  });
})();
