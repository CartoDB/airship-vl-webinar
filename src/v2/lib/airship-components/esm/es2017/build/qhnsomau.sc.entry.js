import { h } from '../airship.core.js';

function getDecimalPlaces(decimalNumber) {
    function hasFraction(numberToCheck) {
        return Math.abs(Math.round(numberToCheck) - numberToCheck) > 1e-10;
    }
    let count = 0;
    while (hasFraction(decimalNumber * (10 ** count)) && isFinite(10 ** count)) {
        count++;
    }
    return count;
}

class RangeSlider {
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
    static get style() { return "as-range-slider{--as--range-slider--rail-color:var(--as--color--ui-03,#e2e6e3);--as--range-slider--range-color:var(--as--color--primary,#1785fb);display:block;height:32px}as-range-slider .as-range-slider--disabled{pointer-events:none}as-range-slider .as-range-slider__rail{display:-ms-flexbox;display:flex;position:relative;width:calc(100% - 12px);height:12px;margin:auto}as-range-slider .as-range-slider__rail:before{content:\" \";position:absolute;z-index:0;top:50%;left:0;width:100%;height:2px;-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0);background-color:var(--as--range-slider--rail-color,#e2e6e3);pointer-events:none}"; }
}

function handleMouseDown(listeners) {
    const handleMove = (eventProperties) => {
        listeners.move(eventProperties);
        eventProperties.preventDefault();
        eventProperties.stopPropagation();
    };
    const handleRelease = (eventProperties) => {
        _handleRelease(eventProperties, { move: handleMove, release: handleRelease }, listeners);
        eventProperties.preventDefault();
        eventProperties.stopPropagation();
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('mouseup', handleRelease);
    document.addEventListener('touchend', handleRelease);
    document.addEventListener('dragstart', preventAndStop);
}
function _handleRelease(eventProperties, listeners, customListeners) {
    document.removeEventListener('mousemove', listeners.move);
    document.removeEventListener('touchmove', listeners.move);
    document.removeEventListener('mouseup', listeners.release);
    document.removeEventListener('touchend', listeners.release);
    document.removeEventListener('dragstart', preventAndStop);
    if (customListeners.move) {
        customListeners.move(eventProperties);
    }
    if (customListeners.release) {
        customListeners.release(eventProperties);
    }
}
function preventAndStop(event) {
    event.preventDefault();
    event.stopPropagation();
}

const MAX_PERCENTAGE = 100;
const MIN_PERCENTAGE = 0;
class RangeSliderBar {
    render() {
        const barStyles = {
            left: `${this.rangeStartPercentage}%`,
            width: `${this.rangeEndPercentage - this.rangeStartPercentage}%`
        };
        const cssClasses = {
            'as-range-slider__range-bar': true,
            'as-range-slider__range-bar--disabled': this.disabled,
            'as-range-slider__range-bar--draggable': this.draggable
        };
        return h("div", { class: cssClasses, style: barStyles });
    }
    onMouseDown(event) {
        if (!this.draggable) {
            return;
        }
        this.barChangeStart.emit();
        this.railElement = document.querySelector('.as-range-slider__rail');
        this.rangeBarElement = this.element.querySelector('.as-range-slider__range-bar');
        this.previousMouseEvent = event;
        handleMouseDown({
            move: (moveEvent) => this.onMove(moveEvent),
            release: () => this._onRelease()
        });
    }
    onMove(event) {
        if (!this.previousMouseEvent) {
            this.previousMouseEvent = event;
            return;
        }
        this.setCursorTo('grabbing');
        if (this.rangeBarElement && this.rangeBarElement.classList) {
            this.rangeBarElement.classList.add('as-range-slider__range-bar--moving');
        }
        const rangeDifference = this._getRangeDifference();
        const movementDelta = this._getMovementDelta(event, this.previousMouseEvent);
        const barXPosition = this.rangeBarElement.offsetLeft + movementDelta;
        let leftPercentage = barXPosition * 100 / this.railElement.offsetWidth;
        let rightPercentage = leftPercentage + rangeDifference;
        if (leftPercentage < MIN_PERCENTAGE) {
            leftPercentage = MIN_PERCENTAGE;
            rightPercentage = leftPercentage + rangeDifference;
        }
        if (rightPercentage > MAX_PERCENTAGE) {
            rightPercentage = MAX_PERCENTAGE;
            leftPercentage = rightPercentage - rangeDifference;
        }
        const thresholdPassed = this._updateRangePercentages([leftPercentage, rightPercentage]);
        if (thresholdPassed) {
            this.previousMouseEvent = event;
        }
        this.barMove.emit([this.rangeStartPercentage, this.rangeEndPercentage]);
    }
    _updateRangePercentages(percentages) {
        const [leftPercentage, rightPercentage] = percentages;
        const direction = (leftPercentage < this.rangeStartPercentage) ? -1 : 1;
        const delta = Math.abs(this.rangeStartPercentage - leftPercentage);
        const threshold = this.stepPercentage;
        const rangeDifference = this._getRangeDifference();
        if (delta >= threshold) {
            this.rangeStartPercentage += direction * delta;
            this.rangeEndPercentage += direction * delta;
            return true;
        }
        if (rightPercentage > (MAX_PERCENTAGE - threshold)) {
            this.rangeStartPercentage = MAX_PERCENTAGE - rangeDifference;
            this.rangeEndPercentage = MAX_PERCENTAGE;
            return false;
        }
        if (leftPercentage < (MIN_PERCENTAGE + threshold)) {
            this.rangeStartPercentage = MIN_PERCENTAGE;
            this.rangeEndPercentage = MIN_PERCENTAGE + rangeDifference;
            return false;
        }
    }
    _onRelease() {
        this.setCursorTo('');
        if (this.rangeBarElement && this.rangeBarElement.classList) {
            this.rangeBarElement.classList.remove('as-range-slider__range-bar--moving');
        }
        this.barChangeEnd.emit();
    }
    _getMovementDelta(currentEvent, previousEvent) {
        const currentChangedTouches = currentEvent.changedTouches;
        const previousChangedTouches = previousEvent.changedTouches;
        const currentEventX = currentChangedTouches
            ? currentChangedTouches[0].pageX
            : currentEvent.pageX;
        const previousEventX = previousChangedTouches
            ? previousChangedTouches[0].pageX
            : previousEvent.pageX;
        return currentEventX - previousEventX;
    }
    _getRangeDifference() {
        return this.rangeEndPercentage - this.rangeStartPercentage;
    }
    setCursorTo(value) {
        document.body.style.cursor = value;
    }
    static get is() { return "as-range-slider-bar"; }
    static get properties() { return {
        "disabled": {
            "type": Boolean,
            "attr": "disabled"
        },
        "draggable": {
            "type": Boolean,
            "attr": "draggable"
        },
        "element": {
            "elementRef": true
        },
        "rangeEndPercentage": {
            "type": Number,
            "attr": "range-end-percentage",
            "mutable": true
        },
        "rangeStartPercentage": {
            "type": Number,
            "attr": "range-start-percentage",
            "mutable": true
        },
        "stepPercentage": {
            "type": Number,
            "attr": "step-percentage"
        }
    }; }
    static get events() { return [{
            "name": "barMove",
            "method": "barMove",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "barChangeStart",
            "method": "barChangeStart",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "barChangeEnd",
            "method": "barChangeEnd",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "mousedown",
            "method": "onMouseDown",
            "passive": true
        }, {
            "name": "touchstart",
            "method": "onMouseDown",
            "passive": true
        }]; }
    static get style() { return "as-range-slider-bar{--as--range-slider__range-bar--background-color:var(--as--color--primary,#1785fb);--as--range-slider__range-bar--background-color--disabled:var(--as--color--ui-03,#e2e6e3)}as-range-slider-bar .as-range-slider__range-bar{position:absolute;z-index:1;top:50%;height:2px;-webkit-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0);background-color:var(--as--range-slider__range-bar--background-color,#1785fb)}as-range-slider-bar .as-range-slider__range-bar--disabled{background-color:var(--as--range-slider__range-bar--background-color--disabled)}as-range-slider-bar .as-range-slider__range-bar--draggable{cursor:-webkit-grab;cursor:grab}as-range-slider-bar .as-range-slider__range-bar--draggable:after{content:\" \";position:absolute;top:-6px;left:0;width:calc(100% - 20px);height:12px;-webkit-transform:translate3d(10px,0,0);transform:translate3d(10px,0,0)}as-range-slider-bar .as-range-slider__range-bar--moving{cursor:-webkit-grabbing;cursor:grabbing}"; }
}

class RangeSliderThumb {
    render() {
        const thumbStyles = {
            left: `${this.percentage}%`
        };
        const cssClasses = {
            'as-range-slider__thumb': true,
            'as-range-slider__thumb--disabled': this.disabled
        };
        const cssValueClasses = {
            'as-caption': true,
            'as-font-medium': true,
            'as-range-slider__value': true,
            'as-range-slider__value--disabled': this.disabled,
        };
        return (h("div", { role: 'slider', tabindex: this.disabled ? '-1' : '0', "aria-valuetext": this._getDisplayValue(this.value), "aria-valuenow": this.value, "aria-valuemin": this.valueMin, "aria-valuemax": this.valueMax, class: cssClasses, style: thumbStyles, "data-value": this.value },
            h("div", { class: 'as-range-slider__thumb-handle' }),
            h("span", { class: cssValueClasses }, this._getDisplayValue(this.value))));
    }
    onMouseDown(event) {
        this.thumbChangeStart.emit();
        this.railElement = document.querySelector('.as-range-slider__rail');
        const thumb = event.target;
        thumb.classList.add('as-range-slider__thumb-handle--moving');
        this.thumbValue = thumb.parentElement.querySelector('.as-range-slider__value');
        this.thumbValue.classList.add('as-range-slider__value--moving');
        this.railBoundingClientRect = this.railElement.getBoundingClientRect();
        handleMouseDown({
            move: (moveEvent) => this._onMove(moveEvent),
            release: () => this._onRelease(thumb)
        });
        thumb.focus();
    }
    onKeyDown(event) {
        if (this.disabled) {
            return;
        }
        const KEY = {
            DOWN: 40,
            LEFT: 37,
            RIGHT: 39,
            UP: 38
        };
        let flag = false;
        switch (event.keyCode) {
            case KEY.DOWN:
            case KEY.LEFT:
                this.thumbDecrease.emit();
                flag = true;
                break;
            case KEY.UP:
            case KEY.RIGHT:
                this.thumbIncrease.emit();
                flag = true;
                break;
            default:
                break;
        }
        if (flag) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
    _onMove(event) {
        this.setCursorTo('grabbing');
        const changedTouches = event.changedTouches;
        const eventX = changedTouches ? changedTouches[0].pageX : event.pageX;
        const barPercentage = (eventX - this.railBoundingClientRect.left) * 100 / this.railElement.offsetWidth;
        if (barPercentage < 0 && this.percentage > 0) {
            return this.thumbMove.emit(0);
        }
        if (barPercentage > 100 && this.percentage < 100) {
            return this.thumbMove.emit(100);
        }
        if (barPercentage < 0 || barPercentage > 100) {
            return;
        }
        this.thumbMove.emit(barPercentage);
    }
    _onRelease(thumb) {
        thumb.classList.remove('as-range-slider__thumb-handle--moving');
        this.thumbValue.classList.remove('as-range-slider__value--moving');
        this.setCursorTo('');
        this.thumbChangeEnd.emit();
    }
    _getDisplayValue(value) {
        return (this.formatValue && this.formatValue(value)) || value;
    }
    setCursorTo(value) {
        document.body.style.cursor = value;
    }
    static get is() { return "as-range-slider-thumb"; }
    static get properties() { return {
        "disabled": {
            "type": Boolean,
            "attr": "disabled"
        },
        "element": {
            "elementRef": true
        },
        "formatValue": {
            "type": "Any",
            "attr": "format-value"
        },
        "percentage": {
            "type": Number,
            "attr": "percentage"
        },
        "value": {
            "type": Number,
            "attr": "value"
        },
        "valueMax": {
            "type": Number,
            "attr": "value-max"
        },
        "valueMin": {
            "type": Number,
            "attr": "value-min"
        }
    }; }
    static get events() { return [{
            "name": "thumbMove",
            "method": "thumbMove",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "thumbChangeStart",
            "method": "thumbChangeStart",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "thumbChangeEnd",
            "method": "thumbChangeEnd",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "thumbIncrease",
            "method": "thumbIncrease",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "thumbDecrease",
            "method": "thumbDecrease",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "mousedown",
            "method": "onMouseDown",
            "passive": true
        }, {
            "name": "touchstart",
            "method": "onMouseDown",
            "passive": true
        }, {
            "name": "keydown",
            "method": "onKeyDown"
        }]; }
    static get style() { return "as-range-slider-thumb .as-range-slider__thumb{--as--range-slider--disabled--value--color:var(--as--color--ui-03,#e2e6e3);--as--range-slider--thumb-handle--border-color:var(--as--color--primary,#1785fb);--as--range-slider--thumb-handle--background-color:var(--as--color--white,#fff);--as--range-slider--disabled--thumb-handle--border-color:var(--as--color--ui-03,#e2e6e3);--as--range-slider--disabled--thumb-handle--background-color:var(--as--color--ui-02,#f5f5f5);--as--range-slider--disabled--thumb-handle--focus-background-color:var(--as--color--ui-02,#f5f5f5);--as--range-slider--focus--thumb-handle--background-color:var(--as--color--primary,#1785fb);position:absolute;z-index:2;width:12px;height:12px;-webkit-transform:translate3d(-6px,0,0);transform:translate3d(-6px,0,0);-webkit-transition:opacity .2s ease,-webkit-transform .2s ease;transition:opacity .2s ease,-webkit-transform .2s ease;transition:transform .2s ease,opacity .2s ease;transition:transform .2s ease,opacity .2s ease,-webkit-transform .2s ease}as-range-slider-thumb .as-range-slider__value{position:absolute;bottom:-16px;left:50%;-webkit-transform:translate3d(-53%,0,0);transform:translate3d(-53%,0,0);-webkit-transition:-webkit-transform .2s ease;transition:-webkit-transform .2s ease;transition:transform .2s ease;transition:transform .2s ease,-webkit-transform .2s ease;pointer-events:none}as-range-slider-thumb .as-range-slider__value--disabled{color:var(--as--range-slider--disabled--value--color)}as-range-slider-thumb .as-range-slider__thumb-handle{width:12px;height:12px;-webkit-transition:-webkit-transform .2s ease;transition:-webkit-transform .2s ease;transition:transform .2s ease;transition:transform .2s ease,-webkit-transform .2s ease;border:1px solid var(--as--range-slider--thumb-handle--border-color);border-radius:50%;background-color:var(--as--range-slider--thumb-handle--background-color);cursor:-webkit-grab;cursor:grab}as-range-slider-thumb .as-range-slider__thumb-handle:before{content:\"\";position:absolute;top:-15px;left:-15px;width:30px;height:30px}as-range-slider-thumb .as-range-slider__thumb-handle.as-range-slider__thumb-handle--moving,as-range-slider-thumb .as-range-slider__thumb-handle:hover{-webkit-transform:scale(1.33);transform:scale(1.33)}as-range-slider-thumb .as-range-slider__thumb-handle--moving{cursor:-webkit-grabbing;cursor:grabbing}as-range-slider-thumb .as-range-slider__thumb--disabled .as-range-slider__thumb-handle{border:1px solid var(--as--range-slider--disabled--thumb-handle--border-color);background-color:var(--as--range-slider--disabled--thumb-handle--background-color)}as-range-slider-thumb .as-range-slider__thumb--disabled .as-range-slider__thumb-handle:focus{background:var(--as--range-slider--disabled--thumb-handle--focus-background-color)}as-range-slider-thumb .as-range-slider__thumb:focus{outline:none}as-range-slider-thumb .as-range-slider__thumb:focus .as-range-slider__thumb-handle{background:var(--as--range-slider--focus--thumb-handle--background-color)}as-range-slider-thumb .as-range-slider__thumb+.as-range-slider__thumb:hover{-webkit-transform:translate3d(-6px,0,0) scale(1.33);transform:translate3d(-6px,0,0) scale(1.33)}"; }
}

export { RangeSlider as AsRangeSlider, RangeSliderBar as AsRangeSliderBar, RangeSliderThumb as AsRangeSliderThumb };
