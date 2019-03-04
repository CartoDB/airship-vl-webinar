import { h } from '../airship.core.js';

import { a as yAxisService } from './chunk-95afe418.js';
import './chunk-6e6f6eb8.js';
import './chunk-2f8d3de5.js';

class YAxis {
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
    static get style() { return ".y-axis{--widget-axis-text-color:var(--as--color--type-01,#2c2c2c);--widget-axis-line-color:var(--as--color--ui-05,#b3b3b3)}.y-axis .tick text{width:30px;fill:var(--widget-axis-text-color);white-space:pre}.y-axis .tick line{stroke:var(--widget-axis-line-color);opacity:.1}.y-axis .tick line.zero{opacity:.5}.y-axis .domain{display:none}"; }
}

export { YAxis as AsYAxis };
