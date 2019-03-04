import '../../stencil.core';
import { TimeLocaleDefinition } from 'd3-time-format';
import { AxisOptions, HistogramColorRange, HistogramData } from '../as-histogram-widget/interfaces';
import { TimeSeriesData } from './interfaces';
/**
 * Time series
 *
 * @export
 * @class HistogramWidget
 */
export declare class TimeSeriesWidget {
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
    data: TimeSeriesData[];
    /**
     * Histogram data to be displayed
     *
     * @type {HistogramData[]}
     * @memberof HistogramWidget
     */
    backgroundData: TimeSeriesData[];
    /**
     * Override color for the histogram bars
     *
     * @type {string}
     * @memberof HistogramWidget
     */
    color: string;
    /**
     * Override color for the selected histogram bars
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
     * Function that formats the tooltip. Receives TimeSeriesData and outputs a string
     *
     * @type {(TimeSeriesData) => string}
     * @memberof HistogramWidget
     */
    tooltipFormatter: (value: TimeSeriesData) => string;
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
     * This attribute is the percentage of progress elapsed on an animation.
     */
    progress: number;
    /**
     * Whether the animation is playing or not.
     */
    playing: boolean;
    /**
     * Whether it should have animated properties or not. Disabling this makes this look
     * like a histogra widget with time capabilities
     */
    animated: boolean;
    /**
     * This string will be parsed by d3-time-format (https://github.com/d3/d3-time-format)
     * and will be used to format the graph's x-axis
     */
    timeFormat: string;
    /**
     * Setting this property will make the date formatter be sensitive to locales. The format
     * is described on https://github.com/d3/d3-time-format
     */
    timeFormatLocale: TimeLocaleDefinition;
    /**
     * Text rendered inside the clear selection button
     */
    clearText: string;
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
    /**
     * User clicks the play button
     */
    private play;
    /**
     * User clicks the pause button
     */
    private pause;
    /**
     * This method proxies the selectionChanged event on the underlying graph, but parses it into
     * a Date
     */
    private selectionChanged;
    /**
     * The user has seeked the animation to this percentage.
     */
    private seek;
    private histogram;
    private _selection;
    private _formatter;
    private _renderOptions;
    private _lastMousePosition;
    private _data;
    private _backgroundData;
    constructor();
    onDataChanged(newData: any, oldData: any): void;
    onBackgroundDataChanged(newData: any): void;
    onProgressChanged(): void;
    onTimeFormatChanged(newFormat: any): void;
    onTimeFormatLocaleChanged(newLocale: any): void;
    /**
     * Proxy to as-histogram-widget defaultFormatter()
     *
     * @memberof TimeSeriesWidget
     */
    defaultFormatter(data: HistogramData): any[];
    /**
     * Proxy to as-histogram-widget getSelection()
     *
     * @returns {number[]|string[]}
     * @memberof TimeSeriesWidget
     */
    getSelection(): Promise<number[] | string[]>;
    /**
     * Proxy to as-histogram-widget setSelection()
     *
     * @param {number[] | null} values
     * @memberof TimeSeriesWidget
     */
    setSelection(values: number[] | null): void;
    /**
     * Proxy to as-histogram-widget clearSelection()
     *
     * @memberof TimeSeriesWidget
     */
    clearSelection(): void;
    /**
     * Proxy to as-histogram-widget xFormatter method
     * @param value
     */
    xFormatter(value: any): any;
    componentWillLoad(): Promise<void>;
    componentDidLoad(): Promise<void>;
    render(): JSX.Element[];
    private axisFormatter;
    private _renderButton;
    private _playPauseClick;
    private _render;
}
