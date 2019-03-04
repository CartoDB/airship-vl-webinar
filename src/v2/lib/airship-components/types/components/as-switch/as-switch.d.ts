import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class Switch {
    /**
     * HTMLElement wraper for the switch component
     *
     * @type {HTMLElement}
     * @memberof Switch
     */
    el: HTMLElement;
    /**
     * Boolean flag to control if the input is checked or not
     *
     * @type {boolean}
     * @memberof Switch
     */
    checked: boolean;
    /**
     * Boolean flag to control when the switch is disabled or not
     *
     * @type {boolean}
     * @memberof Switch
     */
    disabled: boolean;
    /**
     * Input label
     *
     * @type {string}
     * @memberof Switch
     */
    label: string;
    /**
     * The input name
     *
     * @type {string}
     * @memberof Switch
     */
    name: string;
    /**
     * Event triggered by a enabled Switch component when the user clicks on it.
     *
     * @type{boolean}
     * @memberof Switch
     */
    change: EventEmitter;
    /**
     * When the component is attached to the DOM bind the onClick function
     */
    componentDidLoad(): void;
    /**
     * Fire a 'change' event with a boolean parameter if the user clicks on an enabled component
     */
    _onClick(): void;
    render(): JSX.Element;
    private _renderSwitch;
}
