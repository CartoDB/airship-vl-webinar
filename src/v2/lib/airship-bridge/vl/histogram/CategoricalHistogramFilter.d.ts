import { HistogramSelection } from '../../../../components/src/components/as-histogram-widget/interfaces';
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
export declare class CategoricalHistogramFilter extends BaseHistogramFilter<string[]> {
    private _lastHistogram;
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
    constructor(carto: any, layer: any, histogram: HTMLAsTimeSeriesWidgetElement | HTMLAsHistogramWidgetElement, columnName: string, source: any, readOnly?: boolean);
    /**
     * Returns either null or an expression like: `$column in [_selection]`
     *
     * @readonly
     * @type {string}
     * @memberof CategoricalHistogramFilter
     */
    readonly filter: string;
    /**
     * Returns a viewportHistogram with only the column as an argument (no buckets)
     *
     * @readonly
     * @type {*}
     * @memberof CategoricalHistogramFilter
     */
    readonly expression: any;
    protected bindDataLayer(): void;
    protected selectionChanged(evt: CustomEvent<HistogramSelection>): void;
}
