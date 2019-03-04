import getDecimalPlaces from '../../../utils/get-decimal-places';
export class RangeSlider {
    constructor() {
        this.minValue = 0;
        this.maxValue = 10;
        this.step = 1;
        this.disabled = false;
        this.draggable = false;
        this.thumbs = [];
    }
    validateValue(newValue) {
        if (!this._isBetweenValidValues(newValue)) {
            throw new Error(`RangeSlider: Value ${newValue} has to be between ` +
                `minValue (${this.minValue}) and maxValue (${this.maxValue})`);
        }
        this._updateThumbs();
    }
    validateRange(newRange) {
        if (newRange.length !== 2) {
            throw new Error(`RangeSlider: Range ${newRange} need two values at most`);
        }
        newRange.map((value) => this.validateValue(value));
        this._updateThumbs();
    }
    componentWillLoad() {
        this._validateValues();
        this._updateThumbs();
    }
    render() {
        if (this.thumbs.length < 1) {
            return;
        }
        const cssClasses = {
            'as-range-slider': true,
            'as-range-slider--disabled': this.disabled
        };
        return (h("div", { class: cssClasses },
            h("div", { class: 'as-range-slider__rail' },
                this.thumbs.map((thumb) => this._renderThumb(thumb)),
                this._renderRangeBar())));
    }
    _updateThumbs() {
        this.thumbs = this._createThumbs();
    }
    _renderThumb(thumb) {
        return h("as-range-slider-thumb", { value: thumb.value, valueMin: thumb.valueMin, valueMax: thumb.valueMax, percentage: thumb.percentage, disabled: this.disabled, formatValue: this.formatValue, onThumbMove: (event) => this._onThumbMove(thumb, event.detail), onThumbIncrease: () => this._onKeyboardThumbMove(thumb, +1), onThumbDecrease: () => this._onKeyboardThumbMove(thumb, -1), onThumbChangeStart: () => this._emitChangeIn(this.changeStart), onThumbChangeEnd: () => this._emitChangeIn(this.changeEnd) });
    }
    _renderRangeBar() {
        const [firstThumbPercentage, lastThumbPercentage] = this._getCurrentThumbPercentages();
        const draggable = this.draggable && this.range !== undefined;
        return h("as-range-slider-bar", { rangeStartPercentage: firstThumbPercentage, rangeEndPercentage: lastThumbPercentage, draggable: draggable, disabled: this.disabled, stepPercentage: this._getStepPercentage(), onBarChangeStart: () => this._emitChangeIn(this.changeStart), onBarChangeEnd: () => this._emitChangeIn(this.changeEnd), onBarMove: (event) => this._onBarMove(event) });
    }
    _getCurrentThumbPercentages() {
        const firstThumbPercentage = this._sliderHasRange() ? this.thumbs[0].percentage : 0;
        const lastThumbPercentage = this.thumbs[this.thumbs.length - 1].percentage;
        return [firstThumbPercentage, lastThumbPercentage];
    }
    _validateValues() {
        if (this.value) {
            this.validateValue(this.value);
            return;
        }
        if (this.range) {
            this.validateRange(this.range);
            return;
        }
    }
    _createThumbs() {
        const hasRangeValues = this.range && this.range.length;
        if (!hasRangeValues) {
            return [this._getThumbData(this.value)];
        }
        const thumbs = this.range.map((value) => this._getThumbData(value));
        this._clampThumbValues(thumbs);
        return thumbs;
    }
    _getThumbData(value) {
        return {
            percentage: this._isBetweenValidValues(value) ?
                this._getPercentage(value)
                : this._getPercentage(this.minValue),
            value: this._isBetweenValidValues(value) ? value : this.minValue,
            valueMax: this.maxValue,
            valueMin: this.minValue
        };
    }
    _isBetweenValidValues(value) {
        return value >= this.minValue && value <= this.maxValue;
    }
    _sliderHasRange() {
        return this.range && this.range.length === 2;
    }
    _onKeyboardThumbMove(thumb, direction) {
        const percentage = this._getPercentage(thumb.value + (direction * this.step));
        if (percentage < 0 || percentage > 100) {
            return;
        }
        this._onThumbMove(thumb, percentage);
    }
    _onThumbMove(thumb, percentage) {
        const [leftThumb, rightThumb] = this.thumbs;
        const isLeftThumb = leftThumb === thumb;
        const isRightThumb = rightThumb === thumb;
        const value = this._getValueFromPercentage(percentage);
        const stepValue = this._getStepValue(value);
        const stepPercentage = this._getPercentage(stepValue);
        let valueMin = this.minValue;
        let valueMax = this.maxValue;
        if (this._sliderHasRange() && isLeftThumb) {
            valueMax = (rightThumb.value - this.step);
            if (valueMax < stepValue) {
                return;
            }
        }
        if (this._sliderHasRange() && isRightThumb) {
            valueMin = (leftThumb.value + this.step);
            if (valueMin > stepValue) {
                return;
            }
        }
        thumb.value = stepValue;
        thumb.valueMin = valueMin;
        thumb.valueMax = valueMax;
        thumb.percentage = stepPercentage;
        this.thumbs = [...this.thumbs];
        this._emitChangeIn(this.change);
    }
    _onBarMove(percentage) {
        const percentageRange = percentage.detail;
        const rangeValues = percentageRange.map((p) => this._getValueFromPercentage(p));
        const stepValues = rangeValues.map((value) => this._getStepValue(value));
        const thumbs = stepValues.map((stepValue) => ({
            percentage: this._getPercentage(stepValue),
            value: stepValue
        }));
        this._clampThumbValues(thumbs);
        this.thumbs = [...thumbs];
        this._emitChangeIn(this.change);
    }
    _emitChangeIn(eventEmitterInstance) {
        const values = this.thumbs.map((thumb) => thumb.value);
        return eventEmitterInstance.emit(values);
    }
    _getPercentage(value) {
        return ((value - this.minValue) / (this.maxValue - this.minValue)) * 100;
    }
    _getValueFromPercentage(percentage) {
        return ((percentage * (this.maxValue - this.minValue)) / 100) + this.minValue;
    }
    _getStepPercentage() {
        const range = (this.maxValue - this.minValue);
        return this.step * 100 / range;
    }
    _clampThumbValues(thumbs) {
        const [leftThumb, rightThumb] = thumbs;
        leftThumb.valueMin = this.minValue;
        leftThumb.valueMax = Math.min(rightThumb.value - this.step, this.maxValue);
        rightThumb.valueMin = Math.max(this.minValue, leftThumb.value + this.step);
        rightThumb.valueMax = this.maxValue;
    }
    _getStepValue(value) {
        const stepValue = Math.max(this.minValue, Math.round(value / this.step) * this.step);
        return this.roundToStep(stepValue, this.step);
    }
    roundToStep(numberToRound, step) {
        return Number.parseFloat(numberToRound.toFixed(getDecimalPlaces(step)));
    }
    static get is() { return "as-range-slider"; }
    static get properties() { return {
        "disabled": {
            "type": Boolean,
            "attr": "disabled"
        },
        "draggable": {
            "type": Boolean,
            "attr": "draggable"
        },
        "formatValue": {
            "type": "Any",
            "attr": "format-value"
        },
        "maxValue": {
            "type": Number,
            "attr": "max-value"
        },
        "minValue": {
            "type": Number,
            "attr": "min-value"
        },
        "range": {
            "type": "Any",
            "attr": "range",
            "watchCallbacks": ["validateRange"]
        },
        "step": {
            "type": Number,
            "attr": "step"
        },
        "thumbs": {
            "state": true
        },
        "value": {
            "type": Number,
            "attr": "value",
            "watchCallbacks": ["validateValue"]
        }
    }; }
    static get events() { return [{
            "name": "change",
            "method": "change",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "changeStart",
            "method": "changeStart",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "changeEnd",
            "method": "changeEnd",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:as-range-slider:**/"; }
}
