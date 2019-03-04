import { HistogramData } from '../interfaces';
import { SVGContainer, SVGGContainer } from '../types/Container';
export declare function addTooltip(container: SVGContainer, barsContainer: SVGGContainer, hasSelection: {
    selection: number[] | null;
    setSelection: any;
}, color: string, unselectedColor: string, formatter: (d: HistogramData) => string | string[], setTooltip: (tooltip: string | string[] | null, evt?: MouseEvent) => void, className: string): void;
declare const _default: {
    addTooltip: typeof addTooltip;
};
export default _default;
