/* Fluye 7.10.20 · efectos de la landing: entrada al hacer scroll, parallax de teléfonos, barra de progreso, contadores y precio mensual/anual.
 * Respeta prefers-reduced-motion. Sin dependencias. */
(function () {
  var d = document, root = d.documentElement, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');
  function ready(f) { if (d.readyState !== 'loading') f(); else d.addEventListener('DOMContentLoaded', f); }
  ready(function () {
    var rv = d.querySelectorAll('.rv');
    if (reduce || !('IntersectionObserver' in window)) { rv.forEach(function (e) { e.classList.add('in'); }); }
    else {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var g = e.target.closest('.gal'); (g ? g.querySelectorAll('.rv') : [e.target]).forEach(function (x) { x.classList.add('in'); io.unobserve(x); }); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      rv.forEach(function (e) { io.observe(e); });
    }
    // contadores
    d.querySelectorAll('[data-count]').forEach(function (el) {
      var to = Number(el.dataset.count); if (reduce || !to) { el.textContent = to; return; }
      var o = new IntersectionObserver(function (es) { if (!es[0].isIntersecting) return; o.disconnect(); var t0 = performance.now();
        (function f(t) { var k = Math.min(1, (t - t0) / 1100); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0); });
      o.observe(el);
    });
    // mensual / anual
    d.querySelectorAll('.ivt button').forEach(function (b) {
      b.addEventListener('click', function () {
        var y = b.dataset.iv === 'year';
        d.querySelectorAll('.ivt button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        d.querySelectorAll('[data-m]').forEach(function (e) { e.textContent = y ? e.dataset.y : e.dataset.m; });
      });
    });
    if (reduce) return;
    var bar = d.querySelector('.bar'), px = d.querySelectorAll('[data-px]'), tick = false;
    function frame() {
      tick = false; var h = root.scrollHeight - innerHeight, y = scrollY;
      if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
      px.forEach(function (e) { var r = e.getBoundingClientRect(), c = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; e.style.translate = '0 ' + (c * Number(e.dataset.px) * -60).toFixed(1) + 'px'; });
    }
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive: true });
    frame();
    // inclinación suave del teléfono con el puntero (solo escritorio)
    var hero = d.querySelector('.phones');
    if (hero && matchMedia('(hover: hover)').matches) {
      hero.addEventListener('pointermove', function (ev) { var r = hero.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width - 0.5, yy = (ev.clientY - r.top) / r.height - 0.5;
        hero.style.transform = 'rotateY(' + (x * 8).toFixed(2) + 'deg) rotateX(' + (-yy * 6).toFixed(2) + 'deg)'; });
      hero.addEventListener('pointerleave', function () { hero.style.transform = ''; });
      hero.style.transition = 'transform .4s ease-out'; hero.style.transformStyle = 'preserve-3d';
    }
  });
})();
