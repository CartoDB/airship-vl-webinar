import '../../../stencil.core';
/**
 * Helper class to draw widget selections
 *
 * @export
 * @class WidgetSelection
 */
export declare class WidgetSelection {
    /**
     * The text to be displayed
     *
     * @type {string}
     * @memberof WidgetSelection
     */
    selection: string;
    /**
     * Text for the clear text
     *
     * @type {string}
     * @memberof WidgetSelection
     */
    clearText: string;
    /**
     * Whether to display the clear button or not
     *
     * @type {boolean}
     * @memberof WidgetSelection
     */
    showClear: boolean;
    /**
     * Event fired when clicking on clear text
     *
     * @private
     * @memberof WidgetSelection
     */
    private clear;
    render(): JSX.Element;
    private renderClearBtn;
}
