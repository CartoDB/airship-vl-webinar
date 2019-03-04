import readableNumber from '../../utils/readable-number';
import { shadeOrBlend } from '../../utils/styles';
import contentFragment from '../common/content.fragment';
const OTHER_CATEGORY_COLOR = '#747474';
const OTHER_CATEGORY_NAME = 'Other';
export class CategoryWidget {
    constructor() {
        this.categories = [];
        this.disableInteractivity = false;
        this.valueFormatter = this.defaultFormatter;
        this.showClearButton = false;
        this.showHeader = true;
        this.useTotalPercentage = false;
        this.visibleCategories = Infinity;
        this.isLoading = false;
        this.error = '';
        this.errorDescription = '';
        this.noDataHeaderMessage = 'NO DATA AVAILABLE';
        this.noDataBodyMessage = 'There is no data to display.';
        this.selectedCategories = [];
    }
    defaultFormatter(value) {
        return `${readableNumber(value)}`;
    }
    async getSelectedCategories() {
        return this.selectedCategories;
    }
    async clearSelection() {
        if (!this.selectedCategories.length) {
            return;
        }
        this.selectedCategories = [];
        this._onCategoriesChanged();
    }
    render() {
        return [
            this._renderHeader(),
            this._renderSelection(),
            this._renderContent(),
        ];
    }
    _renderSelection() {
        if (this.isLoading || this._isEmpty() || this.error || !this.showClearButton) {
            return '';
        }
        const selectedCount = this.selectedCategories.length;
        return h("as-widget-selection", { selection: `${selectedCount || 'All'} selected`, clearText: 'Clear selection', showClear: selectedCount > 0, onClear: () => this.clearSelection() });
    }
    _renderHeader() {
        if (!this.showHeader) {
            return;
        }
        return h("as-widget-header", { header: this.heading, subheader: this.description, "is-empty": this._isEmpty(), "is-loading": this.isLoading, error: this.error, "no-data-message": this.noDataHeaderMessage });
    }
    _renderContent() {
        return contentFragment(this.isLoading, this.error, this._isEmpty(), this.heading, this.errorDescription, this.noDataBodyMessage, this._renderCategoryList());
    }
    _renderCategoryList() {
        const cssClasses = {
            'as-category-widget__list': true,
            'as-category-widget__list--disabled': this.disableInteractivity
        };
        return h("ul", { class: cssClasses }, this._renderCategories());
    }
    _renderCategories() {
        const moreCategoriesThanVisible = this.categories.length > this.visibleCategories;
        const { categories, otherCategory } = this._parseCategories();
        let otherCategoryTemplate;
        const categoriesToRender = categories.slice(0, this.visibleCategories);
        const maximumValue = this.useTotalPercentage
            ? this._getCategoriesTotalValue(this.categories)
            : this._getCategoriesMaximumValue(categories, Boolean(otherCategory));
        if (otherCategory || moreCategoriesThanVisible) {
            otherCategoryTemplate = this._renderOtherCategory(otherCategory, { maximumValue });
        }
        return [
            categoriesToRender.map((category) => this._renderCategory(category, { maximumValue })),
            otherCategoryTemplate
        ];
    }
    _renderCategory(category, options) {
        const { isOther, maximumValue } = options;
        const isSelected = this._isSelected(category.name);
        const isAnyCategorySelected = this.selectedCategories.length > 0;
        const barColor = this._getBarColor(category.color, { isSelected, isOther });
        const progressStyles = {
            backgroundColor: barColor ? barColor : `var(--as--category-bar--color)`,
            width: `${(category.value / maximumValue) * 100}%`
        };
        const cssClasses = {
            'as-category-widget__category': true,
            'as-category-widget__category--not-selected': isAnyCategorySelected && (!isSelected || isOther),
            'as-category-widget__category--other': isOther,
            'as-category-widget__category--selected': isSelected
        };
        const displayValue = this.valueFormatter(category.value);
        return (h("li", { class: cssClasses, onClick: () => this._toggleCategory(category) },
            h("p", { class: 'as-category-widget__info as-body' },
                h("div", { class: 'as-category-widget__title' }, category.name),
                displayValue),
            h("div", { class: 'as-category-widget__bar' },
                h("div", { class: 'as-category-widget__bar-value', style: progressStyles }))));
    }
    _renderOtherCategory(category, options) {
        const categoryData = category || {
            name: 'Other',
            value: this._getCategoriesTotalValue(this.categories.slice(this.visibleCategories, this.categories.length))
        };
        return this._renderCategory(categoryData, { maximumValue: options.maximumValue, isOther: true });
    }
    _isSelected(categoryName) {
        return this.selectedCategories.includes(categoryName);
    }
    _toggleCategory(category) {
        if (this.disableInteractivity) {
            return;
        }
        this.selectedCategories = this._isSelected(category.name)
            ? this.selectedCategories.filter((currentCategory) => currentCategory !== category.name)
            : [...this.selectedCategories, category.name];
        this._onCategoriesChanged();
    }
    _onCategoriesChanged() {
        this.categoriesSelected.emit(this.selectedCategories);
    }
    _getCategoriesMaximumValue(categories, otherCategoryPresent = false) {
        return this._getVisibleCategories(categories, otherCategoryPresent).reduce((maximum, currentCategory) => currentCategory.value > maximum ? currentCategory.value : maximum, 0);
    }
    _getCategoriesTotalValue(categories) {
        return categories.reduce((sum, currentCategory) => currentCategory.value + sum, 0);
    }
    _getBarColor(color, options = {}) {
        if (options.isOther) {
            return OTHER_CATEGORY_COLOR;
        }
        if (options.isSelected) {
            return shadeOrBlend(-0.16, color);
        }
        return color;
    }
    _parseCategories() {
        const otherCategory = this.categories.find((category) => category.name === OTHER_CATEGORY_NAME);
        if (otherCategory) {
            const categories = this.categories
                .filter((category) => category.name !== otherCategory.name);
            return { categories, otherCategory };
        }
        return { categories: this.categories };
    }
    _getVisibleCategories(parsedCategories, otherCategoryPresent) {
        if (otherCategoryPresent) {
            return parsedCategories;
        }
        return parsedCategories.slice(0, this.visibleCategories);
    }
    _isEmpty() {
        return !this.categories || !this.categories.length;
    }
    static get is() { return "as-category-widget"; }
    static get properties() { return {
        "categories": {
            "type": "Any",
            "attr": "categories"
        },
        "clearSelection": {
            "method": true
        },
        "defaultBarColor": {
            "type": String,
            "attr": "default-bar-color"
        },
        "description": {
            "type": String,
            "attr": "description"
        },
        "disableInteractivity": {
            "type": Boolean,
            "attr": "disable-interactivity"
        },
        "error": {
            "type": String,
            "attr": "error"
        },
        "errorDescription": {
            "type": String,
            "attr": "error-description"
        },
        "getSelectedCategories": {
            "method": true
        },
        "heading": {
            "type": String,
            "attr": "heading"
        },
        "isLoading": {
            "type": Boolean,
            "attr": "is-loading"
        },
        "noDataBodyMessage": {
            "type": String,
            "attr": "no-data-body-message"
        },
        "noDataHeaderMessage": {
            "type": String,
            "attr": "no-data-header-message"
        },
        "selectedCategories": {
            "state": true
        },
        "showClearButton": {
            "type": Boolean,
            "attr": "show-clear-button"
        },
        "showHeader": {
            "type": Boolean,
            "attr": "show-header"
        },
        "useTotalPercentage": {
            "type": Boolean,
            "attr": "use-total-percentage"
        },
        "valueFormatter": {
            "type": "Any",
            "attr": "value-formatter"
        },
        "visibleCategories": {
            "type": Number,
            "attr": "visible-categories"
        }
    }; }
    static get events() { return [{
            "name": "categoriesSelected",
            "method": "categoriesSelected",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:as-category-widget:**/"; }
}
