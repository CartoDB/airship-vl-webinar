import mitt from 'mitt';
/**
 * Base class for all possible CARTO VL Filters to be combined with Airship
 *
 * @export
 * @abstract
 * @class BaseFilter
 */
export declare abstract class BaseFilter {
    private static _counter;
    protected _emitter: mitt.Emitter;
    protected _column: string;
    protected _layer: any;
    protected _source: any;
    protected _legendData: LegendEntry[];
    protected _mapColors: boolean;
    protected _widget: HTMLStencilElement;
    private _readOnly;
    private _name;
    /**
     * Creates an instance of BaseFilter.
     * @param {string} type A type describing what widget this filter represents
     * @param {string} column The column this filter is related to
     * @param {*} layer A CARTO VL layer
     * @param {*} source A CARTO VL source
     * @param {boolean} [readOnly=true] Whether this filter should be read only or not
     * @memberof BaseFilter
     */
    constructor(type: string, column: string, layer: any, source: any, readOnly?: boolean);
    /**
     * Provide a CARTO VL layer to be used as the source of data for the filter.
     *
     * @abstract
     * @param {*} layer a CARTO VL layer
     * @memberof BaseFilter
     */
    abstract setDataLayer(layer: any): any;
    /**
     * This function should be implemented by each filter to provide a valid filter for CARTO VL Viz objects.
     *
     * @readonly
     * @abstract
     * @type {string}
     * @memberof BaseFilter
     */
    abstract readonly filter: string;
    /**
     * This function should be implemented by each filter to create the appropriate data source expression. For instance
     * a histogram.
     *
     * @readonly
     * @abstract
     * @type {*}
     * @memberof BaseFilter
     */
    abstract readonly expression: any;
    /**
     * If the filter returns this, this expression will be assigned to a variable called this.name_global
     *
     * @readonly
     * @abstract
     * @type {*}
     * @memberof BaseFilter
     */
    readonly globalExpression: any;
    /**
     * Returns the name of the filter. The name is a compound of the type, the column and an internal counter to prevent
     * collisions. It will be used as the name for the VL variable containing BaseFilter.expression.
     *
     * @readonly
     * @type {string}
     * @memberof BaseFilter
     */
    readonly name: string;
    /**
     * Get the column of the filter.
     *
     * @readonly
     * @type {string}
     * @memberof BaseFilter
     */
    readonly column: string;
    /**
     * Get whether the filter is read only or not.
     *
     * @readonly
     * @type {boolean}
     * @memberof BaseFilter
     */
    readonly readOnly: boolean;
    /**
     * Get the currently set CARTO VL Visualization layer.
     *
     * @readonly
     * @type {*}
     * @memberof BaseFilter
     */
    readonly layer: any;
    /**
     * Get the current CARTO VL source.
     *
     * @readonly
     * @type {*}
     * @memberof BaseFilter
     */
    readonly source: any;
    /**
     * Bind to an event of the filter. Currently only `filterChanged` is supported.
     *
     * @param {string} type
     * @param {mitt.Handler} handler
     * @memberof BaseFilter
     */
    on(type: string, handler: mitt.Handler): void;
    /**
     * Set LegendData, which can be used by certain filter implementations to display colors
     * for certain values.
     *
     * @param {LegendData} legendData
     * @memberof BaseFilter
     */
    setLegendData(legendData: LegendData): void;
    /**
     * Automatically extract LegendData from the CARTO VL Viz object. This requires the `color` property
     * in the Viz object to be a ramp.
     *
     * @memberof BaseFilter
     */
    enableColorMapping(): void;
    /**
     * Trigger a filterChanged event
     *
     * @protected
     * @memberof BaseFilter
     */
    protected _filterChanged(): void;
    /**
     * Load the legend data from the Viz object. Used from `enableColorMapping`
     *
     * @protected
     * @returns
     * @memberof BaseFilter
     */
    protected _loadLegendData(): void;
    /**
     * Override this method on a specific filter to configure CARTO VL ramps getLegendData arguments
     *
     * @protected
     * @returns
     * @memberof BaseFilter
     */
    protected _getLegendConfig(): any;
}
