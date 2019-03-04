/**
 * Converts VL RGB Colors to hex
 *
 * @export
 * @param {RGBColor} color
 * @returns
 */
export declare function rgbToHex(color: RGBColor): string;
/**
 * Converts colors to hex strings. If input is a string is assumed to be a valid HEX string.
 *
 * @export
 * @param {(RGBColor | string)} color
 * @returns
 */
export declare function toHex(color: RGBColor | string): string;
