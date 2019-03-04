import { HistogramSelection } from '../../../../components/src/components/as-histogram-widget/interfaces';
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
export declare class NumericalHistogramFilter extends BaseHistogramFilter<[number, number]> {
    private _lastHistogram;
    private _isTimeSeries;
    private _totals;
    private _bucketRanges;
    private _globalHistogram;
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
    constructor(carto: any, layer: any, histogram: HTMLAsTimeSeriesWidgetElement | HTMLAsHistogramWidgetElement, columnName: string, nBuckets: number, source: any, bucketRanges: BucketRange[], readOnly?: boolean, showTotals?: boolean);
    /**
     * Returns $column >= selection[0] && $column < selection[1]
     *
     * If this is used on a time series, it does not filter at all.
     *
     * @readonly
     * @type {string}
     * @memberof NumericalHistogramFilter
     */
    readonly filter: string;
    /**
     * Generates a viewportHistogram with either a number of buckets or an array of buckets.
     *
     * The array has priority over the number of buckets.
     *
     * @readonly
     * @type {string}
     * @memberof NumericalHistogramFilter
     */
    readonly expression: string;
    readonly globalExpression: any;
    /**
     * Mark this histogram as a the source for a time-series.
     *
     * @param {boolean} value
     * @memberof NumericalHistogramFilter
     */
    setTimeSeries(value: boolean): void;
    /**
     * Numerical Histograms do not support color mapping for now.
     *
     * @memberof NumericalHistogramFilter
     */
    enableColorMapping(): void;
    /**
     * Numerical Histograms do not support legend data for now.
     *
     * @memberof NumericalHistogramFilter
     */
    setLegendData(): void;
    protected bindDataLayer(): void;
    protected selectionChanged(evt: CustomEvent<HistogramSelection>): void;
    private _bucketArg;
}
