import { ScaleLinear } from 'd3';
import { BrushBehavior } from 'd3-brush';
import { SVGContainer, SVGGContainer } from '../types/Container';
export declare function addBrush(width: number, height: number, onBrush: () => void, onBrushEnd: () => void, CUSTOM_HANDLE_WIDTH: number, CUSTOM_HANDLE_HEIGHT: any, X_PADDING: number, Y_PADDING: number): BrushBehavior<{}>;
export declare function addBrushArea(brush: BrushBehavior<{}>, container: SVGContainer): SVGGContainer;
export declare function addCustomHandles(brushArea: SVGGContainer, CUSTOM_HANDLE_WIDTH: number, CUSTOM_HANDLE_HEIGHT: number, scale: ScaleLinear<number, number>): SVGGContainer<{
    type: string;
}, SVGGElement, {}>;
declare const _default: {
    addBrush: typeof addBrush;
    addBrushArea: typeof addBrushArea;
    addCustomHandles: typeof addCustomHandles;
};
export default _default;
