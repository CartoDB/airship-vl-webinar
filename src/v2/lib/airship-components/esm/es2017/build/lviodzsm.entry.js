import { h } from '../airship.core.js';

import { a as readableNumber } from './chunk-6e6f6eb8.js';
import { a as shadeOrBlend } from './chunk-b62f03fa.js';
import { a as contentFragment } from './chunk-d27dd9c0.js';

const OTHER_CATEGORY_COLOR = '#747474';
const OTHER_CATEGORY_NAME = 'Other';
class CategoryWidget {
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
    static get style() { return "as-category-widget{--as--category-bar--background-color:var(--as--color--ui-02,#f5f5f5);--as--category-bar--color:var(--as--color--complementary,#47db99);--as--category-widget--background-color:var(--as--color--ui-01,#fff);--as--category-widget--bar--height:4px;--as--category-widget--description--color:var(--as--color--type-02,#747474);display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;min-width:228px;height:100%;overflow-y:auto;background:var(--as--category-widget--background-color)}as-category-widget .content{min-height:100px}as-category-widget .as-category-widget__count{color:var(--as--category-widget--description--color)}as-category-widget .as-category-widget__list{-ms-flex:1;flex:1;margin:0;padding:0;overflow-y:auto;list-style:none}as-category-widget .as-category-widget__list.as-category-widget__list--disabled li{pointer-events:none}as-category-widget .as-category-widget__footer{display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between}as-category-widget .as-category-widget__list+.as-category-widget__footer{margin-top:16px}as-category-widget .as-category-widget__info{display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between}as-category-widget .as-category-widget__title{-ms-flex:1;flex:1;width:100%;padding-right:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}as-category-widget .as-category-widget__bar{position:relative;width:100%;height:var(--as--category-widget--bar--height);border-radius:2px;background-color:var(--as--category-bar--background-color)}as-category-widget .as-category-widget__bar-value{position:absolute;left:0;max-width:100%;height:var(--as--category-widget--bar--height);-webkit-transition:background .2s ease,opacity .5s ease;transition:background .2s ease,opacity .5s ease;border-radius:2px}as-category-widget .as-category-widget__category{margin-bottom:8px;cursor:pointer}as-category-widget .as-category-widget__category--other{pointer-events:none}as-category-widget .as-category-widget__category--not-selected{opacity:.5}as-category-widget .as-category-widget__category:not(.as-category-widget__category--selected):hover .as-category-widget__bar-value{opacity:.6}"; }
}

export { CategoryWidget as AsCategoryWidget };
