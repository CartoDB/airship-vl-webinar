import { h } from '../airship.core.js';

function readableNumber (value) {
    const roundedNumber = Math.abs(Math.ceil(value * 100) / 100);
    if (roundedNumber >= 1000000000) {
        return `${(roundedNumber / 1000000000).toFixed(1)}G`.padStart(5);
    }
    if (roundedNumber >= 1000000) {
        return `${(roundedNumber / 1000000).toFixed(1)}M`.padStart(5);
    }
    if (roundedNumber >= 1000) {
        return `${(roundedNumber / 1000).toFixed(1)}K`.padStart(5);
    }
    const roundedStr = `${roundedNumber}`;
    return roundedStr.padStart(6 + Math.abs(roundedStr.length - 3));
}

export { readableNumber as a };
