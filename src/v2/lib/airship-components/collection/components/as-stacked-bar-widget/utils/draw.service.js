import { select } from 'd3-selection';
import 'd3-transition';
import yAxisService from '../../common/y-axis/y-axis.service';
const DURATION = 500;
export function drawColumns(svgElement, data, mousemove, mouseleave) {
    const plot = _createPlot(svgElement);
    const columns = plot.selectAll('.column');
    columns
        .data(data)
        .exit()
        .remove()
        .transition()
        .duration(DURATION);
    _drawRectangles(columns
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'column')
        .selectAll('rect')
        .data((d) => d)
        .enter()
        .append('rect'), mousemove, mouseleave);
    _drawRectangles(columns
        .data(data)
        .selectAll('rect')
        .data((d) => d), mousemove, mouseleave);
}
export function drawYAxis(container, scale) {
    return yAxisService.renderYAxis(container, scale);
}
function _createPlot(svgElement) {
    const container = select(svgElement);
    if (container.select('.plot').empty()) {
        container
            .append('g')
            .attr('class', 'plot');
    }
    return container.select('.plot');
}
function _drawRectangles(selection, mousemove, mouseleave) {
    selection
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)
        .transition()
        .duration(DURATION)
        .attr('fill-opacity', '.5')
        .attr('x', (d) => d.x)
        .attr('y', (d) => `${d.y}%`)
        .attr('width', (d) => d.w)
        .attr('height', (d) => `${d.h}%`)
        .attr('fill', (d) => d.c);
}
export default { drawColumns, drawYAxis };
