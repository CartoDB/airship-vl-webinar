import { scaleLinear } from 'd3-scale';
export function getDomain(data) {
    return data.reduce((domain, currentValue) => {
        let positiveAcum = 0;
        let negativeAcum = 0;
        for (const key of Object.keys(currentValue.values)) {
            const value = currentValue.values[key];
            if (value >= 0) {
                positiveAcum += value;
            }
            if (value < 0) {
                negativeAcum += value;
            }
        }
        if (negativeAcum <= domain[0]) {
            domain[0] = negativeAcum;
        }
        if (positiveAcum >= domain[1]) {
            domain[1] = positiveAcum;
        }
        return domain;
    }, [0, 0]);
}
export function rawDataToStackBarData(data, scale, colorMap, width, margin) {
    const origin = _getZeroAxis(scale);
    let xOffset = margin / 2;
    const result = [];
    for (const rawColumn of data) {
        result.push(_generateColumn(rawColumn, scale, colorMap, width, origin, xOffset));
        xOffset += width + margin;
    }
    return result;
}
export function getKeys(data) {
    const keys = new Set();
    for (const rawColumn of data) {
        Object.keys(rawColumn.values).forEach((key) => {
            keys.add(key);
        });
    }
    const result = [];
    keys.forEach((key) => result.push(key));
    return result;
}
export function createLegendData(metadata, colorMap) {
    if (!metadata) {
        return colorMap;
    }
    const legendData = {};
    for (const key in colorMap) {
        if (metadata[key].label) {
            legendData[metadata[key].label] = colorMap[key];
        }
        else {
            legendData[key] = colorMap[key];
        }
    }
    return legendData;
}
function _generateColumn(data, scale, colorMap, width, origin, x) {
    const column = [];
    let yOffset = origin;
    const [positives, negatives] = _split(data);
    negatives.forEach((key) => {
        yOffset += _addRectangleAndGetHeight(column, data, key, scale, colorMap, x, width, yOffset, false);
    });
    yOffset = origin;
    positives.forEach((key) => {
        yOffset -= _addRectangleAndGetHeight(column, data, key, scale, colorMap, x, width, yOffset, true);
    });
    return column;
}
function _getZeroAxis(scale) {
    const [from, to] = scale;
    const yScale = scaleLinear()
        .domain([from, to])
        .range([0, 100]);
    return (100 - yScale(0));
}
function _addRectangleAndGetHeight(column, data, key, scale, colorMap, x, w, yOffset, positive) {
    const v = data.values[key];
    const h = _getRectSize(v, scale);
    const y = positive ? yOffset - h : yOffset;
    const c = colorMap[key];
    column.push({ c, h, v, w, x, y, });
    return h;
}
function _split(data) {
    const negatives = [];
    const positives = [];
    for (const key of Object.keys(data.values)) {
        const value = data.values[key];
        if (value < 0) {
            negatives.push(key);
        }
        if (value >= 0) {
            positives.push(key);
        }
    }
    return [positives.sort(), negatives.sort()];
}
function _getRectSize(data, scale) {
    const [from, to] = scale;
    data = Math.abs(data);
    return (100 / ((to - from) / data));
}
export default { getDomain, rawDataToStackBarData, getKeys, createLegendData };
