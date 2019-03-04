import { ScaleLinear } from 'd3-scale';
import { HistogramData } from '../interfaces';
import { Domain } from '../types/Domain';
export declare function binsScale(data: HistogramData[]): ScaleLinear<number, number>;
export declare function getXDomain(data: HistogramData[]): Domain;
export declare function getYDomain(data: HistogramData[]): Domain;
export declare function getLowerBounds(data: HistogramData[]): number;
export declare function getXScale(domain: Domain, width: number): ScaleLinear<number, number>;
export declare function isCategoricalData(data: HistogramData[]): boolean;
export declare function prepareData(data: HistogramData[]): {
    start: number;
    end: number;
    category?: string;
    value: number;
    color?: string;
}[];
/**
 * Checks if an array of data and background data are compatible
 */
export declare function isBackgroundCompatible(data: HistogramData[], backgroundData: HistogramData[]): boolean;
declare const _default: {
    getLowerBounds: typeof getLowerBounds;
    getXDomain: typeof getXDomain;
    getXScale: typeof getXScale;
    getYDomain: typeof getYDomain;
    isBackgroundCompatible: typeof isBackgroundCompatible;
    isCategoricalData: typeof isCategoricalData;
    prepareData: typeof prepareData;
};
export default _default;
