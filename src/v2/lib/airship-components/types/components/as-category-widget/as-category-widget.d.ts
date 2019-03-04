import { EventEmitter } from '../../stencil.core';
/**
 * Category Widget
 *
 * @export
 * @class CategoryWidget
 */
export declare class CategoryWidget {
    /**
     * Array of categories to display in the widget.
     * Each category should include a `name` and a `value`.
     * You can also override the bar color for each category with `color`.
     *
     * @type {object[]}
     * @memberof CategoryWidget
     */
    categories: object[];
    /**
     * Default color to draw the bars. Default value is `#47DB99`.
     *
     * @type {string}
     * @memberof CategoryWidget
     */
    defaultBarColor: string;
    /**
     * Description text of the widget
     *
     * @type {string}
     * @memberof CategoryWidget
     */
    description: string;
    /**
     * Disable category selection in Widget
     *
     * @type {string}
     * @memberof CategoryWidget
     */
    disableInteractivity: boolean;
    /**
     * If this property receives a function, it will be used to format the numbers (eg. for adding $ or €).
     *
     * @type {function (value: number)}
     * @memberof RangeSlider
     */
    valueFormatter: (value: number) => string;
    /**
     * Heading text of the widget
     *
     * @type {string}
     * @memberof CategoryWidget
     */
    heading: string;
    /**
     * If truthy, it'll show a button to clear selected categories when there are any. Default value is `false`.
     *
     * @type {boolean}
     * @memberof CategoryWidget
     */
    showClearButton: boolean;
    /**
     * If truthy, it'll render the heading and component's description. Default value is `true`.
     *
     * @type {boolean}
     * @memberof CategoryWidget
     */
    showHeader: boolean;
    /**
     * If truthy, we'll use the sum of all categories' value to render the bar percentage.
     * By default, we use the maximum category value to render the bar percentage.
     *
     * @type {boolean}
     * @memberof CategoryWidget
     */
    useTotalPercentage: boolean;
    /**
     * The number of visible categories without aggregation.
     *
     * @type {number}
     * @memberof CategoryWidget
     */
    visibleCategories: number;
    /**
     * Boolean property to control the widget loading state. If true, a spinner is shown.
     */
    isLoading: boolean;
    /**
     * Text shown in the header subtitle when there's an error
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
     * Fired when selected categories changed or selected categories are cleared.
     *
     * @event categoriesSelected
     * @type {EventEmitter<string[]>}
     * @memberof CategoryWidget
     */
    categoriesSelected: EventEmitter<string[]>;
    private selectedCategories;
    /**
     * Default formatting function. Makes the value a readable number and
     * converts it into a string. Useful to compose with your own formatting
     * function.
     *
     * @memberof CategoryWidget
     */
    defaultFormatter(value: number): string;
    /**
     * Get current selected categories
     *
     * @returns
     * @memberof CategoryWidget
     */
    getSelectedCategories(): Promise<string[]>;
    /**
     * Clear current selected categories
     *
     * @returns
     * @memberof CategoryWidget
     */
    clearSelection(): Promise<void>;
    render(): any[];
    private _renderSelection;
    private _renderHeader;
    private _renderContent;
    private _renderCategoryList;
    private _renderCategories;
    private _renderCategory;
    private _renderOtherCategory;
    private _isSelected;
    private _toggleCategory;
    private _onCategoriesChanged;
    private _getCategoriesMaximumValue;
    private _getCategoriesTotalValue;
    private _getBarColor;
    private _parseCategories;
    private _getVisibleCategories;
    private _isEmpty;
}
