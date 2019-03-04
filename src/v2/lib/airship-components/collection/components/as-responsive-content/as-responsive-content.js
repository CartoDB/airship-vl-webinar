import { redrawChildren } from '../../utils/redraw-children';
import contentService from './utils/content.service';
export class ResponsiveContent {
    constructor() {
        this.sections = [];
    }
    componentWillLoad() {
        this.sections = this.getContentSections();
    }
    componentDidLoad() {
        this.ready.emit();
    }
    async getSections() {
        return this.sections;
    }
    async setVisible(sectionName) {
        const sectionFound = this.sections.find((section) => section.name === sectionName);
        if (sectionFound) {
            this.setActive(sectionFound);
        }
    }
    render() {
        return [
            this._renderTabs(),
            this._renderContent()
        ];
    }
    _renderTabs() {
        const tabs = this.sections.map((section, index) => {
            if (!section.element) {
                return;
            }
            const cssClasses = {
                'as-tabs__item': true,
                'as-tabs__item--active': section.active
            };
            return (h("button", { onClick: () => this.setActive(section), role: 'tab', class: cssClasses }, section.name || index));
        });
        return (h("div", { role: 'tablist', class: 'as-toolbar-tabs as-tabs as-tabs--xl' }, tabs));
    }
    _renderContent() {
        return (h("section", { class: 'as-content' },
            h("slot", null)));
    }
    setActive(section) {
        if (section.active) {
            return;
        }
        this.disableActiveSection();
        section.enable();
        redrawChildren(section.element);
        this.activeSection = section;
        this.sections = [...this.sections];
        this.sectionChange.emit(section);
    }
    disableActiveSection() {
        if (!this.activeSection) {
            return;
        }
        this.activeSection.disable();
    }
    getContentSections() {
        const sections = [
            contentService.getMap(this.element),
            ...contentService.getSidebars(this.element),
            ...contentService.getPanels(this.element),
            contentService.getFooter(this.element)
        ].filter((section) => {
            return section !== null;
        });
        if (sections.length) {
            sections.sort((a, b) => a.order - b.order);
            this.setActive(sections[0]);
        }
        return sections;
    }
    static get is() { return "as-responsive-content"; }
    static get properties() { return {
        "element": {
            "elementRef": true
        },
        "getSections": {
            "method": true
        },
        "sections": {
            "state": true
        },
        "setVisible": {
            "method": true
        }
    }; }
    static get events() { return [{
            "name": "ready",
            "method": "ready",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "sectionChange",
            "method": "sectionChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:as-responsive-content:**/"; }
}
