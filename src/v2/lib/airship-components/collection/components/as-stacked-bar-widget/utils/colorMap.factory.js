import { scaleLinear } from 'd3-scale';
import { interpolateSpectral } from 'd3-scale-chromatic';
export function create(keys, metadata) {
    const map = {};
    const scale = scaleLinear()
        .domain([0, keys.length])
        .range([0, 1]);
    keys.forEach((key) => map[key] = _getColor(key, keys, metadata, scale));
    return map;
}
function _getColor(key, keys, metadata, scale) {
    if (metadata && metadata[key] && metadata[key].color) {
        return metadata[key].color;
    }
    return interpolateSpectral(scale(keys.indexOf(key)));
}
export default { create };
