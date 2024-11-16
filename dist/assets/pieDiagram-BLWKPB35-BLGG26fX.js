import{p as V}from"./chunk-BAOP5US2-BvVu9BDE.js";import{_ as u,l as G,g as j,C as U,G as q,L as Z,f as H,j as J,i as K,k as Q,m as X,o as Y,p as tt,q as et,E as at}from"./Artifact-BE2yZU04.js";import{p as rt}from"./gitGraph-YCYPL57B-Dw0d8nI5.js";import{d as O}from"./arc-C3ybG0W_.js";import{n as nt,d as y,t as z}from"./string-DQ6ad1hy.js";import{o as it}from"./ordinal-DILIJJjt.js";import"./index-ChpSMm3l.js";import"./_baseUniq-BiUMsGgK.js";import"./_basePickBy-BQryXqVT.js";import"./clone-DEU2l8ZK.js";import"./init-Dmth1JHB.js";function st(t,a){return a<t?-1:a>t?1:a>=t?0:NaN}function ot(t){return t}function lt(){var t=ot,a=st,m=null,o=y(0),g=y(z),x=y(0);function i(e){var r,l=(e=nt(e)).length,c,A,h=0,p=new Array(l),n=new Array(l),v=+o.apply(this,arguments),w=Math.min(z,Math.max(-z,g.apply(this,arguments)-v)),f,T=Math.min(Math.abs(w)/l,x.apply(this,arguments)),$=T*(w<0?-1:1),d;for(r=0;r<l;++r)(d=n[p[r]=r]=+t(e[r],r,e))>0&&(h+=d);for(a!=null?p.sort(function(S,C){return a(n[S],n[C])}):m!=null&&p.sort(function(S,C){return m(e[S],e[C])}),r=0,A=h?(w-l*$)/h:0;r<l;++r,v=f)c=p[r],d=n[c],f=v+(d>0?d*A:0)+$,n[c]={data:e[c],index:r,value:d,startAngle:v,endAngle:f,padAngle:T};return n}return i.value=function(e){return arguments.length?(t=typeof e=="function"?e:y(+e),i):t},i.sortValues=function(e){return arguments.length?(a=e,m=null,i):a},i.sort=function(e){return arguments.length?(m=e,a=null,i):m},i.startAngle=function(e){return arguments.length?(o=typeof e=="function"?e:y(+e),i):o},i.endAngle=function(e){return arguments.length?(g=typeof e=="function"?e:y(+e),i):g},i.padAngle=function(e){return arguments.length?(x=typeof e=="function"?e:y(+e),i):x},i}var ct=at.pie,F={sections:new Map,showData:!1},M=F.sections,W=F.showData,pt=structuredClone(ct),ut=u(()=>structuredClone(pt),"getConfig"),gt=u(()=>{M=new Map,W=F.showData,et()},"clear"),dt=u(({label:t,value:a})=>{M.has(t)||(M.set(t,a),G.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),ft=u(()=>M,"getSections"),mt=u(t=>{W=t},"setShowData"),ht=u(()=>W,"getShowData"),P={getConfig:ut,clear:gt,setDiagramTitle:tt,getDiagramTitle:Y,setAccTitle:X,getAccTitle:Q,setAccDescription:K,getAccDescription:J,addSection:dt,getSections:ft,setShowData:mt,getShowData:ht},vt=u((t,a)=>{V(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),St={parse:u(async t=>{const a=await rt("pie",t);G.debug(a),vt(a,P)},"parse")},yt=u(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),xt=yt,At=u(t=>{const a=[...t.entries()].map(o=>({label:o[0],value:o[1]})).sort((o,g)=>g.value-o.value);return lt().value(o=>o.value)(a)},"createPieArcs"),wt=u((t,a,m,o)=>{G.debug(`rendering pie chart
`+t);const g=o.db,x=j(),i=U(g.getConfig(),x.pie),e=40,r=18,l=4,c=450,A=c,h=q(a),p=h.append("g");p.attr("transform","translate("+A/2+","+c/2+")");const{themeVariables:n}=x;let[v]=Z(n.pieOuterStrokeWidth);v??(v=2);const w=i.textPosition,f=Math.min(A,c)/2-e,T=O().innerRadius(0).outerRadius(f),$=O().innerRadius(f*w).outerRadius(f*w);p.append("circle").attr("cx",0).attr("cy",0).attr("r",f+v/2).attr("class","pieOuterCircle");const d=g.getSections(),S=At(d),C=[n.pie1,n.pie2,n.pie3,n.pie4,n.pie5,n.pie6,n.pie7,n.pie8,n.pie9,n.pie10,n.pie11,n.pie12],D=it(C);p.selectAll("mySlices").data(S).enter().append("path").attr("d",T).attr("fill",s=>D(s.data.label)).attr("class","pieCircle");let L=0;d.forEach(s=>{L+=s}),p.selectAll("mySlices").data(S).enter().append("text").text(s=>(s.data.value/L*100).toFixed(0)+"%").attr("transform",s=>"translate("+$.centroid(s)+")").style("text-anchor","middle").attr("class","slice"),p.append("text").text(g.getDiagramTitle()).attr("x",0).attr("y",-(c-50)/2).attr("class","pieTitleText");const b=p.selectAll(".legend").data(D.domain()).enter().append("g").attr("class","legend").attr("transform",(s,k)=>{const E=r+l,I=E*D.domain().length/2,_=12*r,B=k*E-I;return"translate("+_+","+B+")"});b.append("rect").attr("width",r).attr("height",r).style("fill",D).style("stroke",D),b.data(S).append("text").attr("x",r+l).attr("y",r-l).text(s=>{const{label:k,value:E}=s.data;return g.getShowData()?`${k} [${E}]`:k});const R=Math.max(...b.selectAll("text").nodes().map(s=>(s==null?void 0:s.getBoundingClientRect().width)??0)),N=A+e+r+l+R;h.attr("viewBox",`0 0 ${N} ${c}`),H(h,c,N,i.useMaxWidth)},"draw"),Ct={draw:wt},Lt={parser:St,db:P,renderer:Ct,styles:xt};export{Lt as diagram};
