import { HistogramData } from '../../as-histogram-widget/interfaces';
import { TimeSeriesData } from '../interfaces';
export declare function sameData(first: TimeSeriesData[], second: TimeSeriesData[]): boolean;
export declare function prepareData(data: TimeSeriesData[]): HistogramData[];
declare const _default: {
    prepareData: typeof prepareData;
    sameData: typeof sameData;
};
export default _default;
