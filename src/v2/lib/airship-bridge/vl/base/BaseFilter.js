import mitt from 'mitt';
/**
 * Base class for all possible CARTO VL Filters to be combined with Airship
 *
 * @export
 * @abstract
 * @class BaseFilter
 */
var BaseFilter = /** @class */ (function () {
    /**
     * Creates an instance of BaseFilter.
     * @param {string} type A type describing what widget this filter represents
     * @param {string} column The column this filter is related to
     * @param {*} layer A CARTO VL layer
     * @param {*} source A CARTO VL source
     * @param {boolean} [readOnly=true] Whether this filter should be read only or not
     * @memberof BaseFilter
     */
    function BaseFilter(type, column, layer, source, readOnly) {
        if (readOnly === void 0) { readOnly = true; }
        this._emitter = new mitt();
        this._name = "asbind_" + type + "_" + column + "_" + BaseFilter._counter;
        this._column = column;
        this._layer = layer;
        this._source = source;
        this._readOnly = readOnly;
        BaseFilter._counter++;
        this._loadLegendData = this._loadLegendData.bind(this);
    }
    Object.defineProperty(BaseFilter.prototype, "globalExpression", {
        /**
         * If the filter returns this, this expression will be assigned to a variable called this.name_global
         *
         * @readonly
         * @abstract
         * @type {*}
         * @memberof BaseFilter
         */
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFilter.prototype, "name", {
        /**
         * Returns the name of the filter. The name is a compound of the type, the column and an internal counter to prevent
         * collisions. It will be used as the name for the VL variable containing BaseFilter.expression.
         *
         * @readonly
         * @type {string}
         * @memberof BaseFilter
         */
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFilter.prototype, "column", {
        /**
         * Get the column of the filter.
         *
         * @readonly
         * @type {string}
         * @memberof BaseFilter
         */
        get: function () {
            return this._column;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFilter.prototype, "readOnly", {
        /**
         * Get whether the filter is read only or not.
         *
         * @readonly
         * @type {boolean}
         * @memberof BaseFilter
         */
        get: function () {
            return this._readOnly;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFilter.prototype, "layer", {
        /**
         * Get the currently set CARTO VL Visualization layer.
         *
         * @readonly
         * @type {*}
         * @memberof BaseFilter
         */
        get: function () {
            return this._layer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseFilter.prototype, "source", {
        /**
         * Get the current CARTO VL source.
         *
         * @readonly
         * @type {*}
         * @memberof BaseFilter
         */
        get: function () {
            return this._source;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Bind to an event of the filter. Currently only `filterChanged` is supported.
     *
     * @param {string} type
     * @param {mitt.Handler} handler
     * @memberof BaseFilter
     */
    BaseFilter.prototype.on = function (type, handler) {
        this._emitter.on(type, handler);
    };
    /**
     * Set LegendData, which can be used by certain filter implementations to display colors
     * for certain values.
     *
     * @param {LegendData} legendData
     * @memberof BaseFilter
     */
    BaseFilter.prototype.setLegendData = function (legendData) {
        this._legendData = legendData.data;
    };
    /**
     * Automatically extract LegendData from the CARTO VL Viz object. This requires the `color` property
     * in the Viz object to be a ramp.
     *
     * @memberof BaseFilter
     */
    BaseFilter.prototype.enableColorMapping = function () {
        this._mapColors = true;
        if (this._layer.viz) {
            this._loadLegendData();
        }
        else {
            this._layer.on('loaded', this._loadLegendData);
        }
    };
    /**
     * Trigger a filterChanged event
     *
     * @protected
     * @memberof BaseFilter
     */
    BaseFilter.prototype._filterChanged = function () {
        this._emitter.emit('filterChanged', this._name);
    };
    /**
     * Load the legend data from the Viz object. Used from `enableColorMapping`
     *
     * @protected
     * @returns
     * @memberof BaseFilter
     */
    BaseFilter.prototype._loadLegendData = function () {
        var color = this._layer.viz.color;
        if (!color.getLegendData) {
            return;
        }
        this.setLegendData(color.getLegendData(this._getLegendConfig()));
    };
    /**
     * Override this method on a specific filter to configure CARTO VL ramps getLegendData arguments
     *
     * @protected
     * @returns
     * @memberof BaseFilter
     */
    BaseFilter.prototype._getLegendConfig = function () {
        return undefined;
    };
    // Internal counter to prevent colission between filters for the same
    // column and the same type
    BaseFilter._counter = 0;
    return BaseFilter;
}());
export { BaseFilter };
