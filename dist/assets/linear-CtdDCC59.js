import{x as un,y as q,z as U,A as Y,B as fn}from"./string-DQ6ad1hy.js";import{i as cn}from"./init-Dmth1JHB.js";function F(n,t){return n==null||t==null?NaN:n<t?-1:n>t?1:n>=t?0:NaN}function sn(n,t){return n==null||t==null?NaN:t<n?-1:t>n?1:t>=n?0:NaN}function _(n){let t,e,r;n.length!==2?(t=F,e=(u,c)=>F(n(u),c),r=(u,c)=>n(u)-c):(t=n===F||n===sn?n:hn,e=n,r=n);function i(u,c,o=0,m=u.length){if(o<m){if(t(c,c)!==0)return m;do{const s=o+m>>>1;e(u[s],c)<0?o=s+1:m=s}while(o<m)}return o}function f(u,c,o=0,m=u.length){if(o<m){if(t(c,c)!==0)return m;do{const s=o+m>>>1;e(u[s],c)<=0?o=s+1:m=s}while(o<m)}return o}function a(u,c,o=0,m=u.length){const s=i(u,c,o,m-1);return s>o&&r(u[s-1],c)>-r(u[s],c)?s-1:s}return{left:i,center:a,right:f}}function hn(){return 0}function ln(n){return n===null?NaN:+n}function*Kn(n,t){for(let e of n)e!=null&&(e=+e)>=e&&(yield e)}const mn=_(F),dn=mn.right;_(ln).center;const gn=Math.sqrt(50),yn=Math.sqrt(10),Mn=Math.sqrt(2);function R(n,t,e){const r=(t-n)/Math.max(0,e),i=Math.floor(Math.log10(r)),f=r/Math.pow(10,i),a=f>=gn?10:f>=yn?5:f>=Mn?2:1;let u,c,o;return i<0?(o=Math.pow(10,-i)/a,u=Math.round(n*o),c=Math.round(t*o),u/o<n&&++u,c/o>t&&--c,o=-o):(o=Math.pow(10,i)*a,u=Math.round(n/o),c=Math.round(t/o),u*o<n&&++u,c*o>t&&--c),c<u&&.5<=e&&e<2?R(n,t,e*2):[u,c,o]}function pn(n,t,e){if(t=+t,n=+n,e=+e,!(e>0))return[];if(n===t)return[n];const r=t<n,[i,f,a]=r?R(t,n,e):R(n,t,e);if(!(f>=i))return[];const u=f-i+1,c=new Array(u);if(r)if(a<0)for(let o=0;o<u;++o)c[o]=(f-o)/-a;else for(let o=0;o<u;++o)c[o]=(f-o)*a;else if(a<0)for(let o=0;o<u;++o)c[o]=(i+o)/-a;else for(let o=0;o<u;++o)c[o]=(i+o)*a;return c}function I(n,t,e){return t=+t,n=+n,e=+e,R(n,t,e)[2]}function wn(n,t,e){t=+t,n=+n,e=+e;const r=t<n,i=r?I(t,n,e):I(n,t,e);return(r?-1:1)*(i<0?1/-i:i)}function Nn(n,t){t||(t=[]);var e=n?Math.min(t.length,n.length):0,r=t.slice(),i;return function(f){for(i=0;i<e;++i)r[i]=n[i]*(1-f)+t[i]*f;return r}}function kn(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function xn(n,t){var e=t?t.length:0,r=n?Math.min(e,n.length):0,i=new Array(r),f=new Array(e),a;for(a=0;a<r;++a)i[a]=B(n[a],t[a]);for(;a<e;++a)f[a]=t[a];return function(u){for(a=0;a<r;++a)f[a]=i[a](u);return f}}function An(n,t){var e=new Date;return n=+n,t=+t,function(r){return e.setTime(n*(1-r)+t*r),e}}function vn(n,t){var e={},r={},i;(n===null||typeof n!="object")&&(n={}),(t===null||typeof t!="object")&&(t={});for(i in t)i in n?e[i]=B(n[i],t[i]):r[i]=t[i];return function(f){for(i in e)r[i]=e[i](f);return r}}function B(n,t){var e=typeof t,r;return t==null||e==="boolean"?un(t):(e==="number"?q:e==="string"?(r=U(t))?(t=r,Y):fn:t instanceof U?Y:t instanceof Date?An:kn(t)?Nn:Array.isArray(t)?xn:typeof t.valueOf!="function"&&typeof t.toString!="function"||isNaN(t)?vn:q)(n,t)}function Sn(n,t){return n=+n,t=+t,function(e){return Math.round(n*(1-e)+t*e)}}function bn(n){return function(){return n}}function jn(n){return+n}var Z=[0,1];function A(n){return n}function L(n,t){return(t-=n=+n)?function(e){return(e-n)/t}:bn(isNaN(t)?NaN:.5)}function zn(n,t){var e;return n>t&&(e=n,n=t,t=e),function(r){return Math.max(n,Math.min(t,r))}}function Pn(n,t,e){var r=n[0],i=n[1],f=t[0],a=t[1];return i<r?(r=L(i,r),f=e(a,f)):(r=L(r,i),f=e(f,a)),function(u){return f(r(u))}}function $n(n,t,e){var r=Math.min(n.length,t.length)-1,i=new Array(r),f=new Array(r),a=-1;for(n[r]<n[0]&&(n=n.slice().reverse(),t=t.slice().reverse());++a<r;)i[a]=L(n[a],n[a+1]),f[a]=e(t[a],t[a+1]);return function(u){var c=dn(n,u,1,r)-1;return f[c](i[c](u))}}function Fn(n,t){return t.domain(n.domain()).range(n.range()).interpolate(n.interpolate()).clamp(n.clamp()).unknown(n.unknown())}function Rn(){var n=Z,t=Z,e=B,r,i,f,a=A,u,c,o;function m(){var l=Math.min(n.length,t.length);return a!==A&&(a=zn(n[0],n[l-1])),u=l>2?$n:Pn,c=o=null,s}function s(l){return l==null||isNaN(l=+l)?f:(c||(c=u(n.map(r),t,e)))(r(a(l)))}return s.invert=function(l){return a(i((o||(o=u(t,n.map(r),q)))(l)))},s.domain=function(l){return arguments.length?(n=Array.from(l,jn),m()):n.slice()},s.range=function(l){return arguments.length?(t=Array.from(l),m()):t.slice()},s.rangeRound=function(l){return t=Array.from(l),e=Sn,m()},s.clamp=function(l){return arguments.length?(a=l?!0:A,m()):a!==A},s.interpolate=function(l){return arguments.length?(e=l,m()):e},s.unknown=function(l){return arguments.length?(f=l,s):f},function(l,p){return r=l,i=p,m()}}function En(){return Rn()(A,A)}function Dn(n){return Math.abs(n=Math.round(n))>=1e21?n.toLocaleString("en").replace(/,/g,""):n.toString(10)}function E(n,t){if((e=(n=t?n.toExponential(t-1):n.toExponential()).indexOf("e"))<0)return null;var e,r=n.slice(0,e);return[r.length>1?r[0]+r.slice(2):r,+n.slice(e+1)]}function v(n){return n=E(Math.abs(n)),n?n[1]:NaN}function Tn(n,t){return function(e,r){for(var i=e.length,f=[],a=0,u=n[0],c=0;i>0&&u>0&&(c+u+1>r&&(u=Math.max(1,r-c)),f.push(e.substring(i-=u,i+u)),!((c+=u+1)>r));)u=n[a=(a+1)%n.length];return f.reverse().join(t)}}function qn(n){return function(t){return t.replace(/[0-9]/g,function(e){return n[+e]})}}var In=/^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;function D(n){if(!(t=In.exec(n)))throw new Error("invalid format: "+n);var t;return new C({fill:t[1],align:t[2],sign:t[3],symbol:t[4],zero:t[5],width:t[6],comma:t[7],precision:t[8]&&t[8].slice(1),trim:t[9],type:t[10]})}D.prototype=C.prototype;function C(n){this.fill=n.fill===void 0?" ":n.fill+"",this.align=n.align===void 0?">":n.align+"",this.sign=n.sign===void 0?"-":n.sign+"",this.symbol=n.symbol===void 0?"":n.symbol+"",this.zero=!!n.zero,this.width=n.width===void 0?void 0:+n.width,this.comma=!!n.comma,this.precision=n.precision===void 0?void 0:+n.precision,this.trim=!!n.trim,this.type=n.type===void 0?"":n.type+""}C.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?"0":"")+(this.width===void 0?"":Math.max(1,this.width|0))+(this.comma?",":"")+(this.precision===void 0?"":"."+Math.max(0,this.precision|0))+(this.trim?"~":"")+this.type};function Ln(n){n:for(var t=n.length,e=1,r=-1,i;e<t;++e)switch(n[e]){case".":r=i=e;break;case"0":r===0&&(r=e),i=e;break;default:if(!+n[e])break n;r>0&&(r=0);break}return r>0?n.slice(0,r)+n.slice(i+1):n}var nn;function Bn(n,t){var e=E(n,t);if(!e)return n+"";var r=e[0],i=e[1],f=i-(nn=Math.max(-8,Math.min(8,Math.floor(i/3)))*3)+1,a=r.length;return f===a?r:f>a?r+new Array(f-a+1).join("0"):f>0?r.slice(0,f)+"."+r.slice(f):"0."+new Array(1-f).join("0")+E(n,Math.max(0,t+f-1))[0]}function H(n,t){var e=E(n,t);if(!e)return n+"";var r=e[0],i=e[1];return i<0?"0."+new Array(-i).join("0")+r:r.length>i+1?r.slice(0,i+1)+"."+r.slice(i+1):r+new Array(i-r.length+2).join("0")}const J={"%":(n,t)=>(n*100).toFixed(t),b:n=>Math.round(n).toString(2),c:n=>n+"",d:Dn,e:(n,t)=>n.toExponential(t),f:(n,t)=>n.toFixed(t),g:(n,t)=>n.toPrecision(t),o:n=>Math.round(n).toString(8),p:(n,t)=>H(n*100,t),r:H,s:Bn,X:n=>Math.round(n).toString(16).toUpperCase(),x:n=>Math.round(n).toString(16)};function K(n){return n}var Q=Array.prototype.map,W=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];function Cn(n){var t=n.grouping===void 0||n.thousands===void 0?K:Tn(Q.call(n.grouping,Number),n.thousands+""),e=n.currency===void 0?"":n.currency[0]+"",r=n.currency===void 0?"":n.currency[1]+"",i=n.decimal===void 0?".":n.decimal+"",f=n.numerals===void 0?K:qn(Q.call(n.numerals,String)),a=n.percent===void 0?"%":n.percent+"",u=n.minus===void 0?"−":n.minus+"",c=n.nan===void 0?"NaN":n.nan+"";function o(s){s=D(s);var l=s.fill,p=s.align,y=s.sign,S=s.symbol,k=s.zero,b=s.width,T=s.comma,w=s.precision,G=s.trim,d=s.type;d==="n"?(T=!0,d="g"):J[d]||(w===void 0&&(w=12),G=!0,d="g"),(k||l==="0"&&p==="=")&&(k=!0,l="0",p="=");var en=S==="$"?e:S==="#"&&/[boxX]/.test(d)?"0"+d.toLowerCase():"",on=S==="$"?r:/[%p]/.test(d)?a:"",O=J[d],an=/[defgprs%]/.test(d);w=w===void 0?6:/[gprs]/.test(d)?Math.max(1,Math.min(21,w)):Math.max(0,Math.min(20,w));function V(h){var N=en,g=on,x,X,j;if(d==="c")g=O(h)+g,h="";else{h=+h;var z=h<0||1/h<0;if(h=isNaN(h)?c:O(Math.abs(h),w),G&&(h=Ln(h)),z&&+h==0&&y!=="+"&&(z=!1),N=(z?y==="("?y:u:y==="-"||y==="("?"":y)+N,g=(d==="s"?W[8+nn/3]:"")+g+(z&&y==="("?")":""),an){for(x=-1,X=h.length;++x<X;)if(j=h.charCodeAt(x),48>j||j>57){g=(j===46?i+h.slice(x+1):h.slice(x))+g,h=h.slice(0,x);break}}}T&&!k&&(h=t(h,1/0));var P=N.length+h.length+g.length,M=P<b?new Array(b-P+1).join(l):"";switch(T&&k&&(h=t(M+h,M.length?b-g.length:1/0),M=""),p){case"<":h=N+h+g+M;break;case"=":h=N+M+h+g;break;case"^":h=M.slice(0,P=M.length>>1)+N+h+g+M.slice(P);break;default:h=M+N+h+g;break}return f(h)}return V.toString=function(){return s+""},V}function m(s,l){var p=o((s=D(s),s.type="f",s)),y=Math.max(-8,Math.min(8,Math.floor(v(l)/3)))*3,S=Math.pow(10,-y),k=W[8+y/3];return function(b){return p(S*b)+k}}return{format:o,formatPrefix:m}}var $,tn,rn;Gn({thousands:",",grouping:[3],currency:["$",""]});function Gn(n){return $=Cn(n),tn=$.format,rn=$.formatPrefix,$}function On(n){return Math.max(0,-v(Math.abs(n)))}function Vn(n,t){return Math.max(0,Math.max(-8,Math.min(8,Math.floor(v(t)/3)))*3-v(Math.abs(n)))}function Xn(n,t){return n=Math.abs(n),t=Math.abs(t)-n,Math.max(0,v(t)-v(n))+1}function Un(n,t,e,r){var i=wn(n,t,e),f;switch(r=D(r??",f"),r.type){case"s":{var a=Math.max(Math.abs(n),Math.abs(t));return r.precision==null&&!isNaN(f=Vn(i,a))&&(r.precision=f),rn(r,a)}case"":case"e":case"g":case"p":case"r":{r.precision==null&&!isNaN(f=Xn(i,Math.max(Math.abs(n),Math.abs(t))))&&(r.precision=f-(r.type==="e"));break}case"f":case"%":{r.precision==null&&!isNaN(f=On(i))&&(r.precision=f-(r.type==="%")*2);break}}return tn(r)}function Yn(n){var t=n.domain;return n.ticks=function(e){var r=t();return pn(r[0],r[r.length-1],e??10)},n.tickFormat=function(e,r){var i=t();return Un(i[0],i[i.length-1],e??10,r)},n.nice=function(e){e==null&&(e=10);var r=t(),i=0,f=r.length-1,a=r[i],u=r[f],c,o,m=10;for(u<a&&(o=a,a=u,u=o,o=i,i=f,f=o);m-- >0;){if(o=I(a,u,e),o===c)return r[i]=a,r[f]=u,t(r);if(o>0)a=Math.floor(a/o)*o,u=Math.ceil(u/o)*o;else if(o<0)a=Math.ceil(a*o)/o,u=Math.floor(u*o)/o;else break;c=o}return n},n}function Zn(){var n=En();return n.copy=function(){return Fn(n,Zn())},cn.apply(n,arguments),Yn(n)}export{Fn as a,_ as b,En as c,F as d,Kn as e,jn as f,Yn as g,pn as h,B as i,D as j,tn as k,Zn as l,Rn as m,ln as n,A as o,dn as p,Sn as q,Un as r,wn as t};
