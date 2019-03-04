/**
 * Compares two numerical histograms for equality
 *
 * @export
 * @param {VLNumericalHistogram} first
 * @param {VLNumericalHistogram} second
 * @returns
 */
export function isNumericalHistogramEqual(first, second) {
    return isHistogramEqual(first.value, second.value, numericalCompare);
}
/**
 * Compares two categorical histograms for equality
 *
 * @export
 * @param {VLCategoricalHistogram} first
 * @param {VLCategoricalHistogram} second
 * @returns
 */
export function isCategoricalHistogramEqual(first, second) {
    return isHistogramEqual(first.value, second.value, categoricalCompare);
}
function isHistogramEqual(first, second, compareFn) {
    if (first.length !== second.length) {
        return false;
    }
    for (var i = 0; i < first.length; i++) {
        if (compareFn(first[i], second[i])) {
            return false;
        }
    }
    return true;
}
function numericalCompare(first, second) {
    return first.x[0] !== second.x[0] ||
        first.x[1] !== second.x[1] ||
        first.y !== second.y;
}
function categoricalCompare(first, second) {
    return first.x !== second.x || first.y !== second.y;
}
export default { isNumericalHistogramEqual: isNumericalHistogramEqual, isCategoricalHistogramEqual: isCategoricalHistogramEqual };
