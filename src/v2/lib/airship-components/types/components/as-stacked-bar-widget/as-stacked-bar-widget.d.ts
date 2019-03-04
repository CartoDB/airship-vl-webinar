import { Metadata } from './types/Metadata';
import { RawStackedbarData } from './types/RawStackedbarData';
import { RectangleData } from './types/RectangleData';
/**
 * Stacked bar Widget
 *
 * @export
 * @class StackedBarWidget
 */
export declare class StackedBarWidget {
    /**
     * Header of the widget to be displayed
     *
     * @type {string}
     * @memberof StackedBarWidget
     */
    heading: string;
    /**
     * Description of the widget to be displayed
     *
     * @type {string}
     * @memberof StackedBarWidget
     */
    description: string;
    /**
     * Boolean flag to control legend visibility.
     * Defaults: true
     *
     * @type {boolean}
     * @memberof StackedBarWidget
     */
    showLegend: boolean;
    /**
     * The data that will be drawn.
     *
     * @type {RawStackedbarData}
     * @memberof StackedBarWidget
     */
    data: RawStackedbarData[];
    /**
     * Legend data
     */
    metadata: Metadata;
    /**
     * Use this attribute to put the widget in "loading mode".
     * When this attribute is true, the widget won't show any data, a spinner will be placed instead.
     */
    isLoading: boolean;
    /**
     * Use this attribute to put the widget in "error mode".
     * When this attribute is given, its text will be shown in the subheader and the widget content won't be displayed.
     */
    error: string;
    /**
     * Extended error description, only shown when error is present
     */
    errorDescription: string;
    /**
     * Message shown in header when no data is available
     */
    noDataHeaderMessage: string;
    /**
     * Message shown in body when no data is available
     */
    noDataBodyMessage: string;
    /**
     * Use this attribute to decide if the widget should be rerendered on window resize.
     * Defaults to true.
     */
    responsive: boolean;
    /**
     * Store a reference to the element to force repaint on window resize.
     */
    el: HTMLStencilElement;
    /**
     * Hold a reference to the tooltip to show on mouseover
     */
    private tooltip;
    /**
     * Reference to the svg element where the plot will be rendered
     */
    private container;
    /**
     * Chart scale, will be displayed by the yAxis
     */
    private scale;
    /**
     * Mapping between colors and categories
     */
    private colorMap;
    constructor();
    /**
     * Callback executed when the mouse is placed over a rectangle.
     */
    mouseOver: (data: RectangleData) => void;
    /**
     * Callback executed when the mouse is placed outside a rectangle.
     */
    mouseLeave: () => void;
    /**
     * Easy customize tooltip format
     */
    formatFn: (value: any) => any;
    render(): any[];
    componentDidLoad(): void;
    componentDidUpdate(): void;
    componentWillLoad(): void;
    componentWillUpdate(): void;
    componentDidUnload(): void;
    _onDataChanged(): void;
    private _setupState;
    private _renderContent;
    private _drawFigure;
    private _drawColumns;
    private _drawYAxis;
    private _renderLegend;
    private _createColorMap;
    private _isEmpty;
    private _resizeListener;
    private _isContainerReady;
}
