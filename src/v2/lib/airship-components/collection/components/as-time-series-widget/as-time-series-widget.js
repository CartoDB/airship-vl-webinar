import { scaleLinear } from 'd3-scale';
import { event as d3event } from 'd3-selection';
import { timeFormat, timeFormatDefaultLocale } from 'd3-time-format';
import { icon } from '../../utils/icons';
import { DEFAULT_BACKGROUND_BAR_COLOR, DEFAULT_BAR_COLOR } from '../common/constants';
import { prepareData, sameData } from './utils/data.service';
const SCRUBBER_SIZE = 6;
export class TimeSeriesWidget {
    constructor() {
        this.showHeader = true;
        this.disableInteractivity = false;
        this.data = [];
        this.backgroundData = [];
        this.color = DEFAULT_BAR_COLOR;
        this.unselectedColor = DEFAULT_BACKGROUND_BAR_COLOR;
        this.isLoading = false;
        this.error = '';
        this.errorDescription = '';
        this.noDataHeaderMessage = 'NO DATA AVAILABLE';
        this.noDataBodyMessage = 'There is no data to display.';
        this.responsive = true;
        this.progress = 0;
        this.playing = false;
        this.animated = false;
        this.timeFormat = '%x - %X';
        this.clearText = 'Clear selection';
        this.range = null;
        this.disableAnimation = false;
        this.xAxisOptions = {};
        this.yAxisOptions = {};
        this.axisFormatter = this.axisFormatter.bind(this);
    }
    onDataChanged(newData, oldData) {
        if (sameData(newData, oldData)) {
            return;
        }
        else {
            this._data = prepareData(newData);
        }
    }
    onBackgroundDataChanged(newData) {
        this._backgroundData = prepareData(newData);
    }
    onProgressChanged() {
        this._render();
    }
    onTimeFormatChanged(newFormat) {
        this._formatter = timeFormat(newFormat);
        this.histogram.forceUpdate();
    }
    onTimeFormatLocaleChanged(newLocale) {
        try {
            timeFormatDefaultLocale(newLocale);
            if (this.timeFormat) {
                this.onTimeFormatChanged(this.timeFormat);
            }
        }
        catch (e) {
            throw new Error('Invalid time format.');
        }
    }
    defaultFormatter(data) {
        return this.histogram.defaultFormatter(data);
    }
    async getSelection() {
        return this.histogram.getSelection();
    }
    setSelection(values) {
        this.histogram.setSelection(values);
    }
    clearSelection() {
        this.histogram.clearSelection();
    }
    xFormatter(value) {
        return this.histogram.xFormatter(value);
    }
    async componentWillLoad() {
        this.onDataChanged(this.data, []);
        this.onBackgroundDataChanged(this.backgroundData);
    }
    async componentDidLoad() {
        console.warn('[as-time-series-widget] This is an unreleased component, use at your own risk');
        if (this.timeFormatLocale) {
            timeFormatDefaultLocale(this.timeFormatLocale);
        }
        this._formatter = timeFormat(this.timeFormat);
        this.histogram.addEventListener('selectionInput', (evt) => {
            if (evt.detail === null) {
                this._selection = null;
            }
            else {
                this._selection = evt.detail.selection;
            }
            this._render();
        });
        this.histogram.addEventListener('selectionChanged', (evt) => {
            evt.stopPropagation();
            if (evt.detail === null) {
                this.selectionChanged.emit(null);
                return;
            }
            const selectedDates = evt.detail.selection.map((epoch) => new Date(epoch));
            this.selectionChanged.emit(selectedDates);
            this._render();
        });
        this.histogram.addEventListener('drawParametersChanged', (evt) => {
            this._renderOptions = evt.detail;
            this._render();
        });
        this._selection = await this.histogram.getSelection();
    }
    render() {
        return [
            this._renderButton(),
            h("as-histogram-widget", { ref: (ref) => { this.histogram = ref; }, heading: this.heading, description: this.description, showHeader: this.showHeader, showClear: this.showClear, disableInteractivity: this.disableInteractivity, data: this._data, backgroundData: this._backgroundData, color: this.color, unselectedColor: this.unselectedColor, colorRange: this.colorRange, axisFormatter: this.axisFormatter, tooltipFormatter: this.tooltipFormatter, xLabel: this.xLabel, yLabel: this.yLabel, isLoading: this.isLoading, error: this.error, errorDescription: this.errorDescription, noDataHeaderMessage: this.noDataHeaderMessage, noDataBodyMessage: this.noDataBodyMessage, responsive: this.responsive, clearText: this.clearText, range: this.range, disableAnimation: this.disableAnimation, xAxisOptions: this.xAxisOptions, yAxisOptions: this.yAxisOptions })
        ];
    }
    axisFormatter(value) {
        return this._formatter(new Date(value));
    }
    _renderButton() {
        if (!this.animated) {
            return null;
        }
        const classes = {
            'as-time-series--play-button': true,
            'as-time-series--play-button-hidden': !this.data.length || this.isLoading || !!this.error,
            'as-time-series--play-button-x-label': !!this.xLabel
        };
        return h("div", { class: classes, onClick: this._playPauseClick.bind(this) }, icon(this.playing ? 'PAUSE' : 'PLAY', 'var(--as--color--primary)', { width: '32px', height: '32px' }));
    }
    _playPauseClick() {
        this.playing ? this.pause.emit() : this.play.emit();
    }
    _render() {
        if (!this._renderOptions) {
            return;
        }
        const { container, height, width, padding, xScale, binsScale, handleWidth } = this._renderOptions;
        let timeSeries = container.select('.as-time-series--g');
        if (!this.animated) {
            if (!timeSeries.empty()) {
                timeSeries.remove();
            }
            return;
        }
        const { left } = container.node().getBoundingClientRect();
        const [X_PADDING, Y_PADDING] = padding;
        const progressScale = scaleLinear().domain([0, 100]);
        let trackOffset = 0;
        if (this._selection) {
            const selection = this._selection.map((e) => xScale(binsScale(e)));
            trackOffset = handleWidth / 2;
            progressScale.range([
                selection[0] + trackOffset + (SCRUBBER_SIZE / 2),
                selection[1] - trackOffset - (SCRUBBER_SIZE / 2)
            ]);
        }
        else {
            progressScale.range([0, width - X_PADDING]);
        }
        const xPos = progressScale(this.progress);
        container.on('click', () => {
            const evt = d3event;
            const pctX = Math.round(progressScale.invert(evt.clientX - left - X_PADDING + 8));
            if (pctX > 100 || pctX < 0) {
                return;
            }
            this.seek.emit(pctX);
        });
        if (timeSeries.empty()) {
            timeSeries = container
                .append('g')
                .attr('class', 'as-time-series--g');
            timeSeries.append('line')
                .attr('class', 'as-time-series--preview')
                .attr('stroke-width', 4)
                .attr('stroke', 'gray')
                .attr('opacity', '0');
            timeSeries.append('line')
                .attr('class', 'as-time-series--line')
                .attr('stroke-width', 4);
            timeSeries.append('circle')
                .attr('class', 'as-time-series--scrubber')
                .attr('r', SCRUBBER_SIZE)
                .attr('stroke-width', 0);
            timeSeries.append('line')
                .attr('class', 'as-time-series--track')
                .attr('stroke-width', 16)
                .attr('stroke', 'black')
                .attr('opacity', '0')
                .on('mouseleave', () => {
                this._lastMousePosition = -1;
                timeSeries.select('.as-time-series--preview')
                    .attr('opacity', '0');
            });
        }
        timeSeries.select('.as-time-series--line')
            .attr('x1', progressScale(0) - (SCRUBBER_SIZE / 2))
            .attr('x2', xPos)
            .attr('y1', height - Y_PADDING)
            .attr('y2', height - Y_PADDING);
        timeSeries.select('.as-time-series--track')
            .attr('y1', height - Y_PADDING)
            .attr('y2', height - Y_PADDING)
            .attr('x1', progressScale(0) + trackOffset)
            .attr('x2', progressScale(100) - trackOffset)
            .on('mousemove', () => {
            const evt = d3event;
            this._lastMousePosition = evt.clientX - left - X_PADDING + 8;
            if (this._lastMousePosition > progressScale(this.progress)) {
                timeSeries.select('.as-time-series--preview')
                    .attr('x2', this._lastMousePosition)
                    .attr('opacity', '1');
            }
        });
        timeSeries.select('.as-time-series--preview')
            .attr('x1', xPos - (SCRUBBER_SIZE / 2))
            .attr('y1', height - Y_PADDING)
            .attr('y2', height - Y_PADDING)
            .attr('opacity', () => {
            if (this._lastMousePosition > xPos) {
                return '1';
            }
            return '0';
        });
        timeSeries.select('.as-time-series--scrubber')
            .attr('transform', `translate(${xPos - (SCRUBBER_SIZE / 2)},${height - Y_PADDING})`);
    }
    static get is() { return "as-time-series-widget"; }
    static get properties() { return {
        "animated": {
            "type": Boolean,
            "attr": "animated",
            "reflectToAttr": true
        },
        "backgroundData": {
            "type": "Any",
            "attr": "background-data",
            "watchCallbacks": ["onBackgroundDataChanged"]
        },
        "clearSelection": {
            "method": true
        },
        "clearText": {
            "type": String,
            "attr": "clear-text"
        },
        "color": {
            "type": String,
            "attr": "color"
        },
        "colorRange": {
            "type": "Any",
            "attr": "color-range"
        },
        "data": {
            "type": "Any",
            "attr": "data",
            "watchCallbacks": ["onDataChanged"]
        },
        "defaultFormatter": {
            "method": true
        },
        "description": {
            "type": String,
            "attr": "description"
        },
        "disableAnimation": {
            "type": Boolean,
            "attr": "disable-animation"
        },
        "disableInteractivity": {
            "type": Boolean,
            "attr": "disable-interactivity"
        },
        "error": {
            "type": String,
            "attr": "error"
        },
        "errorDescription": {
            "type": String,
            "attr": "error-description"
        },
        "getSelection": {
            "method": true
        },
        "heading": {
            "type": String,
            "attr": "heading"
        },
        "isLoading": {
            "type": Boolean,
            "attr": "is-loading"
        },
        "noDataBodyMessage": {
            "type": String,
            "attr": "no-data-body-message"
        },
        "noDataHeaderMessage": {
            "type": String,
            "attr": "no-data-header-message"
        },
        "playing": {
            "type": Boolean,
            "attr": "playing"
        },
        "progress": {
            "type": Number,
            "attr": "progress",
            "watchCallbacks": ["onProgressChanged"]
        },
        "range": {
            "type": "Any",
            "attr": "range"
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "setSelection": {
            "method": true
        },
        "showClear": {
            "type": Boolean,
            "attr": "show-clear"
        },
        "showHeader": {
            "type": Boolean,
            "attr": "show-header"
        },
        "timeFormat": {
            "type": String,
            "attr": "time-format",
            "watchCallbacks": ["onTimeFormatChanged"]
        },
        "timeFormatLocale": {
            "type": "Any",
            "attr": "time-format-locale",
            "watchCallbacks": ["onTimeFormatLocaleChanged"]
        },
        "tooltipFormatter": {
            "type": "Any",
            "attr": "tooltip-formatter"
        },
        "unselectedColor": {
            "type": String,
            "attr": "unselected-color"
        },
        "xAxisOptions": {
            "type": "Any",
            "attr": "x-axis-options"
        },
        "xFormatter": {
            "method": true
        },
        "xLabel": {
            "type": String,
            "attr": "x-label"
        },
        "yAxisOptions": {
            "type": "Any",
            "attr": "y-axis-options"
        },
        "yLabel": {
            "type": String,
            "attr": "y-label"
        }
    }; }
    static get events() { return [{
            "name": "play",
            "method": "play",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "pause",
            "method": "pause",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "selectionChanged",
            "method": "selectionChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "seek",
            "method": "seek",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:as-time-series-widget:**/"; }
}
