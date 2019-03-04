export class Dropdown {
    constructor() {
        this.options = [];
        this.selectedOption = null;
        this.defaultText = '';
        this.showClearButton = false;
        this.isOpen = false;
        this.selectedOptionObject = {};
        this.onClickOutside = () => { this._closeList(); };
    }
    async closeList() {
        this._closeList();
    }
    onSelectionChanged(newValue) {
        this._selectFromValue(newValue);
    }
    onOptionsChanged() {
        this._selectFromValue(this.selectedOption);
    }
    onClickOutsideChanged(newValue, oldValue) {
        document.removeEventListener('click', oldValue);
        document.addEventListener('click', newValue);
    }
    componentWillLoad() {
        this._selectFromValue(this.selectedOption);
    }
    componentDidLoad() {
        document.addEventListener('click', this.onClickOutside);
    }
    componentDidUnload() {
        document.removeEventListener('click', this.onClickOutside);
    }
    render() {
        const allowRemoveSelectedOption = this.showClearButton && Boolean(this.selectedOption);
        const controlClasses = {
            'as-dropdown': true,
            'as-dropdown--clear': allowRemoveSelectedOption,
            'as-dropdown--open': this.isOpen
        };
        return (h("div", { class: controlClasses },
            h("button", { class: 'as-dropdown__control as-body', "aria-haspopup": 'true', "aria-expanded": this.isOpen, onClick: (e) => { e.stopPropagation(); this._toggleList(); } },
                this.selectedOptionObject && this.selectedOptionObject.text
                    || this.selectedOptionObject && this.selectedOptionObject.value
                    || this.defaultText,
                h("div", { class: 'as-dropdown__arrow' },
                    h("svg", { viewBox: '2 6 12 6', xmlns: 'http://www.w3.org/2000/svg' },
                        h("path", { d: 'M8.30988427,11.1237193 L7.69011573,11.1237193 L15.2195214,4.12372525 C15.415115,3.94188438 15.7124148,3.96294311 15.8835591,4.17076125 C16.0547035,4.37857939 16.0348835,4.69446043 15.83929,4.8763013 L8.30988427,11.8762953 C8.13246042,12.041244 7.86753958,12.041244 7.69011573,11.8762953 L0.160710032,4.8763013 C-0.034883519,4.69446043 -0.0547035068,4.37857939 0.116440851,4.17076125 C0.287585208,3.96294311 0.584885024,3.94188438 0.780478575,4.12372525 L8.30988427,11.1237193 Z' })))),
            h("ul", { tabindex: '-1', class: 'as-dropdown__list' }, this._renderOptions(this.options)),
            allowRemoveSelectedOption ?
                h("button", { class: 'as-dropdown__clear', onClick: () => this.clearOption() },
                    h("svg", { viewBox: '2 2 12 12', xmlns: 'http://www.w3.org/2000/svg' },
                        h("path", { d: 'M8,8.58232323 L1.70292632,14.8793969 C1.5421222,15.040201 1.28140721,15.040201 1.12060309,14.8793969 C0.95979897,14.7185928 0.95979897,14.4578778 1.12060309,14.2970737 L7.41767677,8 L1.12060309,1.70292632 C0.95979897,1.5421222 0.95979897,1.28140721 1.12060309,1.12060309 C1.28140721,0.95979897 1.5421222,0.95979897 1.70292632,1.12060309 L8,7.41767677 L14.2970737,1.12060309 C14.4578778,0.95979897 14.7185928,0.95979897 14.8793969,1.12060309 C15.040201,1.28140721 15.040201,1.5421222 14.8793969,1.70292632 L8.58232323,8 L14.8793969,14.2970737 C15.040201,14.4578778 15.040201,14.7185928 14.8793969,14.8793969 C14.7185928,15.040201 14.4578778,15.040201 14.2970737,14.8793969 L8,8.58232323 Z' }))) : ''));
    }
    _renderOptions(options) {
        return options.map((option) => {
            const buttonClasses = {
                'as-body': true,
                'is-selected': this._isSelected(option)
            };
            return (h("li", { class: 'as-dropdown__list-item', "data-value": option.value },
                h("button", { class: buttonClasses, onClick: (e) => { e.stopPropagation(); this._select(option); } }, option.text || option.value)));
        });
    }
    _isSelected(option) {
        return option === this.selectedOptionObject;
    }
    _select(optionObject) {
        if (this.selectedOption === optionObject.value) {
            return;
        }
        this.selectedOption = optionObject.value;
        this.selectedOptionObject = optionObject;
        this._closeList();
        this._emitOption();
    }
    _selectFromValue(value) {
        if (value === undefined || value === null) {
            this.selectedOptionObject = null;
            return;
        }
        const selectedOptionObject = this.options.find((option) => option.value === value);
        if (selectedOptionObject) {
            this.selectedOptionObject = selectedOptionObject;
        }
    }
    _toggleList() {
        this.isOpen = !this.isOpen;
    }
    _closeList() {
        this.isOpen = false;
    }
    clearOption() {
        this._closeList();
        this.selectedOption = null;
        this._emitOption();
    }
    _emitOption() {
        if (this.optionChanged) {
            this.optionChanged.emit(this.selectedOption);
        }
    }
    static get is() { return "as-dropdown"; }
    static get properties() { return {
        "closeList": {
            "method": true
        },
        "defaultText": {
            "type": String,
            "attr": "default-text"
        },
        "isOpen": {
            "state": true
        },
        "onClickOutside": {
            "type": "Any",
            "attr": "on-click-outside",
            "watchCallbacks": ["onClickOutsideChanged"]
        },
        "options": {
            "type": "Any",
            "attr": "options",
            "watchCallbacks": ["onOptionsChanged"]
        },
        "selectedOption": {
            "type": String,
            "attr": "selected-option",
            "mutable": true,
            "watchCallbacks": ["onSelectionChanged"]
        },
        "selectedOptionObject": {
            "state": true
        },
        "showClearButton": {
            "type": Boolean,
            "attr": "show-clear-button"
        }
    }; }
    static get events() { return [{
            "name": "optionChanged",
            "method": "optionChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:as-dropdown:**/"; }
}
