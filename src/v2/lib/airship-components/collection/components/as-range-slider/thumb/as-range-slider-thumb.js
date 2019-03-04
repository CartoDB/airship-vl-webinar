import { handleMouseDown } from '../MouseTrack';
export class RangeSliderThumb {
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
    static get style() { return "/**style-placeholder:as-range-slider-thumb:**/"; }
}
