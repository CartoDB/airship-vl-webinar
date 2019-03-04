import { redrawChildren } from '../../utils/redraw-children';
export class Tabs {
    constructor() {
        this.activeTab = 0;
        this.xl = false;
    }
    render() {
        const children = this._parseChildren();
        return [
            this._renderTabs(children),
            h("slot", null)
        ];
    }
    componentDidLoad() {
        const children = this._parseChildren();
        this._updateActiveTab(children);
    }
    componentDidUpdate() {
        const children = this._parseChildren();
        this._updateActiveTab(children);
    }
    _parseChildren() {
        return Array.from(this.element.querySelectorAll('[role="tabpanel"]'));
    }
    _updateActiveTab(children) {
        if (!children) {
            console.warn('Airship Tabs: Children elements must have role="tabpanel" attribute.');
            return;
        }
        children.forEach((element, i) => {
            const visible = this.activeTab === i;
            visible ? element.removeAttribute('hidden') : element.setAttribute('hidden', 'hidden');
            if (visible) {
                redrawChildren(element);
            }
        });
    }
    _renderTabs(children) {
        const tabListClasses = {
            'as-tabs': true,
            'as-tabs--xl': this.xl,
        };
        return h("div", { role: 'tablist', class: tabListClasses }, children.map(this._renderTab.bind(this)));
    }
    _renderTab(childrenElement, index) {
        const elementClasses = {
            'as-tabs__item': true,
            'as-tabs__item--active': index === this.activeTab
        };
        const title = this._getTitle(childrenElement, index);
        return h("button", { role: 'tab', class: elementClasses, onClick: () => { this.activeTab = index; } },
            " ",
            title,
            " ");
    }
    _getTitle(element, index) {
        if (element.getAttribute('data-title')) {
            return element.getAttribute('data-title');
        }
        return `Tab ${index}`;
    }
    static get is() { return "as-tabs"; }
    static get properties() { return {
        "activeTab": {
            "type": Number,
            "attr": "active-tab",
            "mutable": true
        },
        "element": {
            "elementRef": true
        },
        "xl": {
            "type": Boolean,
            "attr": "xl"
        }
    }; }
    static get style() { return "/**style-placeholder:as-tabs:**/"; }
}
