/* 7.10.17 · Página de pago de Fluye con Paddle (SOLO sandbox). Es el «Default payment link» de Paddle.
 * Abre el checkout de la transacción ?_ptxn= creada por el servidor. Esta página NUNCA activa un plan:
 * el plan se activa solo cuando el servidor recibe el webhook firmado de Paddle. */
(function () {
  var API = location.hostname === 'localhost' ? 'http://localhost:8788' : 'https://fluye-api-demo.onrender.com';
  var q = new URLSearchParams(location.search), txn = q.get('_ptxn') || q.get('txn') || '', w = q.get('w') || '';
  var en = q.get('l') === 'en' || (!q.get('l') && (function () { try { return localStorage.getItem('fl_lang') === 'en'; } catch (e) { return false; } })());
  var L = en ? 'en' : 'es', $ = function (id) { return document.getElementById(id); };
  document.documentElement.lang = L;
  document.querySelectorAll('[data-' + L + ']').forEach(function (el) { el.textContent = el.getAttribute('data-' + L); });
  if (en) { $('lp').href = '/en/pricing/'; $('lt').href = '/en/terms/'; $('lr').href = '/en/refunds/'; $('lv').href = '/en/privacy/'; document.title = 'Secure payment · Fluye'; }
  var T = en ? { none: 'This is Fluye’s secure payment page. To subscribe, choose a plan in the Fluye app.', off: 'Payments with Paddle aren’t active yet. Nothing was charged. Go back to Fluye and pay by card or PayPal.', fail: 'We couldn’t open the checkout. Nothing was charged. Try again.', open: 'Pay in the secure Paddle window.', done: 'Payment received by Paddle. Your plan turns on as soon as Paddle confirms it to Fluye (usually under a minute). You can go back to the app.', closed: 'You closed the checkout. Nothing was charged.', gpay: 'Choose Google Pay in the payment window. If you don’t see it, your device or browser doesn’t support it; you can pay by card.', apay: 'Choose Apple Pay in the payment window. If you don’t see it, your device or browser doesn’t support it; you can pay by card.' }
    : { none: 'Esta es la página de pago seguro de Fluye. Para suscribirte, elige un plan en la app de Fluye.', off: 'El pago con Paddle todavía no está activo. No se cobró nada. Vuelve a Fluye y paga con tarjeta o PayPal.', fail: 'No pudimos abrir el pago. No se cobró nada. Inténtalo de nuevo.', open: 'Paga en la ventana segura de Paddle.', done: 'Paddle recibió tu pago. Tu plan se activa en cuanto Paddle se lo confirme a Fluye (suele tardar menos de un minuto). Ya puedes volver a la app.', closed: 'Cerraste el pago. No se cobró nada.', gpay: 'Elige Google Pay en la ventana de pago. Si no aparece, tu dispositivo o navegador no lo admite; puedes pagar con tarjeta.', apay: 'Elige Apple Pay en la ventana de pago. Si no aparece, tu dispositivo o navegador no lo admite; puedes pagar con tarjeta.' };
  var completed = false;
  function say(t, h) { $('msg').textContent = t; if (h) $('h').textContent = h; }
  if (w === 'gpay' || w === 'apay') { $('walt').textContent = T[w]; $('wal').hidden = false; }
  if (!/^txn_[a-z0-9]+$/i.test(txn)) { say(T.none); $('wal').hidden = true; return; }
  function open() { try { window.Paddle.Checkout.open({ transactionId: txn, settings: { displayMode: 'overlay', locale: L, theme: document.documentElement.getAttribute('data-theme') === 'dark' || (!document.documentElement.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light' } }); say(T.open); } catch (e) { say(T.fail); $('open').hidden = false; } }
  fetch(API + '/api/paddle/config').then(function (r) { return r.json(); }).then(function (c) {
    if (!c || !c.enabled || c.env !== 'sandbox' || !/^test_/.test(c.clientToken || '')) { say(T.off); return; }
    var s = document.createElement('script'); s.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    s.onerror = function () { say(T.fail); $('open').hidden = false; };
    s.onload = function () {
      window.Paddle.Environment.set('sandbox');
      window.Paddle.Initialize({ token: c.clientToken, eventCallback: function (ev) {
        if (!ev || !ev.name) return;
        if (ev.name === 'checkout.completed') { completed = true; say(T.done, en ? 'Thank you!' : '¡Gracias!'); $('open').hidden = true; $('wal').hidden = true; }
        if (ev.name === 'checkout.closed' && !completed) { say(T.closed); $('open').hidden = false; }
      } });
      // Paddle.js abre solo el checkout cuando la URL trae ?_ptxn=; si no lo hizo en 2,5 s, lo abrimos nosotros.
      setTimeout(function () { if (!completed && !document.querySelector('iframe[name="paddle_frame"], .paddle-frame')) open(); }, 2500);
    };
    document.head.appendChild(s);
  }).catch(function () { say(T.fail); $('open').hidden = false; });
  $('open').addEventListener('click', open);
})();
