import { HistogramData } from '../../../../../../components/src/components/as-histogram-widget/interfaces';
/**
 * Converts a numerical VL Histogram data to Airship's Histogram format.
 *
 * Has no support for `color` for now.
 *
 * @export
 * @param {VLNumericalHistogram} data Histogram data in VL format
 * @returns {HistogramData[]}
 */
export declare function numerical(data: VLNumericalHistogram): HistogramData[];
/**
 * Converts a categorical VL Histogram to Airship's Histogram widget format.
 *
 * The second argument is used to provide custom colors for the widget.
 *
 * @export
 * @param {VLCategoricalHistogram} data Histogram data in VL format
 * @param {LegendEntry[]} [colors] VL Legend data, which maps values to colors.
 * @returns {HistogramData[]}
 */
export declare function categorical(data: VLCategoricalHistogram, colors?: LegendEntry[]): HistogramData[];
/**
 * Looks for a color in an array of VL Legend Data and converts it into a hex string.
 *
 * @export
 * @param {string} category
 * @param {LegendEntry[]} colors
 * @returns {(string | undefined)}
 */
export declare function findColorForCategory(category: string, colors: LegendEntry[]): string | undefined;
declare const _default: {
    numerical: typeof numerical;
    categorical: typeof categorical;
};
export default _default;
