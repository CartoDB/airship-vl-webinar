import { Axis } from 'd3-axis';
import { ScaleLinear } from 'd3-scale';
import { AxisOptions, HistogramData } from '../interfaces';
import { SVGContainer, SVGGContainer } from '../types/Container';
import { Domain } from '../types/Domain';
export declare function cleanAxes(yAxisSelection: SVGGContainer): void;
export declare function updateAxes(container: SVGContainer, xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>, xAxis: Axis<{
    valueOf(): number;
}>, yAxis: Axis<{
    valueOf(): number;
}>, xDomain: Domain, yDomain: Domain): void;
export declare function renderPlot(container: SVGContainer): SVGGContainer;
export declare function renderBars(data: HistogramData[], yScale: ScaleLinear<number, number>, container: SVGContainer, barsContainer: SVGGContainer, color: string, X_PADDING: number, Y_PADDING: number, disableAnimation?: boolean, className?: string): void;
export declare function renderXAxis(container: SVGContainer, domain: Domain, bins: number, X_PADDING: number, Y_PADDING: number, customFormatter: (value: Date | number) => string, axisOptions: AxisOptions): Axis<{
    valueOf(): number;
}>;
export declare function renderYAxis(container: SVGContainer, yAxis: Axis<{
    valueOf(): number;
}>, X_PADDING: number): void;
export declare function generateYScale(container: SVGContainer, domain: Domain, X_PADDING: number, Y_PADDING: number, axisOptions: AxisOptions): Axis<number | {
    valueOf(): number;
}>;
export declare function conditionalFormatter(value: any): string;
declare const _default: {
    cleanAxes: typeof cleanAxes;
    conditionalFormatter: typeof conditionalFormatter;
    generateYScale: typeof generateYScale;
    renderBars: typeof renderBars;
    renderPlot: typeof renderPlot;
    renderXAxis: typeof renderXAxis;
    renderYAxis: typeof renderYAxis;
    updateAxes: typeof updateAxes;
};
export default _default;
