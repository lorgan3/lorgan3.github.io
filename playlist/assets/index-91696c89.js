(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();function Is(e,t){const n=Object.create(null),s=e.split(",");for(let r=0;r<s.length;r++)n[s[r]]=!0;return t?r=>!!n[r.toLowerCase()]:r=>!!n[r]}const H={},ut=[],pe=()=>{},jo=()=>!1,Ho=/^on[^a-z]/,fn=e=>Ho.test(e),vs=e=>e.startsWith("onUpdate:"),q=Object.assign,Es=(e,t)=>{const n=e.indexOf(t);n>-1&&e.splice(n,1)},Uo=Object.prototype.hasOwnProperty,$=(e,t)=>Uo.call(e,t),S=Array.isArray,ft=e=>hn(e)==="[object Map]",ei=e=>hn(e)==="[object Set]",D=e=>typeof e=="function",K=e=>typeof e=="string",dn=e=>typeof e=="symbol",U=e=>e!==null&&typeof e=="object",ti=e=>(U(e)||D(e))&&D(e.then)&&D(e.catch),ni=Object.prototype.toString,hn=e=>ni.call(e),zo=e=>hn(e).slice(8,-1),si=e=>hn(e)==="[object Object]",Ts=e=>K(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,Yt=Is(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),pn=e=>{const t=Object.create(null);return n=>t[n]||(t[n]=e(n))},Vo=/-(\w)/g,pt=pn(e=>e.replace(Vo,(t,n)=>n?n.toUpperCase():"")),Ko=/\B([A-Z])/g,_t=pn(e=>e.replace(Ko,"-$1").toLowerCase()),ri=pn(e=>e.charAt(0).toUpperCase()+e.slice(1)),Mn=pn(e=>e?`on${ri(e)}`:""),Qe=(e,t)=>!Object.is(e,t),Jt=(e,t)=>{for(let n=0;n<e.length;n++)e[n](t)},en=(e,t,n)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,value:n})},Xn=e=>{const t=parseFloat(e);return isNaN(t)?e:t};let er;const Zn=()=>er||(er=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function As(e){if(S(e)){const t={};for(let n=0;n<e.length;n++){const s=e[n],r=K(s)?Jo(s):As(s);if(r)for(const i in r)t[i]=r[i]}return t}else if(K(e)||U(e))return e}const Wo=/;(?![^(]*\))/g,qo=/:([^]+)/,Yo=/\/\*[^]*?\*\//g;function Jo(e){const t={};return e.replace(Yo,"").split(Wo).forEach(n=>{if(n){const s=n.split(qo);s.length>1&&(t[s[0].trim()]=s[1].trim())}}),t}function Ae(e){let t="";if(K(e))t=e;else if(S(e))for(let n=0;n<e.length;n++){const s=Ae(e[n]);s&&(t+=s+" ")}else if(U(e))for(const n in e)e[n]&&(t+=n+" ");return t.trim()}const Go="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",Xo=Is(Go);function ii(e){return!!e||e===""}const Rn=e=>K(e)?e:e==null?"":S(e)||U(e)&&(e.toString===ni||!D(e.toString))?JSON.stringify(e,oi,2):String(e),oi=(e,t)=>t&&t.__v_isRef?oi(e,t.value):ft(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((n,[s,r])=>(n[`${s} =>`]=r,n),{})}:ei(t)?{[`Set(${t.size})`]:[...t.values()]}:U(t)&&!S(t)&&!si(t)?String(t):t;let ue;class Zo{constructor(t=!1){this.detached=t,this._active=!0,this.effects=[],this.cleanups=[],this.parent=ue,!t&&ue&&(this.index=(ue.scopes||(ue.scopes=[])).push(this)-1)}get active(){return this._active}run(t){if(this._active){const n=ue;try{return ue=this,t()}finally{ue=n}}}on(){ue=this}off(){ue=this.parent}stop(t){if(this._active){let n,s;for(n=0,s=this.effects.length;n<s;n++)this.effects[n].stop();for(n=0,s=this.cleanups.length;n<s;n++)this.cleanups[n]();if(this.scopes)for(n=0,s=this.scopes.length;n<s;n++)this.scopes[n].stop(!0);if(!this.detached&&this.parent&&!t){const r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index)}this.parent=void 0,this._active=!1}}}function Qo(e,t=ue){t&&t.active&&t.effects.push(e)}function ea(){return ue}const Cs=e=>{const t=new Set(e);return t.w=0,t.n=0,t},ai=e=>(e.w&Ne)>0,ci=e=>(e.n&Ne)>0,ta=({deps:e})=>{if(e.length)for(let t=0;t<e.length;t++)e[t].w|=Ne},na=e=>{const{deps:t}=e;if(t.length){let n=0;for(let s=0;s<t.length;s++){const r=t[s];ai(r)&&!ci(r)?r.delete(e):t[n++]=r,r.w&=~Ne,r.n&=~Ne}t.length=n}},Qn=new WeakMap;let Ct=0,Ne=1;const es=30;let fe;const Xe=Symbol(""),ts=Symbol("");class Ss{constructor(t,n=null,s){this.fn=t,this.scheduler=n,this.active=!0,this.deps=[],this.parent=void 0,Qo(this,s)}run(){if(!this.active)return this.fn();let t=fe,n=Pe;for(;t;){if(t===this)return;t=t.parent}try{return this.parent=fe,fe=this,Pe=!0,Ne=1<<++Ct,Ct<=es?ta(this):tr(this),this.fn()}finally{Ct<=es&&na(this),Ne=1<<--Ct,fe=this.parent,Pe=n,this.parent=void 0,this.deferStop&&this.stop()}}stop(){fe===this?this.deferStop=!0:this.active&&(tr(this),this.onStop&&this.onStop(),this.active=!1)}}function tr(e){const{deps:t}=e;if(t.length){for(let n=0;n<t.length;n++)t[n].delete(e);t.length=0}}let Pe=!0;const li=[];function yt(){li.push(Pe),Pe=!1}function wt(){const e=li.pop();Pe=e===void 0?!0:e}function re(e,t,n){if(Pe&&fe){let s=Qn.get(e);s||Qn.set(e,s=new Map);let r=s.get(n);r||s.set(n,r=Cs()),ui(r)}}function ui(e,t){let n=!1;Ct<=es?ci(e)||(e.n|=Ne,n=!ai(e)):n=!e.has(fe),n&&(e.add(fe),fe.deps.push(e))}function Ce(e,t,n,s,r,i){const o=Qn.get(e);if(!o)return;let a=[];if(t==="clear")a=[...o.values()];else if(n==="length"&&S(e)){const c=Number(s);o.forEach((u,d)=>{(d==="length"||!dn(d)&&d>=c)&&a.push(u)})}else switch(n!==void 0&&a.push(o.get(n)),t){case"add":S(e)?Ts(n)&&a.push(o.get("length")):(a.push(o.get(Xe)),ft(e)&&a.push(o.get(ts)));break;case"delete":S(e)||(a.push(o.get(Xe)),ft(e)&&a.push(o.get(ts)));break;case"set":ft(e)&&a.push(o.get(Xe));break}if(a.length===1)a[0]&&ns(a[0]);else{const c=[];for(const u of a)u&&c.push(...u);ns(Cs(c))}}function ns(e,t){const n=S(e)?e:[...e];for(const s of n)s.computed&&nr(s);for(const s of n)s.computed||nr(s)}function nr(e,t){(e!==fe||e.allowRecurse)&&(e.scheduler?e.scheduler():e.run())}const sa=Is("__proto__,__v_isRef,__isVue"),fi=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(dn)),sr=ra();function ra(){const e={};return["includes","indexOf","lastIndexOf"].forEach(t=>{e[t]=function(...n){const s=B(this);for(let i=0,o=this.length;i<o;i++)re(s,"get",i+"");const r=s[t](...n);return r===-1||r===!1?s[t](...n.map(B)):r}}),["push","pop","shift","unshift","splice"].forEach(t=>{e[t]=function(...n){yt();const s=B(this)[t].apply(this,n);return wt(),s}}),e}function ia(e){const t=B(this);return re(t,"has",e),t.hasOwnProperty(e)}class di{constructor(t=!1,n=!1){this._isReadonly=t,this._shallow=n}get(t,n,s){const r=this._isReadonly,i=this._shallow;if(n==="__v_isReactive")return!r;if(n==="__v_isReadonly")return r;if(n==="__v_isShallow")return i;if(n==="__v_raw"&&s===(r?i?_a:mi:i?gi:pi).get(t))return t;const o=S(t);if(!r){if(o&&$(sr,n))return Reflect.get(sr,n,s);if(n==="hasOwnProperty")return ia}const a=Reflect.get(t,n,s);return(dn(n)?fi.has(n):sa(n))||(r||re(t,"get",n),i)?a:Q(a)?o&&Ts(n)?a:a.value:U(a)?r?bi(a):Os(a):a}}class hi extends di{constructor(t=!1){super(!1,t)}set(t,n,s,r){let i=t[n];if(gt(i)&&Q(i)&&!Q(s))return!1;if(!this._shallow&&(!tn(s)&&!gt(s)&&(i=B(i),s=B(s)),!S(t)&&Q(i)&&!Q(s)))return i.value=s,!0;const o=S(t)&&Ts(n)?Number(n)<t.length:$(t,n),a=Reflect.set(t,n,s,r);return t===B(r)&&(o?Qe(s,i)&&Ce(t,"set",n,s):Ce(t,"add",n,s)),a}deleteProperty(t,n){const s=$(t,n);t[n];const r=Reflect.deleteProperty(t,n);return r&&s&&Ce(t,"delete",n,void 0),r}has(t,n){const s=Reflect.has(t,n);return(!dn(n)||!fi.has(n))&&re(t,"has",n),s}ownKeys(t){return re(t,"iterate",S(t)?"length":Xe),Reflect.ownKeys(t)}}class oa extends di{constructor(t=!1){super(!0,t)}set(t,n){return!0}deleteProperty(t,n){return!0}}const aa=new hi,ca=new oa,la=new hi(!0),xs=e=>e,gn=e=>Reflect.getPrototypeOf(e);function Ut(e,t,n=!1,s=!1){e=e.__v_raw;const r=B(e),i=B(t);n||(Qe(t,i)&&re(r,"get",t),re(r,"get",i));const{has:o}=gn(r),a=s?xs:n?Ms:Pt;if(o.call(r,t))return a(e.get(t));if(o.call(r,i))return a(e.get(i));e!==r&&e.get(t)}function zt(e,t=!1){const n=this.__v_raw,s=B(n),r=B(e);return t||(Qe(e,r)&&re(s,"has",e),re(s,"has",r)),e===r?n.has(e):n.has(e)||n.has(r)}function Vt(e,t=!1){return e=e.__v_raw,!t&&re(B(e),"iterate",Xe),Reflect.get(e,"size",e)}function rr(e){e=B(e);const t=B(this);return gn(t).has.call(t,e)||(t.add(e),Ce(t,"add",e,e)),this}function ir(e,t){t=B(t);const n=B(this),{has:s,get:r}=gn(n);let i=s.call(n,e);i||(e=B(e),i=s.call(n,e));const o=r.call(n,e);return n.set(e,t),i?Qe(t,o)&&Ce(n,"set",e,t):Ce(n,"add",e,t),this}function or(e){const t=B(this),{has:n,get:s}=gn(t);let r=n.call(t,e);r||(e=B(e),r=n.call(t,e)),s&&s.call(t,e);const i=t.delete(e);return r&&Ce(t,"delete",e,void 0),i}function ar(){const e=B(this),t=e.size!==0,n=e.clear();return t&&Ce(e,"clear",void 0,void 0),n}function Kt(e,t){return function(s,r){const i=this,o=i.__v_raw,a=B(o),c=t?xs:e?Ms:Pt;return!e&&re(a,"iterate",Xe),o.forEach((u,d)=>s.call(r,c(u),c(d),i))}}function Wt(e,t,n){return function(...s){const r=this.__v_raw,i=B(r),o=ft(i),a=e==="entries"||e===Symbol.iterator&&o,c=e==="keys"&&o,u=r[e](...s),d=n?xs:t?Ms:Pt;return!t&&re(i,"iterate",c?ts:Xe),{next(){const{value:p,done:w}=u.next();return w?{value:p,done:w}:{value:a?[d(p[0]),d(p[1])]:d(p),done:w}},[Symbol.iterator](){return this}}}}function De(e){return function(...t){return e==="delete"?!1:this}}function ua(){const e={get(i){return Ut(this,i)},get size(){return Vt(this)},has:zt,add:rr,set:ir,delete:or,clear:ar,forEach:Kt(!1,!1)},t={get(i){return Ut(this,i,!1,!0)},get size(){return Vt(this)},has:zt,add:rr,set:ir,delete:or,clear:ar,forEach:Kt(!1,!0)},n={get(i){return Ut(this,i,!0)},get size(){return Vt(this,!0)},has(i){return zt.call(this,i,!0)},add:De("add"),set:De("set"),delete:De("delete"),clear:De("clear"),forEach:Kt(!0,!1)},s={get(i){return Ut(this,i,!0,!0)},get size(){return Vt(this,!0)},has(i){return zt.call(this,i,!0)},add:De("add"),set:De("set"),delete:De("delete"),clear:De("clear"),forEach:Kt(!0,!0)};return["keys","values","entries",Symbol.iterator].forEach(i=>{e[i]=Wt(i,!1,!1),n[i]=Wt(i,!0,!1),t[i]=Wt(i,!1,!0),s[i]=Wt(i,!0,!0)}),[e,n,t,s]}const[fa,da,ha,pa]=ua();function Ds(e,t){const n=t?e?pa:ha:e?da:fa;return(s,r,i)=>r==="__v_isReactive"?!e:r==="__v_isReadonly"?e:r==="__v_raw"?s:Reflect.get($(n,r)&&r in s?n:s,r,i)}const ga={get:Ds(!1,!1)},ma={get:Ds(!1,!0)},ba={get:Ds(!0,!1)},pi=new WeakMap,gi=new WeakMap,mi=new WeakMap,_a=new WeakMap;function ya(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function wa(e){return e.__v_skip||!Object.isExtensible(e)?0:ya(zo(e))}function Os(e){return gt(e)?e:Ps(e,!1,aa,ga,pi)}function Ia(e){return Ps(e,!1,la,ma,gi)}function bi(e){return Ps(e,!0,ca,ba,mi)}function Ps(e,t,n,s,r){if(!U(e)||e.__v_raw&&!(t&&e.__v_isReactive))return e;const i=r.get(e);if(i)return i;const o=wa(e);if(o===0)return e;const a=new Proxy(e,o===2?s:n);return r.set(e,a),a}function dt(e){return gt(e)?dt(e.__v_raw):!!(e&&e.__v_isReactive)}function gt(e){return!!(e&&e.__v_isReadonly)}function tn(e){return!!(e&&e.__v_isShallow)}function _i(e){return dt(e)||gt(e)}function B(e){const t=e&&e.__v_raw;return t?B(t):e}function yi(e){return en(e,"__v_skip",!0),e}const Pt=e=>U(e)?Os(e):e,Ms=e=>U(e)?bi(e):e;function wi(e){Pe&&fe&&(e=B(e),ui(e.dep||(e.dep=Cs())))}function Ii(e,t){e=B(e);const n=e.dep;n&&ns(n)}function Q(e){return!!(e&&e.__v_isRef===!0)}function Ye(e){return va(e,!1)}function va(e,t){return Q(e)?e:new Ea(e,t)}class Ea{constructor(t,n){this.__v_isShallow=n,this.dep=void 0,this.__v_isRef=!0,this._rawValue=n?t:B(t),this._value=n?t:Pt(t)}get value(){return wi(this),this._value}set value(t){const n=this.__v_isShallow||tn(t)||gt(t);t=n?t:B(t),Qe(t,this._rawValue)&&(this._rawValue=t,this._value=n?t:Pt(t),Ii(this))}}function vi(e){return Q(e)?e.value:e}const Ta={get:(e,t,n)=>vi(Reflect.get(e,t,n)),set:(e,t,n,s)=>{const r=e[t];return Q(r)&&!Q(n)?(r.value=n,!0):Reflect.set(e,t,n,s)}};function Ei(e){return dt(e)?e:new Proxy(e,Ta)}class Aa{constructor(t,n,s,r){this._setter=n,this.dep=void 0,this.__v_isRef=!0,this.__v_isReadonly=!1,this._dirty=!0,this.effect=new Ss(t,()=>{this._dirty||(this._dirty=!0,Ii(this))}),this.effect.computed=this,this.effect.active=this._cacheable=!r,this.__v_isReadonly=s}get value(){const t=B(this);return wi(t),(t._dirty||!t._cacheable)&&(t._dirty=!1,t._value=t.effect.run()),t._value}set value(t){this._setter(t)}}function Ca(e,t,n=!1){let s,r;const i=D(e);return i?(s=e,r=pe):(s=e.get,r=e.set),new Aa(s,r,i||!r,n)}function Me(e,t,n,s){let r;try{r=s?e(...s):e()}catch(i){mn(i,t,n)}return r}function ge(e,t,n,s){if(D(e)){const i=Me(e,t,n,s);return i&&ti(i)&&i.catch(o=>{mn(o,t,n)}),i}const r=[];for(let i=0;i<e.length;i++)r.push(ge(e[i],t,n,s));return r}function mn(e,t,n,s=!0){const r=t?t.vnode:null;if(t){let i=t.parent;const o=t.proxy,a=n;for(;i;){const u=i.ec;if(u){for(let d=0;d<u.length;d++)if(u[d](e,o,a)===!1)return}i=i.parent}const c=t.appContext.config.errorHandler;if(c){Me(c,null,10,[e,o,a]);return}}Sa(e,n,r,s)}function Sa(e,t,n,s=!0){console.error(e)}let Mt=!1,ss=!1;const X=[];let we=0;const ht=[];let Te=null,We=0;const Ti=Promise.resolve();let Rs=null;function xa(e){const t=Rs||Ti;return e?t.then(this?e.bind(this):e):t}function Da(e){let t=we+1,n=X.length;for(;t<n;){const s=t+n>>>1,r=X[s],i=Rt(r);i<e||i===e&&r.pre?t=s+1:n=s}return t}function $s(e){(!X.length||!X.includes(e,Mt&&e.allowRecurse?we+1:we))&&(e.id==null?X.push(e):X.splice(Da(e.id),0,e),Ai())}function Ai(){!Mt&&!ss&&(ss=!0,Rs=Ti.then(Si))}function Oa(e){const t=X.indexOf(e);t>we&&X.splice(t,1)}function Pa(e){S(e)?ht.push(...e):(!Te||!Te.includes(e,e.allowRecurse?We+1:We))&&ht.push(e),Ai()}function cr(e,t=Mt?we+1:0){for(;t<X.length;t++){const n=X[t];n&&n.pre&&(X.splice(t,1),t--,n())}}function Ci(e){if(ht.length){const t=[...new Set(ht)];if(ht.length=0,Te){Te.push(...t);return}for(Te=t,Te.sort((n,s)=>Rt(n)-Rt(s)),We=0;We<Te.length;We++)Te[We]();Te=null,We=0}}const Rt=e=>e.id==null?1/0:e.id,Ma=(e,t)=>{const n=Rt(e)-Rt(t);if(n===0){if(e.pre&&!t.pre)return-1;if(t.pre&&!e.pre)return 1}return n};function Si(e){ss=!1,Mt=!0,X.sort(Ma);const t=pe;try{for(we=0;we<X.length;we++){const n=X[we];n&&n.active!==!1&&Me(n,null,14)}}finally{we=0,X.length=0,Ci(),Mt=!1,Rs=null,(X.length||ht.length)&&Si()}}function Ra(e,t,...n){if(e.isUnmounted)return;const s=e.vnode.props||H;let r=n;const i=t.startsWith("update:"),o=i&&t.slice(7);if(o&&o in s){const d=`${o==="modelValue"?"model":o}Modifiers`,{number:p,trim:w}=s[d]||H;w&&(r=n.map(T=>K(T)?T.trim():T)),p&&(r=n.map(Xn))}let a,c=s[a=Mn(t)]||s[a=Mn(pt(t))];!c&&i&&(c=s[a=Mn(_t(t))]),c&&ge(c,e,6,r);const u=s[a+"Once"];if(u){if(!e.emitted)e.emitted={};else if(e.emitted[a])return;e.emitted[a]=!0,ge(u,e,6,r)}}function xi(e,t,n=!1){const s=t.emitsCache,r=s.get(e);if(r!==void 0)return r;const i=e.emits;let o={},a=!1;if(!D(e)){const c=u=>{const d=xi(u,t,!0);d&&(a=!0,q(o,d))};!n&&t.mixins.length&&t.mixins.forEach(c),e.extends&&c(e.extends),e.mixins&&e.mixins.forEach(c)}return!i&&!a?(U(e)&&s.set(e,null),null):(S(i)?i.forEach(c=>o[c]=null):q(o,i),U(e)&&s.set(e,o),o)}function bn(e,t){return!e||!fn(t)?!1:(t=t.slice(2).replace(/Once$/,""),$(e,t[0].toLowerCase()+t.slice(1))||$(e,_t(t))||$(e,t))}let de=null,_n=null;function nn(e){const t=de;return de=e,_n=e&&e.type.__scopeId||null,t}function Di(e){_n=e}function Oi(){_n=null}function $a(e,t=de,n){if(!t||e._n)return e;const s=(...r)=>{s._d&&_r(-1);const i=nn(t);let o;try{o=e(...r)}finally{nn(i),s._d&&_r(1)}return o};return s._n=!0,s._c=!0,s._d=!0,s}function $n(e){const{type:t,vnode:n,proxy:s,withProxy:r,props:i,propsOptions:[o],slots:a,attrs:c,emit:u,render:d,renderCache:p,data:w,setupState:T,ctx:N,inheritAttrs:R}=e;let W,Y;const J=nn(e);try{if(n.shapeFlag&4){const O=r||s;W=ye(d.call(O,O,p,i,T,w,N)),Y=c}else{const O=t;W=ye(O.length>1?O(i,{attrs:c,slots:a,emit:u}):O(i,null)),Y=t.props?c:Ba(c)}}catch(O){Dt.length=0,mn(O,e,1),W=ve(et)}let G=W;if(Y&&R!==!1){const O=Object.keys(Y),{shapeFlag:xe}=G;O.length&&xe&7&&(o&&O.some(vs)&&(Y=Fa(Y,o)),G=mt(G,Y))}return n.dirs&&(G=mt(G),G.dirs=G.dirs?G.dirs.concat(n.dirs):n.dirs),n.transition&&(G.transition=n.transition),W=G,nn(J),W}const Ba=e=>{let t;for(const n in e)(n==="class"||n==="style"||fn(n))&&((t||(t={}))[n]=e[n]);return t},Fa=(e,t)=>{const n={};for(const s in e)(!vs(s)||!(s.slice(9)in t))&&(n[s]=e[s]);return n};function Na(e,t,n){const{props:s,children:r,component:i}=e,{props:o,children:a,patchFlag:c}=t,u=i.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&c>=0){if(c&1024)return!0;if(c&16)return s?lr(s,o,u):!!o;if(c&8){const d=t.dynamicProps;for(let p=0;p<d.length;p++){const w=d[p];if(o[w]!==s[w]&&!bn(u,w))return!0}}}else return(r||a)&&(!a||!a.$stable)?!0:s===o?!1:s?o?lr(s,o,u):!0:!!o;return!1}function lr(e,t,n){const s=Object.keys(t);if(s.length!==Object.keys(e).length)return!0;for(let r=0;r<s.length;r++){const i=s[r];if(t[i]!==e[i]&&!bn(n,i))return!0}return!1}function La({vnode:e,parent:t},n){for(;t&&t.subTree===e;)(e=t.vnode).el=n,t=t.parent}const ka=Symbol.for("v-ndc"),ja=e=>e.__isSuspense;function Ha(e,t){t&&t.pendingBranch?S(e)?t.effects.push(...e):t.effects.push(e):Pa(e)}const qt={};function Bn(e,t,n){return Pi(e,t,n)}function Pi(e,t,{immediate:n,deep:s,flush:r,onTrack:i,onTrigger:o}=H){var a;const c=ea()===((a=Z)==null?void 0:a.scope)?Z:null;let u,d=!1,p=!1;if(Q(e)?(u=()=>e.value,d=tn(e)):dt(e)?(u=()=>e,s=!0):S(e)?(p=!0,d=e.some(O=>dt(O)||tn(O)),u=()=>e.map(O=>{if(Q(O))return O.value;if(dt(O))return Je(O);if(D(O))return Me(O,c,2)})):D(e)?t?u=()=>Me(e,c,2):u=()=>{if(!(c&&c.isUnmounted))return w&&w(),ge(e,c,3,[T])}:u=pe,t&&s){const O=u;u=()=>Je(O())}let w,T=O=>{w=J.onStop=()=>{Me(O,c,4)}},N;if(Bt)if(T=pe,t?n&&ge(t,c,3,[u(),p?[]:void 0,T]):u(),r==="sync"){const O=Fc();N=O.__watcherHandles||(O.__watcherHandles=[])}else return pe;let R=p?new Array(e.length).fill(qt):qt;const W=()=>{if(J.active)if(t){const O=J.run();(s||d||(p?O.some((xe,It)=>Qe(xe,R[It])):Qe(O,R)))&&(w&&w(),ge(t,c,3,[O,R===qt?void 0:p&&R[0]===qt?[]:R,T]),R=O)}else J.run()};W.allowRecurse=!!t;let Y;r==="sync"?Y=W:r==="post"?Y=()=>ne(W,c&&c.suspense):(W.pre=!0,c&&(W.id=c.uid),Y=()=>$s(W));const J=new Ss(u,Y);t?n?W():R=J.run():r==="post"?ne(J.run.bind(J),c&&c.suspense):J.run();const G=()=>{J.stop(),c&&c.scope&&Es(c.scope.effects,J)};return N&&N.push(G),G}function Ua(e,t,n){const s=this.proxy,r=K(e)?e.includes(".")?Mi(s,e):()=>s[e]:e.bind(s,s);let i;D(t)?i=t:(i=t.handler,n=t);const o=Z;bt(this);const a=Pi(r,i.bind(s),n);return o?bt(o):Ze(),a}function Mi(e,t){const n=t.split(".");return()=>{let s=e;for(let r=0;r<n.length&&s;r++)s=s[n[r]];return s}}function Je(e,t){if(!U(e)||e.__v_skip||(t=t||new Set,t.has(e)))return e;if(t.add(e),Q(e))Je(e.value,t);else if(S(e))for(let n=0;n<e.length;n++)Je(e[n],t);else if(ei(e)||ft(e))e.forEach(n=>{Je(n,t)});else if(si(e))for(const n in e)Je(e[n],t);return e}function za(e,t){const n=de;if(n===null)return e;const s=En(n)||n.proxy,r=e.dirs||(e.dirs=[]);for(let i=0;i<t.length;i++){let[o,a,c,u=H]=t[i];o&&(D(o)&&(o={mounted:o,updated:o}),o.deep&&Je(a),r.push({dir:o,instance:s,value:a,oldValue:void 0,arg:c,modifiers:u}))}return e}function ze(e,t,n,s){const r=e.dirs,i=t&&t.dirs;for(let o=0;o<r.length;o++){const a=r[o];i&&(a.oldValue=i[o].value);let c=a.dir[s];c&&(yt(),ge(c,n,8,[e.el,a,e,t]),wt())}}/*! #__NO_SIDE_EFFECTS__ */function yn(e,t){return D(e)?(()=>q({name:e.name},t,{setup:e}))():e}const Gt=e=>!!e.type.__asyncLoader,Ri=e=>e.type.__isKeepAlive;function Va(e,t){$i(e,"a",t)}function Ka(e,t){$i(e,"da",t)}function $i(e,t,n=Z){const s=e.__wdc||(e.__wdc=()=>{let r=n;for(;r;){if(r.isDeactivated)return;r=r.parent}return e()});if(wn(t,s,n),n){let r=n.parent;for(;r&&r.parent;)Ri(r.parent.vnode)&&Wa(s,t,n,r),r=r.parent}}function Wa(e,t,n,s){const r=wn(t,e,s,!0);Bs(()=>{Es(s[t],r)},n)}function wn(e,t,n=Z,s=!1){if(n){const r=n[e]||(n[e]=[]),i=t.__weh||(t.__weh=(...o)=>{if(n.isUnmounted)return;yt(),bt(n);const a=ge(t,n,e,o);return Ze(),wt(),a});return s?r.unshift(i):r.push(i),i}}const Se=e=>(t,n=Z)=>(!Bt||e==="sp")&&wn(e,(...s)=>t(...s),n),qa=Se("bm"),Bi=Se("m"),Ya=Se("bu"),Ja=Se("u"),Ga=Se("bum"),Bs=Se("um"),Xa=Se("sp"),Za=Se("rtg"),Qa=Se("rtc");function ec(e,t=Z){wn("ec",e,t)}function tc(e,t,n,s){let r;const i=n&&n[s];if(S(e)||K(e)){r=new Array(e.length);for(let o=0,a=e.length;o<a;o++)r[o]=t(e[o],o,void 0,i&&i[o])}else if(typeof e=="number"){r=new Array(e);for(let o=0;o<e;o++)r[o]=t(o+1,o,void 0,i&&i[o])}else if(U(e))if(e[Symbol.iterator])r=Array.from(e,(o,a)=>t(o,a,void 0,i&&i[a]));else{const o=Object.keys(e);r=new Array(o.length);for(let a=0,c=o.length;a<c;a++){const u=o[a];r[a]=t(e[u],u,a,i&&i[a])}}else r=[];return n&&(n[s]=r),r}const rs=e=>e?Wi(e)?En(e)||e.proxy:rs(e.parent):null,xt=q(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>rs(e.parent),$root:e=>rs(e.root),$emit:e=>e.emit,$options:e=>Fs(e),$forceUpdate:e=>e.f||(e.f=()=>$s(e.update)),$nextTick:e=>e.n||(e.n=xa.bind(e.proxy)),$watch:e=>Ua.bind(e)}),Fn=(e,t)=>e!==H&&!e.__isScriptSetup&&$(e,t),nc={get({_:e},t){const{ctx:n,setupState:s,data:r,props:i,accessCache:o,type:a,appContext:c}=e;let u;if(t[0]!=="$"){const T=o[t];if(T!==void 0)switch(T){case 1:return s[t];case 2:return r[t];case 4:return n[t];case 3:return i[t]}else{if(Fn(s,t))return o[t]=1,s[t];if(r!==H&&$(r,t))return o[t]=2,r[t];if((u=e.propsOptions[0])&&$(u,t))return o[t]=3,i[t];if(n!==H&&$(n,t))return o[t]=4,n[t];is&&(o[t]=0)}}const d=xt[t];let p,w;if(d)return t==="$attrs"&&re(e,"get",t),d(e);if((p=a.__cssModules)&&(p=p[t]))return p;if(n!==H&&$(n,t))return o[t]=4,n[t];if(w=c.config.globalProperties,$(w,t))return w[t]},set({_:e},t,n){const{data:s,setupState:r,ctx:i}=e;return Fn(r,t)?(r[t]=n,!0):s!==H&&$(s,t)?(s[t]=n,!0):$(e.props,t)||t[0]==="$"&&t.slice(1)in e?!1:(i[t]=n,!0)},has({_:{data:e,setupState:t,accessCache:n,ctx:s,appContext:r,propsOptions:i}},o){let a;return!!n[o]||e!==H&&$(e,o)||Fn(t,o)||(a=i[0])&&$(a,o)||$(s,o)||$(xt,o)||$(r.config.globalProperties,o)},defineProperty(e,t,n){return n.get!=null?e._.accessCache[t]=0:$(n,"value")&&this.set(e,t,n.value,null),Reflect.defineProperty(e,t,n)}};function ur(e){return S(e)?e.reduce((t,n)=>(t[n]=null,t),{}):e}let is=!0;function sc(e){const t=Fs(e),n=e.proxy,s=e.ctx;is=!1,t.beforeCreate&&fr(t.beforeCreate,e,"bc");const{data:r,computed:i,methods:o,watch:a,provide:c,inject:u,created:d,beforeMount:p,mounted:w,beforeUpdate:T,updated:N,activated:R,deactivated:W,beforeDestroy:Y,beforeUnmount:J,destroyed:G,unmounted:O,render:xe,renderTracked:It,renderTriggered:Nt,errorCaptured:ke,serverPrefetch:xn,expose:je,inheritAttrs:vt,components:Lt,directives:kt,filters:Dn}=t;if(u&&rc(u,s,null),o)for(const z in o){const L=o[z];D(L)&&(s[z]=L.bind(n))}if(r){const z=r.call(n,n);U(z)&&(e.data=Os(z))}if(is=!0,i)for(const z in i){const L=i[z],He=D(L)?L.bind(n,n):D(L.get)?L.get.bind(n,n):pe,jt=!D(L)&&D(L.set)?L.set.bind(n):pe,Ue=$c({get:He,set:jt});Object.defineProperty(s,z,{enumerable:!0,configurable:!0,get:()=>Ue.value,set:me=>Ue.value=me})}if(a)for(const z in a)Fi(a[z],s,n,z);if(c){const z=D(c)?c.call(n):c;Reflect.ownKeys(z).forEach(L=>{uc(L,z[L])})}d&&fr(d,e,"c");function ee(z,L){S(L)?L.forEach(He=>z(He.bind(n))):L&&z(L.bind(n))}if(ee(qa,p),ee(Bi,w),ee(Ya,T),ee(Ja,N),ee(Va,R),ee(Ka,W),ee(ec,ke),ee(Qa,It),ee(Za,Nt),ee(Ga,J),ee(Bs,O),ee(Xa,xn),S(je))if(je.length){const z=e.exposed||(e.exposed={});je.forEach(L=>{Object.defineProperty(z,L,{get:()=>n[L],set:He=>n[L]=He})})}else e.exposed||(e.exposed={});xe&&e.render===pe&&(e.render=xe),vt!=null&&(e.inheritAttrs=vt),Lt&&(e.components=Lt),kt&&(e.directives=kt)}function rc(e,t,n=pe){S(e)&&(e=os(e));for(const s in e){const r=e[s];let i;U(r)?"default"in r?i=Xt(r.from||s,r.default,!0):i=Xt(r.from||s):i=Xt(r),Q(i)?Object.defineProperty(t,s,{enumerable:!0,configurable:!0,get:()=>i.value,set:o=>i.value=o}):t[s]=i}}function fr(e,t,n){ge(S(e)?e.map(s=>s.bind(t.proxy)):e.bind(t.proxy),t,n)}function Fi(e,t,n,s){const r=s.includes(".")?Mi(n,s):()=>n[s];if(K(e)){const i=t[e];D(i)&&Bn(r,i)}else if(D(e))Bn(r,e.bind(n));else if(U(e))if(S(e))e.forEach(i=>Fi(i,t,n,s));else{const i=D(e.handler)?e.handler.bind(n):t[e.handler];D(i)&&Bn(r,i,e)}}function Fs(e){const t=e.type,{mixins:n,extends:s}=t,{mixins:r,optionsCache:i,config:{optionMergeStrategies:o}}=e.appContext,a=i.get(t);let c;return a?c=a:!r.length&&!n&&!s?c=t:(c={},r.length&&r.forEach(u=>sn(c,u,o,!0)),sn(c,t,o)),U(t)&&i.set(t,c),c}function sn(e,t,n,s=!1){const{mixins:r,extends:i}=t;i&&sn(e,i,n,!0),r&&r.forEach(o=>sn(e,o,n,!0));for(const o in t)if(!(s&&o==="expose")){const a=ic[o]||n&&n[o];e[o]=a?a(e[o],t[o]):t[o]}return e}const ic={data:dr,props:hr,emits:hr,methods:St,computed:St,beforeCreate:te,created:te,beforeMount:te,mounted:te,beforeUpdate:te,updated:te,beforeDestroy:te,beforeUnmount:te,destroyed:te,unmounted:te,activated:te,deactivated:te,errorCaptured:te,serverPrefetch:te,components:St,directives:St,watch:ac,provide:dr,inject:oc};function dr(e,t){return t?e?function(){return q(D(e)?e.call(this,this):e,D(t)?t.call(this,this):t)}:t:e}function oc(e,t){return St(os(e),os(t))}function os(e){if(S(e)){const t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function te(e,t){return e?[...new Set([].concat(e,t))]:t}function St(e,t){return e?q(Object.create(null),e,t):t}function hr(e,t){return e?S(e)&&S(t)?[...new Set([...e,...t])]:q(Object.create(null),ur(e),ur(t??{})):t}function ac(e,t){if(!e)return t;if(!t)return e;const n=q(Object.create(null),e);for(const s in t)n[s]=te(e[s],t[s]);return n}function Ni(){return{app:null,config:{isNativeTag:jo,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let cc=0;function lc(e,t){return function(s,r=null){D(s)||(s=q({},s)),r!=null&&!U(r)&&(r=null);const i=Ni(),o=new WeakSet;let a=!1;const c=i.app={_uid:cc++,_component:s,_props:r,_container:null,_context:i,_instance:null,version:Nc,get config(){return i.config},set config(u){},use(u,...d){return o.has(u)||(u&&D(u.install)?(o.add(u),u.install(c,...d)):D(u)&&(o.add(u),u(c,...d))),c},mixin(u){return i.mixins.includes(u)||i.mixins.push(u),c},component(u,d){return d?(i.components[u]=d,c):i.components[u]},directive(u,d){return d?(i.directives[u]=d,c):i.directives[u]},mount(u,d,p){if(!a){const w=ve(s,r);return w.appContext=i,d&&t?t(w,u):e(w,u,p),a=!0,c._container=u,u.__vue_app__=c,En(w.component)||w.component.proxy}},unmount(){a&&(e(null,c._container),delete c._container.__vue_app__)},provide(u,d){return i.provides[u]=d,c},runWithContext(u){rn=c;try{return u()}finally{rn=null}}};return c}}let rn=null;function uc(e,t){if(Z){let n=Z.provides;const s=Z.parent&&Z.parent.provides;s===n&&(n=Z.provides=Object.create(s)),n[e]=t}}function Xt(e,t,n=!1){const s=Z||de;if(s||rn){const r=s?s.parent==null?s.vnode.appContext&&s.vnode.appContext.provides:s.parent.provides:rn._context.provides;if(r&&e in r)return r[e];if(arguments.length>1)return n&&D(t)?t.call(s&&s.proxy):t}}function fc(e,t,n,s=!1){const r={},i={};en(i,vn,1),e.propsDefaults=Object.create(null),Li(e,t,r,i);for(const o in e.propsOptions[0])o in r||(r[o]=void 0);n?e.props=s?r:Ia(r):e.type.props?e.props=r:e.props=i,e.attrs=i}function dc(e,t,n,s){const{props:r,attrs:i,vnode:{patchFlag:o}}=e,a=B(r),[c]=e.propsOptions;let u=!1;if((s||o>0)&&!(o&16)){if(o&8){const d=e.vnode.dynamicProps;for(let p=0;p<d.length;p++){let w=d[p];if(bn(e.emitsOptions,w))continue;const T=t[w];if(c)if($(i,w))T!==i[w]&&(i[w]=T,u=!0);else{const N=pt(w);r[N]=as(c,a,N,T,e,!1)}else T!==i[w]&&(i[w]=T,u=!0)}}}else{Li(e,t,r,i)&&(u=!0);let d;for(const p in a)(!t||!$(t,p)&&((d=_t(p))===p||!$(t,d)))&&(c?n&&(n[p]!==void 0||n[d]!==void 0)&&(r[p]=as(c,a,p,void 0,e,!0)):delete r[p]);if(i!==a)for(const p in i)(!t||!$(t,p))&&(delete i[p],u=!0)}u&&Ce(e,"set","$attrs")}function Li(e,t,n,s){const[r,i]=e.propsOptions;let o=!1,a;if(t)for(let c in t){if(Yt(c))continue;const u=t[c];let d;r&&$(r,d=pt(c))?!i||!i.includes(d)?n[d]=u:(a||(a={}))[d]=u:bn(e.emitsOptions,c)||(!(c in s)||u!==s[c])&&(s[c]=u,o=!0)}if(i){const c=B(n),u=a||H;for(let d=0;d<i.length;d++){const p=i[d];n[p]=as(r,c,p,u[p],e,!$(u,p))}}return o}function as(e,t,n,s,r,i){const o=e[n];if(o!=null){const a=$(o,"default");if(a&&s===void 0){const c=o.default;if(o.type!==Function&&!o.skipFactory&&D(c)){const{propsDefaults:u}=r;n in u?s=u[n]:(bt(r),s=u[n]=c.call(null,t),Ze())}else s=c}o[0]&&(i&&!a?s=!1:o[1]&&(s===""||s===_t(n))&&(s=!0))}return s}function ki(e,t,n=!1){const s=t.propsCache,r=s.get(e);if(r)return r;const i=e.props,o={},a=[];let c=!1;if(!D(e)){const d=p=>{c=!0;const[w,T]=ki(p,t,!0);q(o,w),T&&a.push(...T)};!n&&t.mixins.length&&t.mixins.forEach(d),e.extends&&d(e.extends),e.mixins&&e.mixins.forEach(d)}if(!i&&!c)return U(e)&&s.set(e,ut),ut;if(S(i))for(let d=0;d<i.length;d++){const p=pt(i[d]);pr(p)&&(o[p]=H)}else if(i)for(const d in i){const p=pt(d);if(pr(p)){const w=i[d],T=o[p]=S(w)||D(w)?{type:w}:q({},w);if(T){const N=br(Boolean,T.type),R=br(String,T.type);T[0]=N>-1,T[1]=R<0||N<R,(N>-1||$(T,"default"))&&a.push(p)}}}const u=[o,a];return U(e)&&s.set(e,u),u}function pr(e){return e[0]!=="$"}function gr(e){const t=e&&e.toString().match(/^\s*(function|class) (\w+)/);return t?t[2]:e===null?"null":""}function mr(e,t){return gr(e)===gr(t)}function br(e,t){return S(t)?t.findIndex(n=>mr(n,e)):D(t)&&mr(t,e)?0:-1}const ji=e=>e[0]==="_"||e==="$stable",Ns=e=>S(e)?e.map(ye):[ye(e)],hc=(e,t,n)=>{if(t._n)return t;const s=$a((...r)=>Ns(t(...r)),n);return s._c=!1,s},Hi=(e,t,n)=>{const s=e._ctx;for(const r in e){if(ji(r))continue;const i=e[r];if(D(i))t[r]=hc(r,i,s);else if(i!=null){const o=Ns(i);t[r]=()=>o}}},Ui=(e,t)=>{const n=Ns(t);e.slots.default=()=>n},pc=(e,t)=>{if(e.vnode.shapeFlag&32){const n=t._;n?(e.slots=B(t),en(t,"_",n)):Hi(t,e.slots={})}else e.slots={},t&&Ui(e,t);en(e.slots,vn,1)},gc=(e,t,n)=>{const{vnode:s,slots:r}=e;let i=!0,o=H;if(s.shapeFlag&32){const a=t._;a?n&&a===1?i=!1:(q(r,t),!n&&a===1&&delete r._):(i=!t.$stable,Hi(t,r)),o=t}else t&&(Ui(e,t),o={default:1});if(i)for(const a in r)!ji(a)&&o[a]==null&&delete r[a]};function cs(e,t,n,s,r=!1){if(S(e)){e.forEach((w,T)=>cs(w,t&&(S(t)?t[T]:t),n,s,r));return}if(Gt(s)&&!r)return;const i=s.shapeFlag&4?En(s.component)||s.component.proxy:s.el,o=r?null:i,{i:a,r:c}=e,u=t&&t.r,d=a.refs===H?a.refs={}:a.refs,p=a.setupState;if(u!=null&&u!==c&&(K(u)?(d[u]=null,$(p,u)&&(p[u]=null)):Q(u)&&(u.value=null)),D(c))Me(c,a,12,[o,d]);else{const w=K(c),T=Q(c);if(w||T){const N=()=>{if(e.f){const R=w?$(p,c)?p[c]:d[c]:c.value;r?S(R)&&Es(R,i):S(R)?R.includes(i)||R.push(i):w?(d[c]=[i],$(p,c)&&(p[c]=d[c])):(c.value=[i],e.k&&(d[e.k]=c.value))}else w?(d[c]=o,$(p,c)&&(p[c]=o)):T&&(c.value=o,e.k&&(d[e.k]=o))};o?(N.id=-1,ne(N,n)):N()}}}const ne=Ha;function mc(e){return bc(e)}function bc(e,t){const n=Zn();n.__VUE__=!0;const{insert:s,remove:r,patchProp:i,createElement:o,createText:a,createComment:c,setText:u,setElementText:d,parentNode:p,nextSibling:w,setScopeId:T=pe,insertStaticContent:N}=e,R=(l,f,h,g=null,m=null,y=null,v=!1,_=null,I=!!f.dynamicChildren)=>{if(l===f)return;l&&!Tt(l,f)&&(g=Ht(l),me(l,m,y,!0),l=null),f.patchFlag===-2&&(I=!1,f.dynamicChildren=null);const{type:b,ref:A,shapeFlag:E}=f;switch(b){case In:W(l,f,h,g);break;case et:Y(l,f,h,g);break;case Nn:l==null&&J(f,h,g,v);break;case ce:Lt(l,f,h,g,m,y,v,_,I);break;default:E&1?xe(l,f,h,g,m,y,v,_,I):E&6?kt(l,f,h,g,m,y,v,_,I):(E&64||E&128)&&b.process(l,f,h,g,m,y,v,_,I,ot)}A!=null&&m&&cs(A,l&&l.ref,y,f||l,!f)},W=(l,f,h,g)=>{if(l==null)s(f.el=a(f.children),h,g);else{const m=f.el=l.el;f.children!==l.children&&u(m,f.children)}},Y=(l,f,h,g)=>{l==null?s(f.el=c(f.children||""),h,g):f.el=l.el},J=(l,f,h,g)=>{[l.el,l.anchor]=N(l.children,f,h,g,l.el,l.anchor)},G=({el:l,anchor:f},h,g)=>{let m;for(;l&&l!==f;)m=w(l),s(l,h,g),l=m;s(f,h,g)},O=({el:l,anchor:f})=>{let h;for(;l&&l!==f;)h=w(l),r(l),l=h;r(f)},xe=(l,f,h,g,m,y,v,_,I)=>{v=v||f.type==="svg",l==null?It(f,h,g,m,y,v,_,I):xn(l,f,m,y,v,_,I)},It=(l,f,h,g,m,y,v,_)=>{let I,b;const{type:A,props:E,shapeFlag:C,transition:x,dirs:M}=l;if(I=l.el=o(l.type,y,E&&E.is,E),C&8?d(I,l.children):C&16&&ke(l.children,I,null,g,m,y&&A!=="foreignObject",v,_),M&&ze(l,null,g,"created"),Nt(I,l,l.scopeId,v,g),E){for(const F in E)F!=="value"&&!Yt(F)&&i(I,F,null,E[F],y,l.children,g,m,Ee);"value"in E&&i(I,"value",null,E.value),(b=E.onVnodeBeforeMount)&&_e(b,g,l)}M&&ze(l,null,g,"beforeMount");const k=_c(m,x);k&&x.beforeEnter(I),s(I,f,h),((b=E&&E.onVnodeMounted)||k||M)&&ne(()=>{b&&_e(b,g,l),k&&x.enter(I),M&&ze(l,null,g,"mounted")},m)},Nt=(l,f,h,g,m)=>{if(h&&T(l,h),g)for(let y=0;y<g.length;y++)T(l,g[y]);if(m){let y=m.subTree;if(f===y){const v=m.vnode;Nt(l,v,v.scopeId,v.slotScopeIds,m.parent)}}},ke=(l,f,h,g,m,y,v,_,I=0)=>{for(let b=I;b<l.length;b++){const A=l[b]=_?Oe(l[b]):ye(l[b]);R(null,A,f,h,g,m,y,v,_)}},xn=(l,f,h,g,m,y,v)=>{const _=f.el=l.el;let{patchFlag:I,dynamicChildren:b,dirs:A}=f;I|=l.patchFlag&16;const E=l.props||H,C=f.props||H;let x;h&&Ve(h,!1),(x=C.onVnodeBeforeUpdate)&&_e(x,h,f,l),A&&ze(f,l,h,"beforeUpdate"),h&&Ve(h,!0);const M=m&&f.type!=="foreignObject";if(b?je(l.dynamicChildren,b,_,h,g,M,y):v||L(l,f,_,null,h,g,M,y,!1),I>0){if(I&16)vt(_,f,E,C,h,g,m);else if(I&2&&E.class!==C.class&&i(_,"class",null,C.class,m),I&4&&i(_,"style",E.style,C.style,m),I&8){const k=f.dynamicProps;for(let F=0;F<k.length;F++){const V=k[F],le=E[V],at=C[V];(at!==le||V==="value")&&i(_,V,le,at,m,l.children,h,g,Ee)}}I&1&&l.children!==f.children&&d(_,f.children)}else!v&&b==null&&vt(_,f,E,C,h,g,m);((x=C.onVnodeUpdated)||A)&&ne(()=>{x&&_e(x,h,f,l),A&&ze(f,l,h,"updated")},g)},je=(l,f,h,g,m,y,v)=>{for(let _=0;_<f.length;_++){const I=l[_],b=f[_],A=I.el&&(I.type===ce||!Tt(I,b)||I.shapeFlag&70)?p(I.el):h;R(I,b,A,null,g,m,y,v,!0)}},vt=(l,f,h,g,m,y,v)=>{if(h!==g){if(h!==H)for(const _ in h)!Yt(_)&&!(_ in g)&&i(l,_,h[_],null,v,f.children,m,y,Ee);for(const _ in g){if(Yt(_))continue;const I=g[_],b=h[_];I!==b&&_!=="value"&&i(l,_,b,I,v,f.children,m,y,Ee)}"value"in g&&i(l,"value",h.value,g.value)}},Lt=(l,f,h,g,m,y,v,_,I)=>{const b=f.el=l?l.el:a(""),A=f.anchor=l?l.anchor:a("");let{patchFlag:E,dynamicChildren:C,slotScopeIds:x}=f;x&&(_=_?_.concat(x):x),l==null?(s(b,h,g),s(A,h,g),ke(f.children,h,A,m,y,v,_,I)):E>0&&E&64&&C&&l.dynamicChildren?(je(l.dynamicChildren,C,h,m,y,v,_),(f.key!=null||m&&f===m.subTree)&&zi(l,f,!0)):L(l,f,h,A,m,y,v,_,I)},kt=(l,f,h,g,m,y,v,_,I)=>{f.slotScopeIds=_,l==null?f.shapeFlag&512?m.ctx.activate(f,h,g,v,I):Dn(f,h,g,m,y,v,I):Ys(l,f,I)},Dn=(l,f,h,g,m,y,v)=>{const _=l.component=xc(l,g,m);if(Ri(l)&&(_.ctx.renderer=ot),Dc(_),_.asyncDep){if(m&&m.registerDep(_,ee),!l.el){const I=_.subTree=ve(et);Y(null,I,f,h)}return}ee(_,l,f,h,m,y,v)},Ys=(l,f,h)=>{const g=f.component=l.component;if(Na(l,f,h))if(g.asyncDep&&!g.asyncResolved){z(g,f,h);return}else g.next=f,Oa(g.update),g.update();else f.el=l.el,g.vnode=f},ee=(l,f,h,g,m,y,v)=>{const _=()=>{if(l.isMounted){let{next:A,bu:E,u:C,parent:x,vnode:M}=l,k=A,F;Ve(l,!1),A?(A.el=M.el,z(l,A,v)):A=M,E&&Jt(E),(F=A.props&&A.props.onVnodeBeforeUpdate)&&_e(F,x,A,M),Ve(l,!0);const V=$n(l),le=l.subTree;l.subTree=V,R(le,V,p(le.el),Ht(le),l,m,y),A.el=V.el,k===null&&La(l,V.el),C&&ne(C,m),(F=A.props&&A.props.onVnodeUpdated)&&ne(()=>_e(F,x,A,M),m)}else{let A;const{el:E,props:C}=f,{bm:x,m:M,parent:k}=l,F=Gt(f);if(Ve(l,!1),x&&Jt(x),!F&&(A=C&&C.onVnodeBeforeMount)&&_e(A,k,f),Ve(l,!0),E&&Pn){const V=()=>{l.subTree=$n(l),Pn(E,l.subTree,l,m,null)};F?f.type.__asyncLoader().then(()=>!l.isUnmounted&&V()):V()}else{const V=l.subTree=$n(l);R(null,V,h,g,l,m,y),f.el=V.el}if(M&&ne(M,m),!F&&(A=C&&C.onVnodeMounted)){const V=f;ne(()=>_e(A,k,V),m)}(f.shapeFlag&256||k&&Gt(k.vnode)&&k.vnode.shapeFlag&256)&&l.a&&ne(l.a,m),l.isMounted=!0,f=h=g=null}},I=l.effect=new Ss(_,()=>$s(b),l.scope),b=l.update=()=>I.run();b.id=l.uid,Ve(l,!0),b()},z=(l,f,h)=>{f.component=l;const g=l.vnode.props;l.vnode=f,l.next=null,dc(l,f.props,g,h),gc(l,f.children,h),yt(),cr(),wt()},L=(l,f,h,g,m,y,v,_,I=!1)=>{const b=l&&l.children,A=l?l.shapeFlag:0,E=f.children,{patchFlag:C,shapeFlag:x}=f;if(C>0){if(C&128){jt(b,E,h,g,m,y,v,_,I);return}else if(C&256){He(b,E,h,g,m,y,v,_,I);return}}x&8?(A&16&&Ee(b,m,y),E!==b&&d(h,E)):A&16?x&16?jt(b,E,h,g,m,y,v,_,I):Ee(b,m,y,!0):(A&8&&d(h,""),x&16&&ke(E,h,g,m,y,v,_,I))},He=(l,f,h,g,m,y,v,_,I)=>{l=l||ut,f=f||ut;const b=l.length,A=f.length,E=Math.min(b,A);let C;for(C=0;C<E;C++){const x=f[C]=I?Oe(f[C]):ye(f[C]);R(l[C],x,h,null,m,y,v,_,I)}b>A?Ee(l,m,y,!0,!1,E):ke(f,h,g,m,y,v,_,I,E)},jt=(l,f,h,g,m,y,v,_,I)=>{let b=0;const A=f.length;let E=l.length-1,C=A-1;for(;b<=E&&b<=C;){const x=l[b],M=f[b]=I?Oe(f[b]):ye(f[b]);if(Tt(x,M))R(x,M,h,null,m,y,v,_,I);else break;b++}for(;b<=E&&b<=C;){const x=l[E],M=f[C]=I?Oe(f[C]):ye(f[C]);if(Tt(x,M))R(x,M,h,null,m,y,v,_,I);else break;E--,C--}if(b>E){if(b<=C){const x=C+1,M=x<A?f[x].el:g;for(;b<=C;)R(null,f[b]=I?Oe(f[b]):ye(f[b]),h,M,m,y,v,_,I),b++}}else if(b>C)for(;b<=E;)me(l[b],m,y,!0),b++;else{const x=b,M=b,k=new Map;for(b=M;b<=C;b++){const ie=f[b]=I?Oe(f[b]):ye(f[b]);ie.key!=null&&k.set(ie.key,b)}let F,V=0;const le=C-M+1;let at=!1,Xs=0;const Et=new Array(le);for(b=0;b<le;b++)Et[b]=0;for(b=x;b<=E;b++){const ie=l[b];if(V>=le){me(ie,m,y,!0);continue}let be;if(ie.key!=null)be=k.get(ie.key);else for(F=M;F<=C;F++)if(Et[F-M]===0&&Tt(ie,f[F])){be=F;break}be===void 0?me(ie,m,y,!0):(Et[be-M]=b+1,be>=Xs?Xs=be:at=!0,R(ie,f[be],h,null,m,y,v,_,I),V++)}const Zs=at?yc(Et):ut;for(F=Zs.length-1,b=le-1;b>=0;b--){const ie=M+b,be=f[ie],Qs=ie+1<A?f[ie+1].el:g;Et[b]===0?R(null,be,h,Qs,m,y,v,_,I):at&&(F<0||b!==Zs[F]?Ue(be,h,Qs,2):F--)}}},Ue=(l,f,h,g,m=null)=>{const{el:y,type:v,transition:_,children:I,shapeFlag:b}=l;if(b&6){Ue(l.component.subTree,f,h,g);return}if(b&128){l.suspense.move(f,h,g);return}if(b&64){v.move(l,f,h,ot);return}if(v===ce){s(y,f,h);for(let E=0;E<I.length;E++)Ue(I[E],f,h,g);s(l.anchor,f,h);return}if(v===Nn){G(l,f,h);return}if(g!==2&&b&1&&_)if(g===0)_.beforeEnter(y),s(y,f,h),ne(()=>_.enter(y),m);else{const{leave:E,delayLeave:C,afterLeave:x}=_,M=()=>s(y,f,h),k=()=>{E(y,()=>{M(),x&&x()})};C?C(y,M,k):k()}else s(y,f,h)},me=(l,f,h,g=!1,m=!1)=>{const{type:y,props:v,ref:_,children:I,dynamicChildren:b,shapeFlag:A,patchFlag:E,dirs:C}=l;if(_!=null&&cs(_,null,h,l,!0),A&256){f.ctx.deactivate(l);return}const x=A&1&&C,M=!Gt(l);let k;if(M&&(k=v&&v.onVnodeBeforeUnmount)&&_e(k,f,l),A&6)ko(l.component,h,g);else{if(A&128){l.suspense.unmount(h,g);return}x&&ze(l,null,f,"beforeUnmount"),A&64?l.type.remove(l,f,h,m,ot,g):b&&(y!==ce||E>0&&E&64)?Ee(b,f,h,!1,!0):(y===ce&&E&384||!m&&A&16)&&Ee(I,f,h),g&&Js(l)}(M&&(k=v&&v.onVnodeUnmounted)||x)&&ne(()=>{k&&_e(k,f,l),x&&ze(l,null,f,"unmounted")},h)},Js=l=>{const{type:f,el:h,anchor:g,transition:m}=l;if(f===ce){Lo(h,g);return}if(f===Nn){O(l);return}const y=()=>{r(h),m&&!m.persisted&&m.afterLeave&&m.afterLeave()};if(l.shapeFlag&1&&m&&!m.persisted){const{leave:v,delayLeave:_}=m,I=()=>v(h,y);_?_(l.el,y,I):I()}else y()},Lo=(l,f)=>{let h;for(;l!==f;)h=w(l),r(l),l=h;r(f)},ko=(l,f,h)=>{const{bum:g,scope:m,update:y,subTree:v,um:_}=l;g&&Jt(g),m.stop(),y&&(y.active=!1,me(v,l,f,h)),_&&ne(_,f),ne(()=>{l.isUnmounted=!0},f),f&&f.pendingBranch&&!f.isUnmounted&&l.asyncDep&&!l.asyncResolved&&l.suspenseId===f.pendingId&&(f.deps--,f.deps===0&&f.resolve())},Ee=(l,f,h,g=!1,m=!1,y=0)=>{for(let v=y;v<l.length;v++)me(l[v],f,h,g,m)},Ht=l=>l.shapeFlag&6?Ht(l.component.subTree):l.shapeFlag&128?l.suspense.next():w(l.anchor||l.el),Gs=(l,f,h)=>{l==null?f._vnode&&me(f._vnode,null,null,!0):R(f._vnode||null,l,f,null,null,null,h),cr(),Ci(),f._vnode=l},ot={p:R,um:me,m:Ue,r:Js,mt:Dn,mc:ke,pc:L,pbc:je,n:Ht,o:e};let On,Pn;return t&&([On,Pn]=t(ot)),{render:Gs,hydrate:On,createApp:lc(Gs,On)}}function Ve({effect:e,update:t},n){e.allowRecurse=t.allowRecurse=n}function _c(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function zi(e,t,n=!1){const s=e.children,r=t.children;if(S(s)&&S(r))for(let i=0;i<s.length;i++){const o=s[i];let a=r[i];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=r[i]=Oe(r[i]),a.el=o.el),n||zi(o,a)),a.type===In&&(a.el=o.el)}}function yc(e){const t=e.slice(),n=[0];let s,r,i,o,a;const c=e.length;for(s=0;s<c;s++){const u=e[s];if(u!==0){if(r=n[n.length-1],e[r]<u){t[s]=r,n.push(s);continue}for(i=0,o=n.length-1;i<o;)a=i+o>>1,e[n[a]]<u?i=a+1:o=a;u<e[n[i]]&&(i>0&&(t[s]=n[i-1]),n[i]=s)}}for(i=n.length,o=n[i-1];i-- >0;)n[i]=o,o=t[o];return n}const wc=e=>e.__isTeleport,ce=Symbol.for("v-fgt"),In=Symbol.for("v-txt"),et=Symbol.for("v-cmt"),Nn=Symbol.for("v-stc"),Dt=[];let he=null;function oe(e=!1){Dt.push(he=e?null:[])}function Ic(){Dt.pop(),he=Dt[Dt.length-1]||null}let $t=1;function _r(e){$t+=e}function Vi(e){return e.dynamicChildren=$t>0?he||ut:null,Ic(),$t>0&&he&&he.push(e),e}function Ie(e,t,n,s,r,i){return Vi(P(e,t,n,s,r,i,!0))}function ls(e,t,n,s,r){return Vi(ve(e,t,n,s,r,!0))}function vc(e){return e?e.__v_isVNode===!0:!1}function Tt(e,t){return e.type===t.type&&e.key===t.key}const vn="__vInternal",Ki=({key:e})=>e??null,Zt=({ref:e,ref_key:t,ref_for:n})=>(typeof e=="number"&&(e=""+e),e!=null?K(e)||Q(e)||D(e)?{i:de,r:e,k:t,f:!!n}:e:null);function P(e,t=null,n=null,s=0,r=null,i=e===ce?0:1,o=!1,a=!1){const c={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&Ki(t),ref:t&&Zt(t),scopeId:_n,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetAnchor:null,staticCount:0,shapeFlag:i,patchFlag:s,dynamicProps:r,dynamicChildren:null,appContext:null,ctx:de};return a?(Ls(c,n),i&128&&e.normalize(c)):n&&(c.shapeFlag|=K(n)?8:16),$t>0&&!o&&he&&(c.patchFlag>0||i&6)&&c.patchFlag!==32&&he.push(c),c}const ve=Ec;function Ec(e,t=null,n=null,s=0,r=null,i=!1){if((!e||e===ka)&&(e=et),vc(e)){const a=mt(e,t,!0);return n&&Ls(a,n),$t>0&&!i&&he&&(a.shapeFlag&6?he[he.indexOf(e)]=a:he.push(a)),a.patchFlag|=-2,a}if(Rc(e)&&(e=e.__vccOpts),t){t=Tc(t);let{class:a,style:c}=t;a&&!K(a)&&(t.class=Ae(a)),U(c)&&(_i(c)&&!S(c)&&(c=q({},c)),t.style=As(c))}const o=K(e)?1:ja(e)?128:wc(e)?64:U(e)?4:D(e)?2:0;return P(e,t,n,s,r,o,i,!0)}function Tc(e){return e?_i(e)||vn in e?q({},e):e:null}function mt(e,t,n=!1){const{props:s,ref:r,patchFlag:i,children:o}=e,a=t?Ac(s||{},t):s;return{__v_isVNode:!0,__v_skip:!0,type:e.type,props:a,key:a&&Ki(a),ref:t&&t.ref?n&&r?S(r)?r.concat(Zt(t)):[r,Zt(t)]:Zt(t):r,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:o,target:e.target,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==ce?i===-1?16:i|16:i,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:e.transition,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&mt(e.ssContent),ssFallback:e.ssFallback&&mt(e.ssFallback),el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce}}function Qt(e=" ",t=0){return ve(In,null,e,t)}function on(e="",t=!1){return t?(oe(),ls(et,null,e)):ve(et,null,e)}function ye(e){return e==null||typeof e=="boolean"?ve(et):S(e)?ve(ce,null,e.slice()):typeof e=="object"?Oe(e):ve(In,null,String(e))}function Oe(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:mt(e)}function Ls(e,t){let n=0;const{shapeFlag:s}=e;if(t==null)t=null;else if(S(t))n=16;else if(typeof t=="object")if(s&65){const r=t.default;r&&(r._c&&(r._d=!1),Ls(e,r()),r._c&&(r._d=!0));return}else{n=32;const r=t._;!r&&!(vn in t)?t._ctx=de:r===3&&de&&(de.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else D(t)?(t={default:t,_ctx:de},n=32):(t=String(t),s&64?(n=16,t=[Qt(t)]):n=8);e.children=t,e.shapeFlag|=n}function Ac(...e){const t={};for(let n=0;n<e.length;n++){const s=e[n];for(const r in s)if(r==="class")t.class!==s.class&&(t.class=Ae([t.class,s.class]));else if(r==="style")t.style=As([t.style,s.style]);else if(fn(r)){const i=t[r],o=s[r];o&&i!==o&&!(S(i)&&i.includes(o))&&(t[r]=i?[].concat(i,o):o)}else r!==""&&(t[r]=s[r])}return t}function _e(e,t,n,s=null){ge(e,t,7,[n,s])}const Cc=Ni();let Sc=0;function xc(e,t,n){const s=e.type,r=(t?t.appContext:e.appContext)||Cc,i={uid:Sc++,vnode:e,type:s,parent:t,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,scope:new Zo(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(r.provides),accessCache:null,renderCache:[],components:null,directives:null,propsOptions:ki(s,r),emitsOptions:xi(s,r),emit:null,emitted:null,propsDefaults:H,inheritAttrs:s.inheritAttrs,ctx:H,data:H,props:H,attrs:H,slots:H,refs:H,setupState:H,setupContext:null,attrsProxy:null,slotsProxy:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return i.ctx={_:i},i.root=t?t.root:i,i.emit=Ra.bind(null,i),e.ce&&e.ce(i),i}let Z=null,ks,ct,yr="__VUE_INSTANCE_SETTERS__";(ct=Zn()[yr])||(ct=Zn()[yr]=[]),ct.push(e=>Z=e),ks=e=>{ct.length>1?ct.forEach(t=>t(e)):ct[0](e)};const bt=e=>{ks(e),e.scope.on()},Ze=()=>{Z&&Z.scope.off(),ks(null)};function Wi(e){return e.vnode.shapeFlag&4}let Bt=!1;function Dc(e,t=!1){Bt=t;const{props:n,children:s}=e.vnode,r=Wi(e);fc(e,n,r,t),pc(e,s);const i=r?Oc(e,t):void 0;return Bt=!1,i}function Oc(e,t){const n=e.type;e.accessCache=Object.create(null),e.proxy=yi(new Proxy(e.ctx,nc));const{setup:s}=n;if(s){const r=e.setupContext=s.length>1?Mc(e):null;bt(e),yt();const i=Me(s,e,0,[e.props,r]);if(wt(),Ze(),ti(i)){if(i.then(Ze,Ze),t)return i.then(o=>{wr(e,o,t)}).catch(o=>{mn(o,e,0)});e.asyncDep=i}else wr(e,i,t)}else qi(e,t)}function wr(e,t,n){D(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:U(t)&&(e.setupState=Ei(t)),qi(e,n)}let Ir;function qi(e,t,n){const s=e.type;if(!e.render){if(!t&&Ir&&!s.render){const r=s.template||Fs(e).template;if(r){const{isCustomElement:i,compilerOptions:o}=e.appContext.config,{delimiters:a,compilerOptions:c}=s,u=q(q({isCustomElement:i,delimiters:a},o),c);s.render=Ir(r,u)}}e.render=s.render||pe}{bt(e),yt();try{sc(e)}finally{wt(),Ze()}}}function Pc(e){return e.attrsProxy||(e.attrsProxy=new Proxy(e.attrs,{get(t,n){return re(e,"get","$attrs"),t[n]}}))}function Mc(e){const t=n=>{e.exposed=n||{}};return{get attrs(){return Pc(e)},slots:e.slots,emit:e.emit,expose:t}}function En(e){if(e.exposed)return e.exposeProxy||(e.exposeProxy=new Proxy(Ei(yi(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in xt)return xt[n](e)},has(t,n){return n in t||n in xt}}))}function Rc(e){return D(e)&&"__vccOpts"in e}const $c=(e,t)=>Ca(e,t,Bt),Bc=Symbol.for("v-scx"),Fc=()=>Xt(Bc),Nc="3.3.8",Lc="http://www.w3.org/2000/svg",qe=typeof document<"u"?document:null,vr=qe&&qe.createElement("template"),kc={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{const t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,s)=>{const r=t?qe.createElementNS(Lc,e):qe.createElement(e,n?{is:n}:void 0);return e==="select"&&s&&s.multiple!=null&&r.setAttribute("multiple",s.multiple),r},createText:e=>qe.createTextNode(e),createComment:e=>qe.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>qe.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},insertStaticContent(e,t,n,s,r,i){const o=n?n.previousSibling:t.lastChild;if(r&&(r===i||r.nextSibling))for(;t.insertBefore(r.cloneNode(!0),n),!(r===i||!(r=r.nextSibling)););else{vr.innerHTML=s?`<svg>${e}</svg>`:e;const a=vr.content;if(s){const c=a.firstChild;for(;c.firstChild;)a.appendChild(c.firstChild);a.removeChild(c)}t.insertBefore(a,n)}return[o?o.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},jc=Symbol("_vtc");function Hc(e,t,n){const s=e[jc];s&&(t=(t?[t,...s]:[...s]).join(" ")),t==null?e.removeAttribute("class"):n?e.setAttribute("class",t):e.className=t}const Uc=Symbol("_vod");function zc(e,t,n){const s=e.style,r=K(n);if(n&&!r){if(t&&!K(t))for(const i in t)n[i]==null&&us(s,i,"");for(const i in n)us(s,i,n[i])}else{const i=s.display;r?t!==n&&(s.cssText=n):t&&e.removeAttribute("style"),Uc in e&&(s.display=i)}}const Er=/\s*!important$/;function us(e,t,n){if(S(n))n.forEach(s=>us(e,t,s));else if(n==null&&(n=""),t.startsWith("--"))e.setProperty(t,n);else{const s=Vc(e,t);Er.test(n)?e.setProperty(_t(s),n.replace(Er,""),"important"):e[s]=n}}const Tr=["Webkit","Moz","ms"],Ln={};function Vc(e,t){const n=Ln[t];if(n)return n;let s=pt(t);if(s!=="filter"&&s in e)return Ln[t]=s;s=ri(s);for(let r=0;r<Tr.length;r++){const i=Tr[r]+s;if(i in e)return Ln[t]=i}return t}const Ar="http://www.w3.org/1999/xlink";function Kc(e,t,n,s,r){if(s&&t.startsWith("xlink:"))n==null?e.removeAttributeNS(Ar,t.slice(6,t.length)):e.setAttributeNS(Ar,t,n);else{const i=Xo(t);n==null||i&&!ii(n)?e.removeAttribute(t):e.setAttribute(t,i?"":n)}}function Wc(e,t,n,s,r,i,o){if(t==="innerHTML"||t==="textContent"){s&&o(s,r,i),e[t]=n??"";return}const a=e.tagName;if(t==="value"&&a!=="PROGRESS"&&!a.includes("-")){e._value=n;const u=a==="OPTION"?e.getAttribute("value"):e.value,d=n??"";u!==d&&(e.value=d),n==null&&e.removeAttribute(t);return}let c=!1;if(n===""||n==null){const u=typeof e[t];u==="boolean"?n=ii(n):n==null&&u==="string"?(n="",c=!0):u==="number"&&(n=0,c=!0)}try{e[t]=n}catch{}c&&e.removeAttribute(t)}function lt(e,t,n,s){e.addEventListener(t,n,s)}function qc(e,t,n,s){e.removeEventListener(t,n,s)}const Cr=Symbol("_vei");function Yc(e,t,n,s,r=null){const i=e[Cr]||(e[Cr]={}),o=i[t];if(s&&o)o.value=s;else{const[a,c]=Jc(t);if(s){const u=i[t]=Zc(s,r);lt(e,a,u,c)}else o&&(qc(e,a,o,c),i[t]=void 0)}}const Sr=/(?:Once|Passive|Capture)$/;function Jc(e){let t;if(Sr.test(e)){t={};let s;for(;s=e.match(Sr);)e=e.slice(0,e.length-s[0].length),t[s[0].toLowerCase()]=!0}return[e[2]===":"?e.slice(3):_t(e.slice(2)),t]}let kn=0;const Gc=Promise.resolve(),Xc=()=>kn||(Gc.then(()=>kn=0),kn=Date.now());function Zc(e,t){const n=s=>{if(!s._vts)s._vts=Date.now();else if(s._vts<=n.attached)return;ge(Qc(s,n.value),t,5,[s])};return n.value=e,n.attached=Xc(),n}function Qc(e,t){if(S(t)){const n=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0},t.map(s=>r=>!r._stopped&&s&&s(r))}else return t}const xr=/^on[a-z]/,el=(e,t,n,s,r=!1,i,o,a,c)=>{t==="class"?Hc(e,s,r):t==="style"?zc(e,n,s):fn(t)?vs(t)||Yc(e,t,n,s,o):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):tl(e,t,s,r))?Wc(e,t,s,i,o,a,c):(t==="true-value"?e._trueValue=s:t==="false-value"&&(e._falseValue=s),Kc(e,t,s,r))};function tl(e,t,n,s){return s?!!(t==="innerHTML"||t==="textContent"||t in e&&xr.test(t)&&D(n)):t==="spellcheck"||t==="draggable"||t==="translate"||t==="form"||t==="list"&&e.tagName==="INPUT"||t==="type"&&e.tagName==="TEXTAREA"||xr.test(t)&&K(n)?!1:t in e}const Dr=e=>{const t=e.props["onUpdate:modelValue"]||!1;return S(t)?n=>Jt(t,n):t};function nl(e){e.target.composing=!0}function Or(e){const t=e.target;t.composing&&(t.composing=!1,t.dispatchEvent(new Event("input")))}const jn=Symbol("_assign"),sl={created(e,{modifiers:{lazy:t,trim:n,number:s}},r){e[jn]=Dr(r);const i=s||r.props&&r.props.type==="number";lt(e,t?"change":"input",o=>{if(o.target.composing)return;let a=e.value;n&&(a=a.trim()),i&&(a=Xn(a)),e[jn](a)}),n&&lt(e,"change",()=>{e.value=e.value.trim()}),t||(lt(e,"compositionstart",nl),lt(e,"compositionend",Or),lt(e,"change",Or))},mounted(e,{value:t}){e.value=t??""},beforeUpdate(e,{value:t,modifiers:{lazy:n,trim:s,number:r}},i){if(e[jn]=Dr(i),e.composing||document.activeElement===e&&e.type!=="range"&&(n||s&&e.value.trim()===t||(r||e.type==="number")&&Xn(e.value)===t))return;const o=t??"";e.value!==o&&(e.value=o)}},rl=q({patchProp:el},kc);let Pr;function il(){return Pr||(Pr=mc(rl))}const ol=(...e)=>{const t=il().createApp(...e),{mount:n}=t;return t.mount=s=>{const r=al(s);if(!r)return;const i=t._component;!D(i)&&!i.render&&!i.template&&(i.template=r.innerHTML),r.innerHTML="";const o=n(r,!1,r instanceof SVGElement);return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),o},t};function al(e){return K(e)?document.querySelector(e):e}function cl(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var fs={exports:{}},ll=function(e,t){for(var n={},s=Object.keys(e),r=0;r<s.length;r++){var i=s[r],o=t(i,e[i],e);n[o[0]]=o[1]}return n};(function(e,t){Object.defineProperty(t,"__esModule",{value:!0});function n(u){return u&&u.__esModule?u:{default:u}}var s=ll,r=n(s),i=function(d){return typeof d=="object"},o=function(d){return d.replace(/[ _.-](\w|$)/g,function(p,w){return w.toUpperCase()})};function a(u){return Object.keys(u).map(function(d){return u[d]})}function c(u){var d=u==null?u:(0,r.default)(u,function(p,w){var T=[];if(Array.isArray(w))return w.forEach(function(N){i(N)&&!Array.isArray(N)?T.push(c(N)):T.push(N)}),[o(p),T];if(w){if(w instanceof Date)return[o(p),w];if(i(w))return[o(p),c(w)]}else return[o(p),w];return[o(p),w]});return Array.isArray(u)?a(d):d}t.default=c,e.exports=t.default})(fs,fs.exports);var ul=fs.exports;const fl=cl(ul),ds="custom-song-update",dl="https://bsaber.com/wp-json/bsaber-api/songs",hl="https://corsproxy.io/",pl=3,gl=async({bookmarkedBy:e,amount:t,title:n})=>{const s=new URL(dl);s.searchParams.set("bookmarked_by",e);const r=[];let i=1,o=0;for(;!t||r.length<t;){s.searchParams.set("page",i.toString());let a;try{if(a=await fetch(`${hl}?${encodeURIComponent(s.toString())}`),!a.ok)throw new Error(await a.text())}catch(u){if(o++,o<pl)continue;throw new Error("Failed to fetch bookmarks",{cause:u})}const c=fl(await a.json());if(r.push(...c.songs),Yi(n,r),!c.nextPage)break;i++}return r.slice(0,t)},Yi=(e,t)=>{window.dispatchEvent(new CustomEvent(ds,{detail:{title:e,songs:t}}))},Ji=e=>`${e}'s bookmarks`,ml=async(e,t)=>{const n=Ji(e),s=await gl({bookmarkedBy:e,amount:t,title:n});if(s.length===0)throw new Error("Empty playlist!");return{playlistTitle:n,playlistAuthor:"beatsaber-bookmark-to-playlist",playlistDescription:`Playlist automatically generated from ${e}'s bookmarks on ${new Date().toDateString()}`,image:Gi(n),customData:{},songs:s.map(r=>({songName:r.title,key:r.songKey,hash:r.hash}))}},At=256,bl=10,Gi=(e,t="#3498db")=>{const n=document.createElement("canvas"),s=n.getContext("2d");n.width=At,n.height=At,s.fillStyle=t,s.fillRect(0,0,n.width,n.height);const r=s.createLinearGradient(0,0,n.width,n.height);r.addColorStop(0,"rgba(0, 0, 0, 0)"),r.addColorStop(1,"rgba(0, 0, 0, 0.5)"),s.fillStyle=r,s.fillRect(0,0,n.width,n.height),s.font="42px Geist",s.textAlign="center",s.textBaseline="bottom";let i=128,o=0;const a=e.split(" "),c=[a[0]];for(let u=1;u<a.length;u++){const d=c[c.length-1]+" "+a[u],p=s.measureText(d);p.width>At-bl?(c.push(a[u]),o=(p.actualBoundingBoxAscent+p.actualBoundingBoxDescent)*1.2,i-=o):c[c.length-1]=d}for(let u of c)i+=o,s.fillStyle="#000",s.fillText(u,At/2+2,i+2),s.fillStyle="#fff",s.fillText(u,At/2,i);return n.toDataURL()},Xi=e=>(Di("data-v-e957607e"),e=e(),Oi(),e),_l={class:"loader"},yl=["src"],wl={key:0,class:"text"},Il=Xi(()=>P("span",null,[P("h3",null,"Building playlist"),P("p",null,"This might take a while")],-1)),vl={class:"info"},El={class:"timer"},Tl={class:"amount"},Al={key:1,class:"text"},Cl=Xi(()=>P("span",null,[P("h3",null,"Playlist error!"),P("p",null," Creating the playlist didn't work. Make sure the username is correct and try again later. ")],-1)),Sl=[Cl],xl=yn({__name:"Loader",props:{playlistSize:{},title:{}},setup(e){const{playlistSize:t,title:n}=e,s=Ye("00:00"),r=Ye(0),i=Ye(!1),o=Gi(n);let a=-1;const c=u=>{const d=u.detail.title,p=u.detail.songs;d===n&&(p.length===0&&(i.value=!0,window.clearInterval(a)),r.value=Math.min(t||Number.POSITIVE_INFINITY,p.length),t&&p.length>=t&&window.clearInterval(a))};return Bi(()=>{const u=Date.now();a=window.setInterval(()=>{const d=(Date.now()-u)/1e3,p=Math.floor(d/60),w=Math.floor(d)%60;s.value=`${p}:${w.toString().padStart(2,"0")}`},1e3),window.addEventListener(ds,c)}),Bs(()=>{window.clearInterval(a),window.removeEventListener(ds,c)}),(u,d)=>(oe(),Ie("div",_l,[P("img",{src:vi(o)},null,8,yl),i.value?on("",!0):(oe(),Ie("div",wl,[Il,P("div",vl,[P("span",El,Rn(s.value),1),P("span",Tl,Rn(r.value)+" / "+Rn(u.playlistSize||"??")+" songs",1)])])),i.value?(oe(),Ie("div",Al,Sl)):on("",!0)]))}});const js=(e,t)=>{const n=e.__vccOpts||e;for(const[s,r]of t)n[s]=r;return n},Dl=js(xl,[["__scopeId","data-v-e957607e"]]),Ol=["download","href"],Pl=["src"],Ml=yn({__name:"Playlist",props:{playlist:{}},setup(e){return(t,n)=>(oe(),Ie("a",{class:"playlist",download:`${t.playlist.playlistTitle}.bplist`,href:`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(t.playlist))}`,title:"Download"},[P("img",{src:t.playlist.image},null,8,Pl)],8,Ol))}});const Rl=js(Ml,[["__scopeId","data-v-00a5e31d"]]);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zi=function(e){const t=[];let n=0;for(let s=0;s<e.length;s++){let r=e.charCodeAt(s);r<128?t[n++]=r:r<2048?(t[n++]=r>>6|192,t[n++]=r&63|128):(r&64512)===55296&&s+1<e.length&&(e.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(e.charCodeAt(++s)&1023),t[n++]=r>>18|240,t[n++]=r>>12&63|128,t[n++]=r>>6&63|128,t[n++]=r&63|128):(t[n++]=r>>12|224,t[n++]=r>>6&63|128,t[n++]=r&63|128)}return t},$l=function(e){const t=[];let n=0,s=0;for(;n<e.length;){const r=e[n++];if(r<128)t[s++]=String.fromCharCode(r);else if(r>191&&r<224){const i=e[n++];t[s++]=String.fromCharCode((r&31)<<6|i&63)}else if(r>239&&r<365){const i=e[n++],o=e[n++],a=e[n++],c=((r&7)<<18|(i&63)<<12|(o&63)<<6|a&63)-65536;t[s++]=String.fromCharCode(55296+(c>>10)),t[s++]=String.fromCharCode(56320+(c&1023))}else{const i=e[n++],o=e[n++];t[s++]=String.fromCharCode((r&15)<<12|(i&63)<<6|o&63)}}return t.join("")},Qi={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<e.length;r+=3){const i=e[r],o=r+1<e.length,a=o?e[r+1]:0,c=r+2<e.length,u=c?e[r+2]:0,d=i>>2,p=(i&3)<<4|a>>4;let w=(a&15)<<2|u>>6,T=u&63;c||(T=64,o||(w=64)),s.push(n[d],n[p],n[w],n[T])}return s.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(Zi(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):$l(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<e.length;){const i=n[e.charAt(r++)],a=r<e.length?n[e.charAt(r)]:0;++r;const u=r<e.length?n[e.charAt(r)]:64;++r;const p=r<e.length?n[e.charAt(r)]:64;if(++r,i==null||a==null||u==null||p==null)throw new Bl;const w=i<<2|a>>4;if(s.push(w),u!==64){const T=a<<4&240|u>>2;if(s.push(T),p!==64){const N=u<<6&192|p;s.push(N)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class Bl extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Fl=function(e){const t=Zi(e);return Qi.encodeByteArray(t,!0)},eo=function(e){return Fl(e).replace(/\./g,"")},Nl=function(e){try{return Qi.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ll(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kl=()=>Ll().__FIREBASE_DEFAULTS__,jl=()=>{if(typeof process>"u"||typeof process.env>"u")return;const e={}.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},Hl=()=>{if(typeof document>"u")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=e&&Nl(e[1]);return t&&JSON.parse(t)},Ul=()=>{try{return kl()||jl()||Hl()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},to=()=>{var e;return(e=Ul())===null||e===void 0?void 0:e.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zl{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,s))}}}function Vl(){const e=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof e=="object"&&e.id!==void 0}function no(){try{return typeof indexedDB=="object"}catch{return!1}}function so(){return new Promise((e,t)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(s),e(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var i;t(((i=r.error)===null||i===void 0?void 0:i.message)||"")}}catch(n){t(n)}})}function Kl(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wl="FirebaseError";class it extends Error{constructor(t,n,s){super(n),this.code=t,this.customData=s,this.name=Wl,Object.setPrototypeOf(this,it.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Tn.prototype.create)}}class Tn{constructor(t,n,s){this.service=t,this.serviceName=n,this.errors=s}create(t,...n){const s=n[0]||{},r=`${this.service}/${t}`,i=this.errors[t],o=i?ql(i,s):"Error",a=`${this.serviceName}: ${o} (${r}).`;return new it(r,a,s)}}function ql(e,t){return e.replace(Yl,(n,s)=>{const r=t[s];return r!=null?String(r):`<${s}?>`})}const Yl=/\{\$([^}]+)}/g;function an(e,t){if(e===t)return!0;const n=Object.keys(e),s=Object.keys(t);for(const r of n){if(!s.includes(r))return!1;const i=e[r],o=t[r];if(Mr(i)&&Mr(o)){if(!an(i,o))return!1}else if(i!==o)return!1}for(const r of s)if(!n.includes(r))return!1;return!0}function Mr(e){return e!==null&&typeof e=="object"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jl=1e3,Gl=2,Xl=4*60*60*1e3,Zl=.5;function Rr(e,t=Jl,n=Gl){const s=t*Math.pow(n,e),r=Math.round(Zl*s*(Math.random()-.5)*2);return Math.min(Xl,s+r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ro(e){return e&&e._delegate?e._delegate:e}class Le{constructor(t,n,s){this.name=t,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ke="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ql{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){const s=new zl;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:n});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){var n;const s=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),r=(n=t==null?void 0:t.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(tu(t))try{this.getOrInitializeService({instanceIdentifier:Ke})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:r});s.resolve(i)}catch{}}}}clearInstance(t=Ke){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Ke){return this.instances.has(t)}getOptions(t=Ke){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:n={}}=t,s=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[i,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(i);s===a&&o.resolve(r)}return r}onInit(t,n){var s;const r=this.normalizeInstanceIdentifier(n),i=(s=this.onInitCallbacks.get(r))!==null&&s!==void 0?s:new Set;i.add(t),this.onInitCallbacks.set(r,i);const o=this.instances.get(r);return o&&t(o,r),()=>{i.delete(t)}}invokeOnInitCallbacks(t,n){const s=this.onInitCallbacks.get(n);if(s)for(const r of s)try{r(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let s=this.instances.get(t);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:eu(t),options:n}),this.instances.set(t,s),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(s,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,s)}catch{}return s||null}normalizeInstanceIdentifier(t=Ke){return this.component?this.component.multipleInstances?t:Ke:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function eu(e){return e===Ke?void 0:e}function tu(e){return e.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nu{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const n=new Ql(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var j;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(j||(j={}));const su={debug:j.DEBUG,verbose:j.VERBOSE,info:j.INFO,warn:j.WARN,error:j.ERROR,silent:j.SILENT},ru=j.INFO,iu={[j.DEBUG]:"log",[j.VERBOSE]:"log",[j.INFO]:"info",[j.WARN]:"warn",[j.ERROR]:"error"},ou=(e,t,...n)=>{if(t<e.logLevel)return;const s=new Date().toISOString(),r=iu[t];if(r)console[r](`[${s}]  ${e.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class io{constructor(t){this.name=t,this._logLevel=ru,this._logHandler=ou,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in j))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?su[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,j.DEBUG,...t),this._logHandler(this,j.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,j.VERBOSE,...t),this._logHandler(this,j.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,j.INFO,...t),this._logHandler(this,j.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,j.WARN,...t),this._logHandler(this,j.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,j.ERROR,...t),this._logHandler(this,j.ERROR,...t)}}const au=(e,t)=>t.some(n=>e instanceof n);let $r,Br;function cu(){return $r||($r=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function lu(){return Br||(Br=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const oo=new WeakMap,hs=new WeakMap,ao=new WeakMap,Hn=new WeakMap,Hs=new WeakMap;function uu(e){const t=new Promise((n,s)=>{const r=()=>{e.removeEventListener("success",i),e.removeEventListener("error",o)},i=()=>{n(Re(e.result)),r()},o=()=>{s(e.error),r()};e.addEventListener("success",i),e.addEventListener("error",o)});return t.then(n=>{n instanceof IDBCursor&&oo.set(n,e)}).catch(()=>{}),Hs.set(t,e),t}function fu(e){if(hs.has(e))return;const t=new Promise((n,s)=>{const r=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",o),e.removeEventListener("abort",o)},i=()=>{n(),r()},o=()=>{s(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",i),e.addEventListener("error",o),e.addEventListener("abort",o)});hs.set(e,t)}let ps={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return hs.get(e);if(t==="objectStoreNames")return e.objectStoreNames||ao.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Re(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function du(e){ps=e(ps)}function hu(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){const s=e.call(Un(this),t,...n);return ao.set(s,t.sort?t.sort():[t]),Re(s)}:lu().includes(e)?function(...t){return e.apply(Un(this),t),Re(oo.get(this))}:function(...t){return Re(e.apply(Un(this),t))}}function pu(e){return typeof e=="function"?hu(e):(e instanceof IDBTransaction&&fu(e),au(e,cu())?new Proxy(e,ps):e)}function Re(e){if(e instanceof IDBRequest)return uu(e);if(Hn.has(e))return Hn.get(e);const t=pu(e);return t!==e&&(Hn.set(e,t),Hs.set(t,e)),t}const Un=e=>Hs.get(e);function gu(e,t,{blocked:n,upgrade:s,blocking:r,terminated:i}={}){const o=indexedDB.open(e,t),a=Re(o);return s&&o.addEventListener("upgradeneeded",c=>{s(Re(o.result),c.oldVersion,c.newVersion,Re(o.transaction),c)}),n&&o.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),a.then(c=>{i&&c.addEventListener("close",()=>i()),r&&c.addEventListener("versionchange",u=>r(u.oldVersion,u.newVersion,u))}).catch(()=>{}),a}const mu=["get","getKey","getAll","getAllKeys","count"],bu=["put","add","delete","clear"],zn=new Map;function Fr(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(zn.get(t))return zn.get(t);const n=t.replace(/FromIndex$/,""),s=t!==n,r=bu.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(r||mu.includes(n)))return;const i=async function(o,...a){const c=this.transaction(o,r?"readwrite":"readonly");let u=c.store;return s&&(u=u.index(a.shift())),(await Promise.all([u[n](...a),r&&c.done]))[0]};return zn.set(t,i),i}du(e=>({...e,get:(t,n,s)=>Fr(t,n)||e.get(t,n,s),has:(t,n)=>!!Fr(t,n)||e.has(t,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _u{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(yu(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function yu(e){const t=e.getComponent();return(t==null?void 0:t.type)==="VERSION"}const gs="@firebase/app",Nr="0.9.23";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tt=new io("@firebase/app"),wu="@firebase/app-compat",Iu="@firebase/analytics-compat",vu="@firebase/analytics",Eu="@firebase/app-check-compat",Tu="@firebase/app-check",Au="@firebase/auth",Cu="@firebase/auth-compat",Su="@firebase/database",xu="@firebase/database-compat",Du="@firebase/functions",Ou="@firebase/functions-compat",Pu="@firebase/installations",Mu="@firebase/installations-compat",Ru="@firebase/messaging",$u="@firebase/messaging-compat",Bu="@firebase/performance",Fu="@firebase/performance-compat",Nu="@firebase/remote-config",Lu="@firebase/remote-config-compat",ku="@firebase/storage",ju="@firebase/storage-compat",Hu="@firebase/firestore",Uu="@firebase/firestore-compat",zu="firebase";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ms="[DEFAULT]",Vu={[gs]:"fire-core",[wu]:"fire-core-compat",[vu]:"fire-analytics",[Iu]:"fire-analytics-compat",[Tu]:"fire-app-check",[Eu]:"fire-app-check-compat",[Au]:"fire-auth",[Cu]:"fire-auth-compat",[Su]:"fire-rtdb",[xu]:"fire-rtdb-compat",[Du]:"fire-fn",[Ou]:"fire-fn-compat",[Pu]:"fire-iid",[Mu]:"fire-iid-compat",[Ru]:"fire-fcm",[$u]:"fire-fcm-compat",[Bu]:"fire-perf",[Fu]:"fire-perf-compat",[Nu]:"fire-rc",[Lu]:"fire-rc-compat",[ku]:"fire-gcs",[ju]:"fire-gcs-compat",[Hu]:"fire-fst",[Uu]:"fire-fst-compat","fire-js":"fire-js",[zu]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cn=new Map,bs=new Map;function Ku(e,t){try{e.container.addComponent(t)}catch(n){tt.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function nt(e){const t=e.name;if(bs.has(t))return tt.debug(`There were multiple attempts to register component ${t}.`),!1;bs.set(t,e);for(const n of cn.values())Ku(n,e);return!0}function An(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wu={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."},$e=new Tn("app","Firebase",Wu);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qu{constructor(t,n,s){this._isDeleted=!1,this._options=Object.assign({},t),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Le("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw $e.create("app-deleted",{appName:this._name})}}function co(e,t={}){let n=e;typeof t!="object"&&(t={name:t});const s=Object.assign({name:ms,automaticDataCollectionEnabled:!1},t),r=s.name;if(typeof r!="string"||!r)throw $e.create("bad-app-name",{appName:String(r)});if(n||(n=to()),!n)throw $e.create("no-options");const i=cn.get(r);if(i){if(an(n,i.options)&&an(s,i.config))return i;throw $e.create("duplicate-app",{appName:r})}const o=new nu(r);for(const c of bs.values())o.addComponent(c);const a=new qu(n,s,o);return cn.set(r,a),a}function Yu(e=ms){const t=cn.get(e);if(!t&&e===ms&&to())return co();if(!t)throw $e.create("no-app",{appName:e});return t}function Be(e,t,n){var s;let r=(s=Vu[e])!==null&&s!==void 0?s:e;n&&(r+=`-${n}`);const i=r.match(/\s|\//),o=t.match(/\s|\//);if(i||o){const a=[`Unable to register library "${r}" with version "${t}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&o&&a.push("and"),o&&a.push(`version name "${t}" contains illegal characters (whitespace or "/")`),tt.warn(a.join(" "));return}nt(new Le(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ju="firebase-heartbeat-database",Gu=1,Ft="firebase-heartbeat-store";let Vn=null;function lo(){return Vn||(Vn=gu(Ju,Gu,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(Ft)}}}).catch(e=>{throw $e.create("idb-open",{originalErrorMessage:e.message})})),Vn}async function Xu(e){try{return await(await lo()).transaction(Ft).objectStore(Ft).get(uo(e))}catch(t){if(t instanceof it)tt.warn(t.message);else{const n=$e.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});tt.warn(n.message)}}}async function Lr(e,t){try{const s=(await lo()).transaction(Ft,"readwrite");await s.objectStore(Ft).put(t,uo(e)),await s.done}catch(n){if(n instanceof it)tt.warn(n.message);else{const s=$e.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});tt.warn(s.message)}}}function uo(e){return`${e.name}!${e.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zu=1024,Qu=30*24*60*60*1e3;class ef{constructor(t){this.container=t,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new nf(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var t;const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=kr();if(((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise),!(this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(i=>i.date===r)))return this._heartbeatsCache.heartbeats.push({date:r,agent:s}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(i=>{const o=new Date(i.date).valueOf();return Date.now()-o<=Qu}),this._storage.overwrite(this._heartbeatsCache)}async getHeartbeatsHeader(){var t;if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=kr(),{heartbeatsToSend:s,unsentEntries:r}=tf(this._heartbeatsCache.heartbeats),i=eo(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}}function kr(){return new Date().toISOString().substring(0,10)}function tf(e,t=Zu){const n=[];let s=e.slice();for(const r of e){const i=n.find(o=>o.agent===r.agent);if(i){if(i.dates.push(r.date),jr(n)>t){i.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),jr(n)>t){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class nf{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return no()?so().then(()=>!0).catch(()=>!1):!1}async read(){return await this._canUseIndexedDBPromise?await Xu(this.app)||{heartbeats:[]}:{heartbeats:[]}}async overwrite(t){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return Lr(this.app,{lastSentHeartbeatDate:(n=t.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var n;if(await this._canUseIndexedDBPromise){const r=await this.read();return Lr(this.app,{lastSentHeartbeatDate:(n=t.lastSentHeartbeatDate)!==null&&n!==void 0?n:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...t.heartbeats]})}else return}}function jr(e){return eo(JSON.stringify({version:2,heartbeats:e})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sf(e){nt(new Le("platform-logger",t=>new _u(t),"PRIVATE")),nt(new Le("heartbeat",t=>new ef(t),"PRIVATE")),Be(gs,Nr,e),Be(gs,Nr,"esm2017"),Be("fire-js","")}sf("");var rf="firebase",of="10.6.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Be(rf,of,"app");const af=(e,t)=>t.some(n=>e instanceof n);let Hr,Ur;function cf(){return Hr||(Hr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function lf(){return Ur||(Ur=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const fo=new WeakMap,_s=new WeakMap,ho=new WeakMap,Kn=new WeakMap,Us=new WeakMap;function uf(e){const t=new Promise((n,s)=>{const r=()=>{e.removeEventListener("success",i),e.removeEventListener("error",o)},i=()=>{n(Fe(e.result)),r()},o=()=>{s(e.error),r()};e.addEventListener("success",i),e.addEventListener("error",o)});return t.then(n=>{n instanceof IDBCursor&&fo.set(n,e)}).catch(()=>{}),Us.set(t,e),t}function ff(e){if(_s.has(e))return;const t=new Promise((n,s)=>{const r=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",o),e.removeEventListener("abort",o)},i=()=>{n(),r()},o=()=>{s(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",i),e.addEventListener("error",o),e.addEventListener("abort",o)});_s.set(e,t)}let ys={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return _s.get(e);if(t==="objectStoreNames")return e.objectStoreNames||ho.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Fe(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function df(e){ys=e(ys)}function hf(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){const s=e.call(Wn(this),t,...n);return ho.set(s,t.sort?t.sort():[t]),Fe(s)}:lf().includes(e)?function(...t){return e.apply(Wn(this),t),Fe(fo.get(this))}:function(...t){return Fe(e.apply(Wn(this),t))}}function pf(e){return typeof e=="function"?hf(e):(e instanceof IDBTransaction&&ff(e),af(e,cf())?new Proxy(e,ys):e)}function Fe(e){if(e instanceof IDBRequest)return uf(e);if(Kn.has(e))return Kn.get(e);const t=pf(e);return t!==e&&(Kn.set(e,t),Us.set(t,e)),t}const Wn=e=>Us.get(e);function gf(e,t,{blocked:n,upgrade:s,blocking:r,terminated:i}={}){const o=indexedDB.open(e,t),a=Fe(o);return s&&o.addEventListener("upgradeneeded",c=>{s(Fe(o.result),c.oldVersion,c.newVersion,Fe(o.transaction))}),n&&o.addEventListener("blocked",()=>n()),a.then(c=>{i&&c.addEventListener("close",()=>i()),r&&c.addEventListener("versionchange",()=>r())}).catch(()=>{}),a}const mf=["get","getKey","getAll","getAllKeys","count"],bf=["put","add","delete","clear"],qn=new Map;function zr(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(qn.get(t))return qn.get(t);const n=t.replace(/FromIndex$/,""),s=t!==n,r=bf.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(r||mf.includes(n)))return;const i=async function(o,...a){const c=this.transaction(o,r?"readwrite":"readonly");let u=c.store;return s&&(u=u.index(a.shift())),(await Promise.all([u[n](...a),r&&c.done]))[0]};return qn.set(t,i),i}df(e=>({...e,get:(t,n,s)=>zr(t,n)||e.get(t,n,s),has:(t,n)=>!!zr(t,n)||e.has(t,n)}));const po="@firebase/installations",zs="0.6.4";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const go=1e4,mo=`w:${zs}`,bo="FIS_v2",_f="https://firebaseinstallations.googleapis.com/v1",yf=60*60*1e3,wf="installations",If="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vf={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},st=new Tn(wf,If,vf);function _o(e){return e instanceof it&&e.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yo({projectId:e}){return`${_f}/projects/${e}/installations`}function wo(e){return{token:e.token,requestStatus:2,expiresIn:Tf(e.expiresIn),creationTime:Date.now()}}async function Io(e,t){const s=(await t.json()).error;return st.create("request-failed",{requestName:e,serverCode:s.code,serverMessage:s.message,serverStatus:s.status})}function vo({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function Ef(e,{refreshToken:t}){const n=vo(e);return n.append("Authorization",Af(t)),n}async function Eo(e){const t=await e();return t.status>=500&&t.status<600?e():t}function Tf(e){return Number(e.replace("s","000"))}function Af(e){return`${bo} ${e}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cf({appConfig:e,heartbeatServiceProvider:t},{fid:n}){const s=yo(e),r=vo(e),i=t.getImmediate({optional:!0});if(i){const u=await i.getHeartbeatsHeader();u&&r.append("x-firebase-client",u)}const o={fid:n,authVersion:bo,appId:e.appId,sdkVersion:mo},a={method:"POST",headers:r,body:JSON.stringify(o)},c=await Eo(()=>fetch(s,a));if(c.ok){const u=await c.json();return{fid:u.fid||n,registrationStatus:2,refreshToken:u.refreshToken,authToken:wo(u.authToken)}}else throw await Io("Create Installation",c)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function To(e){return new Promise(t=>{setTimeout(t,e)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sf(e){return btoa(String.fromCharCode(...e)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xf=/^[cdef][\w-]{21}$/,ws="";function Df(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const n=Of(e);return xf.test(n)?n:ws}catch{return ws}}function Of(e){return Sf(e).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cn(e){return`${e.appName}!${e.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ao=new Map;function Co(e,t){const n=Cn(e);So(n,t),Pf(n,t)}function So(e,t){const n=Ao.get(e);if(n)for(const s of n)s(t)}function Pf(e,t){const n=Mf();n&&n.postMessage({key:e,fid:t}),Rf()}let Ge=null;function Mf(){return!Ge&&"BroadcastChannel"in self&&(Ge=new BroadcastChannel("[Firebase] FID Change"),Ge.onmessage=e=>{So(e.data.key,e.data.fid)}),Ge}function Rf(){Ao.size===0&&Ge&&(Ge.close(),Ge=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $f="firebase-installations-database",Bf=1,rt="firebase-installations-store";let Yn=null;function Vs(){return Yn||(Yn=gf($f,Bf,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(rt)}}})),Yn}async function ln(e,t){const n=Cn(e),r=(await Vs()).transaction(rt,"readwrite"),i=r.objectStore(rt),o=await i.get(n);return await i.put(t,n),await r.done,(!o||o.fid!==t.fid)&&Co(e,t.fid),t}async function xo(e){const t=Cn(e),s=(await Vs()).transaction(rt,"readwrite");await s.objectStore(rt).delete(t),await s.done}async function Sn(e,t){const n=Cn(e),r=(await Vs()).transaction(rt,"readwrite"),i=r.objectStore(rt),o=await i.get(n),a=t(o);return a===void 0?await i.delete(n):await i.put(a,n),await r.done,a&&(!o||o.fid!==a.fid)&&Co(e,a.fid),a}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ks(e){let t;const n=await Sn(e.appConfig,s=>{const r=Ff(s),i=Nf(e,r);return t=i.registrationPromise,i.installationEntry});return n.fid===ws?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}function Ff(e){const t=e||{fid:Df(),registrationStatus:0};return Do(t)}function Nf(e,t){if(t.registrationStatus===0){if(!navigator.onLine){const r=Promise.reject(st.create("app-offline"));return{installationEntry:t,registrationPromise:r}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},s=Lf(e,n);return{installationEntry:n,registrationPromise:s}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:kf(e)}:{installationEntry:t}}async function Lf(e,t){try{const n=await Cf(e,t);return ln(e.appConfig,n)}catch(n){throw _o(n)&&n.customData.serverCode===409?await xo(e.appConfig):await ln(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function kf(e){let t=await Vr(e.appConfig);for(;t.registrationStatus===1;)await To(100),t=await Vr(e.appConfig);if(t.registrationStatus===0){const{installationEntry:n,registrationPromise:s}=await Ks(e);return s||n}return t}function Vr(e){return Sn(e,t=>{if(!t)throw st.create("installation-not-found");return Do(t)})}function Do(e){return jf(e)?{fid:e.fid,registrationStatus:0}:e}function jf(e){return e.registrationStatus===1&&e.registrationTime+go<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hf({appConfig:e,heartbeatServiceProvider:t},n){const s=Uf(e,n),r=Ef(e,n),i=t.getImmediate({optional:!0});if(i){const u=await i.getHeartbeatsHeader();u&&r.append("x-firebase-client",u)}const o={installation:{sdkVersion:mo,appId:e.appId}},a={method:"POST",headers:r,body:JSON.stringify(o)},c=await Eo(()=>fetch(s,a));if(c.ok){const u=await c.json();return wo(u)}else throw await Io("Generate Auth Token",c)}function Uf(e,{fid:t}){return`${yo(e)}/${t}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ws(e,t=!1){let n;const s=await Sn(e.appConfig,i=>{if(!Oo(i))throw st.create("not-registered");const o=i.authToken;if(!t&&Kf(o))return i;if(o.requestStatus===1)return n=zf(e,t),i;{if(!navigator.onLine)throw st.create("app-offline");const a=qf(i);return n=Vf(e,a),a}});return n?await n:s.authToken}async function zf(e,t){let n=await Kr(e.appConfig);for(;n.authToken.requestStatus===1;)await To(100),n=await Kr(e.appConfig);const s=n.authToken;return s.requestStatus===0?Ws(e,t):s}function Kr(e){return Sn(e,t=>{if(!Oo(t))throw st.create("not-registered");const n=t.authToken;return Yf(n)?Object.assign(Object.assign({},t),{authToken:{requestStatus:0}}):t})}async function Vf(e,t){try{const n=await Hf(e,t),s=Object.assign(Object.assign({},t),{authToken:n});return await ln(e.appConfig,s),n}catch(n){if(_o(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await xo(e.appConfig);else{const s=Object.assign(Object.assign({},t),{authToken:{requestStatus:0}});await ln(e.appConfig,s)}throw n}}function Oo(e){return e!==void 0&&e.registrationStatus===2}function Kf(e){return e.requestStatus===2&&!Wf(e)}function Wf(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+yf}function qf(e){const t={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},e),{authToken:t})}function Yf(e){return e.requestStatus===1&&e.requestTime+go<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jf(e){const t=e,{installationEntry:n,registrationPromise:s}=await Ks(t);return s?s.catch(console.error):Ws(t).catch(console.error),n.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gf(e,t=!1){const n=e;return await Xf(n),(await Ws(n,t)).token}async function Xf(e){const{registrationPromise:t}=await Ks(e);t&&await t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zf(e){if(!e||!e.options)throw Jn("App Configuration");if(!e.name)throw Jn("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw Jn(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function Jn(e){return st.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Po="installations",Qf="installations-internal",ed=e=>{const t=e.getProvider("app").getImmediate(),n=Zf(t),s=An(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:s,_delete:()=>Promise.resolve()}},td=e=>{const t=e.getProvider("app").getImmediate(),n=An(t,Po).getImmediate();return{getId:()=>Jf(n),getToken:r=>Gf(n,r)}};function nd(){nt(new Le(Po,ed,"PUBLIC")),nt(new Le(Qf,td,"PRIVATE"))}nd();Be(po,zs);Be(po,zs,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const un="analytics",sd="firebase_id",rd="origin",id=60*1e3,od="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",qs="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const se=new io("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ad={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-intialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},ae=new Tn("analytics","Analytics",ad);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cd(e){if(!e.startsWith(qs)){const t=ae.create("invalid-gtag-resource",{gtagURL:e});return se.warn(t.message),""}return e}function Mo(e){return Promise.all(e.map(t=>t.catch(n=>n)))}function ld(e,t){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(e,t)),n}function ud(e,t){const n=ld("firebase-js-sdk-policy",{createScriptURL:cd}),s=document.createElement("script"),r=`${qs}?l=${e}&id=${t}`;s.src=n?n==null?void 0:n.createScriptURL(r):r,s.async=!0,document.head.appendChild(s)}function fd(e){let t=[];return Array.isArray(window[e])?t=window[e]:window[e]=t,t}async function dd(e,t,n,s,r,i){const o=s[r];try{if(o)await t[o];else{const c=(await Mo(n)).find(u=>u.measurementId===r);c&&await t[c.appId]}}catch(a){se.error(a)}e("config",r,i)}async function hd(e,t,n,s,r){try{let i=[];if(r&&r.send_to){let o=r.send_to;Array.isArray(o)||(o=[o]);const a=await Mo(n);for(const c of o){const u=a.find(p=>p.measurementId===c),d=u&&t[u.appId];if(d)i.push(d);else{i=[];break}}}i.length===0&&(i=Object.values(t)),await Promise.all(i),e("event",s,r||{})}catch(i){se.error(i)}}function pd(e,t,n,s){async function r(i,...o){try{if(i==="event"){const[a,c]=o;await hd(e,t,n,a,c)}else if(i==="config"){const[a,c]=o;await dd(e,t,n,s,a,c)}else if(i==="consent"){const[a]=o;e("consent","update",a)}else if(i==="get"){const[a,c,u]=o;e("get",a,c,u)}else if(i==="set"){const[a]=o;e("set",a)}else e(i,...o)}catch(a){se.error(a)}}return r}function gd(e,t,n,s,r){let i=function(...o){window[s].push(arguments)};return window[r]&&typeof window[r]=="function"&&(i=window[r]),window[r]=pd(i,e,t,n),{gtagCore:i,wrappedGtag:window[r]}}function md(e){const t=window.document.getElementsByTagName("script");for(const n of Object.values(t))if(n.src&&n.src.includes(qs)&&n.src.includes(e))return n;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bd=30,_d=1e3;class yd{constructor(t={},n=_d){this.throttleMetadata=t,this.intervalMillis=n}getThrottleMetadata(t){return this.throttleMetadata[t]}setThrottleMetadata(t,n){this.throttleMetadata[t]=n}deleteThrottleMetadata(t){delete this.throttleMetadata[t]}}const Ro=new yd;function wd(e){return new Headers({Accept:"application/json","x-goog-api-key":e})}async function Id(e){var t;const{appId:n,apiKey:s}=e,r={method:"GET",headers:wd(s)},i=od.replace("{app-id}",n),o=await fetch(i,r);if(o.status!==200&&o.status!==304){let a="";try{const c=await o.json();!((t=c.error)===null||t===void 0)&&t.message&&(a=c.error.message)}catch{}throw ae.create("config-fetch-failed",{httpStatus:o.status,responseMessage:a})}return o.json()}async function vd(e,t=Ro,n){const{appId:s,apiKey:r,measurementId:i}=e.options;if(!s)throw ae.create("no-app-id");if(!r){if(i)return{measurementId:i,appId:s};throw ae.create("no-api-key")}const o=t.getThrottleMetadata(s)||{backoffCount:0,throttleEndTimeMillis:Date.now()},a=new Ad;return setTimeout(async()=>{a.abort()},n!==void 0?n:id),$o({appId:s,apiKey:r,measurementId:i},o,a,t)}async function $o(e,{throttleEndTimeMillis:t,backoffCount:n},s,r=Ro){var i;const{appId:o,measurementId:a}=e;try{await Ed(s,t)}catch(c){if(a)return se.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${a} provided in the "measurementId" field in the local Firebase config. [${c==null?void 0:c.message}]`),{appId:o,measurementId:a};throw c}try{const c=await Id(e);return r.deleteThrottleMetadata(o),c}catch(c){const u=c;if(!Td(u)){if(r.deleteThrottleMetadata(o),a)return se.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${a} provided in the "measurementId" field in the local Firebase config. [${u==null?void 0:u.message}]`),{appId:o,measurementId:a};throw c}const d=Number((i=u==null?void 0:u.customData)===null||i===void 0?void 0:i.httpStatus)===503?Rr(n,r.intervalMillis,bd):Rr(n,r.intervalMillis),p={throttleEndTimeMillis:Date.now()+d,backoffCount:n+1};return r.setThrottleMetadata(o,p),se.debug(`Calling attemptFetch again in ${d} millis`),$o(e,p,s,r)}}function Ed(e,t){return new Promise((n,s)=>{const r=Math.max(t-Date.now(),0),i=setTimeout(n,r);e.addEventListener(()=>{clearTimeout(i),s(ae.create("fetch-throttle",{throttleEndTimeMillis:t}))})})}function Td(e){if(!(e instanceof it)||!e.customData)return!1;const t=Number(e.customData.httpStatus);return t===429||t===500||t===503||t===504}class Ad{constructor(){this.listeners=[]}addEventListener(t){this.listeners.push(t)}abort(){this.listeners.forEach(t=>t())}}async function Cd(e,t,n,s,r){if(r&&r.global){e("event",n,s);return}else{const i=await t,o=Object.assign(Object.assign({},s),{send_to:i});e("event",n,o)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sd(){if(no())try{await so()}catch(e){return se.warn(ae.create("indexeddb-unavailable",{errorInfo:e==null?void 0:e.toString()}).message),!1}else return se.warn(ae.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function xd(e,t,n,s,r,i,o){var a;const c=vd(e);c.then(T=>{n[T.measurementId]=T.appId,e.options.measurementId&&T.measurementId!==e.options.measurementId&&se.warn(`The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${T.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(T=>se.error(T)),t.push(c);const u=Sd().then(T=>{if(T)return s.getId()}),[d,p]=await Promise.all([c,u]);md(i)||ud(i,d.measurementId),r("js",new Date);const w=(a=o==null?void 0:o.config)!==null&&a!==void 0?a:{};return w[rd]="firebase",w.update=!0,p!=null&&(w[sd]=p),r("config",d.measurementId,w),d.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dd{constructor(t){this.app=t}_delete(){return delete Ot[this.app.options.appId],Promise.resolve()}}let Ot={},Wr=[];const qr={};let Gn="dataLayer",Od="gtag",Yr,Bo,Jr=!1;function Pd(){const e=[];if(Vl()&&e.push("This is a browser extension environment."),Kl()||e.push("Cookies are not available."),e.length>0){const t=e.map((s,r)=>`(${r+1}) ${s}`).join(" "),n=ae.create("invalid-analytics-context",{errorInfo:t});se.warn(n.message)}}function Md(e,t,n){Pd();const s=e.options.appId;if(!s)throw ae.create("no-app-id");if(!e.options.apiKey)if(e.options.measurementId)se.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw ae.create("no-api-key");if(Ot[s]!=null)throw ae.create("already-exists",{id:s});if(!Jr){fd(Gn);const{wrappedGtag:i,gtagCore:o}=gd(Ot,Wr,qr,Gn,Od);Bo=i,Yr=o,Jr=!0}return Ot[s]=xd(e,Wr,qr,t,Yr,Gn,n),new Dd(e)}function Rd(e=Yu()){e=ro(e);const t=An(e,un);return t.isInitialized()?t.getImmediate():$d(e)}function $d(e,t={}){const n=An(e,un);if(n.isInitialized()){const r=n.getImmediate();if(an(t,n.getOptions()))return r;throw ae.create("already-initialized")}return n.initialize({options:t})}function Fo(e,t,n,s){e=ro(e),Cd(Bo,Ot[e.app.options.appId],t,n,s).catch(r=>se.error(r))}const Gr="@firebase/analytics",Xr="0.10.0";function Bd(){nt(new Le(un,(t,{options:n})=>{const s=t.getProvider("app").getImmediate(),r=t.getProvider("installations-internal").getImmediate();return Md(s,r,n)},"PUBLIC")),nt(new Le("analytics-internal",e,"PRIVATE")),Be(Gr,Xr),Be(Gr,Xr,"esm2017");function e(t){try{const n=t.getProvider(un).getImmediate();return{logEvent:(s,r,i)=>Fo(n,s,r,i)}}catch(n){throw ae.create("interop-component-reg-failed",{reason:n})}}}Bd();const Fd={apiKey:"AIzaSyC697caFxgZ-NFlqXoZLyUVl3VxdG_Pxqk",authDomain:"beatsaber-bookmark-to-playlist.firebaseapp.com",projectId:"beatsaber-bookmark-to-playlist",storageBucket:"beatsaber-bookmark-to-playlist.appspot.com",messagingSenderId:"157912179417",appId:"1:157912179417:web:7e4d93b640095c4ef014c8",measurementId:"G-NJKQ5WTXQ1"},Nd=co(Fd),Ld=Rd(Nd),kd=(e,t)=>{Fo(Ld,e,t)},No=e=>(Di("data-v-47a878a9"),e=e(),Oi(),e),jd={class:"wrapper"},Hd=No(()=>P("h3",null,"BeastSaber username",-1)),Ud=No(()=>P("h3",null,"Playlist size",-1)),zd={key:0,class:"playlist-size"},Vd={key:1,class:"playlist-size"},Kd=["value"],Wd=["disabled"],qd={class:"playlists"},Zr="bsaber-username",Qr="bsaber-playlist-size",Yd=yn({__name:"Form",setup(e){const t=[0,10,25,50,100,250],n=window.localStorage.getItem(Zr)||"",s=Number(window.localStorage.getItem(Qr))??0,r=Ye(n),i=Ye(isNaN(s)?0:s),o=Ye(!t.includes(i.value)),a=Ye([]),c=async()=>{const u={title:Ji(r.value),size:i.value,playlist:null};a.value.push(u),ml(r.value,i.value||void 0).then(d=>{u.playlist=d,a.value=[...a.value]}).catch(d=>{console.error(d),Yi(u.title,[])}),window.localStorage.setItem(Zr,r.value),window.localStorage.setItem(Qr,i.value.toString()),kd("generate_playlist",{username:r.value})};return(u,d)=>(oe(),Ie("div",jd,[P("div",null,[Hd,za(P("input",{name:"username",type:"text",placeholder:"BeastSaber username","onUpdate:modelValue":d[0]||(d[0]=p=>r.value=p),autofocus:""},null,512),[[sl,r.value]])]),P("div",null,[Ud,o.value?(oe(),Ie("div",Vd,[P("input",{name:"playlistSize",onInput:d[8]||(d[8]=p=>i.value=p.target.valueAsNumber),type:"number",placeholder:"Playlist size",value:i.value,autofocus:""},null,40,Kd)])):(oe(),Ie("div",zd,[P("button",{class:Ae({"btn--selected":i.value===0}),onClick:d[1]||(d[1]=()=>i.value=0)}," All ",2),P("button",{class:Ae({"btn--selected":i.value===10}),onClick:d[2]||(d[2]=()=>i.value=10)}," 10 ",2),P("button",{class:Ae({"btn--selected":i.value===25}),onClick:d[3]||(d[3]=()=>i.value=25)}," 25 ",2),P("button",{class:Ae({"btn--selected":i.value===50}),onClick:d[4]||(d[4]=()=>i.value=50)}," 50 ",2),P("button",{class:Ae({"btn--selected":i.value===100}),onClick:d[5]||(d[5]=()=>i.value=100)}," 100 ",2),P("button",{class:Ae({"btn--selected":i.value===250}),onClick:d[6]||(d[6]=()=>i.value=250)}," 250 ",2),P("button",{onClick:d[7]||(d[7]=()=>o.value=!0)},"Custom")]))]),P("button",{onClick:c,disabled:!r.value},"Create playlist",8,Wd),P("div",qd,[(oe(!0),Ie(ce,null,tc(a.value,p=>(oe(),Ie(ce,null,[p.playlist?on("",!0):(oe(),ls(Dl,{key:0,"playlist-size":p.size,title:p.title},null,8,["playlist-size","title"])),p.playlist?(oe(),ls(Rl,{key:1,playlist:p.playlist},null,8,["playlist"])):on("",!0)],64))),256))])]))}});const Jd=js(Yd,[["__scopeId","data-v-47a878a9"]]),Gd=P("header",{class:"header"},[P("a",{href:"https://github.com/lorgan3/beatsaber-bookmark-to-playlist"},[P("h1",null,"Beat Saber bookmark to playlist converter")])],-1),Xd=P("section",{class:"instructions"},[P("h3",null,"Instructions"),P("p",null," Use this tool to convert your bookmarks to a playlist. When done you can click the thumbnail to download and use it like a normal playlist. "),P("p",null,[Qt(" Copy the "),P("pre",null,"`bpList`"),Qt(" file to "),P("pre",null,"`ModData\\com.beatgames.beatsaber\\Mods\\PlaylistManager\\Playlists`"),Qt(' on your quest, start Beat Saber, go this playlist and click the "Download missing songs" button on the right. ')])],-1),Zd=yn({__name:"App",setup(e){return(t,n)=>(oe(),Ie(ce,null,[Gd,ve(Jd),Xd],64))}});ol(Zd).mount("#app");
