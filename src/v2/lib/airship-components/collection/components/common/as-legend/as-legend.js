export class Legend {
    render() {
        return Object.keys(this.data).map((key) => {
            return h("div", { class: 'legend-item' },
                h("span", { class: 'legend-item__box', style: { background: this.data[key] } }),
                h("span", { class: 'legend-item__label as-body' }, key));
        });
    }
    static get is() { return "as-legend"; }
    static get properties() { return {
        "data": {
            "type": "Any",
            "attr": "data"
        }
    }; }
    static get style() { return "/**style-placeholder:as-legend:**/"; }
}
