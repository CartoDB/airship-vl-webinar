/**
 * Compares two numerical histograms for equality
 *
 * @export
 * @param {VLNumericalHistogram} first
 * @param {VLNumericalHistogram} second
 * @returns
 */
export declare function isNumericalHistogramEqual(first: VLNumericalHistogram, second: VLNumericalHistogram): boolean;
/**
 * Compares two categorical histograms for equality
 *
 * @export
 * @param {VLCategoricalHistogram} first
 * @param {VLCategoricalHistogram} second
 * @returns
 */
export declare function isCategoricalHistogramEqual(first: VLCategoricalHistogram, second: VLCategoricalHistogram): boolean;
declare const _default: {
    isNumericalHistogramEqual: typeof isNumericalHistogramEqual;
    isCategoricalHistogramEqual: typeof isCategoricalHistogramEqual;
};
export default _default;
