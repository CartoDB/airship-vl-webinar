/**
 * This class is an orchestrator for Time Series widgets. It does not extend BaseFilter because for all intents
 * and purposes, we can use a numerical histogram. This class is only responsible of particular Time Series event
 * handling with regards to VL.
 *
 * The provided layer Viz object *must have* a variable called `@animation`
 *
 * @export
 * @class TimeSeries
 */
export declare class TimeSeries {
    private _timeSeries;
    private _animation;
    private _layer;
    private _viz;
    private _dataLayer;
    private _min;
    private _max;
    /**
     * Creates an instance of TimeSeries.
     * @param {*} layer A CARTO VL layer
     * @param {HTMLAsTimeSeriesWidgetElement} timeSeries An Airship TimeSeries HTML element
     * @param {() => void} readyCb A callback to be called when we're done configuring internals
     * @memberof TimeSeries
     */
    constructor(layer: any, timeSeries: HTMLAsTimeSeriesWidgetElement, readyCb: () => void);
    removeHistogramLayer(): void;
    /**
     * Set the range of the animation input.
     *
     * This is called when the time series selection is changed.
     *
     * @param {[number, number]} range
     * @returns
     * @memberof TimeSeries
     */
    setRange(range: [number, number]): void;
    /**
     * This method sets up the events to handle animation updates and bind it to the TimeSeries widget:
     *  - Update the progress
     *  - Update the progress when user seeks
     *  - Play / Pause events
     *
     * @private
     * @memberof TimeSeries
     */
    private _onLayerLoaded;
}
export default TimeSeries;
