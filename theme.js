(function(){var k='fluye.web.theme',r=document.documentElement,s=localStorage.getItem(k);if(s)r.dataset.theme=s;
document.addEventListener('DOMContentLoaded',function(){var b=document.getElementById('tg');if(!b)return;
function dark(){return r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
function lbl(){b.textContent=dark()?'☀':'☾';b.setAttribute('aria-label',dark()?'Usar tema claro':'Usar tema oscuro')}lbl();
b.onclick=function(){r.dataset.theme=dark()?'light':'dark';localStorage.setItem(k,r.dataset.theme);lbl()}})})();

(function(){var R=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.addEventListener('DOMContentLoaded',function(){
  var els=document.querySelectorAll('section .w > *, .grid > .card, .steps > .card, .price > .plan, .plans3 > .plan, details, .shot');
  if(!R&&'IntersectionObserver'in window){els.forEach(function(e,i){e.classList.add('rv');e.style.transitionDelay=((i%4)*70)+'ms'});
    var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});els.forEach(function(e){io.observe(e)});
    /* v7.7: si se salta de golpe (ancla, scroll rápido) nada queda invisible por encima de la pantalla */
    var ct;addEventListener('scroll',function(){clearTimeout(ct);ct=setTimeout(function(){els.forEach(function(e){if(!e.classList.contains('in')&&e.getBoundingClientRect().top<innerHeight){e.classList.add('in');io.unobserve(e)}})},120)},{passive:true});}
  if(!R&&innerWidth>900){var ps=document.querySelectorAll('.hero .ph');var t=false;window.addEventListener('scroll',function(){if(t)return;t=true;requestAnimationFrame(function(){var y=Math.min(window.scrollY,700);ps.forEach(function(p,i){p.style.transform=(i?'rotate(3deg)':'rotate(-4deg)')+' translateY('+(y*(i?-.12:.08))+'px)'});t=false})},{passive:true});}
  var sh=document.querySelector('.shots'),dots=document.querySelectorAll('.cnav i');if(sh&&dots.length){sh.addEventListener('scroll',function(){var w=sh.scrollWidth-sh.clientWidth;var k=w?Math.round(sh.scrollLeft/w*(dots.length-1)):0;dots.forEach(function(d,i){d.classList.toggle('on',i===k)})},{passive:true});}
});})();

(function(){var R=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.addEventListener('DOMContentLoaded',function(){
  // contadores (valores reales de los planes, sin cifras inventadas)
  var cs=document.querySelectorAll('[data-count]');
  function run(e){var to=+e.dataset.count;if(R||!to){e.textContent=to;return}var t0=performance.now(),d=900;(function f(t){var k=Math.min(1,(t-t0)/d);e.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(t0)}
  if('IntersectionObserver'in window){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){run(x.target);io.unobserve(x.target)}})},{threshold:.6});cs.forEach(function(e){e.textContent='0';io.observe(e)})}
  // sección activa en la navegación
  var ids=['clientes','negocios','como','precios','descarga','preguntas','contacto'],links=document.querySelectorAll('.links a, .subnav a');
  if('IntersectionObserver'in window){var so=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){links.forEach(function(a){var on=a.getAttribute('href')==='/#'+x.target.id;a.classList.toggle('on',on);if(on&&a.parentNode.classList.contains('subnav'))a.parentNode.scrollTo({left:a.offsetLeft-16,behavior:R?'auto':'smooth'})})}})},{rootMargin:'-45% 0px -50% 0px'});
    ids.forEach(function(i){var s=document.getElementById(i);if(s)so.observe(s)})}
  // inclinación al pasar el cursor (solo con mouse)
  if(!R&&matchMedia('(hover: hover) and (pointer: fine)').matches){document.querySelectorAll('.shot .fr, .card, .plan').forEach(function(el){el.classList.add('tilt');
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform='perspective(900px) rotateX('+(-y*5)+'deg) rotateY('+(x*6)+'deg) translateY(-4px)'});
    el.addEventListener('pointerleave',function(){el.style.transform=''})})}
  // carrusel: avance automático suave en el celular hasta que la persona lo toque
  var sh=document.querySelector('.shots');if(sh&&!R){var stop=false;['pointerdown','touchstart','wheel'].forEach(function(ev){sh.addEventListener(ev,function(){stop=true},{passive:true})});
    setInterval(function(){if(stop||sh.scrollWidth<=sh.clientWidth+4)return;var r=sh.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;var w=sh.firstElementChild.getBoundingClientRect().width+16;var n=sh.scrollLeft+w;sh.scrollTo({left:n>=sh.scrollWidth-sh.clientWidth+4?0:n,behavior:'smooth'})},3200)}
});})();

/* Sesión compartida con /app: si ya entraste, la cabecera muestra tu perfil en lugar de «Entrar / Crear cuenta». */
(function(){
  var TK='fc3_token',US='fc3_user',API=(localStorage.getItem('fc3_api')||'https://fluye-api-demo.onrender.com').replace(/\/+$/,'');
  function tok(){try{return localStorage.getItem(TK)}catch(e){return null}}
  function usr(){try{return JSON.parse(localStorage.getItem(US)||'null')}catch(e){return null}}
  function ini(n){n=String(n||'').trim().split(/\s+/);return ((n[0]||'?')[0]+((n[1]||'')[0]||'')).toUpperCase()}
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  var box=null;
  function mount(u){
    var nav=document.querySelector('header.top .nav');if(!nav||!u)return;
    var outs=nav.querySelectorAll('a[href*="inicio=entrar"],a[href*="inicio=registro"]');for(var i=0;i<outs.length;i++)outs[i].style.display='none';
    if(box)box.remove();
    var owner=u.role==='owner';
    box=document.createElement('div');box.className='acct';
    box.innerHTML='<button class="acct-b" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Tu cuenta: '+esc(u.name)+'">'+(u.photo?'<img src="'+esc(u.photo)+'" alt="">':'<span>'+esc(ini(u.name))+'</span>')+'</button>'+
      '<div class="acct-m" role="menu" hidden><div class="acct-h"><b>'+esc(u.name)+'</b><small>'+esc(u.email||(owner?'Cuenta de negocio':'Cliente'))+'</small></div>'+
      '<a role="menuitem" href="/app/?ir=profile">Mi perfil</a>'+
      '<a role="menuitem" href="/app/?ir='+(owner?'owner':'appts')+'">'+(owner?'Ir al panel del negocio':'Ir a la app · Mis citas')+'</a>'+
      '<a role="menuitem" href="/app/?ir=security">Configuración</a>'+
      (u.isAdmin?'<button role="menuitem" type="button" class="acct-admin">Panel de administración</button>':'')+
      '<button role="menuitem" type="button" class="acct-out">Cerrar sesión</button></div>';
    nav.appendChild(box);
    var b=box.querySelector('.acct-b'),m=box.querySelector('.acct-m');
    function set(o){m.hidden=!o;b.setAttribute('aria-expanded',o?'true':'false');if(o){var f=m.querySelector('a');f&&f.focus({preventScroll:true})}}
    b.onclick=function(e){e.stopPropagation();set(m.hidden)};
    document.addEventListener('click',function(e){if(!box.contains(e.target))set(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!m.hidden){set(false);b.focus()}});
    box.querySelector('.acct-out').onclick=function(){var t=tok();try{fetch(API+'/api/auth/logout',{method:'POST',headers:{authorization:'Bearer '+t,'content-type':'application/json'},body:'{}',keepalive:true}).catch(function(){})}catch(e){}
      try{localStorage.removeItem(TK);localStorage.removeItem(US)}catch(e){}unmount()};
    var ad=box.querySelector('.acct-admin');if(ad)ad.onclick=function(){fetch(API+'/api/admin/ticket',{method:'POST',headers:{authorization:'Bearer '+tok(),'content-type':'application/json'},body:'{}'}).then(function(r){return r.ok?r.json():null}).then(function(j){if(j&&j.url)location.href=j.url})};
  }
  function unmount(){if(box){box.remove();box=null}var outs=document.querySelectorAll('header.top .nav a[href*="inicio="]');for(var i=0;i<outs.length;i++)outs[i].style.display=''}
  function start(){
    if(!tok())return;
    var cached=usr();if(cached)mount({name:cached.name,email:cached.email,role:cached.role,photo:cached.photo||cached.avatarUrl||null,isAdmin:false});
    fetch(API+'/api/me',{headers:{authorization:'Bearer '+tok()}}).then(function(r){if(r.status===401){try{localStorage.removeItem(TK);localStorage.removeItem(US)}catch(e){}unmount();return null}return r.ok?r.json():null})
      .then(function(j){if(j&&j.user){try{localStorage.setItem(US,JSON.stringify(j.user))}catch(e){}mount({name:j.user.name,email:j.user.email,role:j.user.role,photo:j.user.photo||j.user.avatarUrl||null,isAdmin:!!j.user.isAdmin})}}).catch(function(){});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
