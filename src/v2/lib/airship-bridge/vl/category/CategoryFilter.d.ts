import { BaseFilter } from '../base/BaseFilter';
/**
 * Class that binds a CARTO VL categorical histogram to an Airship category widget
 *
 * @export
 * @class CategoryFilter
 * @extends {BaseFilter}
 */
export declare class CategoryFilter extends BaseFilter {
    protected _widget: HTMLAsCategoryWidgetElement;
    private _carto;
    private _selection;
    private _lastHistogram;
    private _dataLayer;
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
    constructor(carto: any, layer: any, widget: HTMLAsCategoryWidgetElement, columnName: string, source: any, readOnly?: boolean);
    setDataLayer(layer: any): void;
    readonly filter: string;
    readonly expression: any;
    private selectionChanged;
}
