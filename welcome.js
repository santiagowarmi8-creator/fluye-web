/* Fluye 7.10 — bienvenida en la web.
   · Visitante nuevo: ventana con el logo (una sola vez; al cerrarla no vuelve: localStorage).
   · Usuario con sesión: saludo con su nombre (una vez por visita; se cierra solo o con un toque).
   Respeta «reducir movimiento», tema claro/oscuro y español/inglés (fl_lang o idioma del navegador). */
(function () {
  var KEY = 'fluye.web.welcome', R = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function get(k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } }
  function set(k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  var l = get('fl_lang'), EN = l ? l === 'en' : String(navigator.language || 'es').toLowerCase().indexOf('en') === 0;
  var T = EN ? {
    slogan: 'Book, arrive and flow.', sub: 'Book your appointment at salons, barbershops, spas and clinics in the Dominican Republic. Free for your business too.',
    create: 'Create account', have: 'I already have an account', close: 'Close', later: 'Just look around',
    am: 'Good morning', pm: 'Good afternoon', ev: 'Good evening', back: 'Welcome back, ', openOwner: 'Open my dashboard', openApp: 'Open the app', dismiss: 'Dismiss greeting',
    today: function (n) { return 'You have ' + n + (n === 1 ? ' appointment' : ' appointments') + ' today'; }, aria: 'Welcome to Fluye'
  } : {
    slogan: 'Reserva, llega y fluye.', sub: 'Reserva tu cita en salones, barberías, spas y consultorios de República Dominicana. Gratis también para tu negocio.',
    create: 'Crear cuenta', have: 'Ya tengo cuenta', close: 'Cerrar', later: 'Solo mirar',
    am: 'Buenos días', pm: 'Buenas tardes', ev: 'Buenas noches', back: 'Hola de nuevo, ', openOwner: 'Abrir mi panel', openApp: 'Abrir la app', dismiss: 'Cerrar saludo',
    today: function (n) { return 'Tienes ' + n + (n === 1 ? ' cita' : ' citas') + ' hoy'; }, aria: 'Bienvenida a Fluye'
  };
  var user = null; try { user = JSON.parse(get('fc3_user') || 'null'); } catch (e) { user = null; }
  var token = get('fc3_token');
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var LOGO = '<img src="/favicon.svg" alt="" width="64" height="64">';
  function mount() {
    if (/[?&](inicio|soporte)=/.test(location.search)) return;
    if (user && user.name && token) return greet();
    if (!get(KEY)) return welcome();
  }
  function welcome() {
    var o = document.createElement('div'); o.className = 'wl-ov'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-modal', 'true'); o.setAttribute('aria-label', T.aria);
    o.innerHTML = '<div class="wl-box"><button class="wl-x" type="button" aria-label="' + T.close + '">×</button><div class="wl-logo' + (R ? '' : ' fl') + '">' + LOGO + '</div><h2>Fluye</h2><p class="wl-s">' + T.slogan + '</p><p class="wl-p">' + T.sub + '</p><div class="wl-b"><a class="btn p" href="/app/?inicio=registro">' + T.create + '</a><a class="btn g" href="/app/?inicio=entrar">' + T.have + '</a></div><button class="wl-l" type="button">' + T.later + '</button></div>';
    var prev = document.activeElement;
    function done() { set(KEY, '1'); o.classList.add('out'); setTimeout(function () { o.remove(); if (prev && prev.focus) prev.focus(); }, R ? 0 : 220); document.removeEventListener('keydown', key); }
    function key(e) { if (e.key === 'Escape') done(); else if (e.key === 'Tab') { var f = o.querySelectorAll('a,button'); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } } }
    o.addEventListener('click', function (e) { if (e.target === o || e.target.closest('.wl-x,.wl-l')) done(); else if (e.target.closest('a')) set(KEY, '1'); });
    document.addEventListener('keydown', key); document.body.appendChild(o);
    requestAnimationFrame(function () { o.classList.add('in'); o.querySelector('.btn').focus(); });
  }
  function greet() {
    if (get('fl_greeted_web', true)) return; set('fl_greeted_web', '1', true);
    var h = new Date().getHours(), part = h < 12 ? T.am : h < 19 ? T.pm : T.ev, name = String(user.name).split(' ')[0];
    var owner = user.role === 'owner' || (user.businesses && user.businesses.length > 0);
    var g = document.createElement('div'); g.className = 'wl-gr'; g.setAttribute('role', 'status'); g.setAttribute('aria-live', 'polite');
    function paint(line) { g.innerHTML = '<button type="button" class="wl-gb" aria-label="' + T.dismiss + '"><span class="wl-gl"><img src="/favicon.svg" alt="" width="30" height="30"></span><span class="wl-gt"><small>' + esc(part) + '</small><b>' + esc(T.back + name) + '</b>' + (line ? '<span>' + esc(line) + '</span>' : '') + '</span></button><a class="wl-go" href="/app/">' + (owner ? T.openOwner : T.openApp) + '</a>'; }
    paint('');
    document.body.appendChild(g); requestAnimationFrame(function () { g.classList.add('in'); });
    var tm = setTimeout(close, 6000);
    function close() { clearTimeout(tm); g.classList.add('out'); setTimeout(function () { g.remove(); }, R ? 0 : 240); }
    g.addEventListener('click', function (e) { if (e.target.closest('.wl-gb')) close(); });
    try {
      fetch('https://fluye-api-demo.onrender.com/api/me/welcome', { headers: { authorization: 'Bearer ' + token } }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
        if (d && d.owner && owner && d.owner.today > 0 && g.isConnected) { paint(T.today(d.owner.today)); }
      }).catch(function () { /* sin conexión: saludo sin datos */ });
    } catch (e) { /* */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(mount, 500); }); else setTimeout(mount, 500);
})();
