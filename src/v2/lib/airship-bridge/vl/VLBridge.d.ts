import { CategoryFilter } from './category/CategoryFilter';
import { CategoricalHistogramFilter } from './histogram/CategoricalHistogramFilter';
import { NumericalHistogramFilter } from './histogram/NumericalHistogramFilter';
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
export default class VLBridge {
    private _carto;
    private _map;
    private _layer;
    private _source;
    private _vizFilters;
    private _readOnlyLayer;
    private _id;
    private _animation;
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
    constructor(carto: any, map: any, layer: any, source: any);
    /**
     * Create a numerical histogram filter. See {@link NumericalHistogramOptions} for more details
     *
     * @param {NumericalHistogramOptions} args
     * @returns
     * @memberof VLBridge
     */
    numericalHistogram(args: NumericalHistogramOptions): NumericalHistogramFilter;
    /**
     * Create a categorical histogram filter. See {@link CategoricalHistogramOptions} for more details
     *
     * @param {CategoricalHistogramOptions} args
     * @returns
     * @memberof VLBridge
     */
    categoricalHistogram(args: CategoricalHistogramOptions): CategoricalHistogramFilter;
    /**
     * Creates a numerical or categorical histogram, depending on the arguments.
     *
     * If neither buckets or bucketRanges are provided, a categorical one will be created. A numerical one otherwise
     *
     * @param {NumericalHistogramOptions} args
     * @returns
     * @memberof VLBridge
     */
    histogram(args: NumericalHistogramOptions): CategoricalHistogramFilter | NumericalHistogramFilter;
    /**
     * Creates a category widget filter. See {@link CategoryOptions} for more details
     *
     * @param {CategoryOptions} args
     * @returns
     * @memberof VLBridge
     */
    category(args: CategoryOptions): CategoryFilter;
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
    timeSeries({ column, buckets, readOnly, widget }: NumericalHistogramOptions): void;
    /**
     * Call this method after creating all the different filters you require.
     *
     * It will internally do the following:
     *  - Add new variables to your Viz, with the columns of all the non-read-only filters
     *  - Create a new layer as the filters' data source
     * @returns
     * @memberof VLBridge
     */
    build(): void;
    private _addFilter;
    /**
     * This will append extra variables with all the columns of non-read-only filters.
     *
     * This is required so that whenever the filter is changed, the original viz layer
     * can be filtered by it.
     *
     * @private
     * @memberof VLBridge
     */
    private _appendVariables;
    /**
     * This will create a new Layer using the same source as the original, add it to the map, and
     * pass it to all the filters so they can hook up to read the data
     *
     * It has style properties to make it invisible, plus all the expressions created by each filter.
     *
     * @private
     * @memberof VLBridge
     */
    private _buildDataLayer;
    private _getVariables;
    private _updateDataLayerVariables;
    /**
     * Gather all the VL filters from each filter, combine them and filter both the data layer and
     * the original layer with it.
     *
     * If there is an animation involved, it uses @animation and all the filters.
     *
     * @private
     * @memberof VLBridge
     */
    private _rebuildFilters;
    private _combineFilters;
}
