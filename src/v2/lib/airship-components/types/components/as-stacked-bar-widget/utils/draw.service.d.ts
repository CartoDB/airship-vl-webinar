import 'd3-transition';
import { StackedBarData } from '../types/StackedBarData';
/**
 * Draw the stacked bar char in the given svg element.
 */
export declare function drawColumns(svgElement: SVGElement, data: StackedBarData, mousemove: any, mouseleave: any): void;
export declare function drawYAxis(container: SVGElement, scale: [number, number]): SVGGElement;
declare const _default: {
    drawColumns: typeof drawColumns;
    drawYAxis: typeof drawYAxis;
};
export default _default;
