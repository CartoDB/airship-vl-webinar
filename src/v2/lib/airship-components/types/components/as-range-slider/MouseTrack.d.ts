export declare function handleMouseDown(listeners: MouseListeners): void;
interface MouseListeners {
    move?: (eventProperties: MouseEvent) => void;
    release?: (eventProperties: MouseEvent) => void;
}
export {};
