import{a as t}from"./chunk-6e6f6eb8.js";import{v as e,t as n,n as a}from"./chunk-2f8d3de5.js";var i={renderYAxis:function(i,s){const r=a(i),c=r.node().getBoundingClientRect().height-36,o=25-r.node().getBoundingClientRect().width,l=[c,0],d=n().domain(s).range(l),g=e(d).tickSizeInner(o+18).ticks(6).tickFormat(e=>`${t(e)}`);var u;return r.select(".y-axis").empty()?(u=r,u.append("g").attr("class","y-axis")).call(g):r.select(".y-axis").call(g),r.selectAll(".tick text").attr("textLength",25).attr("lengthAdjust","spacing"),i.querySelector("g.y-axis")}};export{i as a};