/**
 * Converts a VL 'categorical' histogram to the format Airship's category widget requires
 *
 * @export
 * @param {VLCategoricalHistogram} data
 * @param {*} [colors]
 * @returns {object[]}
 */
export declare function vlToCategory(data: VLCategoricalHistogram, colors?: any): object[];
export default vlToCategory;
