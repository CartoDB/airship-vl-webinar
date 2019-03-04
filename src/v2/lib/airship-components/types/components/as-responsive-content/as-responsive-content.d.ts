import '../../stencil.core';
/**
 * Category Widget
 *
 * @export
 * @class CategoryWidget
 */
export declare class ResponsiveContent {
    private activeSection;
    private element;
    private sections;
    private ready;
    private sectionChange;
    componentWillLoad(): void;
    componentDidLoad(): void;
    getSections(): Promise<object[]>;
    setVisible(sectionName: string): Promise<void>;
    render(): JSX.Element[];
    private _renderTabs;
    private _renderContent;
    private setActive;
    private disableActiveSection;
    private getContentSections;
}
