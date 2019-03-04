import '../../stencil.core';
/**
 * As Tabs
 *
 * @export
 * @class Tabs
 */
export declare class Tabs {
    /**
     * Index of the active tab. Defaults to 0
     */
    activeTab: number;
    /**
     * Make the tabs XL
     */
    xl: boolean;
    private element;
    render(): JSX.Element[];
    componentDidLoad(): void;
    componentDidUpdate(): void;
    private _parseChildren;
    private _updateActiveTab;
    private _renderTabs;
    private _renderTab;
    private _getTitle;
}
