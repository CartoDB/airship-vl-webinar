var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { isNumericalHistogramEqual } from '../utils/comparison/histogram';
import * as conversion from '../utils/conversion/histogram';
import { BaseHistogramFilter } from './BaseHistogramFilter';
/**
 * This class is an especialization of the HistogramFilter for numerical histograms, i.e. those in
 * which each bucket have a start / end value. The selection is an array of numbers.
 *
 * The expression it provides for VL is a viewportHistogram with either a number of buckets, or an array
 * describing each buckets range. The latter is recommended for non-read-only ones.
 *
 * As for the filter, it uses the $column >= selection[0] && $column < selection[1]
 *
 * @export
 * @class NumericalHistogramFilter
 * @extends {BaseHistogramFilter<[number, number]>}
 */
var NumericalHistogramFilter = /** @class */ (function (_super) {
    __extends(NumericalHistogramFilter, _super);
    /**
     * Creates an instance of NumericalHistogramFilter.
     *
     * If an array of buckets (bucketRanges) is provided, nBuckets is ignored, and the number of buckets
     * is the length of said array.
     *
     * @param {*} carto CARTO VL namespace
     * @param {*} layer CARTO VL layer
     * @param {(HTMLAsTimeSeriesWidgetElement | HTMLAsHistogramWidgetElement)} histogram
     * Airship histogram / time series HTML element
     * @param {string} columnName Column to pull data from
     * @param {number} nBuckets Number of buckets
     * @param {*} source CARTO VL source
     * @param {BucketRange[]} bucketRanges Array describing the bucket ranges. This has priority over nBuckets.
     * See https://carto.com/developers/carto-vl/reference/#cartoexpressionsviewporthistogram for more information
     * @param {boolean} [readOnly=true] Whether this histogram can filter the Visualization or not.
     * @memberof NumericalHistogramFilter
     */
    function NumericalHistogramFilter(carto, layer, histogram, columnName, nBuckets, source, bucketRanges, readOnly, showTotals) {
        if (readOnly === void 0) { readOnly = true; }
        if (showTotals === void 0) { showTotals = false; }
        var _this = _super.call(this, 'numerical', carto, layer, histogram, columnName, source, readOnly) || this;
        _this._lastHistogram = null;
        _this._buckets = bucketRanges !== undefined ? bucketRanges.length : nBuckets;
        _this._bucketRanges = bucketRanges;
        _this._totals = showTotals;
        return _this;
    }
    Object.defineProperty(NumericalHistogramFilter.prototype, "filter", {
        /**
         * Returns $column >= selection[0] && $column < selection[1]
         *
         * If this is used on a time series, it does not filter at all.
         *
         * @readonly
         * @type {string}
         * @memberof NumericalHistogramFilter
         */
        get: function () {
            if (this._selection === null || this._isTimeSeries) {
                return null;
            }
            return "($" + this._column + " >= " + this._selection[0] + " and $" + this._column + " < " + this._selection[1] + ")";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumericalHistogramFilter.prototype, "expression", {
        /**
         * Generates a viewportHistogram with either a number of buckets or an array of buckets.
         *
         * The array has priority over the number of buckets.
         *
         * @readonly
         * @type {string}
         * @memberof NumericalHistogramFilter
         */
        get: function () {
            if (this._totals && !this._globalHistogram) {
                return null;
            }
            var s = this._carto.expressions;
            return s.viewportHistogram(s.prop(this._column), this._bucketArg());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumericalHistogramFilter.prototype, "globalExpression", {
        get: function () {
            if (!this._totals) {
                return null;
            }
            var s = this._carto.expressions;
            return s.globalHistogram(s.prop(this._column), this._bucketArg());
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Mark this histogram as a the source for a time-series.
     *
     * @param {boolean} value
     * @memberof NumericalHistogramFilter
     */
    NumericalHistogramFilter.prototype.setTimeSeries = function (value) {
        this._isTimeSeries = value;
    };
    /**
     * Numerical Histograms do not support color mapping for now.
     *
     * @memberof NumericalHistogramFilter
     */
    NumericalHistogramFilter.prototype.enableColorMapping = function () {
        throw new Error('Unsupported for numerical histograms');
    };
    /**
     * Numerical Histograms do not support legend data for now.
     *
     * @memberof NumericalHistogramFilter
     */
    NumericalHistogramFilter.prototype.setLegendData = function () {
        throw new Error('Unsupported for numerical histograms');
    };
    NumericalHistogramFilter.prototype.bindDataLayer = function () {
        var _this = this;
        this._dataLayer.on('updated', function () {
            if (_this._totals && !_this._globalHistogram) {
                _this._globalHistogram = _this._dataLayer.viz.variables[_this.name + "_global"];
                if (_this._globalHistogram) {
                    _this._bucketRanges = _this._globalHistogram.value.map(function (value) { return [value.x[0], value.x[1]]; });
                    _this._emitter.emit('expressionReady', { name: _this.name, expression: _this.expression });
                }
                _this._widget.backgroundData = conversion.numerical(_this._globalHistogram);
            }
            var newHistogram = _this._dataLayer.viz.variables[_this.name];
            if (!newHistogram) {
                return;
            }
            if (newHistogram.value !== null &&
                (_this._lastHistogram === null || !isNumericalHistogramEqual(_this._lastHistogram, newHistogram))) {
                _this._emitter.emit('rangeChanged', [
                    newHistogram.value[0].x[0],
                    newHistogram.value[newHistogram.value.length - 1].x[1]
                ]);
                _this._lastHistogram = { value: newHistogram.value };
                _this._widget.data = conversion.numerical(newHistogram);
            }
        });
    };
    NumericalHistogramFilter.prototype.selectionChanged = function (evt) {
        if (evt.detail === null) {
            this._selection = null;
        }
        else {
            var selection = (this._isTimeSeries ? evt.detail : evt.detail.selection);
            this._selection = [Number(selection[0]), Number(selection[1])];
        }
        this._emitter.emit('rangeChanged', this._selection);
        this._filterChanged();
    };
    NumericalHistogramFilter.prototype._bucketArg = function () {
        if (this._bucketRanges !== undefined) {
            return this._bucketRanges;
        }
        return this._buckets;
    };
    return NumericalHistogramFilter;
}(BaseHistogramFilter));
export { NumericalHistogramFilter };
