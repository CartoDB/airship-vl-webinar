export class Infowindow {
    render() {
        return !this.element.innerHTML && this.src
            ? this._renderImageInfoWindow()
            : this._renderStandarInfowindow();
    }
    componentDidLoad() {
        if (this.src) {
            this._setupHook();
        }
    }
    _renderStandarInfowindow() {
        return (h("div", { class: 'as-infowindow' },
            this.src && h("img", { src: this.src }),
            h("div", { class: 'as-infowindow__content' },
                h("slot", null)),
            h("div", { class: 'as-infowindow__hook' })));
    }
    _renderImageInfoWindow() {
        return (h("div", { class: 'as-infowindow' },
            h("div", { class: 'as-infowindow__media' },
                h("img", { src: this.src })),
            h("div", { class: 'as-infowindow__imageHook' },
                h("div", { class: 'as-infowindow__imageHook--inner' },
                    h("img", { src: this.src })))));
    }
    _setupHook() {
        const imageElement = this.element.querySelector('.as-infowindow__media img');
        if (!imageElement) {
            return;
        }
        imageElement.onload = () => {
            const imageHeight = imageElement.offsetHeight;
            const media = this.element.querySelector('.as-infowindow__media');
            const hook = this.element.querySelector('.as-infowindow__imageHook img');
            const offset = imageHeight - 18;
            media.style.height = `${offset}px`;
            hook.style.marginTop = `-${offset}px`;
        };
    }
    static get is() { return "as-infowindow"; }
    static get properties() { return {
        "element": {
            "elementRef": true
        },
        "src": {
            "type": String,
            "attr": "src"
        }
    }; }
    static get style() { return "/**style-placeholder:as-infowindow:**/"; }
}
