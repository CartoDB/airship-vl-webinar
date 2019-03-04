import { axisBottom } from 'd3-axis';
import { axisLeft } from 'd3-axis';
import { format } from 'd3-format';
import { scaleLinear } from 'd3-scale';
const BAR_WIDTH_THRESHOLD = 3;
const formatter = format('.2~s');
const decimalFormatter = format('.2');
export function cleanAxes(yAxisSelection) {
    yAxisSelection.select('.domain').remove();
}
export function updateAxes(container, xScale, yScale, xAxis, yAxis, xDomain, yDomain) {
    const xAxisSelection = container.select('.xAxis');
    const yAxisSelection = container.select('.yAxis');
    yScale
        .domain(yDomain)
        .nice();
    xScale
        .domain(xDomain);
    xAxisSelection
        .call(xAxis);
    yAxisSelection
        .call(yAxis);
}
export function renderPlot(container) {
    if (container.select('.plot').empty()) {
        const barsContainer = container
            .append('g');
        barsContainer
            .attr('class', 'plot');
        return barsContainer;
    }
    return container.select('.plot');
}
export function renderBars(data, yScale, container, barsContainer, color, X_PADDING, Y_PADDING, disableAnimation = false, className = '') {
    if (!container || !container.node()) {
        return;
    }
    let barsSeparation = 1;
    const HEIGHT = container.node().getBoundingClientRect().height - Y_PADDING;
    const WIDTH = container.node().getBoundingClientRect().width - X_PADDING;
    data = data === null ? [] : data;
    const barWidth = data.length === 0 ? WIDTH : WIDTH / data.length;
    if (barWidth - barsSeparation < BAR_WIDTH_THRESHOLD) {
        barsSeparation = 0;
    }
    this.bars = barsContainer
        .selectAll(`rect.${className}`)
        .data(data);
    this.bars.exit().remove()
        .transition()
        .duration(200);
    const mergeSelection = this.bars
        .enter()
        .append('rect')
        .attr('y', HEIGHT)
        .attr('height', 0)
        .merge(this.bars)
        .attr('class', `bar ${className}`)
        .attr('x', (_d, index) => index * barWidth)
        .attr('width', () => Math.max(0, barWidth - barsSeparation))
        .style('fill', (d) => d.color || color);
    const minDomain = yScale.domain()[0];
    const yZero = yScale(Math.max(0, minDomain));
    (disableAnimation ? mergeSelection : mergeSelection.transition().delay(_delayFn))
        .attr('height', (d) => {
        return Math.abs(yScale(d.value) - yZero);
    })
        .attr('y', (d) => d.value > 0 ? yScale(d.value) : yZero);
    (disableAnimation ? this.bars : this.bars.transition().delay(_delayFn))
        .attr('height', (d) => {
        return Math.abs(yScale(d.value) - yZero);
    })
        .attr('y', (d) => d.value > 0 ? yScale(d.value) : yZero);
}
export function renderXAxis(container, domain, bins, X_PADDING, Y_PADDING, customFormatter = conditionalFormatter, axisOptions) {
    if (!container || !container.node()) {
        return;
    }
    const HEIGHT = container.node().getBoundingClientRect().height - Y_PADDING;
    const WIDTH = container.node().getBoundingClientRect().width - X_PADDING;
    const tickValues = [0, bins / 2, bins];
    const tickPadding = axisOptions.padding !== undefined ? axisOptions.padding : 13;
    const ticks = axisOptions.ticks !== undefined ? axisOptions.ticks : tickValues.length;
    const xScale = scaleLinear()
        .domain([0, bins])
        .range([0, WIDTH]);
    const realScale = scaleLinear()
        .domain(domain)
        .range([0, bins]);
    let xAxis;
    if (axisOptions.values || axisOptions.format) {
        const altScale = scaleLinear()
            .domain(domain)
            .range([0, WIDTH]);
        xAxis = axisBottom(altScale)
            .tickValues(axisOptions.values || null)
            .tickFormat(axisOptions.format || customFormatter);
    }
    else {
        xAxis = axisBottom(xScale)
            .tickValues(ticks !== undefined ? null : tickValues)
            .tickFormat((value) => {
            const realValue = realScale.invert(value);
            return customFormatter(realValue);
        });
    }
    xAxis
        .tickSize(-HEIGHT)
        .tickPadding(tickPadding)
        .ticks(ticks);
    if (container.select('.x-axis').empty()) {
        container
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${HEIGHT})`)
            .call(xAxis);
    }
    else {
        container
            .select('.x-axis')
            .attr('transform', `translate(0, ${HEIGHT})`)
            .call(xAxis);
    }
    container.selectAll('.x-axis text')
        .attr('transform', (_d, i, collection) => {
        const node = collection[i];
        const { width } = node.getBoundingClientRect();
        let xOffset = 0;
        if (i === 0) {
            xOffset = width / 2;
        }
        else if (i === collection.length - 1) {
            xOffset = -width / 2;
        }
        return `translate(${xOffset})`;
    })
        .attr('opacity', (_d, i, collection) => {
        if (i === 0 || i === collection.length - 1) {
            return 1;
        }
        let textWidth = 0;
        const textElements = collection;
        for (const textEl of textElements) {
            textWidth += textEl.getBoundingClientRect().width;
        }
        if (WIDTH - textWidth < 0) {
            return 0;
        }
        return 1;
    });
    return xAxis;
}
export function renderYAxis(container, yAxis, X_PADDING) {
    if (!container || !container.node()) {
        return;
    }
    if (container.select('.y-axis').empty()) {
        container
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);
    }
    else {
        container.select('.y-axis')
            .call(yAxis);
    }
    container
        .select('.y-axis')
        .append('g')
        .attr('class', 'tick')
        .attr('opacity', '1')
        .attr('transform', `translate(0,${yAxis.scale()(0)})`)
        .append('line')
        .attr('shape-rendering', 'crisp')
        .attr('stroke', '#000')
        .attr('class', 'zero')
        .attr('x2', container.node().getBoundingClientRect().width - X_PADDING);
}
export function generateYScale(container, domain, X_PADDING, Y_PADDING, axisOptions) {
    if (!container || !container.node()) {
        return;
    }
    const HEIGHT = container.node().getBoundingClientRect().height - Y_PADDING;
    const WIDTH = container.node().getBoundingClientRect().width - X_PADDING;
    const ticks = axisOptions.ticks !== undefined ? axisOptions.ticks : 5;
    const tickPadding = axisOptions.padding !== undefined ? axisOptions.padding : 10;
    const yScale = scaleLinear()
        .domain(domain)
        .range([HEIGHT, 0]);
    const yAxis = axisLeft(yScale)
        .tickSize(-WIDTH)
        .ticks(ticks)
        .tickPadding(tickPadding)
        .tickFormat(axisOptions.format || conditionalFormatter)
        .tickValues(axisOptions.values || null);
    return yAxis;
}
function _delayFn(_d, i) {
    return i;
}
export function conditionalFormatter(value) {
    if (value > 0 && value < 1) {
        return decimalFormatter(value);
    }
    return formatter(value);
}
export default {
    cleanAxes,
    conditionalFormatter,
    generateYScale,
    renderBars,
    renderPlot,
    renderXAxis,
    renderYAxis,
    updateAxes
};
