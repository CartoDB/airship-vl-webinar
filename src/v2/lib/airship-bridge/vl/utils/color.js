/**
 * Converts VL RGB Colors to hex
 *
 * @export
 * @param {RGBColor} color
 * @returns
 */
export function rgbToHex(color) {
    return "#" + _toHex(color.r) + _toHex(color.g) + _toHex(color.b) + _toHex(color.a * 255);
}
/**
 * Converts colors to hex strings. If input is a string is assumed to be a valid HEX string.
 *
 * @export
 * @param {(RGBColor | string)} color
 * @returns
 */
export function toHex(color) {
    if (typeof color === 'string') {
        return color;
    }
    return rgbToHex(color);
}
function _toHex(value) {
    if (isNaN(value) || value === undefined) {
        return '';
    }
    return value.toString(16).padStart(2, '0').toUpperCase();
}
