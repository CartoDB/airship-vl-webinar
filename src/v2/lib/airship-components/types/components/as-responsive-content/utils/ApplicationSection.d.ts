export default class ApplicationSection {
    private _active;
    private _activeClass;
    private _element;
    private _name;
    private _order;
    private _type;
    constructor({ activeClass, element, name, order, type }: {
        activeClass: any;
        element: any;
        name: any;
        order: any;
        type: any;
    });
    readonly active: boolean;
    readonly activeClass: string;
    readonly element: HTMLElement;
    readonly name: string;
    readonly order: number;
    readonly type: "map" | "sidebar" | "mapFooter" | "panels";
    enable(): void;
    disable(): void;
}
