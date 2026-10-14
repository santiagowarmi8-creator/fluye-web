(function(){var k='fluye.web.theme',r=document.documentElement,s=localStorage.getItem(k);if(s)r.dataset.theme=s;
document.addEventListener('DOMContentLoaded',function(){var b=document.getElementById('tg');if(!b)return;
function dark(){return r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
function lbl(){b.textContent=dark()?'☀':'☾';b.setAttribute('aria-label',dark()?'Usar tema claro':'Usar tema oscuro')}lbl();
b.onclick=function(){r.dataset.theme=dark()?'light':'dark';localStorage.setItem(k,r.dataset.theme);lbl()}})})();

(function(){var R=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.addEventListener('DOMContentLoaded',function(){
  var els=document.querySelectorAll('section .w > *, .grid > .card, .steps > .card, .price > .plan, .plans3 > .plan, details, .shot');
  if(!R&&'IntersectionObserver'in window){els.forEach(function(e,i){e.classList.add('rv');e.style.transitionDelay=((i%4)*70)+'ms'});
    var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});els.forEach(function(e){io.observe(e)});}
  if(!R){var ps=document.querySelectorAll('.hero .ph');var t=false;window.addEventListener('scroll',function(){if(t)return;t=true;requestAnimationFrame(function(){var y=Math.min(window.scrollY,700);ps.forEach(function(p,i){p.style.transform=(i?'rotate(3deg)':'rotate(-4deg)')+' translateY('+(y*(i?-.12:.08))+'px)'});t=false})},{passive:true});}
  var sh=document.querySelector('.shots'),dots=document.querySelectorAll('.cnav i');if(sh&&dots.length){sh.addEventListener('scroll',function(){var w=sh.scrollWidth-sh.clientWidth;var k=w?Math.round(sh.scrollLeft/w*(dots.length-1)):0;dots.forEach(function(d,i){d.classList.toggle('on',i===k)})},{passive:true});}
});})();
