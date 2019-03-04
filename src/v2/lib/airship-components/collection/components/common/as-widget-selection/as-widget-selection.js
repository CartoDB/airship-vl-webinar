export class WidgetSelection {
    constructor() {
        this.clearText = 'Clear selection';
    }
    render() {
        return h("div", { class: 'as-color--type-01 as-widget-selection__wrapper' },
            h("span", { class: 'as-widget-selection__selection as-body' }, this.selection),
            this.showClear ? this.renderClearBtn() : '');
    }
    renderClearBtn() {
        return (h("span", { class: 'as-body as-color--primary as-widget-selection__clear', onClick: () => { this.clear.emit(); } }, this.clearText));
    }
    static get is() { return "as-widget-selection"; }
    static get properties() { return {
        "clearText": {
            "type": String,
            "attr": "clear-text"
        },
        "selection": {
            "type": String,
            "attr": "selection"
        },
        "showClear": {
            "type": Boolean,
            "attr": "show-clear"
        }
    }; }
    static get events() { return [{
            "name": "clear",
            "method": "clear",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:as-widget-selection:**/"; }
}
