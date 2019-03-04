import { h } from '../airship.core.js';

class Loader {
    render() {
        return h("span", { class: 'as-loading' },
            h("svg", { viewBox: '0 0 50 50' },
                h("circle", { cx: '25', cy: '25', r: '20', fill: 'none' })));
    }
    static get is() { return "as-loader"; }
    static get style() { return "as-loader{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}"; }
}

class WidgetHeader {
    constructor() {
        this.header = '';
        this.subheader = '';
        this.error = '';
        this.isEmpty = false;
        this.isLoading = false;
        this.noDataMessage = 'NO DATA AVAILABLE';
    }
    render() {
        return [
            h("h2", { class: 'as-widget-header__header' }, this.header),
            this._getSubHeader(),
        ];
    }
    _getSubHeader() {
        if (this.isLoading) {
            return h("p", { class: 'as-widget-header__subheader as-body ' }, this.subheader);
        }
        if (this.error) {
            return h("p", { class: 'as-widget-header__subheader as-widget-header__subheader--error as-body ' }, this.error);
        }
        if (this.isEmpty) {
            return h("p", { class: 'as-widget-header__subheader as-widget-header__subheader--empty as-body ' }, this.noDataMessage);
        }
        return h("p", { class: 'as-widget-header__subheader as-body' }, this.subheader);
    }
    static get is() { return "as-widget-header"; }
    static get properties() { return {
        "error": {
            "type": String,
            "attr": "error"
        },
        "header": {
            "type": String,
            "attr": "header"
        },
        "isEmpty": {
            "type": Boolean,
            "attr": "is-empty"
        },
        "isLoading": {
            "type": Boolean,
            "attr": "is-loading"
        },
        "noDataMessage": {
            "type": String,
            "attr": "no-data-message"
        },
        "subheader": {
            "type": String,
            "attr": "subheader"
        }
    }; }
    static get style() { return "as-widget-header{--as--widget-header__header--color:var(--as--color--type-01);--as--widget-subheader--color:var(--as--color--type-02);--as--widget-header__subheader--color-error:var(--as--color--error);--as--widget-header__subheader--color-empty:var(--as--color--warning);display:block}as-widget-header .as-widget-header__header{margin:0;color:var(--as--widget-header__header--color);font:var(--as--font--subheader)}as-widget-header .as-widget-header__subheader{color:var(--as--widget-subheader--color,#f4f4f4)}as-widget-header .as-widget-header__subheader--error{color:var(--widget--subheader-color-error,#f3522b);text-transform:uppercase}as-widget-header .as-widget-header__subheader--empty{color:var(--widget--subheader-color-empty,#fdb32b);text-transform:uppercase}"; }
}

class WidgetSelection {
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
    static get style() { return "as-widget-selection .as-widget-selection__wrapper{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}as-widget-selection .as-widget-selection__clear{margin-left:8px;cursor:pointer}"; }
}

export { Loader as AsLoader, WidgetHeader as AsWidgetHeader, WidgetSelection as AsWidgetSelection };
