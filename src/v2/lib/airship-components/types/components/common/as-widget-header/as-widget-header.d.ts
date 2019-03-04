import '../../../stencil.core';
/**
 * Helper class to draw widget headers
 *
 * @export
 * @class WidgetHeader
 */
export declare class WidgetHeader {
    /**
     * Main title
     *
     * @type {string}
     * @memberof WidgetHeader
     */
    header: string;
    /**
     * Secondary title
     *
     * @type {string}
     * @memberof WidgetHeader
     */
    subheader: string;
    /**
     * Use this attribute to put the widget-header in "error mode".
     * When this attribute is not empty the subheader will display the given value.
     */
    error: string;
    /**
     * Use this attribute to put the widget-header in "empty mode".
     * When this attribute is true the subheader will show the text defined by noDataMessage.
     */
    isEmpty: boolean;
    /**
     * Use this attribute to put the widget-header in "loading mode".
     * When this attribute is true the subheader text will be displayed as usual.
     */
    isLoading: boolean;
    /**
     * Use this attribute to select the text displayed in the subheader when the header is in "empty mode".
     * Defaults to "NO DATA AVAILABLE"
     */
    noDataMessage: string;
    render(): JSX.Element[];
    private _getSubHeader;
}
