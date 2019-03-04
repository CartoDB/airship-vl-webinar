import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
export function binsScale(data) {
    return scaleLinear()
        .domain(getXDomain(data))
        .range([0, data.length]);
}
export function getXDomain(data) {
    const { start } = data.length > 0 ? data[0] : { start: 0 };
    const { end } = data.length > 0 ? data[data.length - 1] : { end: 0 };
    return [start, end];
}
export function getYDomain(data) {
    return [Math.min(0, getLowerBounds(data)), max(data, (d) => d.value)];
}
export function getLowerBounds(data) {
    return min(data, (d) => d.value);
}
export function getXScale(domain, width) {
    return scaleLinear()
        .domain(domain)
        .range([0, width]);
}
export function isCategoricalData(data) {
    return data.every(_hasCategory);
}
export function prepareData(data) {
    const hasRange = data.every(_hasRange);
    return data.map((d, index) => {
        const parsed = Object.assign({}, d);
        if (!hasRange) {
            parsed.start = index;
            parsed.end = index + 1;
        }
        return parsed;
    });
}
function _hasCategory(data) {
    return data.category !== undefined;
}
function _hasRange(data) {
    return data.start !== undefined && data.end !== undefined;
}
export function isBackgroundCompatible(data, backgroundData) {
    const isNull = [data, backgroundData].map((value) => value === null);
    if (isNull[0] !== isNull[1]) {
        return false;
    }
    if (isNull[0] && isNull[1]) {
        return true;
    }
    if (data.length !== backgroundData.length) {
        return true;
    }
    const isCategorical = data.every(_hasCategory);
    const hasRange = data.every(_hasRange);
    for (let index = 0; index < data.length; index++) {
        if (hasRange) {
            if (backgroundData[index].start !== data[index].start ||
                backgroundData[index].end !== data[index].end) {
                return false;
            }
        }
        if (isCategorical) {
            if (backgroundData[index].category !== data[index].category) {
                return false;
            }
        }
    }
    return true;
}
export default {
    getLowerBounds,
    getXDomain,
    getXScale,
    getYDomain,
    isBackgroundCompatible,
    isCategoricalData,
    prepareData,
};
