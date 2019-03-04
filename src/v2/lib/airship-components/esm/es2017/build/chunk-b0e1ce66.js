import { h } from '../airship.core.js';

function redrawChildren(element) {
    const allChildren = element.querySelectorAll('*');
    for (const child of allChildren) {
        const isAirshipElement = child.tagName.toLowerCase().indexOf('as-') === 0 && child.forceUpdate;
        if (isAirshipElement) {
            child.forceUpdate();
        }
    }
}

export { redrawChildren as a };
