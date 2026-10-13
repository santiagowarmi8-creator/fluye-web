(function(){var k='fluye.web.theme',r=document.documentElement,s=localStorage.getItem(k);if(s)r.dataset.theme=s;
document.addEventListener('DOMContentLoaded',function(){var b=document.getElementById('tg');if(!b)return;
function dark(){return r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
function lbl(){b.textContent=dark()?'☀':'☾';b.setAttribute('aria-label',dark()?'Usar tema claro':'Usar tema oscuro')}lbl();
b.onclick=function(){r.dataset.theme=dark()?'light':'dark';localStorage.setItem(k,r.dataset.theme);lbl()}})})();
