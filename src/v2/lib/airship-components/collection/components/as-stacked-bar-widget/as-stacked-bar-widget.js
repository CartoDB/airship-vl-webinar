import { event as d3event } from 'd3-selection';
import contentFragment from '../common/content.fragment';
import colorMapFactory from './utils/colorMap.factory';
import dataService from './utils/data.service';
import drawService from './utils/draw.service';
const BAR_WIDTH_THRESHOLD = 3;
export class StackedBarWidget {
    constructor() {
        this.showLegend = true;
        this.data = [];
        this.isLoading = false;
        this.error = '';
        this.errorDescription = '';
        this.noDataHeaderMessage = 'NO DATA AVAILABLE';
        this.noDataBodyMessage = 'There is no data to display.';
        this.responsive = true;
        this.scale = [0, 0];
        this.mouseOver = (data) => {
            const event = d3event;
            this.tooltip.style.display = 'inline';
            this.tooltip.style.left = `${event.clientX}px`;
            this.tooltip.style.top = `${event.clientY}px`;
            this.tooltip.innerText = `${this.formatFn(data.v)}`;
        };
        this.mouseLeave = () => {
            this.tooltip.style.display = 'none';
        };
        this.formatFn = (value) => {
            return value;
        };
        this._resizeListener = this._resizeListener.bind(this);
    }
    render() {
        return [
            h("as-widget-header", { header: this.heading, subheader: this.description, "is-loading": this.isLoading, "is-empty": this._isEmpty(), error: this.error, "no-data-message": this.noDataHeaderMessage }),
            this._renderContent()
        ];
    }
    componentDidLoad() {
        this._drawFigure();
    }
    componentDidUpdate() {
        this._drawFigure();
    }
    componentWillLoad() {
        this._setupState();
        addEventListener('resize', this._resizeListener);
    }
    componentWillUpdate() {
        this._setupState();
    }
    componentDidUnload() {
        removeEventListener('resize', this._resizeListener);
    }
    _onDataChanged() {
        this._setupState();
        this._drawFigure();
    }
    _setupState() {
        this.scale = dataService.getDomain(this.data);
        this.colorMap = this._createColorMap(this.data, this.metadata);
    }
    _renderContent() {
        return contentFragment(this.isLoading, this.error, this._isEmpty(), this.heading, this.errorDescription, this.noDataBodyMessage, [
            h("svg", { class: 'figure', ref: (ref) => this.container = ref }),
            this._renderLegend(),
            h("span", { ref: (ref) => this.tooltip = ref, role: 'tooltip', class: 'as-tooltip as-tooltip--top' }, " TOOLTIP")
        ]);
    }
    _drawFigure() {
        if (!this._isContainerReady()) {
            return;
        }
        requestAnimationFrame(() => {
            const yAxis = this._drawYAxis();
            this._drawColumns(yAxis);
        });
    }
    _drawColumns(yAxisElement) {
        if (this.isLoading || this.error || this._isEmpty()) {
            return;
        }
        const Y_AXIS_LABEL_WIDTH = 25;
        let columnMargin = 4;
        let WIDTH = yAxisElement.getBoundingClientRect().width - Y_AXIS_LABEL_WIDTH - columnMargin;
        let COLUMN_WIDTH = (WIDTH / this.data.length) - columnMargin;
        if (COLUMN_WIDTH < BAR_WIDTH_THRESHOLD) {
            WIDTH += columnMargin;
            COLUMN_WIDTH += columnMargin;
            columnMargin = 0;
        }
        const data = dataService.rawDataToStackBarData(this.data, this.scale, this.colorMap, COLUMN_WIDTH, columnMargin);
        drawService.drawColumns(this.container, data, this.mouseOver, this.mouseLeave);
    }
    _drawYAxis() {
        return drawService.drawYAxis(this.container, this.scale);
    }
    _renderLegend() {
        if (this.showLegend && this.colorMap) {
            const legendData = dataService.createLegendData(this.metadata, this.colorMap);
            return h("as-legend", { data: legendData });
        }
    }
    _createColorMap(data, metadata) {
        const keys = dataService.getKeys(data);
        return colorMapFactory.create(keys, metadata);
    }
    _isEmpty() {
        return !this.data || !this.data.length;
    }
    _resizeListener() {
        if (this.responsive) {
            this.el.forceUpdate();
        }
    }
    _isContainerReady() {
        if (!this.container || this.el.clientWidth === 0 || this.el.clientHeight === 0) {
            return false;
        }
        return true;
    }
    static get is() { return "as-stacked-bar-widget"; }
    static get properties() { return {
        "data": {
            "type": "Any",
            "attr": "data",
            "watchCallbacks": ["_onDataChanged"]
        },
        "description": {
            "type": String,
            "attr": "description"
        },
        "el": {
            "elementRef": true
        },
        "error": {
            "type": String,
            "attr": "error"
        },
        "errorDescription": {
            "type": String,
            "attr": "error-description"
        },
        "formatFn": {
            "type": "Any",
            "attr": "format-fn"
        },
        "heading": {
            "type": String,
            "attr": "heading"
        },
        "isLoading": {
            "type": Boolean,
            "attr": "is-loading"
        },
        "metadata": {
            "type": "Any",
            "attr": "metadata"
        },
        "mouseLeave": {
            "type": "Any",
            "attr": "mouse-leave"
        },
        "mouseOver": {
            "type": "Any",
            "attr": "mouse-over"
        },
        "noDataBodyMessage": {
            "type": String,
            "attr": "no-data-body-message"
        },
        "noDataHeaderMessage": {
            "type": String,
            "attr": "no-data-header-message"
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "showLegend": {
            "type": Boolean,
            "attr": "show-legend"
        }
    }; }
    static get style() { return "/**style-placeholder:as-stacked-bar-widget:**/"; }
}
