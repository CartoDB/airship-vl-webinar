export class Loader {
    render() {
        return h("span", { class: 'as-loading' },
            h("svg", { viewBox: '0 0 50 50' },
                h("circle", { cx: '25', cy: '25', r: '20', fill: 'none' })));
    }
    static get is() { return "as-loader"; }
    static get style() { return "/**style-placeholder:as-loader:**/"; }
}
