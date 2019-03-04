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
import { isCategoricalHistogramEqual } from '../utils/comparison/histogram';
import vlToCategory from '../utils/conversion/category';
/**
 * Class that binds a CARTO VL categorical histogram to an Airship category widget
 *
 * @export
 * @class CategoryFilter
 * @extends {BaseFilter}
 */
var CategoryFilter = /** @class */ (function (_super) {
    __extends(CategoryFilter, _super);
    /**
     * Creates an instance of CategoryFilter.
     * @param {*} carto CARTO VL namespace
     * @param {*} layer CARTO VL layer
     * @param {HTMLAsCategoryWidgetElement} widget A Category Widget HTML element
     * @param {string} columnName The column to pull data from
     * @param {*} source CARTO VL source
     * @param {boolean} [readOnly=true] Whether this widget filters or not
     * @memberof CategoryFilter
     */
    function CategoryFilter(carto, layer, widget, columnName, source, readOnly) {
        if (readOnly === void 0) { readOnly = true; }
        var _this = _super.call(this, "category", columnName, layer, source, readOnly) || this;
        _this._selection = [];
        _this._lastHistogram = null;
        _this._widget = widget;
        _this._carto = carto;
        widget.disableInteractivity = readOnly;
        widget.showClearButton = !readOnly;
        _this.selectionChanged = _this.selectionChanged.bind(_this);
        if (!readOnly) {
            _this._widget.addEventListener('categoriesSelected', _this.selectionChanged);
        }
        return _this;
    }
    CategoryFilter.prototype.setDataLayer = function (layer) {
        var _this = this;
        this._dataLayer = layer;
        this._dataLayer.on('updated', function () {
            var newHistogram = _this._dataLayer.viz.variables[_this.name];
            if (!newHistogram) {
                return;
            }
            if (_this._lastHistogram === null || !isCategoricalHistogramEqual(_this._lastHistogram, newHistogram)) {
                _this._lastHistogram = { value: newHistogram.value };
                _this._widget.categories = vlToCategory(newHistogram, _this._legendData);
            }
        });
    };
    Object.defineProperty(CategoryFilter.prototype, "filter", {
        get: function () {
            if (this._selection.length === 0) {
                return null;
            }
            else {
                return "$" + this._column + " in [" + this._selection.map(function (value) { return "'" + value + "'"; }).join(',') + "]";
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CategoryFilter.prototype, "expression", {
        get: function () {
            var s = this._carto.expressions;
            return s.viewportHistogram(s.prop(this._column));
        },
        enumerable: true,
        configurable: true
    });
    CategoryFilter.prototype.selectionChanged = function (evt) {
        this._selection = evt.detail;
        this._filterChanged();
    };
    return CategoryFilter;
}(BaseFilter));
export { CategoryFilter };
