import yAxisService from './y-axis.service';
export class YAxis {
    constructor() {
        this.from = 0;
        this.to = 0;
        this.responsive = true;
        this._resizeListener = this._resizeListener.bind(this);
    }
    componentWillLoad() {
        addEventListener('resize', this._resizeListener);
    }
    componentDidUnload() {
        removeEventListener('resize', this._resizeListener);
    }
    render() {
        const element = this.element.previousElementSibling;
        const scale = [this.from, this.to];
        yAxisService.renderYAxis(element, scale);
    }
    _resizeListener() {
        if (this.responsive) {
            this.element.forceUpdate();
        }
    }
    static get is() { return "as-y-axis"; }
    static get properties() { return {
        "element": {
            "elementRef": true
        },
        "from": {
            "type": Number,
            "attr": "from"
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "to": {
            "type": Number,
            "attr": "to"
        }
    }; }
    static get style() { return "/**style-placeholder:as-y-axis:**/"; }
}
