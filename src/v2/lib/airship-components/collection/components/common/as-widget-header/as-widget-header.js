export class WidgetHeader {
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
    static get style() { return "/**style-placeholder:as-widget-header:**/"; }
}
