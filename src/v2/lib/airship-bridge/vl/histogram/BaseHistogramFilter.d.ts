import { HistogramSelection } from '../../../../components/src/components/as-histogram-widget/interfaces';
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
export declare abstract class BaseHistogramFilter<T> extends BaseFilter {
    protected _buckets: number;
    protected _carto: any;
    protected _widget: HTMLAsTimeSeriesWidgetElement | HTMLAsHistogramWidgetElement;
    protected _selection: T;
    protected _dataLayer: any;
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
    constructor(type: 'categorical' | 'numerical', carto: any, layer: any, histogram: HTMLAsTimeSeriesWidgetElement | HTMLAsHistogramWidgetElement, columnName: string, source: any, readOnly?: boolean);
    removeHistogramLayer(): void;
    setDataLayer(layer: any): void;
    protected _getLegendConfig(): {
        samples: number;
    };
    /**
     * Custom implementation of a histogram selection changed event. This differs on every type of histogram
     *
     * @protected
     * @abstract
     * @param {CustomEvent<HistogramSelection>} evt A Custom Event with the HistogramSelection
     * @memberof BaseHistogramFilter
     */
    protected abstract selectionChanged(evt: CustomEvent<HistogramSelection>): any;
    /**
     * Function called right after the Data Layer has been set, allows for each type of histogram filter to
     * customize the updated handling.
     *
     * @protected
     * @abstract
     * @memberof BaseHistogramFilter
     */
    protected abstract bindDataLayer(): any;
}
