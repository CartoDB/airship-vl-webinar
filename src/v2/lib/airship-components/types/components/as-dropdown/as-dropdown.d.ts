import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
import { DropdownOption } from './types/DropdownOption';
/**
 * Dropdown Widget
 *
 * @export
 * @class Dropdown
 */
export declare class Dropdown {
    /**
     * Array of options to display in the dropdown
     *
     * @type {string[]}
     * @memberof Dropdown
     */
    options: DropdownOption[];
    /**
     * Selected option to show in the dropdown
     *
     * @type {string}
     * @memberof Dropdown
     */
    selectedOption: string;
    /**
     * Default text to show when no option is selected
     *
     * @type {string}
     * @memberof Dropdown
     */
    defaultText: string;
    /**
     * Allow the user to clear selected option
     *
     * @type {string}
     * @memberof Dropdown
     */
    showClearButton: boolean;
    /**
     * Fired when selected option changes or option is cleared
     *
     * @type {string}
     * @memberof Dropdown
     */
    optionChanged: EventEmitter<string>;
    private isOpen;
    private selectedOptionObject;
    /**
     * Function called when clicking outside of the dropdown.
     * By default it closes the list.
     *
     * @type {function}
     * @memberof Dropdown
     */
    onClickOutside: () => void;
    /**
     * Closes the list, useful in case you need to customize {onClickOutside}
     *
     * @memberof Dropdown
     */
    closeList(): Promise<void>;
    onSelectionChanged(newValue: string): void;
    onOptionsChanged(): void;
    onClickOutsideChanged(newValue: any, oldValue: any): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
    render(): JSX.Element;
    private _renderOptions;
    private _isSelected;
    private _select;
    private _selectFromValue;
    private _toggleList;
    private _closeList;
    private clearOption;
    private _emitOption;
}
