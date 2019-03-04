import 'd3-transition';
import { AxisOptions, HistogramColorRange, HistogramData } from './interfaces';
/**
 * Histogram Widget
 *
 * @export
 * @class HistogramWidget
 */
export declare class HistogramWidget {
    /**
     * Title of the widget to be displayed
     *
     * @type {string}
     * @memberof HistogramWidget
     */
    heading: string;
    /**
     * Description of the widget to be displayed
     *
     * @type {string}
     * @memberof HistogramWidget
     */
    description: string;
    /**
     * Toggles displaying title and description
     *
     * @type {boolean}
     * @memberof HistogramWidget
     */
    showHeader: boolean;
    /**
     * Display a clear button that clears the histogram selection.
     *
     * @type {boolean}
     * @memberof HistogramWidget
     */
    showClear: boolean;
    /**
     * Disables selection brushes and events for the widget
     *
     * @type {boolean}
     * @memberof HistogramWidget
     */
    disableInteractivity: boolean;
    /**
     * Histogram data to be displayed
     *
     * @type {HistogramData[]}
     * @memberof HistogramWidget
     */
    data: HistogramData[];
    /**
     * Data that will be merged into buckets with value === 0
     *
     * @type {HistogramData[]}
     * @memberof HistogramWidget
     */
    backgroundData: HistogramData[];
    /**
     * Override color for the histogram bars
     *
     * @type {string}
     * @memberof HistogramWidget
     */
    color: string;
    /**
     * Override color for the non selected histogram bars
     *
     * @type {string}
     * @memberof HistogramWidget
     */
    unselectedColor: string;
    /**
     * Color range for histogram data
     *
     * @type {HistogramColorRange[]}
     * @memberof HistogramWidget
     */
    colorRange: HistogramColorRange[];
    /**
     * Function that formats the tooltip. Receives HistogramData and outputs a string
     *
     * @type {(HistogramData) => string}
     * @memberof HistogramWidget
     */
    tooltipFormatter: (value: HistogramData) => string | string[];
    /**
     * Label the x axis of the histogram with the given string.
     */
    xLabel: string;
    /**
     * Label the y axis of the histogram with the given string.
     */
    yLabel: string;
    /**
     * Use this attribute to put the widget in "loading mode".
     * When loading mode is active, a spinner will be shown and the data will be hidden.
     */
    isLoading: boolean;
    /**
     * Use this widget to put the widget in "error mode".
     * When error mode is active. The header will display the given text.
     * And the body will be display the errorDescription instead any data.
     */
    error: string;
    /**
     * Extended error description, only shown when error is present
     */
    errorDescription: string;
    /**
     * Message shown in header when no data is available
     */
    noDataHeaderMessage: string;
    /**
     * Message shown in body when no data is available
     */
    noDataBodyMessage: string;
    /**
     * Use this attribute to decide if the widget should be rerendered on window resize.
     * Defaults to true.
     */
    responsive: boolean;
    /**
     * Function used to format the x-axis values
     *
     * @memberof HistogramWidget
     */
    axisFormatter: (value: number | Date) => string;
    /**
     * Text rendered inside the clear selection button
     */
    clearText: string;
    /**
     * Function to format the range selected text displayed below the histogram
     *
     * @memberof HistogramWidget
     */
    selectedFormatter: (value: number[]) => string;
    /**
     * This prop lets you provide the range of the y-axis so it's not automatically calculated with
     * data or backgroundData. It always starts at 0, you can provide the top value.
     *
     * @memberof HistogramWidget
     */
    range: [number, number];
    /**
     * This lets you disable the animations for the bars when showing / updating the data
     *
     * @type {boolean}
     * @memberof HistogramWidget
     */
    disableAnimation: boolean;
    /**
     * This prop is a proxy to some d3-axis options for the X Axis
     *
     * @type {AxisOptions}
     * @memberof TimeSeriesWidget
     */
    xAxisOptions: AxisOptions;
    /**
     * This prop is a proxy to some d3-axis options for the Y Axis
     *
     * @type {AxisOptions}
     * @memberof TimeSeriesWidget
     */
    yAxisOptions: AxisOptions;
    selection: number[];
    private el;
    /**
     * Fired when user update or clear the widget selection.
     *
     * @type {EventEmitter<number[]>}
     * @memberof HistogramWidget
     */
    private selectionChanged;
    private selectionInput;
    private drawParametersChanged;
    private tooltip;
    private container;
    private tooltipElement;
    private xScale;
    private binsScale;
    private yScale;
    private yAxis;
    private barsContainer;
    private brush;
    private brushArea;
    private customHandles;
    private width;
    private height;
    private prevWidth;
    private prevHeight;
    private _data;
    private _backgroundData;
    private _mockBackground;
    private _color;
    private _barBackgroundColor;
    private _muteSelectionChanged;
    private _skipRender;
    private _dataJustChanged;
    private _lastEmittedSelection;
    private selectionEmpty;
    private selectionFooter;
    private isCategoricalData;
    constructor();
    _onBackgroundDataChanged(newBackgroundData: any): void;
    _onDataChanged(newData: any, oldData: any): void;
    _prepareData(data: any, backgroundData: any, oldData?: HistogramData[]): void;
    _onColorChanged(newColor: any): void;
    _onSelectedColorChanged(newColor: any): void;
    /**
     * Default formatting function. Makes the value a readable number and
     * converts it into a string. Useful to compose with your own formatting
     * function.
     *
     * @memberof HistogramWidget
     */
    defaultFormatter(data: HistogramData): any[];
    /**
     * Returns the current selection
     *
     * @returns {number[] | string[]}
     * @memberof HistogramWidget
     */
    getSelection(): Promise<number[] | string[]>;
    /**
     * Programmatically set the selection. It will be adjusted to the buckets
     * present in {@link data}. To clear see {@link clearSelection} or call with null
     *
     * @param {number[] | null} values
     * @memberof HistogramWidget
     */
    setSelection(values: number[] | null): void;
    /**
     * Clears the Histogram selection
     *
     * @memberof HistogramWidget
     */
    clearSelection(): void;
    /**
     * Formats a number using the component's x-axis formatter if present
     *
     * @memberof HistogramWidget
     */
    xFormatter(value: any): any;
    componentDidLoad(): void;
    componentDidUpdate(): void;
    componentWillLoad(): void;
    componentDidUnload(): void;
    render(): any[];
    private _resizeRender;
    private _renderContent;
    private _mockBackgroundData;
    private _selectionFormatter;
    private _renderSelection;
    private _renderGraph;
    private _setTooltip;
    private _updateSelection;
    private _adjustSelection;
    private _adjustSelectionValue;
    private _hideCustomHandles;
    private _onBrush;
    private _onBrushEnd;
    private _setSelection;
    private _preadjustSelection;
    private _dataForSelection;
    private _simplifySelection;
    private _sameSelection;
    private emitSelection;
    private _eventType;
    private _selectionInData;
    private _updateHandles;
    private _dataForDomain;
    private _generateYAxis;
    private _renderXAxis;
    private _getTooltipPosition;
    private _showTooltip;
    private _hideTooltip;
    private _renderHeader;
    private _renderTooltip;
    private _parseTooltip;
    private _renderTooltipLine;
    private _renderLabels;
    /**
     * Converts to a hex color string, allowing CSS variables to be passed.
     *
     * @param color color string, can be a CSS variable declaration: var(varname[, fallback])
     * @param fallbackColor if the variable is malformed, or if the CSS variable is not defined, this will be returned
     */
    private _toColor;
    private _isEmpty;
    private _hasDataToDisplay;
}
