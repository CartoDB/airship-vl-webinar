import ApplicationSection from './ApplicationSection';
export declare function getMap(element: HTMLElement): ApplicationSection;
export declare function getSidebars(element: HTMLElement): ApplicationSection[];
export declare function getPanels(element: HTMLElement): ApplicationSection[];
export declare function getFooter(element: HTMLElement): ApplicationSection;
declare const _default: {
    getFooter: typeof getFooter;
    getMap: typeof getMap;
    getPanels: typeof getPanels;
    getSidebars: typeof getSidebars;
};
export default _default;
