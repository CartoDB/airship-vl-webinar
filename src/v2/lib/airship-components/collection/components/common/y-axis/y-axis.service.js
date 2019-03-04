import { axisLeft } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import readableNumber from '../../../utils/readable-number';
export function renderYAxis(svgElement, scale) {
    const VERTICAL_SPACING = 36;
    const TICK_RIGHT_MARGIN = 18;
    const LABEL_WIDTH = 25;
    const ELEMENT = select(svgElement);
    const HEIGHT = ELEMENT.node().getBoundingClientRect().height - VERTICAL_SPACING;
    const WIDTH = ELEMENT.node().getBoundingClientRect().width;
    const TICK_SIZE = -WIDTH + LABEL_WIDTH;
    const RANGE = [HEIGHT, 0];
    const yScale = scaleLinear()
        .domain(scale)
        .range(RANGE);
    const yAxis = axisLeft(yScale)
        .tickSizeInner(TICK_SIZE + TICK_RIGHT_MARGIN)
        .ticks(6)
        .tickFormat((d) => `${readableNumber(d)}`);
    if (ELEMENT.select('.y-axis').empty()) {
        _createYAxisElement(ELEMENT).call(yAxis);
    }
    else {
        ELEMENT.select('.y-axis').call(yAxis);
    }
    ELEMENT.selectAll('.tick text')
        .attr('textLength', LABEL_WIDTH)
        .attr('lengthAdjust', 'spacing');
    return svgElement.querySelector('g.y-axis');
}
function _createYAxisElement(element) {
    return element.append('g').attr('class', 'y-axis');
}
export default { renderYAxis };
