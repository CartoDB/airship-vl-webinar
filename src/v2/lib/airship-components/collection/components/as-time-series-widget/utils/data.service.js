export function sameData(first, second) {
    if (first.length !== second.length) {
        return false;
    }
    for (let i = 0; i < first.length; i++) {
        if (first[i].start !== second[i].start ||
            first[i].end !== second[i].end ||
            first[i].value !== second[i].value ||
            first[i].color !== second[i].color) {
            return false;
        }
    }
    return true;
}
export function prepareData(data) {
    const isDate = data.every((d) => _isDate(d.start) && _isDate(d.end));
    if (isDate) {
        return data.map((d) => ({
            color: d.color,
            end: d.end.getTime(),
            start: d.start.getTime(),
            value: d.value
        }));
    }
    return data.map((d) => ({
        color: d.color,
        end: d.end,
        start: d.start,
        value: d.value
    }));
}
function _isDate(obj) {
    return Object.prototype.toString.call(obj) === '[object Date]';
}
export default { prepareData, sameData };
