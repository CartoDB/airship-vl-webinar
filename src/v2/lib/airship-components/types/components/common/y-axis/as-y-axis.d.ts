/**
 * Helper class to draw the vertical axis on some widgets.
 * WARNING: This component should be placed next to the SVG element.
 *
 * @export
 * @class YAxis
 */
export declare class YAxis {
    /**
     * Lower limit of the axis
     *
     * @type {number}
     * @memberof YAxis
     */
    from: number;
    /**
     * Upper limit of the axis
     *
     * @type {Number[]}
     * @memberof YAxis
     */
    to: number;
    /**
     * Use this attribute to decide if the widget should be rerendered on window resize
     * Defaults to true
     */
    responsive: boolean;
    /**
     * Reference to the HTMLStencilElement
     */
    private element;
    constructor();
    componentWillLoad(): void;
    componentDidUnload(): void;
    render(): void;
    private _resizeListener;
}
