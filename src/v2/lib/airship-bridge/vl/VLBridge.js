import semver from 'semver';
import { CategoryFilter } from './category/CategoryFilter';
import { CategoricalHistogramFilter } from './histogram/CategoricalHistogramFilter';
import { NumericalHistogramFilter } from './histogram/NumericalHistogramFilter';
import { TimeSeries } from './time-series/TimeSeries';
var VL_VERSION = '^1.1.0';
/**
 * This class is the main interface to bind a VL layer to one or more Airship widgets.
 *
 * The normal usage is create an instance and use its public methods to generate filters for
 * different widgets.
 *
 * After you have specified all the required filters, simply call the method `build` and all will be
 * handled for you. Internally, a new layer will be created with an invisible Viz, as a source for all
 * the widget's data.
 *
 * Some caveats:
 * - You can create as many filters for a column you want, but only one per widget.
 * - If you enable non-read-only capabilities, it is recommended that the Viz filter property not to
 * be changed, as it will be changed internally by each filter.
 *
 * @export
 * @class VLBridge
 */
var VLBridge = /** @class */ (function () {
    /**
     * Creates an instance of VLBridge.
     *
     * The CARTO VL namespace is required to create new expressions
     * The map is required in order to add an internal invisble layer to it
     * The VL Layer is used for event handling purposes
     * The source will be reused for the internal invisible layer
     *
     * @param {*} carto CARTO VL namespace
     * @param {*} map CARTO VL map instance (Mapbox gl)
     * @param {*} layer CARTO VL layer
     * @param {*} source CARTO VL source
     * @memberof VLBridge
     */
    function VLBridge(carto, map, layer, source) {
        this._vizFilters = [];
        this._carto = carto;
        this._map = map;
        this._layer = layer;
        this._source = source;
        this._id = layer.id;
        this._rebuildFilters = this._rebuildFilters.bind(this);
        this._updateDataLayerVariables = this._updateDataLayerVariables.bind(this);
        if (!semver.satisfies(carto.version, VL_VERSION)) {
            throw new Error("Provided VL version " + carto.version + " not supported. Must satisfy " + VL_VERSION);
        }
    }
    /**
     * Create a numerical histogram filter. See {@link NumericalHistogramOptions} for more details
     *
     * @param {NumericalHistogramOptions} args
     * @returns
     * @memberof VLBridge
     */
    VLBridge.prototype.numericalHistogram = function (args) {
        var column = args.column, buckets = args.buckets, bucketRanges = args.bucketRanges, readOnly = args.readOnly, widget = args.widget;
        var histogram = new NumericalHistogramFilter(this._carto, this._layer, widget, column, buckets, this._source, bucketRanges, readOnly);
        this._addFilter(histogram);
        return histogram;
    };
    /**
     * Create a categorical histogram filter. See {@link CategoricalHistogramOptions} for more details
     *
     * @param {CategoricalHistogramOptions} args
     * @returns
     * @memberof VLBridge
     */
    VLBridge.prototype.categoricalHistogram = function (args) {
        var column = args.column, readOnly = args.readOnly, widget = args.widget;
        var histogram = new CategoricalHistogramFilter(this._carto, this._layer, widget, column, this._source, readOnly);
        this._addFilter(histogram);
        return histogram;
    };
    /**
     * Creates a numerical or categorical histogram, depending on the arguments.
     *
     * If neither buckets or bucketRanges are provided, a categorical one will be created. A numerical one otherwise
     *
     * @param {NumericalHistogramOptions} args
     * @returns
     * @memberof VLBridge
     */
    VLBridge.prototype.histogram = function (args) {
        var column = args.column, buckets = args.buckets, bucketRanges = args.bucketRanges, readOnly = args.readOnly, widget = args.widget;
        if (buckets === undefined && bucketRanges === undefined) {
            var histogramWidget = widget;
            return this.categoricalHistogram({ column: column, readOnly: readOnly, widget: histogramWidget });
        }
        return this.numericalHistogram({ column: column, readOnly: readOnly, buckets: buckets, bucketRanges: bucketRanges, widget: widget });
    };
    /**
     * Creates a category widget filter. See {@link CategoryOptions} for more details
     *
     * @param {CategoryOptions} args
     * @returns
     * @memberof VLBridge
     */
    VLBridge.prototype.category = function (args) {
        var column = args.column, readOnly = args.readOnly, widget = args.widget;
        var category = new CategoryFilter(this._carto, this._layer, widget, column, this._source, readOnly);
        this._addFilter(category);
        return category;
    };
    /**
     * Creates a time series widget filter.
     *
     * Internally this creates a {@link NumericalHistogramFilter} and instances a {@link TimeSeries}.
     *
     * One will take care of the histogram part and the other of the animation parts.
     *
     * There can only be one animation per layer (per VLBridge instance)
     *
     * @param {CategoryOptions} args
     * @returns
     * @memberof VLBridge
     */
    VLBridge.prototype.timeSeries = function (_a) {
        var _this = this;
        var column = _a.column, buckets = _a.buckets, readOnly = _a.readOnly, widget = _a.widget;
        if (this._animation) {
            throw new Error('There can only be one Time Series animation');
        }
        this._animation = new TimeSeries(this._layer, widget, function () {
            _this._rebuildFilters();
        });
        var histogram = this.numericalHistogram({
            buckets: buckets,
            column: column,
            readOnly: readOnly,
            widget: widget
        });
        histogram.setTimeSeries(true);
        histogram.on('rangeChanged', function (range) {
            _this._animation.setRange(range);
        });
    };
    /**
     * Call this method after creating all the different filters you require.
     *
     * It will internally do the following:
     *  - Add new variables to your Viz, with the columns of all the non-read-only filters
     *  - Create a new layer as the filters' data source
     * @returns
     * @memberof VLBridge
     */
    VLBridge.prototype.build = function () {
        var _this = this;
        if (this._vizFilters.length === 0) {
            return;
        }
        var onLoaded = function () {
            _this._appendVariables();
            _this._buildDataLayer();
        };
        if (!this._layer.viz) {
            this._layer.on('loaded', onLoaded);
        }
        else {
            onLoaded();
        }
    };
    VLBridge.prototype._addFilter = function (filter) {
        filter.on('filterChanged', this._rebuildFilters);
        filter.on('expressionReady', this._updateDataLayerVariables);
        this._vizFilters.push(filter);
    };
    /**
     * This will append extra variables with all the columns of non-read-only filters.
     *
     * This is required so that whenever the filter is changed, the original viz layer
     * can be filtered by it.
     *
     * @private
     * @memberof VLBridge
     */
    VLBridge.prototype._appendVariables = function () {
        var _this = this;
        var s = this._carto.expressions;
        this._vizFilters.forEach(function (filter) { return _this._layer.viz.variables[filter.name + "_col"] = s.prop(filter.column); });
    };
    /**
     * This will create a new Layer using the same source as the original, add it to the map, and
     * pass it to all the filters so they can hook up to read the data
     *
     * It has style properties to make it invisible, plus all the expressions created by each filter.
     *
     * @private
     * @memberof VLBridge
     */
    VLBridge.prototype._buildDataLayer = function () {
        var _this = this;
        var variables = this._getVariables();
        var s = this._carto.expressions;
        var viz = new this._carto.Viz({
            color: s.rgba(0, 0, 0, 0),
            strokeWidth: 0,
            variables: variables,
        });
        this._readOnlyLayer = new this._carto.Layer("asbind_ro_" + this._id, this._source, viz);
        this._readOnlyLayer.addTo(this._map);
        this._vizFilters.forEach(function (filter) { return filter.setDataLayer(_this._readOnlyLayer); });
    };
    VLBridge.prototype._getVariables = function () {
        var variables = this._readOnlyLayer !== undefined ? this._readOnlyLayer.viz.variables : {};
        for (var _i = 0, _a = this._vizFilters; _i < _a.length; _i++) {
            var filter = _a[_i];
            var name_1 = filter.name;
            if (filter.globalExpression) {
                variables[name_1 + "_global"] = filter.globalExpression;
            }
            if (filter.expression) {
                variables[name_1] = filter.expression;
            }
        }
        return variables;
    };
    VLBridge.prototype._updateDataLayerVariables = function (payload) {
        if (!this._readOnlyLayer.viz) {
            return;
        }
        this._readOnlyLayer.viz.variables[payload.name] = payload.expression;
    };
    /**
     * Gather all the VL filters from each filter, combine them and filter both the data layer and
     * the original layer with it.
     *
     * If there is an animation involved, it uses @animation and all the filters.
     *
     * @private
     * @memberof VLBridge
     */
    VLBridge.prototype._rebuildFilters = function () {
        var newFilter = this._combineFilters(this._vizFilters
            .filter(function (hasFilter) { return hasFilter.filter !== null; })
            .map(function (hasFilter) { return hasFilter.filter; }));
        // Update (if required) the readonly layer
        if (this._readOnlyLayer) {
            this._readOnlyLayer.viz.filter.blendTo(newFilter, 0);
        }
        if (this._animation) {
            newFilter = "@animation and " + newFilter;
        }
        // Update the Visualization filter
        this._layer.viz.filter.blendTo(newFilter, 0);
    };
    VLBridge.prototype._combineFilters = function (filters) {
        if (filters.length === 0) {
            return '1';
        }
        return filters.join(' and ');
    };
    return VLBridge;
}());
export default VLBridge;
