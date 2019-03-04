var Expression = /** @class */ (function () {
    function Expression(name, value) {
        this._name = name;
        this._value = value;
    }
    Object.defineProperty(Expression.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Expression.prototype, "expression", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return Expression;
}());
export { Expression };
