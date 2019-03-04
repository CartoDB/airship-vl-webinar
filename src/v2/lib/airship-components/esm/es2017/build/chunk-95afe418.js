import { h } from '../airship.core.js';

import { a as readableNumber } from './chunk-6e6f6eb8.js';
import { v as axisLeft, t as linear, n as select } from './chunk-2f8d3de5.js';

function renderYAxis(svgElement, scale) {
    const VERTICAL_SPACING = 36;
    const TICK_RIGHT_MARGIN = 18;
    const LABEL_WIDTH = 25;
    const ELEMENT = select(svgElement);
    const HEIGHT = ELEMENT.node().getBoundingClientRect().height - VERTICAL_SPACING;
    const WIDTH = ELEMENT.node().getBoundingClientRect().width;
    const TICK_SIZE = -WIDTH + LABEL_WIDTH;
    const RANGE = [HEIGHT, 0];
    const yScale = linear()
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
var yAxisService = { renderYAxis };

export { yAxisService as a };
