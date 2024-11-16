import{_ as o,g as lt,s as vt,ar as j,l as _t,c as We,f as Ve,a as ze,u as Oe,j as Pe,i as Ne,o as Re,p as Be,k as He,m as Ge,q as qe}from"./Artifact-BE2yZU04.js";import{c as Bt,g as Ht}from"./index-ChpSMm3l.js";import{t as Xe,m as je,a as Ue,b as ee,c as re,d as Ze,e as Ke,f as Qe,g as Je,h as $e,i as tr,j as er,k as ne,l as ie,n as ae,s as se,o as ce}from"./time-DwDWuYLK.js";import{l as rr}from"./linear-CtdDCC59.js";import{R as fe,r as nr,o as he,q as me,C as ke,u as At,v as ir}from"./string-DQ6ad1hy.js";import"./init-Dmth1JHB.js";const ar=Math.PI/180,sr=180/Math.PI,Dt=18,ye=.96422,ge=1,pe=.82521,ve=4/29,ut=6/29,be=3*ut*ut,cr=ut*ut*ut;function xe(t){if(t instanceof $)return new $(t.l,t.a,t.b,t.opacity);if(t instanceof rt)return Te(t);t instanceof fe||(t=nr(t));var e=Yt(t.r),r=Yt(t.g),n=Yt(t.b),i=It((.2225045*e+.7168786*r+.0606169*n)/ge),f,d;return e===r&&r===n?f=d=i:(f=It((.4360747*e+.3850649*r+.1430804*n)/ye),d=It((.0139322*e+.0971045*r+.7141733*n)/pe)),new $(116*i-16,500*(f-i),200*(i-d),t.opacity)}function or(t,e,r,n){return arguments.length===1?xe(t):new $(t,e,r,n??1)}function $(t,e,r,n){this.l=+t,this.a=+e,this.b=+r,this.opacity=+n}he($,or,me(ke,{brighter(t){return new $(this.l+Dt*(t??1),this.a,this.b,this.opacity)},darker(t){return new $(this.l-Dt*(t??1),this.a,this.b,this.opacity)},rgb(){var t=(this.l+16)/116,e=isNaN(this.a)?t:t+this.a/500,r=isNaN(this.b)?t:t-this.b/200;return e=ye*Lt(e),t=ge*Lt(t),r=pe*Lt(r),new fe(Ft(3.1338561*e-1.6168667*t-.4906146*r),Ft(-.9787684*e+1.9161415*t+.033454*r),Ft(.0719453*e-.2289914*t+1.4052427*r),this.opacity)}}));function It(t){return t>cr?Math.pow(t,1/3):t/be+ve}function Lt(t){return t>ut?t*t*t:be*(t-ve)}function Ft(t){return 255*(t<=.0031308?12.92*t:1.055*Math.pow(t,1/2.4)-.055)}function Yt(t){return(t/=255)<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)}function lr(t){if(t instanceof rt)return new rt(t.h,t.c,t.l,t.opacity);if(t instanceof $||(t=xe(t)),t.a===0&&t.b===0)return new rt(NaN,0<t.l&&t.l<100?0:NaN,t.l,t.opacity);var e=Math.atan2(t.b,t.a)*sr;return new rt(e<0?e+360:e,Math.sqrt(t.a*t.a+t.b*t.b),t.l,t.opacity)}function Vt(t,e,r,n){return arguments.length===1?lr(t):new rt(t,e,r,n??1)}function rt(t,e,r,n){this.h=+t,this.c=+e,this.l=+r,this.opacity=+n}function Te(t){if(isNaN(t.h))return new $(t.l,0,0,t.opacity);var e=t.h*ar;return new $(t.l,Math.cos(e)*t.c,Math.sin(e)*t.c,t.opacity)}he(rt,Vt,me(ke,{brighter(t){return new rt(this.h,this.c,this.l+Dt*(t??1),this.opacity)},darker(t){return new rt(this.h,this.c,this.l-Dt*(t??1),this.opacity)},rgb(){return Te(this).rgb()}}));function ur(t){return function(e,r){var n=t((e=Vt(e)).h,(r=Vt(r)).h),i=At(e.c,r.c),f=At(e.l,r.l),d=At(e.opacity,r.opacity);return function(v){return e.h=n(v),e.c=i(v),e.l=f(v),e.opacity=d(v),e+""}}}const dr=ur(ir);function fr(t){return t}var xt=1,Wt=2,zt=3,bt=4,oe=1e-6;function hr(t){return"translate("+t+",0)"}function mr(t){return"translate(0,"+t+")"}function kr(t){return e=>+t(e)}function yr(t,e){return e=Math.max(0,t.bandwidth()-e*2)/2,t.round()&&(e=Math.round(e)),r=>+t(r)+e}function gr(){return!this.__axis}function we(t,e){var r=[],n=null,i=null,f=6,d=6,v=3,A=typeof window<"u"&&window.devicePixelRatio>1?0:.5,p=t===xt||t===bt?-1:1,S=t===bt||t===Wt?"x":"y",M=t===xt||t===zt?hr:mr;function C(T){var H=n??(e.ticks?e.ticks.apply(e,r):e.domain()),m=i??(e.tickFormat?e.tickFormat.apply(e,r):fr),E=Math.max(f,0)+v,F=e.range(),I=+F[0]+A,P=+F[F.length-1]+A,N=(e.bandwidth?yr:kr)(e.copy(),A),X=T.selection?T.selection():T,R=X.selectAll(".domain").data([null]),V=X.selectAll(".tick").data(H,e).order(),g=V.exit(),w=V.enter().append("g").attr("class","tick"),x=V.select("line"),b=V.select("text");R=R.merge(R.enter().insert("path",".tick").attr("class","domain").attr("stroke","currentColor")),V=V.merge(w),x=x.merge(w.append("line").attr("stroke","currentColor").attr(S+"2",p*f)),b=b.merge(w.append("text").attr("fill","currentColor").attr(S,p*E).attr("dy",t===xt?"0em":t===zt?"0.71em":"0.32em")),T!==X&&(R=R.transition(T),V=V.transition(T),x=x.transition(T),b=b.transition(T),g=g.transition(T).attr("opacity",oe).attr("transform",function(k){return isFinite(k=N(k))?M(k+A):this.getAttribute("transform")}),w.attr("opacity",oe).attr("transform",function(k){var D=this.parentNode.__axis;return M((D&&isFinite(D=D(k))?D:N(k))+A)})),g.remove(),R.attr("d",t===bt||t===Wt?d?"M"+p*d+","+I+"H"+A+"V"+P+"H"+p*d:"M"+A+","+I+"V"+P:d?"M"+I+","+p*d+"V"+A+"H"+P+"V"+p*d:"M"+I+","+A+"H"+P),V.attr("opacity",1).attr("transform",function(k){return M(N(k)+A)}),x.attr(S+"2",p*f),b.attr(S,p*E).text(m),X.filter(gr).attr("fill","none").attr("font-size",10).attr("font-family","sans-serif").attr("text-anchor",t===Wt?"start":t===bt?"end":"middle"),X.each(function(){this.__axis=N})}return C.scale=function(T){return arguments.length?(e=T,C):e},C.ticks=function(){return r=Array.from(arguments),C},C.tickArguments=function(T){return arguments.length?(r=T==null?[]:Array.from(T),C):r.slice()},C.tickValues=function(T){return arguments.length?(n=T==null?null:Array.from(T),C):n&&n.slice()},C.tickFormat=function(T){return arguments.length?(i=T,C):i},C.tickSize=function(T){return arguments.length?(f=d=+T,C):f},C.tickSizeInner=function(T){return arguments.length?(f=+T,C):f},C.tickSizeOuter=function(T){return arguments.length?(d=+T,C):d},C.tickPadding=function(T){return arguments.length?(v=+T,C):v},C.offset=function(T){return arguments.length?(A=+T,C):A},C}function pr(t){return we(xt,t)}function vr(t){return we(zt,t)}var _e={exports:{}};(function(t,e){(function(r,n){t.exports=n()})(Bt,function(){var r="day";return function(n,i,f){var d=function(p){return p.add(4-p.isoWeekday(),r)},v=i.prototype;v.isoWeekYear=function(){return d(this).year()},v.isoWeek=function(p){if(!this.$utils().u(p))return this.add(7*(p-this.isoWeek()),r);var S,M,C,T,H=d(this),m=(S=this.isoWeekYear(),M=this.$u,C=(M?f.utc:f)().year(S).startOf("year"),T=4-C.isoWeekday(),C.isoWeekday()>4&&(T+=7),C.add(T,r));return H.diff(m,"week")+1},v.isoWeekday=function(p){return this.$utils().u(p)?this.day()||7:this.day(this.day()%7?p:p-7)};var A=v.startOf;v.startOf=function(p,S){var M=this.$utils(),C=!!M.u(S)||S;return M.p(p)==="isoweek"?C?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):A.bind(this)(p,S)}}})})(_e);var br=_e.exports;const xr=Ht(br);var De={exports:{}};(function(t,e){(function(r,n){t.exports=n()})(Bt,function(){var r={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},n=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,i=/\d\d/,f=/\d\d?/,d=/\d*[^-_:/,()\s\d]+/,v={},A=function(m){return(m=+m)+(m>68?1900:2e3)},p=function(m){return function(E){this[m]=+E}},S=[/[+-]\d\d:?(\d\d)?|Z/,function(m){(this.zone||(this.zone={})).offset=function(E){if(!E||E==="Z")return 0;var F=E.match(/([+-]|\d\d)/g),I=60*F[1]+(+F[2]||0);return I===0?0:F[0]==="+"?-I:I}(m)}],M=function(m){var E=v[m];return E&&(E.indexOf?E:E.s.concat(E.f))},C=function(m,E){var F,I=v.meridiem;if(I){for(var P=1;P<=24;P+=1)if(m.indexOf(I(P,0,E))>-1){F=P>12;break}}else F=m===(E?"pm":"PM");return F},T={A:[d,function(m){this.afternoon=C(m,!1)}],a:[d,function(m){this.afternoon=C(m,!0)}],S:[/\d/,function(m){this.milliseconds=100*+m}],SS:[i,function(m){this.milliseconds=10*+m}],SSS:[/\d{3}/,function(m){this.milliseconds=+m}],s:[f,p("seconds")],ss:[f,p("seconds")],m:[f,p("minutes")],mm:[f,p("minutes")],H:[f,p("hours")],h:[f,p("hours")],HH:[f,p("hours")],hh:[f,p("hours")],D:[f,p("day")],DD:[i,p("day")],Do:[d,function(m){var E=v.ordinal,F=m.match(/\d+/);if(this.day=F[0],E)for(var I=1;I<=31;I+=1)E(I).replace(/\[|\]/g,"")===m&&(this.day=I)}],M:[f,p("month")],MM:[i,p("month")],MMM:[d,function(m){var E=M("months"),F=(M("monthsShort")||E.map(function(I){return I.slice(0,3)})).indexOf(m)+1;if(F<1)throw new Error;this.month=F%12||F}],MMMM:[d,function(m){var E=M("months").indexOf(m)+1;if(E<1)throw new Error;this.month=E%12||E}],Y:[/[+-]?\d+/,p("year")],YY:[i,function(m){this.year=A(m)}],YYYY:[/\d{4}/,p("year")],Z:S,ZZ:S};function H(m){var E,F;E=m,F=v&&v.formats;for(var I=(m=E.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,function(w,x,b){var k=b&&b.toUpperCase();return x||F[b]||r[b]||F[k].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,function(D,c,u){return c||u.slice(1)})})).match(n),P=I.length,N=0;N<P;N+=1){var X=I[N],R=T[X],V=R&&R[0],g=R&&R[1];I[N]=g?{regex:V,parser:g}:X.replace(/^\[|\]$/g,"")}return function(w){for(var x={},b=0,k=0;b<P;b+=1){var D=I[b];if(typeof D=="string")k+=D.length;else{var c=D.regex,u=D.parser,y=w.slice(k),h=c.exec(y)[0];u.call(x,h),w=w.replace(h,"")}}return function(_){var a=_.afternoon;if(a!==void 0){var l=_.hours;a?l<12&&(_.hours+=12):l===12&&(_.hours=0),delete _.afternoon}}(x),x}}return function(m,E,F){F.p.customParseFormat=!0,m&&m.parseTwoDigitYear&&(A=m.parseTwoDigitYear);var I=E.prototype,P=I.parse;I.parse=function(N){var X=N.date,R=N.utc,V=N.args;this.$u=R;var g=V[1];if(typeof g=="string"){var w=V[2]===!0,x=V[3]===!0,b=w||x,k=V[2];x&&(k=V[2]),v=this.$locale(),!w&&k&&(v=F.Ls[k]),this.$d=function(y,h,_){try{if(["x","X"].indexOf(h)>-1)return new Date((h==="X"?1e3:1)*y);var a=H(h)(y),l=a.year,s=a.month,W=a.day,L=a.hours,Y=a.minutes,G=a.seconds,z=a.milliseconds,O=a.zone,U=new Date,nt=W||(l||s?1:U.getDate()),it=l||U.getFullYear(),st=0;l&&!s||(st=s>0?s-1:U.getMonth());var ht=L||0,ct=Y||0,q=G||0,Q=z||0;return O?new Date(Date.UTC(it,st,nt,ht,ct,q,Q+60*O.offset*1e3)):_?new Date(Date.UTC(it,st,nt,ht,ct,q,Q)):new Date(it,st,nt,ht,ct,q,Q)}catch{return new Date("")}}(X,g,R),this.init(),k&&k!==!0&&(this.$L=this.locale(k).$L),b&&X!=this.format(g)&&(this.$d=new Date("")),v={}}else if(g instanceof Array)for(var D=g.length,c=1;c<=D;c+=1){V[1]=g[c-1];var u=F.apply(this,V);if(u.isValid()){this.$d=u.$d,this.$L=u.$L,this.init();break}c===D&&(this.$d=new Date(""))}else P.call(this,N)}}})})(De);var Tr=De.exports;const wr=Ht(Tr);var Ce={exports:{}};(function(t,e){(function(r,n){t.exports=n()})(Bt,function(){return function(r,n){var i=n.prototype,f=i.format;i.format=function(d){var v=this,A=this.$locale();if(!this.isValid())return f.bind(this)(d);var p=this.$utils(),S=(d||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,function(M){switch(M){case"Q":return Math.ceil((v.$M+1)/3);case"Do":return A.ordinal(v.$D);case"gggg":return v.weekYear();case"GGGG":return v.isoWeekYear();case"wo":return A.ordinal(v.week(),"W");case"w":case"ww":return p.s(v.week(),M==="w"?1:2,"0");case"W":case"WW":return p.s(v.isoWeek(),M==="W"?1:2,"0");case"k":case"kk":return p.s(String(v.$H===0?24:v.$H),M==="k"?1:2,"0");case"X":return Math.floor(v.$d.getTime()/1e3);case"x":return v.$d.getTime();case"z":return"["+v.offsetName()+"]";case"zzz":return"["+v.offsetName("long")+"]";default:return M}});return f.bind(this)(S)}}})})(Ce);var _r=Ce.exports;const Dr=Ht(_r);var Ot=function(){var t=o(function(D,c,u,y){for(u=u||{},y=D.length;y--;u[D[y]]=c);return u},"o"),e=[6,8,10,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,30,31,33,35,36,38,40],r=[1,26],n=[1,27],i=[1,28],f=[1,29],d=[1,30],v=[1,31],A=[1,32],p=[1,33],S=[1,34],M=[1,9],C=[1,10],T=[1,11],H=[1,12],m=[1,13],E=[1,14],F=[1,15],I=[1,16],P=[1,19],N=[1,20],X=[1,21],R=[1,22],V=[1,23],g=[1,25],w=[1,35],x={trace:o(function(){},"trace"),yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,weekend:19,weekend_friday:20,weekend_saturday:21,dateFormat:22,inclusiveEndDates:23,topAxis:24,axisFormat:25,tickInterval:26,excludes:27,includes:28,todayMarker:29,title:30,acc_title:31,acc_title_value:32,acc_descr:33,acc_descr_value:34,acc_descr_multiline_value:35,section:36,clickStatement:37,taskTxt:38,taskData:39,click:40,callbackname:41,callbackargs:42,href:43,clickStatementDebug:44,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",20:"weekend_friday",21:"weekend_saturday",22:"dateFormat",23:"inclusiveEndDates",24:"topAxis",25:"axisFormat",26:"tickInterval",27:"excludes",28:"includes",29:"todayMarker",30:"title",31:"acc_title",32:"acc_title_value",33:"acc_descr",34:"acc_descr_value",35:"acc_descr_multiline_value",36:"section",38:"taskTxt",39:"taskData",40:"click",41:"callbackname",42:"callbackargs",43:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[19,1],[19,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[37,2],[37,3],[37,3],[37,4],[37,3],[37,4],[37,2],[44,2],[44,3],[44,3],[44,4],[44,3],[44,4],[44,2]],performAction:o(function(c,u,y,h,_,a,l){var s=a.length-1;switch(_){case 1:return a[s-1];case 2:this.$=[];break;case 3:a[s-1].push(a[s]),this.$=a[s-1];break;case 4:case 5:this.$=a[s];break;case 6:case 7:this.$=[];break;case 8:h.setWeekday("monday");break;case 9:h.setWeekday("tuesday");break;case 10:h.setWeekday("wednesday");break;case 11:h.setWeekday("thursday");break;case 12:h.setWeekday("friday");break;case 13:h.setWeekday("saturday");break;case 14:h.setWeekday("sunday");break;case 15:h.setWeekend("friday");break;case 16:h.setWeekend("saturday");break;case 17:h.setDateFormat(a[s].substr(11)),this.$=a[s].substr(11);break;case 18:h.enableInclusiveEndDates(),this.$=a[s].substr(18);break;case 19:h.TopAxis(),this.$=a[s].substr(8);break;case 20:h.setAxisFormat(a[s].substr(11)),this.$=a[s].substr(11);break;case 21:h.setTickInterval(a[s].substr(13)),this.$=a[s].substr(13);break;case 22:h.setExcludes(a[s].substr(9)),this.$=a[s].substr(9);break;case 23:h.setIncludes(a[s].substr(9)),this.$=a[s].substr(9);break;case 24:h.setTodayMarker(a[s].substr(12)),this.$=a[s].substr(12);break;case 27:h.setDiagramTitle(a[s].substr(6)),this.$=a[s].substr(6);break;case 28:this.$=a[s].trim(),h.setAccTitle(this.$);break;case 29:case 30:this.$=a[s].trim(),h.setAccDescription(this.$);break;case 31:h.addSection(a[s].substr(8)),this.$=a[s].substr(8);break;case 33:h.addTask(a[s-1],a[s]),this.$="task";break;case 34:this.$=a[s-1],h.setClickEvent(a[s-1],a[s],null);break;case 35:this.$=a[s-2],h.setClickEvent(a[s-2],a[s-1],a[s]);break;case 36:this.$=a[s-2],h.setClickEvent(a[s-2],a[s-1],null),h.setLink(a[s-2],a[s]);break;case 37:this.$=a[s-3],h.setClickEvent(a[s-3],a[s-2],a[s-1]),h.setLink(a[s-3],a[s]);break;case 38:this.$=a[s-2],h.setClickEvent(a[s-2],a[s],null),h.setLink(a[s-2],a[s-1]);break;case 39:this.$=a[s-3],h.setClickEvent(a[s-3],a[s-1],a[s]),h.setLink(a[s-3],a[s-2]);break;case 40:this.$=a[s-1],h.setLink(a[s-1],a[s]);break;case 41:case 47:this.$=a[s-1]+" "+a[s];break;case 42:case 43:case 45:this.$=a[s-2]+" "+a[s-1]+" "+a[s];break;case 44:case 46:this.$=a[s-3]+" "+a[s-2]+" "+a[s-1]+" "+a[s];break}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(e,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:r,13:n,14:i,15:f,16:d,17:v,18:A,19:18,20:p,21:S,22:M,23:C,24:T,25:H,26:m,27:E,28:F,29:I,30:P,31:N,33:X,35:R,36:V,37:24,38:g,40:w},t(e,[2,7],{1:[2,1]}),t(e,[2,3]),{9:36,11:17,12:r,13:n,14:i,15:f,16:d,17:v,18:A,19:18,20:p,21:S,22:M,23:C,24:T,25:H,26:m,27:E,28:F,29:I,30:P,31:N,33:X,35:R,36:V,37:24,38:g,40:w},t(e,[2,5]),t(e,[2,6]),t(e,[2,17]),t(e,[2,18]),t(e,[2,19]),t(e,[2,20]),t(e,[2,21]),t(e,[2,22]),t(e,[2,23]),t(e,[2,24]),t(e,[2,25]),t(e,[2,26]),t(e,[2,27]),{32:[1,37]},{34:[1,38]},t(e,[2,30]),t(e,[2,31]),t(e,[2,32]),{39:[1,39]},t(e,[2,8]),t(e,[2,9]),t(e,[2,10]),t(e,[2,11]),t(e,[2,12]),t(e,[2,13]),t(e,[2,14]),t(e,[2,15]),t(e,[2,16]),{41:[1,40],43:[1,41]},t(e,[2,4]),t(e,[2,28]),t(e,[2,29]),t(e,[2,33]),t(e,[2,34],{42:[1,42],43:[1,43]}),t(e,[2,40],{41:[1,44]}),t(e,[2,35],{43:[1,45]}),t(e,[2,36]),t(e,[2,38],{42:[1,46]}),t(e,[2,37]),t(e,[2,39])],defaultActions:{},parseError:o(function(c,u){if(u.recoverable)this.trace(c);else{var y=new Error(c);throw y.hash=u,y}},"parseError"),parse:o(function(c){var u=this,y=[0],h=[],_=[null],a=[],l=this.table,s="",W=0,L=0,Y=2,G=1,z=a.slice.call(arguments,1),O=Object.create(this.lexer),U={yy:{}};for(var nt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,nt)&&(U.yy[nt]=this.yy[nt]);O.setInput(c,U.yy),U.yy.lexer=O,U.yy.parser=this,typeof O.yylloc>"u"&&(O.yylloc={});var it=O.yylloc;a.push(it);var st=O.options&&O.options.ranges;typeof U.yy.parseError=="function"?this.parseError=U.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function ht(K){y.length=y.length-2*K,_.length=_.length-K,a.length=a.length-K}o(ht,"popStack");function ct(){var K;return K=h.pop()||O.lex()||G,typeof K!="number"&&(K instanceof Array&&(h=K,K=h.pop()),K=u.symbols_[K]||K),K}o(ct,"lex");for(var q,Q,Z,Et,ot={},gt,tt,te,pt;;){if(Q=y[y.length-1],this.defaultActions[Q]?Z=this.defaultActions[Q]:((q===null||typeof q>"u")&&(q=ct()),Z=l[Q]&&l[Q][q]),typeof Z>"u"||!Z.length||!Z[0]){var Mt="";pt=[];for(gt in l[Q])this.terminals_[gt]&&gt>Y&&pt.push("'"+this.terminals_[gt]+"'");O.showPosition?Mt="Parse error on line "+(W+1)+`:
`+O.showPosition()+`
Expecting `+pt.join(", ")+", got '"+(this.terminals_[q]||q)+"'":Mt="Parse error on line "+(W+1)+": Unexpected "+(q==G?"end of input":"'"+(this.terminals_[q]||q)+"'"),this.parseError(Mt,{text:O.match,token:this.terminals_[q]||q,line:O.yylineno,loc:it,expected:pt})}if(Z[0]instanceof Array&&Z.length>1)throw new Error("Parse Error: multiple actions possible at state: "+Q+", token: "+q);switch(Z[0]){case 1:y.push(q),_.push(O.yytext),a.push(O.yylloc),y.push(Z[1]),q=null,L=O.yyleng,s=O.yytext,W=O.yylineno,it=O.yylloc;break;case 2:if(tt=this.productions_[Z[1]][1],ot.$=_[_.length-tt],ot._$={first_line:a[a.length-(tt||1)].first_line,last_line:a[a.length-1].last_line,first_column:a[a.length-(tt||1)].first_column,last_column:a[a.length-1].last_column},st&&(ot._$.range=[a[a.length-(tt||1)].range[0],a[a.length-1].range[1]]),Et=this.performAction.apply(ot,[s,L,W,U.yy,Z[1],_,a].concat(z)),typeof Et<"u")return Et;tt&&(y=y.slice(0,-1*tt*2),_=_.slice(0,-1*tt),a=a.slice(0,-1*tt)),y.push(this.productions_[Z[1]][0]),_.push(ot.$),a.push(ot._$),te=l[y[y.length-2]][y[y.length-1]],y.push(te);break;case 3:return!0}}return!0},"parse")},b=function(){var D={EOF:1,parseError:o(function(u,y){if(this.yy.parser)this.yy.parser.parseError(u,y);else throw new Error(u)},"parseError"),setInput:o(function(c,u){return this.yy=u||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:o(function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var u=c.match(/(?:\r\n?|\n).*/g);return u?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},"input"),unput:o(function(c){var u=c.length,y=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-u),this.offset-=u;var h=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),y.length-1&&(this.yylineno-=y.length-1);var _=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:y?(y.length===h.length?this.yylloc.first_column:0)+h[h.length-y.length].length-y[0].length:this.yylloc.first_column-u},this.options.ranges&&(this.yylloc.range=[_[0],_[0]+this.yyleng-u]),this.yyleng=this.yytext.length,this},"unput"),more:o(function(){return this._more=!0,this},"more"),reject:o(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:o(function(c){this.unput(this.match.slice(c))},"less"),pastInput:o(function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:o(function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:o(function(){var c=this.pastInput(),u=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+u+"^"},"showPosition"),test_match:o(function(c,u){var y,h,_;if(this.options.backtrack_lexer&&(_={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(_.yylloc.range=this.yylloc.range.slice(0))),h=c[0].match(/(?:\r\n?|\n).*/g),h&&(this.yylineno+=h.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:h?h[h.length-1].length-h[h.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],y=this.performAction.call(this,this.yy,this,u,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),y)return y;if(this._backtrack){for(var a in _)this[a]=_[a];return!1}return!1},"test_match"),next:o(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,u,y,h;this._more||(this.yytext="",this.match="");for(var _=this._currentRules(),a=0;a<_.length;a++)if(y=this._input.match(this.rules[_[a]]),y&&(!u||y[0].length>u[0].length)){if(u=y,h=a,this.options.backtrack_lexer){if(c=this.test_match(y,_[a]),c!==!1)return c;if(this._backtrack){u=!1;continue}else return!1}else if(!this.options.flex)break}return u?(c=this.test_match(u,_[h]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:o(function(){var u=this.next();return u||this.lex()},"lex"),begin:o(function(u){this.conditionStack.push(u)},"begin"),popState:o(function(){var u=this.conditionStack.length-1;return u>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:o(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:o(function(u){return u=this.conditionStack.length-1-Math.abs(u||0),u>=0?this.conditionStack[u]:"INITIAL"},"topState"),pushState:o(function(u){this.begin(u)},"pushState"),stateStackSize:o(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:o(function(u,y,h,_){switch(h){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),31;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),33;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:break;case 9:break;case 10:break;case 11:return 10;case 12:break;case 13:break;case 14:this.begin("href");break;case 15:this.popState();break;case 16:return 43;case 17:this.begin("callbackname");break;case 18:this.popState();break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 41;case 21:this.popState();break;case 22:return 42;case 23:this.begin("click");break;case 24:this.popState();break;case 25:return 40;case 26:return 4;case 27:return 22;case 28:return 23;case 29:return 24;case 30:return 25;case 31:return 26;case 32:return 28;case 33:return 27;case 34:return 29;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return 20;case 43:return 21;case 44:return"date";case 45:return 30;case 46:return"accDescription";case 47:return 36;case 48:return 38;case 49:return 39;case 50:return":";case 51:return 6;case 52:return"INVALID"}},"anonymous"),rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:weekend\s+friday\b)/i,/^(?:weekend\s+saturday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],inclusive:!0}}};return D}();x.lexer=b;function k(){this.yy={}}return o(k,"Parser"),k.prototype=x,x.Parser=k,new k}();Ot.parser=Ot;var Cr=Ot;j.extend(xr);j.extend(wr);j.extend(Dr);var le={friday:5,saturday:6},J="",Gt="",qt=void 0,Xt="",mt=[],kt=[],jt=new Map,Ut=[],Ct=[],ft="",Zt="",Se=["active","done","crit","milestone"],Kt=[],yt=!1,Qt=!1,Jt="sunday",St="saturday",Pt=0,Sr=o(function(){Ut=[],Ct=[],ft="",Kt=[],Tt=0,Rt=void 0,wt=void 0,B=[],J="",Gt="",Zt="",qt=void 0,Xt="",mt=[],kt=[],yt=!1,Qt=!1,Pt=0,jt=new Map,qe(),Jt="sunday",St="saturday"},"clear"),Er=o(function(t){Gt=t},"setAxisFormat"),Mr=o(function(){return Gt},"getAxisFormat"),Ar=o(function(t){qt=t},"setTickInterval"),Ir=o(function(){return qt},"getTickInterval"),Lr=o(function(t){Xt=t},"setTodayMarker"),Fr=o(function(){return Xt},"getTodayMarker"),Yr=o(function(t){J=t},"setDateFormat"),Wr=o(function(){yt=!0},"enableInclusiveEndDates"),Vr=o(function(){return yt},"endDatesAreInclusive"),zr=o(function(){Qt=!0},"enableTopAxis"),Or=o(function(){return Qt},"topAxisEnabled"),Pr=o(function(t){Zt=t},"setDisplayMode"),Nr=o(function(){return Zt},"getDisplayMode"),Rr=o(function(){return J},"getDateFormat"),Br=o(function(t){mt=t.toLowerCase().split(/[\s,]+/)},"setIncludes"),Hr=o(function(){return mt},"getIncludes"),Gr=o(function(t){kt=t.toLowerCase().split(/[\s,]+/)},"setExcludes"),qr=o(function(){return kt},"getExcludes"),Xr=o(function(){return jt},"getLinks"),jr=o(function(t){ft=t,Ut.push(t)},"addSection"),Ur=o(function(){return Ut},"getSections"),Zr=o(function(){let t=ue();const e=10;let r=0;for(;!t&&r<e;)t=ue(),r++;return Ct=B,Ct},"getTasks"),Ee=o(function(t,e,r,n){return n.includes(t.format(e.trim()))?!1:r.includes("weekends")&&(t.isoWeekday()===le[St]||t.isoWeekday()===le[St]+1)||r.includes(t.format("dddd").toLowerCase())?!0:r.includes(t.format(e.trim()))},"isInvalidDate"),Kr=o(function(t){Jt=t},"setWeekday"),Qr=o(function(){return Jt},"getWeekday"),Jr=o(function(t){St=t},"setWeekend"),Me=o(function(t,e,r,n){if(!r.length||t.manualEndTime)return;let i;t.startTime instanceof Date?i=j(t.startTime):i=j(t.startTime,e,!0),i=i.add(1,"d");let f;t.endTime instanceof Date?f=j(t.endTime):f=j(t.endTime,e,!0);const[d,v]=$r(i,f,e,r,n);t.endTime=d.toDate(),t.renderEndTime=v},"checkTaskDates"),$r=o(function(t,e,r,n,i){let f=!1,d=null;for(;t<=e;)f||(d=e.toDate()),f=Ee(t,r,n,i),f&&(e=e.add(1,"d")),t=t.add(1,"d");return[e,d]},"fixTaskDates"),Nt=o(function(t,e,r){r=r.trim();const i=/^after\s+(?<ids>[\d\w- ]+)/.exec(r);if(i!==null){let d=null;for(const A of i.groups.ids.split(" ")){let p=at(A);p!==void 0&&(!d||p.endTime>d.endTime)&&(d=p)}if(d)return d.endTime;const v=new Date;return v.setHours(0,0,0,0),v}let f=j(r,e.trim(),!0);if(f.isValid())return f.toDate();{_t.debug("Invalid date:"+r),_t.debug("With date format:"+e.trim());const d=new Date(r);if(d===void 0||isNaN(d.getTime())||d.getFullYear()<-1e4||d.getFullYear()>1e4)throw new Error("Invalid date:"+r);return d}},"getStartDate"),Ae=o(function(t){const e=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return e!==null?[Number.parseFloat(e[1]),e[2]]:[NaN,"ms"]},"parseDuration"),Ie=o(function(t,e,r,n=!1){r=r.trim();const f=/^until\s+(?<ids>[\d\w- ]+)/.exec(r);if(f!==null){let S=null;for(const C of f.groups.ids.split(" ")){let T=at(C);T!==void 0&&(!S||T.startTime<S.startTime)&&(S=T)}if(S)return S.startTime;const M=new Date;return M.setHours(0,0,0,0),M}let d=j(r,e.trim(),!0);if(d.isValid())return n&&(d=d.add(1,"d")),d.toDate();let v=j(t);const[A,p]=Ae(r);if(!Number.isNaN(A)){const S=v.add(A,p);S.isValid()&&(v=S)}return v.toDate()},"getEndDate"),Tt=0,dt=o(function(t){return t===void 0?(Tt=Tt+1,"task"+Tt):t},"parseId"),tn=o(function(t,e){let r;e.substr(0,1)===":"?r=e.substr(1,e.length):r=e;const n=r.split(","),i={};$t(n,i,Se);for(let d=0;d<n.length;d++)n[d]=n[d].trim();let f="";switch(n.length){case 1:i.id=dt(),i.startTime=t.endTime,f=n[0];break;case 2:i.id=dt(),i.startTime=Nt(void 0,J,n[0]),f=n[1];break;case 3:i.id=dt(n[0]),i.startTime=Nt(void 0,J,n[1]),f=n[2];break}return f&&(i.endTime=Ie(i.startTime,J,f,yt),i.manualEndTime=j(f,"YYYY-MM-DD",!0).isValid(),Me(i,J,kt,mt)),i},"compileData"),en=o(function(t,e){let r;e.substr(0,1)===":"?r=e.substr(1,e.length):r=e;const n=r.split(","),i={};$t(n,i,Se);for(let f=0;f<n.length;f++)n[f]=n[f].trim();switch(n.length){case 1:i.id=dt(),i.startTime={type:"prevTaskEnd",id:t},i.endTime={data:n[0]};break;case 2:i.id=dt(),i.startTime={type:"getStartDate",startData:n[0]},i.endTime={data:n[1]};break;case 3:i.id=dt(n[0]),i.startTime={type:"getStartDate",startData:n[1]},i.endTime={data:n[2]};break}return i},"parseData"),Rt,wt,B=[],Le={},rn=o(function(t,e){const r={section:ft,type:ft,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:e},task:t,classes:[]},n=en(wt,e);r.raw.startTime=n.startTime,r.raw.endTime=n.endTime,r.id=n.id,r.prevTaskId=wt,r.active=n.active,r.done=n.done,r.crit=n.crit,r.milestone=n.milestone,r.order=Pt,Pt++;const i=B.push(r);wt=r.id,Le[r.id]=i-1},"addTask"),at=o(function(t){const e=Le[t];return B[e]},"findTaskById"),nn=o(function(t,e){const r={section:ft,type:ft,description:t,task:t,classes:[]},n=tn(Rt,e);r.startTime=n.startTime,r.endTime=n.endTime,r.id=n.id,r.active=n.active,r.done=n.done,r.crit=n.crit,r.milestone=n.milestone,Rt=r,Ct.push(r)},"addTaskOrg"),ue=o(function(){const t=o(function(r){const n=B[r];let i="";switch(B[r].raw.startTime.type){case"prevTaskEnd":{const f=at(n.prevTaskId);n.startTime=f.endTime;break}case"getStartDate":i=Nt(void 0,J,B[r].raw.startTime.startData),i&&(B[r].startTime=i);break}return B[r].startTime&&(B[r].endTime=Ie(B[r].startTime,J,B[r].raw.endTime.data,yt),B[r].endTime&&(B[r].processed=!0,B[r].manualEndTime=j(B[r].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),Me(B[r],J,kt,mt))),B[r].processed},"compileTask");let e=!0;for(const[r,n]of B.entries())t(r),e=e&&n.processed;return e},"compileTasks"),an=o(function(t,e){let r=e;lt().securityLevel!=="loose"&&(r=ze(e)),t.split(",").forEach(function(n){at(n)!==void 0&&(Ye(n,()=>{window.open(r,"_self")}),jt.set(n,r))}),Fe(t,"clickable")},"setLink"),Fe=o(function(t,e){t.split(",").forEach(function(r){let n=at(r);n!==void 0&&n.classes.push(e)})},"setClass"),sn=o(function(t,e,r){if(lt().securityLevel!=="loose"||e===void 0)return;let n=[];if(typeof r=="string"){n=r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let f=0;f<n.length;f++){let d=n[f].trim();d.startsWith('"')&&d.endsWith('"')&&(d=d.substr(1,d.length-2)),n[f]=d}}n.length===0&&n.push(t),at(t)!==void 0&&Ye(t,()=>{Oe.runFunc(e,...n)})},"setClickFun"),Ye=o(function(t,e){Kt.push(function(){const r=document.querySelector(`[id="${t}"]`);r!==null&&r.addEventListener("click",function(){e()})},function(){const r=document.querySelector(`[id="${t}-text"]`);r!==null&&r.addEventListener("click",function(){e()})})},"pushFun"),cn=o(function(t,e,r){t.split(",").forEach(function(n){sn(n,e,r)}),Fe(t,"clickable")},"setClickEvent"),on=o(function(t){Kt.forEach(function(e){e(t)})},"bindFunctions"),ln={getConfig:o(()=>lt().gantt,"getConfig"),clear:Sr,setDateFormat:Yr,getDateFormat:Rr,enableInclusiveEndDates:Wr,endDatesAreInclusive:Vr,enableTopAxis:zr,topAxisEnabled:Or,setAxisFormat:Er,getAxisFormat:Mr,setTickInterval:Ar,getTickInterval:Ir,setTodayMarker:Lr,getTodayMarker:Fr,setAccTitle:Ge,getAccTitle:He,setDiagramTitle:Be,getDiagramTitle:Re,setDisplayMode:Pr,getDisplayMode:Nr,setAccDescription:Ne,getAccDescription:Pe,addSection:jr,getSections:Ur,getTasks:Zr,addTask:rn,findTaskById:at,addTaskOrg:nn,setIncludes:Br,getIncludes:Hr,setExcludes:Gr,getExcludes:qr,setClickEvent:cn,setLink:an,getLinks:Xr,bindFunctions:on,parseDuration:Ae,isInvalidDate:Ee,setWeekday:Kr,getWeekday:Qr,setWeekend:Jr};function $t(t,e,r){let n=!0;for(;n;)n=!1,r.forEach(function(i){const f="^\\s*"+i+"\\s*$",d=new RegExp(f);t[0].match(d)&&(e[i]=!0,t.shift(1),n=!0)})}o($t,"getTaskTags");var un=o(function(){_t.debug("Something is calling, setConf, remove the call")},"setConf"),de={monday:er,tuesday:tr,wednesday:$e,thursday:Je,friday:Qe,saturday:Ke,sunday:Ze},dn=o((t,e)=>{let r=[...t].map(()=>-1/0),n=[...t].sort((f,d)=>f.startTime-d.startTime||f.order-d.order),i=0;for(const f of n)for(let d=0;d<r.length;d++)if(f.startTime>=r[d]){r[d]=f.endTime,f.order=d+e,d>i&&(i=d);break}return i},"getMaxIntersections"),et,fn=o(function(t,e,r,n){const i=lt().gantt,f=lt().securityLevel;let d;f==="sandbox"&&(d=vt("#i"+e));const v=f==="sandbox"?vt(d.nodes()[0].contentDocument.body):vt("body"),A=f==="sandbox"?d.nodes()[0].contentDocument:document,p=A.getElementById(e);et=p.parentElement.offsetWidth,et===void 0&&(et=1200),i.useWidth!==void 0&&(et=i.useWidth);const S=n.db.getTasks();let M=[];for(const g of S)M.push(g.type);M=V(M);const C={};let T=2*i.topPadding;if(n.db.getDisplayMode()==="compact"||i.displayMode==="compact"){const g={};for(const x of S)g[x.section]===void 0?g[x.section]=[x]:g[x.section].push(x);let w=0;for(const x of Object.keys(g)){const b=dn(g[x],w)+1;w+=b,T+=b*(i.barHeight+i.barGap),C[x]=b}}else{T+=S.length*(i.barHeight+i.barGap);for(const g of M)C[g]=S.filter(w=>w.type===g).length}p.setAttribute("viewBox","0 0 "+et+" "+T);const H=v.select(`[id="${e}"]`),m=Xe().domain([je(S,function(g){return g.startTime}),Ue(S,function(g){return g.endTime})]).rangeRound([0,et-i.leftPadding-i.rightPadding]);function E(g,w){const x=g.startTime,b=w.startTime;let k=0;return x>b?k=1:x<b&&(k=-1),k}o(E,"taskCompare"),S.sort(E),F(S,et,T),Ve(H,T,et,i.useMaxWidth),H.append("text").text(n.db.getDiagramTitle()).attr("x",et/2).attr("y",i.titleTopMargin).attr("class","titleText");function F(g,w,x){const b=i.barHeight,k=b+i.barGap,D=i.topPadding,c=i.leftPadding,u=rr().domain([0,M.length]).range(["#00B9FA","#F95002"]).interpolate(dr);P(k,D,c,w,x,g,n.db.getExcludes(),n.db.getIncludes()),N(c,D,w,x),I(g,k,D,c,b,u,w),X(k,D),R(c,D,w,x)}o(F,"makeGantt");function I(g,w,x,b,k,D,c){const y=[...new Set(g.map(l=>l.order))].map(l=>g.find(s=>s.order===l));H.append("g").selectAll("rect").data(y).enter().append("rect").attr("x",0).attr("y",function(l,s){return s=l.order,s*w+x-2}).attr("width",function(){return c-i.rightPadding/2}).attr("height",w).attr("class",function(l){for(const[s,W]of M.entries())if(l.type===W)return"section section"+s%i.numberSectionStyles;return"section section0"});const h=H.append("g").selectAll("rect").data(g).enter(),_=n.db.getLinks();if(h.append("rect").attr("id",function(l){return l.id}).attr("rx",3).attr("ry",3).attr("x",function(l){return l.milestone?m(l.startTime)+b+.5*(m(l.endTime)-m(l.startTime))-.5*k:m(l.startTime)+b}).attr("y",function(l,s){return s=l.order,s*w+x}).attr("width",function(l){return l.milestone?k:m(l.renderEndTime||l.endTime)-m(l.startTime)}).attr("height",k).attr("transform-origin",function(l,s){return s=l.order,(m(l.startTime)+b+.5*(m(l.endTime)-m(l.startTime))).toString()+"px "+(s*w+x+.5*k).toString()+"px"}).attr("class",function(l){const s="task";let W="";l.classes.length>0&&(W=l.classes.join(" "));let L=0;for(const[G,z]of M.entries())l.type===z&&(L=G%i.numberSectionStyles);let Y="";return l.active?l.crit?Y+=" activeCrit":Y=" active":l.done?l.crit?Y=" doneCrit":Y=" done":l.crit&&(Y+=" crit"),Y.length===0&&(Y=" task"),l.milestone&&(Y=" milestone "+Y),Y+=L,Y+=" "+W,s+Y}),h.append("text").attr("id",function(l){return l.id+"-text"}).text(function(l){return l.task}).attr("font-size",i.fontSize).attr("x",function(l){let s=m(l.startTime),W=m(l.renderEndTime||l.endTime);l.milestone&&(s+=.5*(m(l.endTime)-m(l.startTime))-.5*k),l.milestone&&(W=s+k);const L=this.getBBox().width;return L>W-s?W+L+1.5*i.leftPadding>c?s+b-5:W+b+5:(W-s)/2+s+b}).attr("y",function(l,s){return s=l.order,s*w+i.barHeight/2+(i.fontSize/2-2)+x}).attr("text-height",k).attr("class",function(l){const s=m(l.startTime);let W=m(l.endTime);l.milestone&&(W=s+k);const L=this.getBBox().width;let Y="";l.classes.length>0&&(Y=l.classes.join(" "));let G=0;for(const[O,U]of M.entries())l.type===U&&(G=O%i.numberSectionStyles);let z="";return l.active&&(l.crit?z="activeCritText"+G:z="activeText"+G),l.done?l.crit?z=z+" doneCritText"+G:z=z+" doneText"+G:l.crit&&(z=z+" critText"+G),l.milestone&&(z+=" milestoneText"),L>W-s?W+L+1.5*i.leftPadding>c?Y+" taskTextOutsideLeft taskTextOutside"+G+" "+z:Y+" taskTextOutsideRight taskTextOutside"+G+" "+z+" width-"+L:Y+" taskText taskText"+G+" "+z+" width-"+L}),lt().securityLevel==="sandbox"){let l;l=vt("#i"+e);const s=l.nodes()[0].contentDocument;h.filter(function(W){return _.has(W.id)}).each(function(W){var L=s.querySelector("#"+W.id),Y=s.querySelector("#"+W.id+"-text");const G=L.parentNode;var z=s.createElement("a");z.setAttribute("xlink:href",_.get(W.id)),z.setAttribute("target","_top"),G.appendChild(z),z.appendChild(L),z.appendChild(Y)})}}o(I,"drawRects");function P(g,w,x,b,k,D,c,u){if(c.length===0&&u.length===0)return;let y,h;for(const{startTime:L,endTime:Y}of D)(y===void 0||L<y)&&(y=L),(h===void 0||Y>h)&&(h=Y);if(!y||!h)return;if(j(h).diff(j(y),"year")>5){_t.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");return}const _=n.db.getDateFormat(),a=[];let l=null,s=j(y);for(;s.valueOf()<=h;)n.db.isInvalidDate(s,_,c,u)?l?l.end=s:l={start:s,end:s}:l&&(a.push(l),l=null),s=s.add(1,"d");H.append("g").selectAll("rect").data(a).enter().append("rect").attr("id",function(L){return"exclude-"+L.start.format("YYYY-MM-DD")}).attr("x",function(L){return m(L.start)+x}).attr("y",i.gridLineStartPadding).attr("width",function(L){const Y=L.end.add(1,"day");return m(Y)-m(L.start)}).attr("height",k-w-i.gridLineStartPadding).attr("transform-origin",function(L,Y){return(m(L.start)+x+.5*(m(L.end)-m(L.start))).toString()+"px "+(Y*g+.5*k).toString()+"px"}).attr("class","exclude-range")}o(P,"drawExcludeDays");function N(g,w,x,b){let k=vr(m).tickSize(-b+w+i.gridLineStartPadding).tickFormat(ee(n.db.getAxisFormat()||i.axisFormat||"%Y-%m-%d"));const c=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(n.db.getTickInterval()||i.tickInterval);if(c!==null){const u=c[1],y=c[2],h=n.db.getWeekday()||i.weekday;switch(y){case"millisecond":k.ticks(ce.every(u));break;case"second":k.ticks(se.every(u));break;case"minute":k.ticks(ae.every(u));break;case"hour":k.ticks(ie.every(u));break;case"day":k.ticks(ne.every(u));break;case"week":k.ticks(de[h].every(u));break;case"month":k.ticks(re.every(u));break}}if(H.append("g").attr("class","grid").attr("transform","translate("+g+", "+(b-50)+")").call(k).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),n.db.topAxisEnabled()||i.topAxis){let u=pr(m).tickSize(-b+w+i.gridLineStartPadding).tickFormat(ee(n.db.getAxisFormat()||i.axisFormat||"%Y-%m-%d"));if(c!==null){const y=c[1],h=c[2],_=n.db.getWeekday()||i.weekday;switch(h){case"millisecond":u.ticks(ce.every(y));break;case"second":u.ticks(se.every(y));break;case"minute":u.ticks(ae.every(y));break;case"hour":u.ticks(ie.every(y));break;case"day":u.ticks(ne.every(y));break;case"week":u.ticks(de[_].every(y));break;case"month":u.ticks(re.every(y));break}}H.append("g").attr("class","grid").attr("transform","translate("+g+", "+w+")").call(u).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}o(N,"makeGrid");function X(g,w){let x=0;const b=Object.keys(C).map(k=>[k,C[k]]);H.append("g").selectAll("text").data(b).enter().append(function(k){const D=k[0].split(We.lineBreakRegex),c=-(D.length-1)/2,u=A.createElementNS("http://www.w3.org/2000/svg","text");u.setAttribute("dy",c+"em");for(const[y,h]of D.entries()){const _=A.createElementNS("http://www.w3.org/2000/svg","tspan");_.setAttribute("alignment-baseline","central"),_.setAttribute("x","10"),y>0&&_.setAttribute("dy","1em"),_.textContent=h,u.appendChild(_)}return u}).attr("x",10).attr("y",function(k,D){if(D>0)for(let c=0;c<D;c++)return x+=b[D-1][1],k[1]*g/2+x*g+w;else return k[1]*g/2+w}).attr("font-size",i.sectionFontSize).attr("class",function(k){for(const[D,c]of M.entries())if(k[0]===c)return"sectionTitle sectionTitle"+D%i.numberSectionStyles;return"sectionTitle"})}o(X,"vertLabels");function R(g,w,x,b){const k=n.db.getTodayMarker();if(k==="off")return;const D=H.append("g").attr("class","today"),c=new Date,u=D.append("line");u.attr("x1",m(c)+g).attr("x2",m(c)+g).attr("y1",i.titleTopMargin).attr("y2",b-i.titleTopMargin).attr("class","today"),k!==""&&u.attr("style",k.replace(/,/g,";"))}o(R,"drawToday");function V(g){const w={},x=[];for(let b=0,k=g.length;b<k;++b)Object.prototype.hasOwnProperty.call(w,g[b])||(w[g[b]]=!0,x.push(g[b]));return x}o(V,"checkUnique")},"draw"),hn={setConf:un,draw:fn},mn=o(t=>`
  .mermaid-main-font {
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .exclude-range {
    fill: ${t.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${t.sectionBkgColor};
  }

  .section2 {
    fill: ${t.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${t.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${t.titleColor};
  }

  .sectionTitle1 {
    fill: ${t.titleColor};
  }

  .sectionTitle2 {
    fill: ${t.titleColor};
  }

  .sectionTitle3 {
    fill: ${t.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${t.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${t.fontFamily};
    fill: ${t.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${t.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }

  .taskTextOutsideLeft {
    fill: ${t.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${t.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${t.taskBkgColor};
    stroke: ${t.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${t.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${t.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${t.activeTaskBkgColor};
    stroke: ${t.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${t.doneTaskBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.titleColor||t.textColor};
    font-family: var(--mermaid-font-family, "trebuchet ms", verdana, arial, sans-serif);
  }
`,"getStyles"),kn=mn,Tn={parser:Cr,db:ln,renderer:hn,styles:kn};export{Tn as diagram};
