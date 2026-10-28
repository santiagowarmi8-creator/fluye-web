/* 7.10.7 · idioma de la landing: la elección del usuario (fl_lang, compartida con la app web) manda sobre el idioma del navegador. */
(function () {
  var K = 'fl_lang', p = location.pathname;
  function get() { try { return localStorage.getItem(K); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(K, v); } catch (e) { /* sin almacenamiento: el enlace igual cambia de página */ } }
  // Quien eligió inglés y abre la portada en español vuelve a /en/. Quien eligió español nunca es devuelto a /en/ (el enlace ES apunta a «/»).
  if (get() === 'en' && (p === '/' || p === '/index.html')) location.replace('/en/' + location.search + location.hash);
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a.lg') : null;
    if (a) set(a.getAttribute('hreflang') === 'en' ? 'en' : 'es');
  }, true);
})();
