import{a as readableNumber}from"./chunk-6e6f6eb8.js";import{v as axisLeft,t as linear,n as select}from"./chunk-2f8d3de5.js";function renderYAxis(e,t){var r=select(e),i=r.node().getBoundingClientRect().height-36,n=25-r.node().getBoundingClientRect().width,a=[i,0],s=linear().domain(t).range(a),c=axisLeft(s).tickSizeInner(n+18).ticks(6).tickFormat(function(e){return""+readableNumber(e)});return r.select(".y-axis").empty()?_createYAxisElement(r).call(c):r.select(".y-axis").call(c),r.selectAll(".tick text").attr("textLength",25).attr("lengthAdjust","spacing"),e.querySelector("g.y-axis")}function _createYAxisElement(e){return e.append("g").attr("class","y-axis")}var yAxisService={renderYAxis:renderYAxis};export{yAxisService as a};