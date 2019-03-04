import { h } from '../airship.core.js';

class Infowindow {
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
    static get style() { return "as-infowindow{--as--infowindow--color--background:var(--as--color--ui-01,#fff);--as--infowindow--color--shadow:var(--as--color--shadow,rgba(44,44,44,0.16));display:inline-block}as-infowindow .as-infowindow{display:inline-block;position:relative;z-index:3;width:260px;border-radius:4px 4px 4px 0;background:var(--as--infowindow--color--background);-webkit-box-shadow:0 4px 16px 0 var(--as--infowindow--color--shadow);box-shadow:0 4px 16px 0 var(--as--infowindow--color--shadow)}as-infowindow .as-infowindow img{display:block;width:100%;border-top-left-radius:4px;border-top-right-radius:4px}as-infowindow .as-infowindow__media{overflow:hidden;border-radius:4px 4px 4px 0}as-infowindow .as-infowindow__content{height:100%;padding:16px;overflow:auto}as-infowindow .as-infowindow__hook{position:absolute;z-index:10;bottom:1px;left:0;background:var(--as--infowindow--color--background)}as-infowindow .as-infowindow__hook:before{z-index:3;top:0;border-top:12px solid var(--as--infowindow--color--background);border-radius:0 0 0 4px}as-infowindow .as-infowindow__hook:after,as-infowindow .as-infowindow__hook:before{content:\"\";position:absolute;left:0;width:0;height:0;border-right:18px solid transparent}as-infowindow .as-infowindow__hook:after{z-index:2;top:3px;border-top:12px solid var(--as--infowindow--color--shadow);-webkit-filter:blur(2px);filter:blur(2px)}as-infowindow .as-infowindow__imageHook{position:absolute;z-index:10;bottom:0}as-infowindow .as-infowindow__imageHook:after{content:\"\";position:absolute;z-index:1;top:3px;left:0;width:0;height:0;border-top:12px solid var(--as--infowindow--color--shadow);border-right:18px solid transparent;-webkit-filter:blur(2px);filter:blur(2px)}as-infowindow .as-infowindow__imageHook--inner{position:absolute;z-index:3;top:-1px;width:18px;height:12px;overflow:hidden;-webkit-clip-path:polygon(0 0,0 100%,100% 0);clip-path:polygon(0 0,0 100%,100% 0)}as-infowindow .as-infowindow__imageHook--inner>img{width:260px}"; }
}

export { Infowindow as AsInfowindow };
