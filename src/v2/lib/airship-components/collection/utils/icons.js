import paths from '../resources/icon-paths.json';
export function icon(name, color = '#000', props) {
    const path = paths[name];
    return (h("svg", Object.assign({ width: '16px', height: '16px', viewBox: '0 0 16 16', xmlns: 'http://www.w3.org/2000/svg' }, props),
        h("path", { fill: color, d: path })));
}
export default { icon };
