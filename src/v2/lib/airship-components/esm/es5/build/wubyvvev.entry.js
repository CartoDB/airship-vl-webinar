import{h}from"../airship.core.js";import{a as redrawChildren}from"./chunk-b0e1ce66.js";var Tabs=function(){function t(){this.activeTab=0,this.xl=!1}return t.prototype.render=function(){var t=this._parseChildren();return[this._renderTabs(t),h("slot",null)]},t.prototype.componentDidLoad=function(){var t=this._parseChildren();this._updateActiveTab(t)},t.prototype.componentDidUpdate=function(){var t=this._parseChildren();this._updateActiveTab(t)},t.prototype._parseChildren=function(){return Array.from(this.element.querySelectorAll('[role="tabpanel"]'))},t.prototype._updateActiveTab=function(t){var e=this;t?t.forEach(function(t,r){var a=e.activeTab===r;a?t.removeAttribute("hidden"):t.setAttribute("hidden","hidden"),a&&redrawChildren(t)}):console.warn('Airship Tabs: Children elements must have role="tabpanel" attribute.')},t.prototype._renderTabs=function(t){return h("div",{role:"tablist",class:{"as-tabs":!0,"as-tabs--xl":this.xl}},t.map(this._renderTab.bind(this)))},t.prototype._renderTab=function(t,e){var r=this,a={"as-tabs__item":!0,"as-tabs__item--active":e===this.activeTab},i=this._getTitle(t,e);return h("button",{role:"tab",class:a,onClick:function(){r.activeTab=e}}," ",i," ")},t.prototype._getTitle=function(t,e){return t.getAttribute("data-title")?t.getAttribute("data-title"):"Tab "+e},Object.defineProperty(t,"is",{get:function(){return"as-tabs"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{activeTab:{type:Number,attr:"active-tab",mutable:!0},element:{elementRef:!0},xl:{type:Boolean,attr:"xl"}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return".as-tabs{--as--tabs--background-color:var(--as--color--ui-01,#fff);--as--tabs--border-color:var(--as--color--ui-03,#e2e6e3);--as--tabs--item--font:var(--as--font--body);--as--tabs--item--color:var(--as--color--primary,#1785fb);--as--tabs--item--color-hover:var(--as--color--type-01,#2c2c2c);--as--tabs--item--color-active:var(--as--color--primary,#1785fb);--as--tabs--item--border-color-hover:var(--as--color--complementary,#47db99);--as--tabs--item--border-color-active:var(--as--color--primary,#1785fb);--as--tabs--item--border-color-hover-active:var(--as--color--primary,#1785fb);--as--tabs--subheader--font:var(--as--font--subheader);--as--tabs--horizontal-padding:12px;display:-ms-flexbox;display:flex;-ms-flex-wrap:nowrap;flex-wrap:nowrap;-ms-flex-pack:start;justify-content:flex-start;margin:0;padding:0 var(--as--tabs--horizontal-padding);overflow-x:auto;-webkit-overflow-scrolling:touch;-ms-overflow-style:-ms-autohiding-scrollbar;background:var(--as--tabs--background-color);-webkit-box-shadow:inset 0 -1px 0 0 var(--as--tabs--border-color);box-shadow:inset 0 -1px 0 0 var(--as--tabs--border-color);list-style:none}.as-tabs::-webkit-scrollbar,.as-tabs::-webkit-scrollbar-thumb{display:none}.as-tabs__item{padding:8px 12px;display:inline-block;-ms-flex:0 0 auto;flex:0 0 auto;margin:0;-webkit-transition:border .2s;transition:border .2s;border:none;border-bottom:2px solid transparent;outline:none;background:none;color:var(--as--tabs--item--color);font:var(--as--tabs--item--font);text-decoration:none;cursor:pointer}.as-tabs__item:hover{border-bottom:2px solid var(--as--tabs--item--border-color-hover)}.as-tabs__item--active{border-bottom:2px solid var(--as--tabs--item--border-color-active);color:var(--as--tabs--item--color-active)}.as-tabs__item--active:hover{border-bottom:2px solid var(--as--tabs--item--border-color-hover-active)}.as-tabs__item a{color:inherit;text-decoration:none}.as-tabs--xl .as-tabs__item{border-bottom:4px solid transparent;font:var(--as--tabs--subheader--font)}.as-tabs--xl .as-tabs__item:focus,.as-tabs--xl .as-tabs__item:hover{border-bottom:4px solid var(--as--tabs--item--border-color-hover)}.as-tabs--xl .as-tabs__item--active,.as-tabs--xl .as-tabs__item:active{border-bottom:4px solid var(--as--tabs--item--border-color-active);color:var(--as--tabs--item--color-active)}as-tabs{display:block}"},enumerable:!0,configurable:!0}),t}();export{Tabs as AsTabs};