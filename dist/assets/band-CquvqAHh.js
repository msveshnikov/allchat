import{i as w}from"./init-Dmth1JHB.js";import{o as I}from"./ordinal-DILIJJjt.js";function O(n,u,o){n=+n,u=+u,o=(e=arguments.length)<2?(u=n,n=0,1):e<3?1:+o;for(var t=-1,e=Math.max(0,Math.ceil((u-n)/o))|0,a=new Array(e);++t<e;)a[t]=n+t*o;return a}function s(){var n=I().unknown(void 0),u=n.domain,o=n.range,t=0,e=1,a,p,g=!1,d=0,m=0,h=.5;delete n.unknown;function i(){var r=u().length,l=e<t,f=l?e:t,c=l?t:e;a=(c-f)/Math.max(1,r-d+m*2),g&&(a=Math.floor(a)),f+=(c-f-a*(r-d))*h,p=a*(1-d),g&&(f=Math.round(f),p=Math.round(p));var M=O(r).map(function(y){return f+a*y});return o(l?M.reverse():M)}return n.domain=function(r){return arguments.length?(u(r),i()):u()},n.range=function(r){return arguments.length?([t,e]=r,t=+t,e=+e,i()):[t,e]},n.rangeRound=function(r){return[t,e]=r,t=+t,e=+e,g=!0,i()},n.bandwidth=function(){return p},n.step=function(){return a},n.round=function(r){return arguments.length?(g=!!r,i()):g},n.padding=function(r){return arguments.length?(d=Math.min(1,m=+r),i()):d},n.paddingInner=function(r){return arguments.length?(d=Math.min(1,r),i()):d},n.paddingOuter=function(r){return arguments.length?(m=+r,i()):m},n.align=function(r){return arguments.length?(h=Math.max(0,Math.min(1,r)),i()):h},n.copy=function(){return s(u(),[t,e]).round(g).paddingInner(d).paddingOuter(m).align(h)},w.apply(i(),arguments)}function v(n){var u=n.copy;return n.padding=n.paddingOuter,delete n.paddingInner,delete n.paddingOuter,n.copy=function(){return v(u())},n}function R(){return v(s.apply(null,arguments).paddingInner(1))}export{s as b,R as p};
