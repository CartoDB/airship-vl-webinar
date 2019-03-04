import { ColorMap } from '../types/ColorMap';
import { Metadata } from '../types/Metadata';
import { RawStackedbarData } from '../types/RawStackedbarData';
import { StackedBarData } from '../types/StackedBarData';
/**
 * Compute the lowest and highest values in the RawStackedBarData array.
 * If the lowest value is bigger than zero, zero is returned instead.
 * @param data
 */
export declare function getDomain(data: RawStackedbarData[]): [number, number];
/**
 * Transform the data given from the user as widget attr into a internal format.
 */
export declare function rawDataToStackBarData(data: RawStackedbarData[], scale: [number, number], colorMap: ColorMap, width: number, margin: number): StackedBarData;
export declare function getKeys(data: RawStackedbarData[]): string[];
export declare function createLegendData(metadata: Metadata, colorMap: ColorMap): ColorMap;
declare const _default: {
    getDomain: typeof getDomain;
    rawDataToStackBarData: typeof rawDataToStackBarData;
    getKeys: typeof getKeys;
    createLegendData: typeof createLegendData;
};
export default _default;
