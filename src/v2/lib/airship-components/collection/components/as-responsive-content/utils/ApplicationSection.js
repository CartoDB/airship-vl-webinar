export default class ApplicationSection {
    constructor({ activeClass, element, name, order, type }) {
        this._active = false;
        this._activeClass = activeClass;
        this._element = element;
        this._name = name;
        this._order = order;
        this._type = type;
    }
    get active() {
        return this._active;
    }
    get activeClass() {
        return this._activeClass;
    }
    get element() {
        return this._element;
    }
    get name() {
        return this._name;
    }
    get order() {
        return this._order;
    }
    get type() {
        return this._type;
    }
    enable() {
        this.element.classList.add(this._activeClass);
        this._active = true;
    }
    disable() {
        this.element.classList.remove(this._activeClass);
        this._active = false;
    }
}
