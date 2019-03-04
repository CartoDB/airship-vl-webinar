import '../../../stencil.core';
import { EventEmitter } from '../../../stencil.core';
export declare class RangeSliderThumb {
    percentage: number;
    value: number;
    valueMin: number;
    valueMax: number;
    disabled: boolean;
    formatValue: (value: number) => string | number;
    thumbMove: EventEmitter<number>;
    thumbChangeStart: EventEmitter<void>;
    thumbChangeEnd: EventEmitter<void>;
    thumbIncrease: EventEmitter<number>;
    thumbDecrease: EventEmitter<number>;
    element: HTMLElement;
    railElement: HTMLElement;
    thumbValue: HTMLElement;
    railBoundingClientRect: ClientRect | DOMRect;
    render(): JSX.Element;
    onMouseDown(event: MouseEvent): void;
    onKeyDown(event: KeyboardEvent): void;
    private _onMove;
    private _onRelease;
    private _getDisplayValue;
    private setCursorTo;
}
