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
import { isCategoricalHistogramEqual } from '../utils/comparison/histogram';
import * as conversion from '../utils/conversion/histogram';
import { BaseHistogramFilter } from './BaseHistogramFilter';
/**
 * This class is an especialization of the HistogramFilter for categorical histograms, i.e. those
 * which instead of a numerical range, have a category for each bucket. The selection is an array
 * of strings, and the expression it provides for VL is a viewportHistogram with only a column.
 *
 * As for the filter, it uses the $column in [] expression of VL
 *
 * @export
 * @class CategoricalHistogramFilter
 * @extends {BaseHistogramFilter<string[]>}
 */
var CategoricalHistogramFilter = /** @class */ (function (_super) {
    __extends(CategoricalHistogramFilter, _super);
    /**
     * Creates an instance of CategoricalHistogramFilter.
     * @param {*} carto CARTO VL namespace
     * @param {*} layer CARTO VL layer
     * @param {(HTMLAsTimeSeriesWidgetElement | HTMLAsHistogramWidgetElement)} histogram
     * Airship histogram widget HTML element
     * @param {string} columnName The column to pull data from
     * @param {*} source CARTO VL source
     * @param {boolean} [readOnly=true] Whether this histogram allows filtering or not
     * @memberof CategoricalHistogramFilter
     */
    function CategoricalHistogramFilter(carto, layer, histogram, columnName, source, readOnly) {
        if (readOnly === void 0) { readOnly = true; }
        var _this = _super.call(this, 'categorical', carto, layer, histogram, columnName, source, readOnly) || this;
        _this._lastHistogram = null;
        return _this;
    }
    Object.defineProperty(CategoricalHistogramFilter.prototype, "filter", {
        /**
         * Returns either null or an expression like: `$column in [_selection]`
         *
         * @readonly
         * @type {string}
         * @memberof CategoricalHistogramFilter
         */
        get: function () {
            if (this._selection === null) {
                return null;
            }
            else {
                return "$" + this._column + " in [" + this._selection.map(function (value) { return "'" + value + "'"; }).join(',') + "]";
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoricalHistogramFilter.prototype, "expression", {
        /**
         * Returns a viewportHistogram with only the column as an argument (no buckets)
         *
         * @readonly
         * @type {*}
         * @memberof CategoricalHistogramFilter
         */
        get: function () {
            var s = this._carto.expressions;
            return s.viewportHistogram(s.prop(this._column));
        },
        enumerable: true,
        configurable: true
    });
    CategoricalHistogramFilter.prototype.bindDataLayer = function () {
        var _this = this;
        this._dataLayer.on('updated', function () {
            var newHistogram = _this._dataLayer.viz.variables[_this.name];
            if (!newHistogram) {
                return;
            }
            if (_this._lastHistogram === null || !isCategoricalHistogramEqual(_this._lastHistogram, newHistogram)) {
                _this._lastHistogram = { value: newHistogram.value };
                _this._widget.data = conversion.categorical(newHistogram, _this._legendData);
            }
        });
    };
    CategoricalHistogramFilter.prototype.selectionChanged = function (evt) {
        if (evt.detail === null) {
            this._selection = null;
        }
        else {
            var selection = evt.detail.selection;
            this._selection = selection.map(function (value) { return value; });
        }
        this._filterChanged();
    };
    return CategoricalHistogramFilter;
}(BaseHistogramFilter));
export { CategoricalHistogramFilter };
