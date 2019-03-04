import '../../../stencil.core';
import { LegendData } from './types/LegendData';
/**
 * Helper class to draw the vertical axis on some widgets.
 *
 * @export
 * @class Legend
 */
export declare class Legend {
    /**
     * Data to be displayed by the legend
     *
     * @type {LegendData}
     * @memberof Legend
     */
    data: LegendData;
    render(): JSX.Element[];
}
