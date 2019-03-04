export function handleMouseDown(listeners) {
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
