import { event as d3event, select } from 'd3-selection';
import 'd3-transition';
import readableNumber from '../../utils/readable-number';
import { DEFAULT_BACKGROUND_BAR_COLOR, DEFAULT_BACKGROUND_BAR_COLOR_HEX, DEFAULT_BAR_COLOR, DEFAULT_BAR_COLOR_HEX } from '../common/constants';
import contentFragment from '../common/content.fragment';
import brushService from './utils/brush.service';
import dataService, { binsScale, isBackgroundCompatible, isCategoricalData, prepareData } from './utils/data.service';
import drawService, { conditionalFormatter } from './utils/draw.service';
import interactionService from './utils/interaction.service';
const CUSTOM_HANDLE_WIDTH = 8;
const CUSTOM_HANDLE_HEIGHT = 20;
const X_PADDING = 38;
const Y_PADDING = 40;
const LABEL_PADDING = 25;
const FG_CLASSNAME = 'foreground-bar';
const BG_CLASSNAME = 'background-bar';
export class HistogramWidget {
    constructor() {
        this.showHeader = true;
        this.disableInteractivity = false;
        this.data = [];
        this.backgroundData = null;
        this.color = DEFAULT_BAR_COLOR;
        this.unselectedColor = DEFAULT_BACKGROUND_BAR_COLOR;
        this.tooltipFormatter = this.defaultFormatter;
        this.isLoading = false;
        this.error = '';
        this.errorDescription = '';
        this.noDataHeaderMessage = 'NO DATA AVAILABLE';
        this.noDataBodyMessage = 'There is no data to display.';
        this.responsive = true;
        this.clearText = 'Clear selection';
        this.selectedFormatter = this._selectionFormatter;
        this.range = null;
        this.disableAnimation = false;
        this.xAxisOptions = {};
        this.yAxisOptions = {};
        this.selection = null;
        this.tooltip = null;
        this._mockBackground = false;
        this._muteSelectionChanged = false;
        this._lastEmittedSelection = null;
        this.selectionEmpty = true;
        this.selectionFooter = '';
        this._resizeRender = this._resizeRender.bind(this);
    }
    _onBackgroundDataChanged(newBackgroundData) {
        if (newBackgroundData === null || newBackgroundData.length === 0) {
            this._prepareData(this.data, null);
            return;
        }
        if (isBackgroundCompatible(this.data, newBackgroundData)) {
            this._prepareData(this.data, newBackgroundData);
        }
    }
    _onDataChanged(newData, oldData) {
        this._lastEmittedSelection = null;
        if (isBackgroundCompatible(newData, this.backgroundData)) {
            this._prepareData(this.data, this.backgroundData, oldData);
        }
        else {
            this._prepareData(this.data, null, oldData);
        }
    }
    _prepareData(data, backgroundData, oldData) {
        this._data = prepareData(data);
        this._backgroundData = backgroundData === null ? this._mockBackgroundData(data) : prepareData(backgroundData);
        this._mockBackground = backgroundData === null;
        const newScale = binsScale(this._data);
        const wasCategoricalData = !!this.isCategoricalData;
        this.isCategoricalData = isCategoricalData(this._data);
        if (wasCategoricalData !== this.isCategoricalData) {
            this.selection = null;
        }
        else {
            this.selection = this._preadjustSelection(oldData, newScale, data.length);
        }
        this.binsScale = newScale;
        this._muteSelectionChanged = true;
        this._dataJustChanged = true;
    }
    _onColorChanged(newColor) {
        const incomingColor = newColor || DEFAULT_BAR_COLOR;
        this._color = this._toColor(incomingColor, DEFAULT_BAR_COLOR_HEX);
    }
    _onSelectedColorChanged(newColor) {
        const incomingColor = newColor || DEFAULT_BACKGROUND_BAR_COLOR;
        this._barBackgroundColor = this._toColor(incomingColor, DEFAULT_BACKGROUND_BAR_COLOR_HEX);
    }
    defaultFormatter(data) {
        const tooltip = [];
        if (this.isCategoricalData) {
            tooltip.push(`${data.category}`);
        }
        tooltip.push(`${readableNumber(data.value).trim()}`);
        return tooltip;
    }
    async getSelection() {
        const data = this._dataForSelection(this.selection);
        return this._simplifySelection(data);
    }
    setSelection(values) {
        if (values === null) {
            this._setSelection(null);
            this.emitSelection(this.selectionChanged, this.selection);
            return;
        }
        if (values.some((value) => typeof value === 'string')) {
            return;
        }
        const bins = values.map(this.binsScale);
        this._setSelection(bins);
        if (!this._muteSelectionChanged) {
            this.emitSelection(this.selectionChanged, this.selection);
        }
    }
    clearSelection() {
        this.setSelection(null);
    }
    xFormatter(value) {
        if (this.axisFormatter) {
            return this.axisFormatter(value);
        }
        return value;
    }
    componentDidLoad() {
        this._color = this._toColor(this.color, DEFAULT_BAR_COLOR_HEX);
        this._barBackgroundColor = this._toColor(this.unselectedColor, DEFAULT_BACKGROUND_BAR_COLOR_HEX);
        if (!this._hasDataToDisplay()) {
            return;
        }
        this.binsScale = binsScale(this._data);
        this.isCategoricalData = isCategoricalData(this._data);
        requestAnimationFrame(() => {
            this._renderGraph();
        });
    }
    componentDidUpdate() {
        if (!this._skipRender || this._dataJustChanged) {
            this._renderGraph();
        }
        this._skipRender = false;
        this._dataJustChanged = false;
    }
    componentWillLoad() {
        addEventListener('resize', this._resizeRender);
        this.selectionFooter = this.selectedFormatter(this.selection);
        this._onBackgroundDataChanged(this.backgroundData);
        this._onDataChanged(this.data, null);
    }
    componentDidUnload() {
        removeEventListener('resize', this._resizeRender);
    }
    render() {
        return [
            this._renderHeader(),
            this._renderSelection(),
            this._renderContent(),
        ];
    }
    _resizeRender() {
        requestAnimationFrame(() => {
            this._renderGraph();
        });
    }
    _renderContent() {
        const histogramClasses = {
            'as-histogram-widget--categorical': this.isCategoricalData,
            'as-histogram-widget__wrapper': true,
            'as-histogram-widget__wrapper--disabled': this.disableInteractivity
        };
        const svgClasses = {
            'figure': true,
            'figure--has-x-label': this.xLabel,
            'figure--has-y-label': this.yLabel
        };
        return contentFragment(this.isLoading, this.error, this._isEmpty(), this.heading, this.errorDescription, this.noDataBodyMessage, h("div", { class: histogramClasses },
            h("svg", { class: svgClasses, ref: (ref) => this.container = select(ref) }),
            this._renderLabels(),
            this._renderTooltip()));
    }
    _mockBackgroundData(data) {
        const min = dataService.getLowerBounds(data);
        return data.map((value) => (Object.assign({}, value, { value: Math.max(0, min) })));
    }
    _selectionFormatter(selection) {
        if (selection === null) {
            return 'All selected';
        }
        if (this.isCategoricalData) {
            return `${selection[1] - selection[0]} selected`;
        }
        let formattedSelection;
        const domainSelection = selection.map(this.binsScale.invert);
        if (this.axisFormatter) {
            formattedSelection = domainSelection.map(this.axisFormatter);
        }
        else {
            formattedSelection = domainSelection.map((e) => `${conditionalFormatter(e)}`);
        }
        return `Selected from ${formattedSelection[0]} to ${formattedSelection[1]}`;
    }
    _renderSelection() {
        if (this.isLoading || this._isEmpty() || this.error || !this.showClear) {
            return '';
        }
        return h("as-widget-selection", { selection: this.selectionFooter, clearText: this.clearText, showClear: !this.selectionEmpty, onClear: () => this.clearSelection() });
    }
    _renderGraph() {
        if (!this.container || !this.container.node()) {
            return;
        }
        const bbox = this.container.node().getBoundingClientRect();
        const firstRender = this.prevWidth === undefined || this.prevHeight === undefined;
        this.prevWidth = this.width;
        this.prevHeight = this.height;
        this.width = bbox.width;
        this.height = bbox.height;
        const resizing = !firstRender && (this.prevWidth !== this.width || this.height !== this.prevHeight);
        if (this.height === 0 || this.width === 0) {
            return;
        }
        this._generateYAxis();
        this._renderXAxis();
        this.barsContainer = drawService.renderPlot(this.container);
        interactionService.addTooltip(this.container, this.barsContainer, this, this._color, this._barBackgroundColor, (value) => this.tooltipFormatter(value), this._setTooltip.bind(this), FG_CLASSNAME);
        drawService.renderBars(this._backgroundData, this.yScale, this.container, this.barsContainer, this._barBackgroundColor, X_PADDING + (this.yLabel ? LABEL_PADDING : 0), Y_PADDING, this.disableAnimation || resizing, BG_CLASSNAME);
        drawService.renderBars(this._data, this.yScale, this.container, this.barsContainer, this._color, X_PADDING + (this.yLabel ? LABEL_PADDING : 0), Y_PADDING, this.disableAnimation || resizing, FG_CLASSNAME);
        drawService.renderYAxis(this.container, this.yAxis, X_PADDING);
        if (!this.disableInteractivity) {
            this.brush = brushService.addBrush(this.width, this.height, this._onBrush.bind(this), this._onBrushEnd.bind(this), CUSTOM_HANDLE_WIDTH, CUSTOM_HANDLE_HEIGHT, X_PADDING + (this.yLabel ? LABEL_PADDING : 0), Y_PADDING);
            this.brushArea = brushService.addBrushArea(this.brush, this.container);
            this.customHandles = brushService.addCustomHandles(this.brushArea, CUSTOM_HANDLE_WIDTH, CUSTOM_HANDLE_HEIGHT, this.yScale);
        }
        this._updateSelection();
        this.drawParametersChanged.emit({
            binsScale: this.binsScale,
            container: this.container,
            handleWidth: CUSTOM_HANDLE_WIDTH,
            height: this.height,
            padding: [X_PADDING + (this.yLabel ? LABEL_PADDING : 0), Y_PADDING],
            width: this.width,
            xScale: this.xScale
        });
        this._muteSelectionChanged = false;
    }
    _setTooltip(value, evt) {
        this._muteSelectionChanged = true;
        if (value === null) {
            this._hideTooltip();
            return;
        }
        this._skipRender = true;
        this.tooltip = value;
        this._showTooltip(evt);
    }
    _updateSelection() {
        if (this.selection === null || this.disableInteractivity) {
            return;
        }
        if (this._selectionInData(this.selection)) {
            this._setSelection(this.selection);
        }
        else {
            this.clearSelection();
        }
    }
    _adjustSelection(values) {
        if (values === null) {
            return null;
        }
        return values.map((value) => this._adjustSelectionValue(value));
    }
    _adjustSelectionValue(value) {
        if (value < 0) {
            return 0;
        }
        if (value >= this._data.length) {
            return this._data.length;
        }
        return Math.round(value);
    }
    _hideCustomHandles() {
        this.customHandles.style('opacity', 0);
        this.brushArea.selectAll('.bottomline').style('opacity', 0);
    }
    _onBrush() {
        if (this.disableInteractivity) {
            return;
        }
        const evt = d3event;
        if (evt.selection === null) {
            this._hideCustomHandles();
            return;
        }
        if (!evt.sourceEvent || evt.sourceEvent.type === 'brush') {
            return;
        }
        const d0 = evt.selection
            .map((selection) => this.xScale.invert(selection));
        this._setSelection(d0);
    }
    _onBrushEnd() {
        if (this.disableInteractivity) {
            return;
        }
        if (!this._muteSelectionChanged) {
            this.emitSelection(this.selectionChanged, this.selection);
        }
    }
    _setSelection(selection) {
        if (this.disableInteractivity) {
            return;
        }
        const adjustedSelection = this._adjustSelection(selection);
        if (adjustedSelection !== null && (adjustedSelection[0] === adjustedSelection[1])) {
            return;
        }
        const sameSelection = this.selection !== null &&
            adjustedSelection !== null &&
            this.selection.every((d, i) => adjustedSelection[i] === d);
        this.selection = adjustedSelection;
        this._updateHandles(adjustedSelection);
        if (!sameSelection) {
            this._hideTooltip();
            this.emitSelection(this.selectionInput, this.selection);
        }
        this.selectionEmpty = this.selection === null;
        this.selectionFooter = this.selectedFormatter(this.selection);
    }
    _preadjustSelection(oldData, newScale, nBuckets) {
        if (!(oldData && this.selection)) {
            return this.selection;
        }
        if (this.isCategoricalData) {
            const selectedCats = this._simplifySelection(this._dataForSelection(this.selection, oldData));
            const selection = selectedCats.map((value) => {
                return this._data.findIndex((d) => d.category === value);
            });
            if (selection.some((e) => e === -1)) {
                return null;
            }
            return [selection[0], selection[selection.length - 1] + 1];
        }
        const oldSelection = this._simplifySelection(this._dataForSelection(this.selection, oldData));
        const newSelection = oldSelection.map(newScale);
        return [Math.max(0, newSelection[0]), Math.min(nBuckets, newSelection[1])];
    }
    _dataForSelection(selection, from) {
        if (selection === null) {
            return null;
        }
        const data = from !== undefined ? from : this.data;
        if (this.isCategoricalData) {
            return data
                .slice(selection[0], selection[1])
                .map((d) => d);
        }
        return [data[selection[0]], data[selection[1] - 1]];
    }
    _simplifySelection(selection) {
        if (selection === null) {
            return null;
        }
        if (this.isCategoricalData) {
            return selection.map((value) => value.category);
        }
        return [selection[0].start, selection[selection.length - 1].end];
    }
    _sameSelection(first, second) {
        if (first === null || second === null) {
            return false;
        }
        return (first[0] === second[0] && first[1] === second[1]);
    }
    emitSelection(emitter, selection) {
        if (this._sameSelection(selection, this._lastEmittedSelection)) {
            return;
        }
        if (selection === null) {
            emitter.emit(null);
            return;
        }
        const payload = this._dataForSelection(selection);
        const evt = {
            payload,
            selection: this._simplifySelection(payload),
            type: this._eventType()
        };
        emitter.emit(evt);
        if (emitter === this.selectionChanged) {
            this._lastEmittedSelection = [selection[0], selection[1]];
        }
    }
    _eventType() {
        return this.isCategoricalData ? 'categorical' : 'continuous';
    }
    _selectionInData(selection) {
        const domainSelection = selection.map(this.binsScale.invert);
        const inData = domainSelection.map((selectionValue) => {
            return this._data.some((value) => selectionValue >= value.start && selectionValue <= value.end);
        });
        return inData.some((e) => e);
    }
    _updateHandles(values) {
        if (!this.xScale) {
            return;
        }
        if (values === null) {
            this.barsContainer.selectAll(`rect.${FG_CLASSNAME}`)
                .style('fill', (_d, i) => {
                const d = this._data[i];
                return d.color || this._color;
            });
            this.brushArea.call(this.brush.move, null);
            return;
        }
        const yCoord = this.yScale(this.yScale.domain()[0]);
        const spaceValues = values
            .map(this.xScale);
        const domainValues = values.map(this.binsScale.invert);
        this.brushArea.call(this.brush.move, spaceValues);
        this.customHandles
            .style('opacity', 1)
            .attr('transform', (_d, i) => {
            return `translate(${(spaceValues[i] - (CUSTOM_HANDLE_WIDTH / 2) - 1)},${yCoord - CUSTOM_HANDLE_HEIGHT / 2})`;
        });
        this.brushArea.selectAll('.bottomline')
            .style('opacity', 1)
            .attr('stroke-width', 2)
            .attr('x1', spaceValues[0])
            .attr('x2', spaceValues[1]);
        this.barsContainer.selectAll(`rect.${FG_CLASSNAME}`)
            .style('fill', (_d, i) => {
            const d = this._data[i];
            if (!d) {
                return;
            }
            if (!(domainValues[0] <= d.start && d.end <= domainValues[1])) {
                return this._barBackgroundColor;
            }
            return d.color || this._color;
        });
    }
    _dataForDomain() {
        if (this._backgroundData === null || this._backgroundData.length === 0 || this._mockBackground) {
            return this._data;
        }
        return this._backgroundData;
    }
    _generateYAxis() {
        const yDomain = this.range !== null ? this.range : dataService.getYDomain(this._dataForDomain());
        this.yAxis = drawService.generateYScale(this.container, yDomain, X_PADDING + (this.yLabel ? LABEL_PADDING : 0), Y_PADDING, this.yAxisOptions);
        this.yScale = this.yAxis.scale();
    }
    _renderXAxis() {
        const xDomain = dataService.getXDomain(this._data);
        const xAxis = drawService.renderXAxis(this.container, xDomain, this._data.length, X_PADDING + (this.yLabel ? LABEL_PADDING : 0), Y_PADDING, this.axisFormatter, this.xAxisOptions);
        this.xScale = xAxis.scale();
    }
    _getTooltipPosition(mouseX, mouseY) {
        const OFFSET = 25;
        let x = mouseX;
        let y = mouseY;
        const viewportBoundaries = {
            bottom: window.innerHeight + window.pageYOffset,
            right: window.innerWidth + window.pageXOffset,
        };
        const tooltipContainerBoundingRect = this.tooltipElement.getBoundingClientRect();
        const tooltipBoundaries = {
            bottom: mouseY + tooltipContainerBoundingRect.height,
            right: mouseX + tooltipContainerBoundingRect.width,
        };
        if (viewportBoundaries.right < tooltipBoundaries.right) {
            x = mouseX - tooltipContainerBoundingRect.width;
        }
        if (viewportBoundaries.bottom < tooltipBoundaries.bottom) {
            y = mouseY - tooltipContainerBoundingRect.height - OFFSET;
        }
        return [x, y];
    }
    _showTooltip(event) {
        if (!this.tooltipElement) {
            return;
        }
        const [x, y] = this._getTooltipPosition(event.clientX, event.clientY);
        select(this.tooltipElement)
            .style('display', 'inline')
            .style('left', `${x}px`)
            .style('top', `${y}px`);
    }
    _hideTooltip() {
        select(this.tooltipElement)
            .style('display', 'none');
    }
    _renderHeader() {
        if (!this.showHeader) {
            return;
        }
        return h("as-widget-header", { header: this.heading, subheader: this.description, "is-loading": this.isLoading, "is-empty": this._isEmpty(), error: this.error, "no-data-message": this.noDataHeaderMessage });
    }
    _renderTooltip() {
        return (h("span", { ref: (ref) => this.tooltipElement = ref, role: 'tooltip', class: 'as-tooltip as-tooltip--top' }, this._parseTooltip(this.tooltip)));
    }
    _parseTooltip(tooltip) {
        if (tooltip === null) {
            return null;
        }
        if (Array.isArray(tooltip)) {
            return tooltip.map((text) => this._renderTooltipLine(text));
        }
        return this._renderTooltipLine(tooltip);
    }
    _renderTooltipLine(value) {
        return h("div", null, value);
    }
    _renderLabels() {
        return [
            this.yLabel ? h("div", { class: 'y-label' }, this.yLabel) : '',
            this.xLabel ? h("div", { class: 'x-label' }, this.xLabel) : '',
        ];
    }
    _toColor(color, fallbackColor) {
        if (color.startsWith('var(')) {
            const match = color.match(/var\(([^,\)]+)(,.+)?\)/);
            if (match === null) {
                return fallbackColor;
            }
            const variable = match[1];
            const fallback = (match[2] || '').replace(',', '').trim();
            const computed = getComputedStyle(this.el).getPropertyValue(variable).toLowerCase().trim();
            if (computed.length === 0) {
                return fallback.length === 0 ? fallbackColor : fallback;
            }
            return computed;
        }
        return color;
    }
    _isEmpty() {
        return !this._data || !this._data.length;
    }
    _hasDataToDisplay() {
        return !(this.isLoading || this._isEmpty() || this.error);
    }
    static get is() { return "as-histogram-widget"; }
    static get properties() { return {
        "axisFormatter": {
            "type": "Any",
            "attr": "axis-formatter"
        },
        "backgroundData": {
            "type": "Any",
            "attr": "background-data",
            "watchCallbacks": ["_onBackgroundDataChanged"]
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
            "attr": "color",
            "watchCallbacks": ["_onColorChanged"]
        },
        "colorRange": {
            "type": "Any",
            "attr": "color-range"
        },
        "data": {
            "type": "Any",
            "attr": "data",
            "watchCallbacks": ["_onDataChanged"]
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
        "getSelection": {
            "method": true
        },
        "heading": {
            "type": String,
            "attr": "heading"
        },
        "isCategoricalData": {
            "state": true
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
        "range": {
            "type": "Any",
            "attr": "range"
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "selectedFormatter": {
            "type": "Any",
            "attr": "selected-formatter"
        },
        "selectionEmpty": {
            "state": true
        },
        "selectionFooter": {
            "state": true
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
        "tooltip": {
            "state": true
        },
        "tooltipFormatter": {
            "type": "Any",
            "attr": "tooltip-formatter"
        },
        "unselectedColor": {
            "type": String,
            "attr": "unselected-color",
            "watchCallbacks": ["_onSelectedColorChanged"]
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
            "name": "selectionChanged",
            "method": "selectionChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "selectionInput",
            "method": "selectionInput",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "drawParametersChanged",
            "method": "drawParametersChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:as-histogram-widget:**/"; }
}
