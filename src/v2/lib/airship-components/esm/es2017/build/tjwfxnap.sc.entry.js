import { h } from '../airship.core.js';

class Toolbar {
    componentWillLoad() {
        this.actions = this.element.querySelector('.as-toolbar__actions');
    }
    componentWillUpdate() {
        this.actions = this.element.querySelector('.as-toolbar__actions');
    }
    render() {
        return (h("header", { class: 'as-toolbar' },
            this._renderToggleButton(),
            h("slot", null)));
    }
    _toggleDrawer() {
        this.actions.classList.toggle('as-toolbar__actions--visible');
    }
    _renderToggleButton() {
        if (!this.actions) {
            return;
        }
        return (h("button", { onClick: this._toggleDrawer.bind(this), class: 'as-toolbar__item as-toolbar__toggle' },
            h("i", { class: 'as-icon-hamburguer as-title as-m--0' })));
    }
    static get is() { return "as-toolbar"; }
    static get properties() { return {
        "element": {
            "elementRef": true
        }
    }; }
    static get style() { return "as-toolbar{display:block;z-index:3}"; }
}

export { Toolbar as AsToolbar };
