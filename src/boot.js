(function(){
var L="";try{L=localStorage.getItem("mtm_lang")||"";}catch(e){}
try{var h=(location.hash||"").match(/lang=(th|en)/);if(h)L=h[1];}catch(e){}
if(L!=="th"&&L!=="en")L="th";
window.LANG=L;try{document.documentElement.lang=L;}catch(e){}
var D=null,R=null;
function fwd(){if(!D){try{D=JSON.parse(document.getElementById("i18n-dict").textContent);}catch(e){D={};}}return D;}
function rev(){if(!R){var d=fwd(),c={};R={};for(var k in d){var v=d[k];if(!v||v.trim().length<2||/^[a-z0-9_]+$/.test(v))continue;if(c[v]){delete R[v];continue;}c[v]=1;R[v]=k;}}return R;}
function tr(s,m,split){if(Object.prototype.hasOwnProperty.call(m,s))return m[s];
  if(split&&s.indexOf(" ")>0){var p=s.split(" ");for(var i=0;i<p.length;i++)if(!Object.prototype.hasOwnProperty.call(m,p[i]))return s;return p.map(function(x){return m[x];}).join(" ");}return s;}
function walk(o,m,split,depth){if(depth>12||!o||typeof o!=="object")return o;
  if(Array.isArray(o)){for(var i=0;i<o.length;i++){var v=o[i];o[i]=typeof v==="string"?tr(v,m,split):walk(v,m,split,depth+1);}return o;}
  var ks=Object.keys(o);for(var j=0;j<ks.length;j++){var k=ks[j],v=o[k],nv=typeof v==="string"?tr(v,m,split):walk(v,m,split,depth+1),nk=/[฀-๿]/.test(k)||split===false?tr(k,m,false):k;
    if(nk!==k&&!(nk in o)){delete o[k];o[nk]=nv;}else o[k]=nv;}return o;}
window.I18N_FIX=function(s){try{if(!s||typeof s!=="object")return s;var from=s._lang||"th";if(from===L)return s;
  if(L==="en")walk(s,fwd(),true,0);else walk(s,rev(),false,0);s._lang=L;}catch(e){}return s;};
var src=document.getElementById(L==="en"?"js-en":"js-th").textContent;
var el=document.createElement("script");el.text=src;document.body.appendChild(el);
if(!window.__MTM_RAN){try{(0,eval)(src);}catch(e){console.error(e);}}
})();
