import{a as yAxisService}from"./chunk-95afe418.js";import"./chunk-6e6f6eb8.js";import"./chunk-2f8d3de5.js";var YAxis=function(){function e(){this.from=0,this.to=0,this.responsive=!0,this._resizeListener=this._resizeListener.bind(this)}return e.prototype.componentWillLoad=function(){addEventListener("resize",this._resizeListener)},e.prototype.componentDidUnload=function(){removeEventListener("resize",this._resizeListener)},e.prototype.render=function(){yAxisService.renderYAxis(this.element.previousElementSibling,[this.from,this.to])},e.prototype._resizeListener=function(){this.responsive&&this.element.forceUpdate()},Object.defineProperty(e,"is",{get:function(){return"as-y-axis"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{element:{elementRef:!0},from:{type:Number,attr:"from"},responsive:{type:Boolean,attr:"responsive"},to:{type:Number,attr:"to"}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return".y-axis{--widget-axis-text-color:var(--as--color--type-01,#2c2c2c);--widget-axis-line-color:var(--as--color--ui-05,#b3b3b3)}.y-axis .tick text{width:30px;fill:var(--widget-axis-text-color);white-space:pre}.y-axis .tick line{stroke:var(--widget-axis-line-color);opacity:.1}.y-axis .tick line.zero{opacity:.5}.y-axis .domain{display:none}"},enumerable:!0,configurable:!0}),e}();export{YAxis as AsYAxis};