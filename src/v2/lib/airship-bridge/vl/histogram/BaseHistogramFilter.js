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
import { BaseFilter } from '../base/BaseFilter';
/**
 * Base class for Filters based on Airship Histogram Widgets
 *
 * @export
 * @abstract
 * @class BaseHistogramFilter
 * @extends {BaseFilter}
 * @template T Type of the selection. Typicall an array of number or strings
 */
var BaseHistogramFilter = /** @class */ (function (_super) {
    __extends(BaseHistogramFilter, _super);
    /**
     * Creates an instance of BaseHistogramFilter.
     * @param {('categorical' | 'numerical')} type Whether it is a categorical or a numerical histogram
     * @param {*} carto The CARTO VL namespace
     * @param {*} layer A CARTO VL layer
     * @param {(HTMLAsTimeSeriesWidgetElement | HTMLAsHistogramWidgetElement)} histogram
     * An Airship Histogram or TimeSeries HTML element
     * @param {string} columnName The column to pull data from
     * @param {*} source A CARTO VL source
     * @param {boolean} [readOnly=true] Whether the widget will be able to filter the visualization or not
     * @memberof BaseHistogramFilter
     */
    function BaseHistogramFilter(type, carto, layer, histogram, columnName, source, readOnly) {
        if (readOnly === void 0) { readOnly = true; }
        var _this = _super.call(this, "histogram_" + type, columnName, layer, source, readOnly) || this;
        _this._selection = null;
        _this._widget = histogram;
        _this._carto = carto;
        histogram.disableInteractivity = readOnly;
        histogram.showClear = !readOnly;
        _this.selectionChanged = _this.selectionChanged.bind(_this);
        if (!readOnly) {
            _this._widget.addEventListener('selectionChanged', _this.selectionChanged);
        }
        return _this;
    }
    BaseHistogramFilter.prototype.removeHistogramLayer = function () {
        this._layer.remove();
    };
    BaseHistogramFilter.prototype.setDataLayer = function (layer) {
        this._dataLayer = layer;
        this.bindDataLayer();
    };
    BaseHistogramFilter.prototype._getLegendConfig = function () {
        return {
            samples: this._buckets
        };
    };
    return BaseHistogramFilter;
}(BaseFilter));
export { BaseHistogramFilter };
