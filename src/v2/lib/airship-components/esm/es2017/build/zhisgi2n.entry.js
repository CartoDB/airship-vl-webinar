import { h } from '../airship.core.js';

import { a as readableNumber } from './chunk-6e6f6eb8.js';
import { a as shadeOrBlend } from './chunk-b62f03fa.js';
import { a as contentFragment } from './chunk-d27dd9c0.js';
import { m as event, n as select, o as customEvent, p as mouse, q as value, r as max, s as min, t as linear, u as axisBottom, v as axisLeft, w as format, x as timeFormat, y as defaultLocale } from './chunk-2f8d3de5.js';
import { a as dispatch, b as interrupt } from './chunk-5ffbf53e.js';

const DEFAULT_BAR_COLOR_HEX = '#47DB99';
const DEFAULT_BACKGROUND_BAR_COLOR_HEX = '#E2E6E3';
const DEFAULT_BAR_COLOR = `var(--as--color--complementary, ${DEFAULT_BAR_COLOR_HEX})`;
const DEFAULT_BACKGROUND_BAR_COLOR = `var(--as-color--type-03, ${DEFAULT_BACKGROUND_BAR_COLOR_HEX})`;

function noevent() {
  event.preventDefault();
  event.stopImmediatePropagation();
}

function nodrag(view) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", noevent, true);
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent, true);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", null);
  if (noclick) {
    selection.on("click.drag", noevent, true);
    setTimeout(function() { selection.on("click.drag", null); }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}

function constant$1(x) {
  return function() {
    return x;
  };
}

function BrushEvent(target, type, selection) {
  this.target = target;
  this.type = type;
  this.selection = selection;
}

function nopropagation$1() {
  event.stopImmediatePropagation();
}

function noevent$1() {
  event.preventDefault();
  event.stopImmediatePropagation();
}

var MODE_DRAG = {name: "drag"},
    MODE_SPACE = {name: "space"},
    MODE_HANDLE = {name: "handle"},
    MODE_CENTER = {name: "center"};

var X = {
  name: "x",
  handles: ["e", "w"].map(type),
  input: function(x, e) { return x && [[x[0], e[0][1]], [x[1], e[1][1]]]; },
  output: function(xy) { return xy && [xy[0][0], xy[1][0]]; }
};

var Y = {
  name: "y",
  handles: ["n", "s"].map(type),
  input: function(y, e) { return y && [[e[0][0], y[0]], [e[1][0], y[1]]]; },
  output: function(xy) { return xy && [xy[0][1], xy[1][1]]; }
};

var cursors = {
  overlay: "crosshair",
  selection: "move",
  n: "ns-resize",
  e: "ew-resize",
  s: "ns-resize",
  w: "ew-resize",
  nw: "nwse-resize",
  ne: "nesw-resize",
  se: "nwse-resize",
  sw: "nesw-resize"
};

var flipX = {
  e: "w",
  w: "e",
  nw: "ne",
  ne: "nw",
  se: "sw",
  sw: "se"
};

var flipY = {
  n: "s",
  s: "n",
  nw: "sw",
  ne: "se",
  se: "ne",
  sw: "nw"
};

var signsX = {
  overlay: +1,
  selection: +1,
  n: null,
  e: +1,
  s: null,
  w: -1,
  nw: -1,
  ne: +1,
  se: +1,
  sw: -1
};

var signsY = {
  overlay: +1,
  selection: +1,
  n: -1,
  e: null,
  s: +1,
  w: null,
  nw: -1,
  ne: -1,
  se: +1,
  sw: +1
};

function type(t) {
  return {type: t};
}

// Ignore right-click, since that should open the context menu.
function defaultFilter$1() {
  return !event.button;
}

function defaultExtent() {
  var svg = this.ownerSVGElement || this;
  return [[0, 0], [svg.width.baseVal.value, svg.height.baseVal.value]];
}

// Like d3.local, but with the name “__brush” rather than auto-generated.
function local(node) {
  while (!node.__brush) if (!(node = node.parentNode)) return;
  return node.__brush;
}

function empty(extent) {
  return extent[0][0] === extent[1][0]
      || extent[0][1] === extent[1][1];
}

function brushX() {
  return brush$1(X);
}

function brush$1(dim) {
  var extent = defaultExtent,
      filter = defaultFilter$1,
      listeners = dispatch(brush, "start", "brush", "end"),
      handleSize = 6,
      touchending;

  function brush(group) {
    var overlay = group
        .property("__brush", initialize)
      .selectAll(".overlay")
      .data([type("overlay")]);

    overlay.enter().append("rect")
        .attr("class", "overlay")
        .attr("pointer-events", "all")
        .attr("cursor", cursors.overlay)
      .merge(overlay)
        .each(function() {
          var extent = local(this).extent;
          select(this)
              .attr("x", extent[0][0])
              .attr("y", extent[0][1])
              .attr("width", extent[1][0] - extent[0][0])
              .attr("height", extent[1][1] - extent[0][1]);
        });

    group.selectAll(".selection")
      .data([type("selection")])
      .enter().append("rect")
        .attr("class", "selection")
        .attr("cursor", cursors.selection)
        .attr("fill", "#777")
        .attr("fill-opacity", 0.3)
        .attr("stroke", "#fff")
        .attr("shape-rendering", "crispEdges");

    var handle = group.selectAll(".handle")
      .data(dim.handles, function(d) { return d.type; });

    handle.exit().remove();

    handle.enter().append("rect")
        .attr("class", function(d) { return "handle handle--" + d.type; })
        .attr("cursor", function(d) { return cursors[d.type]; });

    group
        .each(redraw)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)")
        .on("mousedown.brush touchstart.brush", started);
  }

  brush.move = function(group, selection) {
    if (group.selection) {
      group
          .on("start.brush", function() { emitter(this, arguments).beforestart().start(); })
          .on("interrupt.brush end.brush", function() { emitter(this, arguments).end(); })
          .tween("brush", function() {
            var that = this,
                state = that.__brush,
                emit = emitter(that, arguments),
                selection0 = state.selection,
                selection1 = dim.input(typeof selection === "function" ? selection.apply(this, arguments) : selection, state.extent),
                i = value(selection0, selection1);

            function tween(t) {
              state.selection = t === 1 && empty(selection1) ? null : i(t);
              redraw.call(that);
              emit.brush();
            }

            return selection0 && selection1 ? tween : tween(1);
          });
    } else {
      group
          .each(function() {
            var that = this,
                args = arguments,
                state = that.__brush,
                selection1 = dim.input(typeof selection === "function" ? selection.apply(that, args) : selection, state.extent),
                emit = emitter(that, args).beforestart();

            interrupt(that);
            state.selection = selection1 == null || empty(selection1) ? null : selection1;
            redraw.call(that);
            emit.start().brush().end();
          });
    }
  };

  function redraw() {
    var group = select(this),
        selection = local(this).selection;

    if (selection) {
      group.selectAll(".selection")
          .style("display", null)
          .attr("x", selection[0][0])
          .attr("y", selection[0][1])
          .attr("width", selection[1][0] - selection[0][0])
          .attr("height", selection[1][1] - selection[0][1]);

      group.selectAll(".handle")
          .style("display", null)
          .attr("x", function(d) { return d.type[d.type.length - 1] === "e" ? selection[1][0] - handleSize / 2 : selection[0][0] - handleSize / 2; })
          .attr("y", function(d) { return d.type[0] === "s" ? selection[1][1] - handleSize / 2 : selection[0][1] - handleSize / 2; })
          .attr("width", function(d) { return d.type === "n" || d.type === "s" ? selection[1][0] - selection[0][0] + handleSize : handleSize; })
          .attr("height", function(d) { return d.type === "e" || d.type === "w" ? selection[1][1] - selection[0][1] + handleSize : handleSize; });
    }

    else {
      group.selectAll(".selection,.handle")
          .style("display", "none")
          .attr("x", null)
          .attr("y", null)
          .attr("width", null)
          .attr("height", null);
    }
  }

  function emitter(that, args) {
    return that.__brush.emitter || new Emitter(that, args);
  }

  function Emitter(that, args) {
    this.that = that;
    this.args = args;
    this.state = that.__brush;
    this.active = 0;
  }

  Emitter.prototype = {
    beforestart: function() {
      if (++this.active === 1) this.state.emitter = this, this.starting = true;
      return this;
    },
    start: function() {
      if (this.starting) this.starting = false, this.emit("start");
      return this;
    },
    brush: function() {
      this.emit("brush");
      return this;
    },
    end: function() {
      if (--this.active === 0) delete this.state.emitter, this.emit("end");
      return this;
    },
    emit: function(type) {
      customEvent(new BrushEvent(brush, type, dim.output(this.state.selection)), listeners.apply, listeners, [type, this.that, this.args]);
    }
  };

  function started() {
    if (event.touches) { if (event.changedTouches.length < event.touches.length) return noevent$1(); }
    else if (touchending) return;
    if (!filter.apply(this, arguments)) return;

    var that = this,
        type = event.target.__data__.type,
        mode = (event.metaKey ? type = "overlay" : type) === "selection" ? MODE_DRAG : (event.altKey ? MODE_CENTER : MODE_HANDLE),
        signX = dim === Y ? null : signsX[type],
        signY = dim === X ? null : signsY[type],
        state = local(that),
        extent = state.extent,
        selection = state.selection,
        W = extent[0][0], w0, w1,
        N = extent[0][1], n0, n1,
        E = extent[1][0], e0, e1,
        S = extent[1][1], s0, s1,
        dx,
        dy,
        moving,
        shifting = signX && signY && event.shiftKey,
        lockX,
        lockY,
        point0 = mouse(that),
        point = point0,
        emit = emitter(that, arguments).beforestart();

    if (type === "overlay") {
      state.selection = selection = [
        [w0 = dim === Y ? W : point0[0], n0 = dim === X ? N : point0[1]],
        [e0 = dim === Y ? E : w0, s0 = dim === X ? S : n0]
      ];
    } else {
      w0 = selection[0][0];
      n0 = selection[0][1];
      e0 = selection[1][0];
      s0 = selection[1][1];
    }

    w1 = w0;
    n1 = n0;
    e1 = e0;
    s1 = s0;

    var group = select(that)
        .attr("pointer-events", "none");

    var overlay = group.selectAll(".overlay")
        .attr("cursor", cursors[type]);

    if (event.touches) {
      group
          .on("touchmove.brush", moved, true)
          .on("touchend.brush touchcancel.brush", ended, true);
    } else {
      var view = select(event.view)
          .on("keydown.brush", keydowned, true)
          .on("keyup.brush", keyupped, true)
          .on("mousemove.brush", moved, true)
          .on("mouseup.brush", ended, true);

      nodrag(event.view);
    }

    nopropagation$1();
    interrupt(that);
    redraw.call(that);
    emit.start();

    function moved() {
      var point1 = mouse(that);
      if (shifting && !lockX && !lockY) {
        if (Math.abs(point1[0] - point[0]) > Math.abs(point1[1] - point[1])) lockY = true;
        else lockX = true;
      }
      point = point1;
      moving = true;
      noevent$1();
      move();
    }

    function move() {
      var t;

      dx = point[0] - point0[0];
      dy = point[1] - point0[1];

      switch (mode) {
        case MODE_SPACE:
        case MODE_DRAG: {
          if (signX) dx = Math.max(W - w0, Math.min(E - e0, dx)), w1 = w0 + dx, e1 = e0 + dx;
          if (signY) dy = Math.max(N - n0, Math.min(S - s0, dy)), n1 = n0 + dy, s1 = s0 + dy;
          break;
        }
        case MODE_HANDLE: {
          if (signX < 0) dx = Math.max(W - w0, Math.min(E - w0, dx)), w1 = w0 + dx, e1 = e0;
          else if (signX > 0) dx = Math.max(W - e0, Math.min(E - e0, dx)), w1 = w0, e1 = e0 + dx;
          if (signY < 0) dy = Math.max(N - n0, Math.min(S - n0, dy)), n1 = n0 + dy, s1 = s0;
          else if (signY > 0) dy = Math.max(N - s0, Math.min(S - s0, dy)), n1 = n0, s1 = s0 + dy;
          break;
        }
        case MODE_CENTER: {
          if (signX) w1 = Math.max(W, Math.min(E, w0 - dx * signX)), e1 = Math.max(W, Math.min(E, e0 + dx * signX));
          if (signY) n1 = Math.max(N, Math.min(S, n0 - dy * signY)), s1 = Math.max(N, Math.min(S, s0 + dy * signY));
          break;
        }
      }

      if (e1 < w1) {
        signX *= -1;
        t = w0, w0 = e0, e0 = t;
        t = w1, w1 = e1, e1 = t;
        if (type in flipX) overlay.attr("cursor", cursors[type = flipX[type]]);
      }

      if (s1 < n1) {
        signY *= -1;
        t = n0, n0 = s0, s0 = t;
        t = n1, n1 = s1, s1 = t;
        if (type in flipY) overlay.attr("cursor", cursors[type = flipY[type]]);
      }

      if (state.selection) selection = state.selection; // May be set by brush.move!
      if (lockX) w1 = selection[0][0], e1 = selection[1][0];
      if (lockY) n1 = selection[0][1], s1 = selection[1][1];

      if (selection[0][0] !== w1
          || selection[0][1] !== n1
          || selection[1][0] !== e1
          || selection[1][1] !== s1) {
        state.selection = [[w1, n1], [e1, s1]];
        redraw.call(that);
        emit.brush();
      }
    }

    function ended() {
      nopropagation$1();
      if (event.touches) {
        if (event.touches.length) return;
        if (touchending) clearTimeout(touchending);
        touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
        group.on("touchmove.brush touchend.brush touchcancel.brush", null);
      } else {
        yesdrag(event.view, moving);
        view.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
      }
      group.attr("pointer-events", "all");
      overlay.attr("cursor", cursors.overlay);
      if (state.selection) selection = state.selection; // May be set by brush.move (on start)!
      if (empty(selection)) state.selection = null, redraw.call(that);
      emit.end();
    }

    function keydowned() {
      switch (event.keyCode) {
        case 16: { // SHIFT
          shifting = signX && signY;
          break;
        }
        case 18: { // ALT
          if (mode === MODE_HANDLE) {
            if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
            if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
            mode = MODE_CENTER;
            move();
          }
          break;
        }
        case 32: { // SPACE; takes priority over ALT
          if (mode === MODE_HANDLE || mode === MODE_CENTER) {
            if (signX < 0) e0 = e1 - dx; else if (signX > 0) w0 = w1 - dx;
            if (signY < 0) s0 = s1 - dy; else if (signY > 0) n0 = n1 - dy;
            mode = MODE_SPACE;
            overlay.attr("cursor", cursors.selection);
            move();
          }
          break;
        }
        default: return;
      }
      noevent$1();
    }

    function keyupped() {
      switch (event.keyCode) {
        case 16: { // SHIFT
          if (shifting) {
            lockX = lockY = shifting = false;
            move();
          }
          break;
        }
        case 18: { // ALT
          if (mode === MODE_CENTER) {
            if (signX < 0) e0 = e1; else if (signX > 0) w0 = w1;
            if (signY < 0) s0 = s1; else if (signY > 0) n0 = n1;
            mode = MODE_HANDLE;
            move();
          }
          break;
        }
        case 32: { // SPACE
          if (mode === MODE_SPACE) {
            if (event.altKey) {
              if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
              if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
              mode = MODE_CENTER;
            } else {
              if (signX < 0) e0 = e1; else if (signX > 0) w0 = w1;
              if (signY < 0) s0 = s1; else if (signY > 0) n0 = n1;
              mode = MODE_HANDLE;
            }
            overlay.attr("cursor", cursors[type]);
            move();
          }
          break;
        }
        default: return;
      }
      noevent$1();
    }
  }

  function initialize() {
    var state = this.__brush || {selection: null};
    state.extent = extent.apply(this, arguments);
    state.dim = dim;
    return state;
  }

  brush.extent = function(_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : constant$1([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), brush) : extent;
  };

  brush.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$1(!!_), brush) : filter;
  };

  brush.handleSize = function(_) {
    return arguments.length ? (handleSize = +_, brush) : handleSize;
  };

  brush.on = function() {
    var value$$1 = listeners.on.apply(listeners, arguments);
    return value$$1 === listeners ? brush : value$$1;
  };

  return brush;
}

function addBrush(width, height, onBrush, onBrushEnd, CUSTOM_HANDLE_WIDTH, CUSTOM_HANDLE_HEIGHT, X_PADDING, Y_PADDING) {
    return brushX()
        .handleSize(CUSTOM_HANDLE_WIDTH)
        .extent([[0, 0], [width - X_PADDING, height - Y_PADDING + (CUSTOM_HANDLE_HEIGHT / 2)]])
        .on('brush', onBrush)
        .on('end', onBrushEnd);
}
function addBrushArea(brush$$1, container) {
    let brushArea = container.select('g.brush');
    if (brushArea.empty()) {
        brushArea = container.append('g');
        brushArea.attr('class', 'brush');
    }
    brushArea.call(brush$$1);
    return brushArea;
}
function addCustomHandles(brushArea, CUSTOM_HANDLE_WIDTH, CUSTOM_HANDLE_HEIGHT, scale) {
    let bottomLine = brushArea.select('line.bottomline');
    if (bottomLine.empty()) {
        bottomLine = brushArea.append('line')
            .attr('class', 'bottomline')
            .attr('stroke-width', 4)
            .style('opacity', 0)
            .attr('pointer-events', 'none');
    }
    bottomLine
        .attr('y1', scale(0))
        .attr('y2', scale(0));
    let customHandles = brushArea.selectAll('.handle--wrapper');
    const linesMargin = Math.floor((CUSTOM_HANDLE_WIDTH - 2) / 2);
    if (customHandles.empty()) {
        customHandles = customHandles
            .data([{ type: 'w' }, { type: 'e' }])
            .enter()
            .append('g')
            .attr('class', 'handle--wrapper');
        customHandles
            .append('rect')
            .attr('class', 'handle--custom')
            .attr('width', CUSTOM_HANDLE_WIDTH)
            .attr('height', CUSTOM_HANDLE_HEIGHT)
            .attr('rx', 1)
            .attr('ry', 1);
        const handleGrab = customHandles
            .append('g')
            .attr('class', 'handle--grab');
        for (let i = 0; i < 3; i++) {
            handleGrab
                .append('line')
                .attr('transform', `translate(0 ${(CUSTOM_HANDLE_HEIGHT / 2) - 2})`)
                .attr('x1', linesMargin)
                .attr('y1', i * 2)
                .attr('x2', CUSTOM_HANDLE_WIDTH - linesMargin)
                .attr('y2', i * 2)
                .attr('class', 'grab-line');
        }
    }
    return customHandles;
}
var brushService = { addBrush, addBrushArea, addCustomHandles };

function binsScale(data) {
    return linear()
        .domain(getXDomain(data))
        .range([0, data.length]);
}
function getXDomain(data) {
    const { start } = data.length > 0 ? data[0] : { start: 0 };
    const { end } = data.length > 0 ? data[data.length - 1] : { end: 0 };
    return [start, end];
}
function getYDomain(data) {
    return [Math.min(0, getLowerBounds(data)), max(data, (d) => d.value)];
}
function getLowerBounds(data) {
    return min(data, (d) => d.value);
}
function getXScale(domain, width) {
    return linear()
        .domain(domain)
        .range([0, width]);
}
function isCategoricalData(data) {
    return data.every(_hasCategory);
}
function prepareData(data) {
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
function isBackgroundCompatible(data, backgroundData) {
    const isNull = [data, backgroundData].map((value$$1) => value$$1 === null);
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
var dataService = {
    getLowerBounds,
    getXDomain,
    getXScale,
    getYDomain,
    isBackgroundCompatible,
    isCategoricalData,
    prepareData,
};

const BAR_WIDTH_THRESHOLD = 3;
const formatter = format('.2~s');
const decimalFormatter = format('.2');
function cleanAxes(yAxisSelection) {
    yAxisSelection.select('.domain').remove();
}
function updateAxes(container, xScale, yScale, xAxis, yAxis, xDomain, yDomain) {
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
function renderPlot(container) {
    if (container.select('.plot').empty()) {
        const barsContainer = container
            .append('g');
        barsContainer
            .attr('class', 'plot');
        return barsContainer;
    }
    return container.select('.plot');
}
function renderBars(data, yScale, container, barsContainer, color, X_PADDING, Y_PADDING, disableAnimation = false, className = '') {
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
function renderXAxis(container, domain, bins, X_PADDING, Y_PADDING, customFormatter = conditionalFormatter, axisOptions) {
    if (!container || !container.node()) {
        return;
    }
    const HEIGHT = container.node().getBoundingClientRect().height - Y_PADDING;
    const WIDTH = container.node().getBoundingClientRect().width - X_PADDING;
    const tickValues = [0, bins / 2, bins];
    const tickPadding = axisOptions.padding !== undefined ? axisOptions.padding : 13;
    const ticks = axisOptions.ticks !== undefined ? axisOptions.ticks : tickValues.length;
    const xScale = linear()
        .domain([0, bins])
        .range([0, WIDTH]);
    const realScale = linear()
        .domain(domain)
        .range([0, bins]);
    let xAxis;
    if (axisOptions.values || axisOptions.format) {
        const altScale = linear()
            .domain(domain)
            .range([0, WIDTH]);
        xAxis = axisBottom(altScale)
            .tickValues(axisOptions.values || null)
            .tickFormat(axisOptions.format || customFormatter);
    }
    else {
        xAxis = axisBottom(xScale)
            .tickValues(ticks !== undefined ? null : tickValues)
            .tickFormat((value$$1) => {
            const realValue = realScale.invert(value$$1);
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
function renderYAxis(container, yAxis, X_PADDING) {
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
function generateYScale(container, domain, X_PADDING, Y_PADDING, axisOptions) {
    if (!container || !container.node()) {
        return;
    }
    const HEIGHT = container.node().getBoundingClientRect().height - Y_PADDING;
    const WIDTH = container.node().getBoundingClientRect().width - X_PADDING;
    const ticks = axisOptions.ticks !== undefined ? axisOptions.ticks : 5;
    const tickPadding = axisOptions.padding !== undefined ? axisOptions.padding : 10;
    const yScale = linear()
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
function conditionalFormatter(value$$1) {
    if (value$$1 > 0 && value$$1 < 1) {
        return decimalFormatter(value$$1);
    }
    return formatter(value$$1);
}
var drawService = {
    cleanAxes,
    conditionalFormatter,
    generateYScale,
    renderBars,
    renderPlot,
    renderXAxis,
    renderYAxis,
    updateAxes
};

function addTooltip(container, barsContainer, hasSelection, color, unselectedColor, formatter, setTooltip, className) {
    container.on('mousemove', () => {
        const evt = event;
        const { clientX, clientY } = evt;
        let anyHovered = false;
        _forEachRect(barsContainer, clientX, clientY, className, (data, node, bucketIndex) => {
            const selected = _isSelected(hasSelection.selection, bucketIndex);
            let _color = selected ? data.color || color : unselectedColor;
            _color = shadeOrBlend(-0.16, _color);
            node.style('fill', _color);
            setTooltip(formatter(data), evt);
            anyHovered = true;
        }, (data, node, bucketIndex) => {
            const selected = _isSelected(hasSelection.selection, bucketIndex);
            node.style('fill', selected ? data.color || color : unselectedColor);
        });
        if (!anyHovered) {
            setTooltip(null);
        }
    })
        .on('click', () => {
        const evt = event;
        const { clientX, clientY } = evt;
        _forEachRect(barsContainer, clientX, clientY, className, (data) => {
            hasSelection.setSelection([data.start, data.end]);
        });
    })
        .on('mouseleave', () => {
        setTooltip(null);
        barsContainer.selectAll(`rect.${className}`)
            .style('fill', (data, bucketIndex) => {
            if (_isSelected(hasSelection.selection, bucketIndex)) {
                return data.color || color;
            }
            return unselectedColor;
        });
    });
}
function _isSelected(range, bucketIndex) {
    if (range === null) {
        return true;
    }
    return bucketIndex >= range[0] && bucketIndex < range[1];
}
function _forEachRect(container, x, y, className, insideCallback, outsideCallback) {
    container.selectAll(`rect.${className}`)
        .each((data, i, nodes) => {
        const nodeSelection = select(nodes[i]);
        const node = nodes[i];
        const bb = node.getBoundingClientRect();
        const isInsideBB = bb.left <= x &&
            x <= bb.right &&
            bb.top <= y &&
            y <= bb.bottom;
        if (isInsideBB) {
            insideCallback(data, nodeSelection, i);
            return;
        }
        if (outsideCallback) {
            outsideCallback(data, nodeSelection, i);
        }
    });
}
var interactionService = { addTooltip };

const CUSTOM_HANDLE_WIDTH = 8;
const CUSTOM_HANDLE_HEIGHT = 20;
const X_PADDING = 38;
const Y_PADDING = 40;
const LABEL_PADDING = 25;
const FG_CLASSNAME = 'foreground-bar';
const BG_CLASSNAME = 'background-bar';
class HistogramWidget {
    constructor() {
        this.showHeader = true;
        this.disableInteractivity = false;
        this.data = [];
        this.backgroundData = null;
        this.color = DEFAULT_BAR_COLOR;
        this.unselectedColor = DEFAULT_BACKGROUND_BAR_COLOR;
        this.tooltipFormatter = this.defaultFormatter;
        this.isLoading = false;
        this.error = '';
        this.errorDescription = '';
        this.noDataHeaderMessage = 'NO DATA AVAILABLE';
        this.noDataBodyMessage = 'There is no data to display.';
        this.responsive = true;
        this.clearText = 'Clear selection';
        this.selectedFormatter = this._selectionFormatter;
        this.range = null;
        this.disableAnimation = false;
        this.xAxisOptions = {};
        this.yAxisOptions = {};
        this.selection = null;
        this.tooltip = null;
        this._mockBackground = false;
        this._muteSelectionChanged = false;
        this._lastEmittedSelection = null;
        this.selectionEmpty = true;
        this.selectionFooter = '';
        this._resizeRender = this._resizeRender.bind(this);
    }
    _onBackgroundDataChanged(newBackgroundData) {
        if (newBackgroundData === null || newBackgroundData.length === 0) {
            this._prepareData(this.data, null);
            return;
        }
        if (isBackgroundCompatible(this.data, newBackgroundData)) {
            this._prepareData(this.data, newBackgroundData);
        }
    }
    _onDataChanged(newData, oldData) {
        this._lastEmittedSelection = null;
        if (isBackgroundCompatible(newData, this.backgroundData)) {
            this._prepareData(this.data, this.backgroundData, oldData);
        }
        else {
            this._prepareData(this.data, null, oldData);
        }
    }
    _prepareData(data, backgroundData, oldData) {
        this._data = prepareData(data);
        this._backgroundData = backgroundData === null ? this._mockBackgroundData(data) : prepareData(backgroundData);
        this._mockBackground = backgroundData === null;
        const newScale = binsScale(this._data);
        const wasCategoricalData = !!this.isCategoricalData;
        this.isCategoricalData = isCategoricalData(this._data);
        if (wasCategoricalData !== this.isCategoricalData) {
            this.selection = null;
        }
        else {
            this.selection = this._preadjustSelection(oldData, newScale, data.length);
        }
        this.binsScale = newScale;
        this._muteSelectionChanged = true;
        this._dataJustChanged = true;
    }
    _onColorChanged(newColor) {
        const incomingColor = newColor || DEFAULT_BAR_COLOR;
        this._color = this._toColor(incomingColor, DEFAULT_BAR_COLOR_HEX);
    }
    _onSelectedColorChanged(newColor) {
        const incomingColor = newColor || DEFAULT_BACKGROUND_BAR_COLOR;
        this._barBackgroundColor = this._toColor(incomingColor, DEFAULT_BACKGROUND_BAR_COLOR_HEX);
    }
    defaultFormatter(data) {
        const tooltip = [];
        if (this.isCategoricalData) {
            tooltip.push(`${data.category}`);
        }
        tooltip.push(`${readableNumber(data.value).trim()}`);
        return tooltip;
    }
    async getSelection() {
        const data = this._dataForSelection(this.selection);
        return this._simplifySelection(data);
    }
    setSelection(values) {
        if (values === null) {
            this._setSelection(null);
            this.emitSelection(this.selectionChanged, this.selection);
            return;
        }
        if (values.some((value$$1) => typeof value$$1 === 'string')) {
            return;
        }
        const bins = values.map(this.binsScale);
        this._setSelection(bins);
        if (!this._muteSelectionChanged) {
            this.emitSelection(this.selectionChanged, this.selection);
        }
    }
    clearSelection() {
        this.setSelection(null);
    }
    xFormatter(value$$1) {
        if (this.axisFormatter) {
            return this.axisFormatter(value$$1);
        }
        return value$$1;
    }
    componentDidLoad() {
        this._color = this._toColor(this.color, DEFAULT_BAR_COLOR_HEX);
        this._barBackgroundColor = this._toColor(this.unselectedColor, DEFAULT_BACKGROUND_BAR_COLOR_HEX);
        if (!this._hasDataToDisplay()) {
            return;
        }
        this.binsScale = binsScale(this._data);
        this.isCategoricalData = isCategoricalData(this._data);
        requestAnimationFrame(() => {
            this._renderGraph();
        });
    }
    componentDidUpdate() {
        if (!this._skipRender || this._dataJustChanged) {
            this._renderGraph();
        }
        this._skipRender = false;
        this._dataJustChanged = false;
    }
    componentWillLoad() {
        addEventListener('resize', this._resizeRender);
        this.selectionFooter = this.selectedFormatter(this.selection);
        this._onBackgroundDataChanged(this.backgroundData);
        this._onDataChanged(this.data, null);
    }
    componentDidUnload() {
        removeEventListener('resize', this._resizeRender);
    }
    render() {
        return [
            this._renderHeader(),
            this._renderSelection(),
            this._renderContent(),
        ];
    }
    _resizeRender() {
        requestAnimationFrame(() => {
            this._renderGraph();
        });
    }
    _renderContent() {
        const histogramClasses = {
            'as-histogram-widget--categorical': this.isCategoricalData,
            'as-histogram-widget__wrapper': true,
            'as-histogram-widget__wrapper--disabled': this.disableInteractivity
        };
        const svgClasses = {
            'figure': true,
            'figure--has-x-label': this.xLabel,
            'figure--has-y-label': this.yLabel
        };
        return contentFragment(this.isLoading, this.error, this._isEmpty(), this.heading, this.errorDescription, this.noDataBodyMessage, h("div", { class: histogramClasses },
            h("svg", { class: svgClasses, ref: (ref) => this.container = select(ref) }),
            this._renderLabels(),
            this._renderTooltip()));
    }
    _mockBackgroundData(data) {
        const min$$1 = dataService.getLowerBounds(data);
        return data.map((value$$1) => (Object.assign({}, value$$1, { value: Math.max(0, min$$1) })));
    }
    _selectionFormatter(selection) {
        if (selection === null) {
            return 'All selected';
        }
        if (this.isCategoricalData) {
            return `${selection[1] - selection[0]} selected`;
        }
        let formattedSelection;
        const domainSelection = selection.map(this.binsScale.invert);
        if (this.axisFormatter) {
            formattedSelection = domainSelection.map(this.axisFormatter);
        }
        else {
            formattedSelection = domainSelection.map((e) => `${conditionalFormatter(e)}`);
        }
        return `Selected from ${formattedSelection[0]} to ${formattedSelection[1]}`;
    }
    _renderSelection() {
        if (this.isLoading || this._isEmpty() || this.error || !this.showClear) {
            return '';
        }
        return h("as-widget-selection", { selection: this.selectionFooter, clearText: this.clearText, showClear: !this.selectionEmpty, onClear: () => this.clearSelection() });
    }
    _renderGraph() {
        if (!this.container || !this.container.node()) {
            return;
        }
        const bbox = this.container.node().getBoundingClientRect();
        const firstRender = this.prevWidth === undefined || this.prevHeight === undefined;
        this.prevWidth = this.width;
        this.prevHeight = this.height;
        this.width = bbox.width;
        this.height = bbox.height;
        const resizing = !firstRender && (this.prevWidth !== this.width || this.height !== this.prevHeight);
        if (this.height === 0 || this.width === 0) {
            return;
        }
        this._generateYAxis();
        this._renderXAxis();
        this.barsContainer = drawService.renderPlot(this.container);
        interactionService.addTooltip(this.container, this.barsContainer, this, this._color, this._barBackgroundColor, (value$$1) => this.tooltipFormatter(value$$1), this._setTooltip.bind(this), FG_CLASSNAME);
        drawService.renderBars(this._backgroundData, this.yScale, this.container, this.barsContainer, this._barBackgroundColor, X_PADDING + (this.yLabel ? LABEL_PADDING : 0), Y_PADDING, this.disableAnimation || resizing, BG_CLASSNAME);
        drawService.renderBars(this._data, this.yScale, this.container, this.barsContainer, this._color, X_PADDING + (this.yLabel ? LABEL_PADDING : 0), Y_PADDING, this.disableAnimation || resizing, FG_CLASSNAME);
        drawService.renderYAxis(this.container, this.yAxis, X_PADDING);
        if (!this.disableInteractivity) {
            this.brush = brushService.addBrush(this.width, this.height, this._onBrush.bind(this), this._onBrushEnd.bind(this), CUSTOM_HANDLE_WIDTH, CUSTOM_HANDLE_HEIGHT, X_PADDING + (this.yLabel ? LABEL_PADDING : 0), Y_PADDING);
            this.brushArea = brushService.addBrushArea(this.brush, this.container);
            this.customHandles = brushService.addCustomHandles(this.brushArea, CUSTOM_HANDLE_WIDTH, CUSTOM_HANDLE_HEIGHT, this.yScale);
        }
        this._updateSelection();
        this.drawParametersChanged.emit({
            binsScale: this.binsScale,
            container: this.container,
            handleWidth: CUSTOM_HANDLE_WIDTH,
            height: this.height,
            padding: [X_PADDING + (this.yLabel ? LABEL_PADDING : 0), Y_PADDING],
            width: this.width,
            xScale: this.xScale
        });
        this._muteSelectionChanged = false;
    }
    _setTooltip(value$$1, evt) {
        this._muteSelectionChanged = true;
        if (value$$1 === null) {
            this._hideTooltip();
            return;
        }
        this._skipRender = true;
        this.tooltip = value$$1;
        this._showTooltip(evt);
    }
    _updateSelection() {
        if (this.selection === null || this.disableInteractivity) {
            return;
        }
        if (this._selectionInData(this.selection)) {
            this._setSelection(this.selection);
        }
        else {
            this.clearSelection();
        }
    }
    _adjustSelection(values) {
        if (values === null) {
            return null;
        }
        return values.map((value$$1) => this._adjustSelectionValue(value$$1));
    }
    _adjustSelectionValue(value$$1) {
        if (value$$1 < 0) {
            return 0;
        }
        if (value$$1 >= this._data.length) {
            return this._data.length;
        }
        return Math.round(value$$1);
    }
    _hideCustomHandles() {
        this.customHandles.style('opacity', 0);
        this.brushArea.selectAll('.bottomline').style('opacity', 0);
    }
    _onBrush() {
        if (this.disableInteractivity) {
            return;
        }
        const evt = event;
        if (evt.selection === null) {
            this._hideCustomHandles();
            return;
        }
        if (!evt.sourceEvent || evt.sourceEvent.type === 'brush') {
            return;
        }
        const d0 = evt.selection
            .map((selection) => this.xScale.invert(selection));
        this._setSelection(d0);
    }
    _onBrushEnd() {
        if (this.disableInteractivity) {
            return;
        }
        if (!this._muteSelectionChanged) {
            this.emitSelection(this.selectionChanged, this.selection);
        }
    }
    _setSelection(selection) {
        if (this.disableInteractivity) {
            return;
        }
        const adjustedSelection = this._adjustSelection(selection);
        if (adjustedSelection !== null && (adjustedSelection[0] === adjustedSelection[1])) {
            return;
        }
        const sameSelection = this.selection !== null &&
            adjustedSelection !== null &&
            this.selection.every((d, i) => adjustedSelection[i] === d);
        this.selection = adjustedSelection;
        this._updateHandles(adjustedSelection);
        if (!sameSelection) {
            this._hideTooltip();
            this.emitSelection(this.selectionInput, this.selection);
        }
        this.selectionEmpty = this.selection === null;
        this.selectionFooter = this.selectedFormatter(this.selection);
    }
    _preadjustSelection(oldData, newScale, nBuckets) {
        if (!(oldData && this.selection)) {
            return this.selection;
        }
        if (this.isCategoricalData) {
            const selectedCats = this._simplifySelection(this._dataForSelection(this.selection, oldData));
            const selection = selectedCats.map((value$$1) => {
                return this._data.findIndex((d) => d.category === value$$1);
            });
            if (selection.some((e) => e === -1)) {
                return null;
            }
            return [selection[0], selection[selection.length - 1] + 1];
        }
        const oldSelection = this._simplifySelection(this._dataForSelection(this.selection, oldData));
        const newSelection = oldSelection.map(newScale);
        return [Math.max(0, newSelection[0]), Math.min(nBuckets, newSelection[1])];
    }
    _dataForSelection(selection, from) {
        if (selection === null) {
            return null;
        }
        const data = from !== undefined ? from : this.data;
        if (this.isCategoricalData) {
            return data
                .slice(selection[0], selection[1])
                .map((d) => d);
        }
        return [data[selection[0]], data[selection[1] - 1]];
    }
    _simplifySelection(selection) {
        if (selection === null) {
            return null;
        }
        if (this.isCategoricalData) {
            return selection.map((value$$1) => value$$1.category);
        }
        return [selection[0].start, selection[selection.length - 1].end];
    }
    _sameSelection(first, second) {
        if (first === null || second === null) {
            return false;
        }
        return (first[0] === second[0] && first[1] === second[1]);
    }
    emitSelection(emitter, selection) {
        if (this._sameSelection(selection, this._lastEmittedSelection)) {
            return;
        }
        if (selection === null) {
            emitter.emit(null);
            return;
        }
        const payload = this._dataForSelection(selection);
        const evt = {
            payload,
            selection: this._simplifySelection(payload),
            type: this._eventType()
        };
        emitter.emit(evt);
        if (emitter === this.selectionChanged) {
            this._lastEmittedSelection = [selection[0], selection[1]];
        }
    }
    _eventType() {
        return this.isCategoricalData ? 'categorical' : 'continuous';
    }
    _selectionInData(selection) {
        const domainSelection = selection.map(this.binsScale.invert);
        const inData = domainSelection.map((selectionValue) => {
            return this._data.some((value$$1) => selectionValue >= value$$1.start && selectionValue <= value$$1.end);
        });
        return inData.some((e) => e);
    }
    _updateHandles(values) {
        if (!this.xScale) {
            return;
        }
        if (values === null) {
            this.barsContainer.selectAll(`rect.${FG_CLASSNAME}`)
                .style('fill', (_d, i) => {
                const d = this._data[i];
                return d.color || this._color;
            });
            this.brushArea.call(this.brush.move, null);
            return;
        }
        const yCoord = this.yScale(this.yScale.domain()[0]);
        const spaceValues = values
            .map(this.xScale);
        const domainValues = values.map(this.binsScale.invert);
        this.brushArea.call(this.brush.move, spaceValues);
        this.customHandles
            .style('opacity', 1)
            .attr('transform', (_d, i) => {
            return `translate(${(spaceValues[i] - (CUSTOM_HANDLE_WIDTH / 2) - 1)},${yCoord - CUSTOM_HANDLE_HEIGHT / 2})`;
        });
        this.brushArea.selectAll('.bottomline')
            .style('opacity', 1)
            .attr('stroke-width', 2)
            .attr('x1', spaceValues[0])
            .attr('x2', spaceValues[1]);
        this.barsContainer.selectAll(`rect.${FG_CLASSNAME}`)
            .style('fill', (_d, i) => {
            const d = this._data[i];
            if (!d) {
                return;
            }
            if (!(domainValues[0] <= d.start && d.end <= domainValues[1])) {
                return this._barBackgroundColor;
            }
            return d.color || this._color;
        });
    }
    _dataForDomain() {
        if (this._backgroundData === null || this._backgroundData.length === 0 || this._mockBackground) {
            return this._data;
        }
        return this._backgroundData;
    }
    _generateYAxis() {
        const yDomain = this.range !== null ? this.range : dataService.getYDomain(this._dataForDomain());
        this.yAxis = drawService.generateYScale(this.container, yDomain, X_PADDING + (this.yLabel ? LABEL_PADDING : 0), Y_PADDING, this.yAxisOptions);
        this.yScale = this.yAxis.scale();
    }
    _renderXAxis() {
        const xDomain = dataService.getXDomain(this._data);
        const xAxis = drawService.renderXAxis(this.container, xDomain, this._data.length, X_PADDING + (this.yLabel ? LABEL_PADDING : 0), Y_PADDING, this.axisFormatter, this.xAxisOptions);
        this.xScale = xAxis.scale();
    }
    _getTooltipPosition(mouseX, mouseY) {
        const OFFSET = 25;
        let x = mouseX;
        let y = mouseY;
        const viewportBoundaries = {
            bottom: window.innerHeight + window.pageYOffset,
            right: window.innerWidth + window.pageXOffset,
        };
        const tooltipContainerBoundingRect = this.tooltipElement.getBoundingClientRect();
        const tooltipBoundaries = {
            bottom: mouseY + tooltipContainerBoundingRect.height,
            right: mouseX + tooltipContainerBoundingRect.width,
        };
        if (viewportBoundaries.right < tooltipBoundaries.right) {
            x = mouseX - tooltipContainerBoundingRect.width;
        }
        if (viewportBoundaries.bottom < tooltipBoundaries.bottom) {
            y = mouseY - tooltipContainerBoundingRect.height - OFFSET;
        }
        return [x, y];
    }
    _showTooltip(event$$1) {
        if (!this.tooltipElement) {
            return;
        }
        const [x, y] = this._getTooltipPosition(event$$1.clientX, event$$1.clientY);
        select(this.tooltipElement)
            .style('display', 'inline')
            .style('left', `${x}px`)
            .style('top', `${y}px`);
    }
    _hideTooltip() {
        select(this.tooltipElement)
            .style('display', 'none');
    }
    _renderHeader() {
        if (!this.showHeader) {
            return;
        }
        return h("as-widget-header", { header: this.heading, subheader: this.description, "is-loading": this.isLoading, "is-empty": this._isEmpty(), error: this.error, "no-data-message": this.noDataHeaderMessage });
    }
    _renderTooltip() {
        return (h("span", { ref: (ref) => this.tooltipElement = ref, role: 'tooltip', class: 'as-tooltip as-tooltip--top' }, this._parseTooltip(this.tooltip)));
    }
    _parseTooltip(tooltip) {
        if (tooltip === null) {
            return null;
        }
        if (Array.isArray(tooltip)) {
            return tooltip.map((text) => this._renderTooltipLine(text));
        }
        return this._renderTooltipLine(tooltip);
    }
    _renderTooltipLine(value$$1) {
        return h("div", null, value$$1);
    }
    _renderLabels() {
        return [
            this.yLabel ? h("div", { class: 'y-label' }, this.yLabel) : '',
            this.xLabel ? h("div", { class: 'x-label' }, this.xLabel) : '',
        ];
    }
    _toColor(color, fallbackColor) {
        if (color.startsWith('var(')) {
            const match = color.match(/var\(([^,\)]+)(,.+)?\)/);
            if (match === null) {
                return fallbackColor;
            }
            const variable = match[1];
            const fallback = (match[2] || '').replace(',', '').trim();
            const computed = getComputedStyle(this.el).getPropertyValue(variable).toLowerCase().trim();
            if (computed.length === 0) {
                return fallback.length === 0 ? fallbackColor : fallback;
            }
            return computed;
        }
        return color;
    }
    _isEmpty() {
        return !this._data || !this._data.length;
    }
    _hasDataToDisplay() {
        return !(this.isLoading || this._isEmpty() || this.error);
    }
    static get is() { return "as-histogram-widget"; }
    static get properties() { return {
        "axisFormatter": {
            "type": "Any",
            "attr": "axis-formatter"
        },
        "backgroundData": {
            "type": "Any",
            "attr": "background-data",
            "watchCallbacks": ["_onBackgroundDataChanged"]
        },
        "clearSelection": {
            "method": true
        },
        "clearText": {
            "type": String,
            "attr": "clear-text"
        },
        "color": {
            "type": String,
            "attr": "color",
            "watchCallbacks": ["_onColorChanged"]
        },
        "colorRange": {
            "type": "Any",
            "attr": "color-range"
        },
        "data": {
            "type": "Any",
            "attr": "data",
            "watchCallbacks": ["_onDataChanged"]
        },
        "defaultFormatter": {
            "method": true
        },
        "description": {
            "type": String,
            "attr": "description"
        },
        "disableAnimation": {
            "type": Boolean,
            "attr": "disable-animation"
        },
        "disableInteractivity": {
            "type": Boolean,
            "attr": "disable-interactivity"
        },
        "el": {
            "elementRef": true
        },
        "error": {
            "type": String,
            "attr": "error"
        },
        "errorDescription": {
            "type": String,
            "attr": "error-description"
        },
        "getSelection": {
            "method": true
        },
        "heading": {
            "type": String,
            "attr": "heading"
        },
        "isCategoricalData": {
            "state": true
        },
        "isLoading": {
            "type": Boolean,
            "attr": "is-loading"
        },
        "noDataBodyMessage": {
            "type": String,
            "attr": "no-data-body-message"
        },
        "noDataHeaderMessage": {
            "type": String,
            "attr": "no-data-header-message"
        },
        "range": {
            "type": "Any",
            "attr": "range"
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "selectedFormatter": {
            "type": "Any",
            "attr": "selected-formatter"
        },
        "selectionEmpty": {
            "state": true
        },
        "selectionFooter": {
            "state": true
        },
        "setSelection": {
            "method": true
        },
        "showClear": {
            "type": Boolean,
            "attr": "show-clear"
        },
        "showHeader": {
            "type": Boolean,
            "attr": "show-header"
        },
        "tooltip": {
            "state": true
        },
        "tooltipFormatter": {
            "type": "Any",
            "attr": "tooltip-formatter"
        },
        "unselectedColor": {
            "type": String,
            "attr": "unselected-color",
            "watchCallbacks": ["_onSelectedColorChanged"]
        },
        "xAxisOptions": {
            "type": "Any",
            "attr": "x-axis-options"
        },
        "xFormatter": {
            "method": true
        },
        "xLabel": {
            "type": String,
            "attr": "x-label"
        },
        "yAxisOptions": {
            "type": "Any",
            "attr": "y-axis-options"
        },
        "yLabel": {
            "type": String,
            "attr": "y-label"
        }
    }; }
    static get events() { return [{
            "name": "selectionChanged",
            "method": "selectionChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "selectionInput",
            "method": "selectionInput",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "drawParametersChanged",
            "method": "drawParametersChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ".as-tooltip{--as--tooltip--background-color:var(--as--color--type-01,#2c2c2c);--as--tooltip--color:var(--as--color--text-contrast,#fff);--as--tooltip--support-color:var(--as--color--white,#fff);--as--tooltip--primary--background-color:var(--as--primary--success,#1785fb);--as--tooltip--primary--color:var(--as--tooltip--support-color);--as--tooltip--secondary--background-color:var(--as--secondary--success,#0f2d53);--as--tooltip--secondary--color:var(--as--tooltip--support-color);--as--tooltip--complementary--background-color:var(--as--complementary--success,#47db99);--as--tooltip--complementary--color:var(--as--tooltip--support-color);--as--tooltip--error--background-color:var(--as--color--error,#f3522b);--as--tooltip--error-color:var(--as--tooltip--support-color);--as--tooltip--warning--background-color:var(--as--color--warning,#fdb32b);--as--tooltip--warning--color:var(--as--tooltip--support-color);--as--tooltip--success--background-color:var(--as--color--success,#80b622);--as--tooltip--success--color:var(--as--tooltip--support-color);display:-ms-inline-flexbox;display:inline-flex;position:relative;padding:4px 8px;border-width:0;border-radius:4px;border-color:var(--as--tooltip--background-color);background:var(--as--tooltip--background-color);color:var(--as--tooltip--color);font:var(--as--font--body)}.as-tooltip:after{content:\"\";position:absolute;border-width:5px;border-style:solid;border-radius:2px;border-color:inherit}.as-tooltip--top:after{top:100%;left:50%;-webkit-transform:translateY(-6px) translateX(-5px) rotate(45deg);transform:translateY(-6px) translateX(-5px) rotate(45deg)}.as-tooltip--bot:after,.as-tooltip--bottom:after{bottom:100%;left:50%;-webkit-transform:translateY(6px) translateX(-5px) rotate(45deg);transform:translateY(6px) translateX(-5px) rotate(45deg)}.as-tooltip--right:after{top:50%;left:0;-webkit-transform:translateY(-5px) translateX(-4px) rotate(45deg);transform:translateY(-5px) translateX(-4px) rotate(45deg)}.as-tooltip--left:after{top:50%;right:0;-webkit-transform:translateY(-4px) translateX(4px) rotate(45deg);transform:translateY(-4px) translateX(4px) rotate(45deg)}.as-tooltip--primary{border-color:var(--as--tooltip--primary--background-color);background:var(--as--tooltip--primary--background-color);color:var(--as--tooltip--primary--color)}.as-tooltip--secondary{border-color:var(--as--tooltip--secondary--background-color);background:var(--as--tooltip--secondary--background-color);color:var(--as--tooltip--secondary--color)}.as-tooltip--complementary{border-color:var(--as--tooltip--complementary--background-color);background:var(--as--tooltip--complementary--background-color);color:var(--as--tooltip--complementary--color)}.as-tooltip--error{border-color:var(--as--tooltip--error--background-color);background:var(--as--tooltip--error--background-color);color:var(--as--tooltip--error--color)}.as-tooltip--warning{border-color:var(--as--tooltip--warning--background-color);background:var(--as--tooltip--warning--background-color);color:var(--as--tooltip--warning--color)}.as-tooltip--success{border-color:var(--as--tooltip--success--background-color);background:var(--as--tooltip--success--background-color);color:var(--as--tooltip--success--color)}as-histogram-widget{--as--histogram-widget--background-color:var(--as--color--ui-01,#fff);--as--histogram-widget--figure--stroke-color:var(--as--color--secondary,#0f2d53);--as--histogram-widget--figure--text-color:var(--as--color--type-01,#2c2c2c);--as--histogram-widget--label-color:var(--as--color--type-01,#2c2c2c);--as--histogram-widget--label-font:var(--as--font--caption);display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;width:100%;min-width:228px;height:100%;max-height:100%;overflow:auto;background:var(--as--histogram-widget--background-color)}as-histogram-widget .as-histogram-widget__wrapper{display:-ms-flexbox;display:flex;position:relative;-ms-flex:1;flex:1;min-height:0}as-histogram-widget .as-histogram-widget--categorical .x-axis{opacity:0}as-histogram-widget .figure{-webkit-box-sizing:border-box;box-sizing:border-box;-ms-flex:1;flex:1;width:100%;min-height:0;padding:18px 8px 17px 30px;overflow:visible}as-histogram-widget .figure--has-x-label{margin-bottom:25px}as-histogram-widget .figure--has-y-label{padding-left:55px}as-histogram-widget .figure text{fill:var(--as--histogram-widget--figure--text-color)}as-histogram-widget .figure .brush .selection{stroke:none;fill:none}as-histogram-widget .figure .foreground-bar{cursor:pointer}as-histogram-widget .figure .y-axis{--widget-axis-text-color:var(--as--color--type-01,#2c2c2c);--widget-axis-line-color:var(--as--color--ui-05,#b3b3b3)}as-histogram-widget .figure .y-axis .tick text{width:30px;fill:var(--widget-axis-text-color);white-space:pre}as-histogram-widget .figure .y-axis .tick line{stroke:var(--widget-axis-line-color);opacity:.1}as-histogram-widget .figure .y-axis .tick line.zero{opacity:.5}as-histogram-widget .figure .x-axis .domain,as-histogram-widget .figure .x-axis .tick line,as-histogram-widget .figure .y-axis .domain{display:none}as-histogram-widget .figure .handle--wrapper{opacity:0}as-histogram-widget .figure .handle--custom{stroke-linecap:round;stroke:var(--as--histogram-widget--figure--stroke-color);fill:#fff;cursor:ew-resize;pointer-events:none}as-histogram-widget .figure .grab-line{stroke:#ccc}as-histogram-widget .figure .bottomline{stroke:var(--as--histogram-widget--figure--stroke-color)}as-histogram-widget .as-histogram-widget__wrapper--disabled svg .bar{cursor:inherit}as-histogram-widget .as-histogram-widget__footer{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between;margin-top:8px}as-histogram-widget .as-histogram-widget__selection{margin:0}as-histogram-widget .x-label,as-histogram-widget .y-label{color:var(--as--histogram-widget--label-color);font:var(--as--histogram-widget--label-font);text-align:center}as-histogram-widget .x-label{position:absolute;bottom:0;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}as-histogram-widget .y-label{position:absolute;top:50%;left:0;margin-left:4px;-webkit-transform:rotate(-90deg) translate(-50%);transform:rotate(-90deg) translate(-50%);-webkit-transform-origin:0 0;transform-origin:0 0}as-histogram-widget [role=tooltip]{display:none;position:fixed;-webkit-transform:translate(-50%,-120%);transform:translate(-50%,-120%);pointer-events:none}"; }
}

var ALERT_FILL = "M15.2005128,16 L0.800287177,16 C0.522682827,16 0.265878803,15.8556807 0.119476508,15.6199592 C-0.0269257857,15.3826341 -0.0389259738,15.088383 0.0842759568,14.8390314 L7.28438879,0.40710071 C7.55559304,-0.135700237 8.44440696,-0.135700237 8.71561121,0.40710071 L15.915724,14.8390314 C16.038926,15.088383 16.0269258,15.3818323 15.8805235,15.6199592 C15.7349212,15.8564825 15.4781172,16 15.2005128,16 Z M7,6 L7,11 L9,11 L9,6 L7,6 Z M8.70710729,12.2928927 C8.31657968,11.9023691 7.68341632,11.9023691 7.29289271,12.2928927 C6.9023691,12.6834203 6.9023691,13.3165837 7.29289271,13.7071073 C7.68342032,14.0976309 8.31658368,14.0976309 8.70710729,13.7071073 C9.0976309,13.3165797 9.0976309,12.6834163 8.70710729,12.2928927 Z";
var ALERT = "M15.2005128,16 L0.800287177,16 C0.522682827,16 0.265878803,15.8556807 0.119476508,15.6199592 C-0.0269257857,15.3826341 -0.0389259738,15.088383 0.0842759568,14.8390314 L7.28438879,0.40710071 C7.55559304,-0.135700237 8.44440696,-0.135700237 8.71561121,0.40710071 L15.915724,14.8390314 C16.038926,15.088383 16.0269258,15.3818323 15.8805235,15.6199592 C15.7349212,15.8564825 15.4781172,16 15.2005128,16 Z M2.09470746,14.3964522 L13.9060926,14.3964522 L8.00040001,2.5598637 L2.09470746,14.3964522 Z M7,6 L9,6 L9,11 L7,11 L7,6 Z M8.70710729,12.2928927 C9.0976309,12.6834163 9.0976309,13.3165797 8.70710729,13.7071073 C8.31658368,14.0976309 7.68342032,14.0976309 7.29289271,13.7071073 C6.9023691,13.3165837 6.9023691,12.6834203 7.29289271,12.2928927 C7.68341632,11.9023691 8.31657968,11.9023691 8.70710729,12.2928927 Z";
var ARROW_DOWN = "M 8.8620002,1.5286665 V 11.919334 l 1.5286668,-1.528667 0.942667,0.942667 -3.1380005,3.138 -3.138,-3.138 0.942667,-0.942667 1.5286663,1.528667 V 1.5286665 Z";
var ARROW_LEFT = "M4.276,7.3333333 5.8046667,5.8046667 4.862,4.862 1.724,8 4.862,11.138 5.8046667,10.195333 4.276,8.6666667 H 14.666667 V 7.3333333 Z";
var ARROW_RIGHT = "M12.114667,7.3333333 10.586,5.8046667 11.528667,4.862 14.666667,8 11.528667,11.138 10.586,10.195333 12.114667,8.6666667 H 1.724 V 7.3333333 Z";
var ARROW_UP = "M 8.8620002,14.471334 V 4.0806665 l 1.5286668,1.5286667 0.942667,-0.9426667 -3.1380005,-3.138 -3.138,3.138 0.942667,0.9426667 1.5286663,-1.5286667 V 14.471334 Z";
var CHEVRON_DOWN = "M1.3339844,4 0.98046875,4.3535156 0,5.3339844 8,13.333984 16,5.3339844 14.666016,4 8,10.666016 Z";
var CHEVRON_LEFT = "M 12.666992,14.666016 12.313476,15.019531 11.333008,16 l -8,-8 8,-8 1.333984,1.333984 L 6.000976,8 Z";
var CHEVRON_RIGHT = "M 3.333008,14.666016 3.686524,15.019531 4.666992,16 l 8,-8 -8,-8 L 3.333008,1.333984 9.999024,8 Z";
var CHEVRON_UP = "M1.3339844,13.333984 0.98046875,12.980468 0,12 8,4 16,12 14.666016,13.333984 8,6.667968 Z";
var CLOSE = "M 14,2.9743406 13.024979,2 8.0003445,7.0253649 2.9750215,2 2,2.9743406 7.025323,7.9997055 2,13.02507 2.9750215,13.999411 8.0003445,8.974046 13.024979,13.999411 14,13.02507 8.974677,7.9997055 Z";
var FACEBOOK = "M12,7 L9,7 C9.15401766,7.25882085 8.99420316,7.42198953 9,8 L9,16 L6,16 L6,8 C6.14037278,7.42198953 5.98055828,7.25882085 6,7 L4,7 L4,5 L6,5 C5.98055828,5.07352606 6.14037278,4.91035739 6,5 L6,3 C6.14037278,1.97186433 6.5270668,-1.45661261e-13 9,-1.45661261e-13 L12,0 L12,2 L10,2 C9.57495764,2.15251537 8.99420316,2.45918507 9,3 L9,5 C8.99420316,4.91035739 9.15401766,5.07352606 9,5 L12,5 L12,7 Z";
var HAMBURGUER = "M3.33333333,10.6666667 L12.6666667,10.6666667 L12.6666667,12.6666667 L3.33333333,12.6666667 L3.33333333,10.6666667 Z M3.33333333,7.33333333 L12.6666667,7.33333333 L12.6666667,9.33333333 L3.33333333,9.33333333 L3.33333333,7.33333333 Z M3.33333333,4 L12.6666667,4 L12.6666667,6 L3.33333333,6 L3.33333333,4 Z";
var HAMBURGER = "M3.33333333,10.6666667 L12.6666667,10.6666667 L12.6666667,12.6666667 L3.33333333,12.6666667 L3.33333333,10.6666667 Z M3.33333333,7.33333333 L12.6666667,7.33333333 L12.6666667,9.33333333 L3.33333333,9.33333333 L3.33333333,7.33333333 Z M3.33333333,4 L12.6666667,4 L12.6666667,6 L3.33333333,6 L3.33333333,4 Z";
var HOME = "M12.1997272,15 L3.80008915,15 C3.4137058,15 3.10011931,14.6860861 3.10011931,14.2992993 L3.10011931,9.39439439 L2.40014947,9.39439439 C1.83247394,9.39439439 1.32499581,9.05525526 1.10730519,8.52972973 C0.88961457,8.0035035 1.00930941,7.4044044 1.41039213,7.0022022 L7.01085078,1.40990991 C7.27473941,1.14574575 7.62612427,1 7.99990816,1 C8.37369205,1 8.72507691,1.14574575 8.98966551,1.41061061 L14.5887242,7.0015015 C14.9905069,7.4037037 15.1102017,8.0035035 14.8932111,8.52832833 C14.6769204,9.05455455 14.1687423,9.39439439 13.5996668,9.39439439 L12.899697,9.39439439 L12.899697,14.2992993 C12.899697,14.6853854 12.5861105,15 12.1997272,15 Z M4.50005898,13.5985986 L11.4997573,13.5985986 L11.4997573,8.69369369 C11.4997573,8.30690691 11.8133438,7.99299299 12.1997272,7.99299299 L13.5996668,7.99299299 L8.00060813,2.4014014 L2.3994495,7.99299299 L3.80008915,7.99299299 C4.18647249,7.99299299 4.50005898,8.30690691 4.50005898,8.69369369 L4.50005898,13.5985986 Z";
var INFO = "M8,15 C4.1402,15 1,11.8605 1,8 C1,4.1409 4.1402,1 8,1 C11.8598,1 15,4.1402 15,8 C15,11.8605 11.8598,15 8,15 Z M8,2.4 C4.9123,2.4 2.4,4.9123 2.4,8 C2.4,11.0877 4.9123,13.6 8,13.6 C11.0877,13.6 13.6,11.0877 13.6,8 C13.6,4.9123 11.0877,2.4 8,2.4 Z M8.7,10.1 L10.1,10.1 L10.1,11.5 L5.9,11.5 L5.9,10.1 L7.3,10.1 L7.3,8 L6.6,8 L6.6,6.6 L8,6.6 C8.3871,6.6 8.7,6.9136 8.7,7.3 L8.7,10.1 Z M8.61873,4.581284 C8.9604385,4.9229925 8.9604385,5.477011 8.61873,5.818723 C8.2770215,6.1604315 7.723003,6.1604315 7.381291,5.818723 C7.0395825,5.4770145 7.0395825,4.922996 7.381291,4.581284 C7.7229995,4.2395755 8.277018,4.2395755 8.61873,4.581284 Z";
var LINKEDIN = "M15,15 L12,15 L12,10 C11.9901246,9.17953506 11.519306,8.35524227 10,8 C9.69208185,8.35524227 9.25169039,8.91149286 9,9 C8.96983986,9.63999627 8.98185053,9.90803847 9,10 L9,15 L6,15 C6,15 6.03843416,6.82849407 6,6 L9,6 L9,7 C9.15800712,6.87302773 10.1108541,6 12,6 C13.5178826,6 15,7.28223322 15,10 L15,15 L15,15 Z M2,5 L2,5 C1.58001988,5 1,4.3390383 1,4 C1,2.64710676 1.597167,2 3,2 C3.42147117,2 3.98210736,2.64547677 4,3 C4,4.33659332 3.42147117,5 2,5 L2,5 L2,5 Z M1,6 L4,6 L4,15 L1,15 L1,6 L1,6 Z";
var MAGNIFY = "M14.5420063,13.4106724 L11.6220048,10.4900042 C12.2753385,9.60533714 12.666672,8.51600326 12.666672,7.333336 C12.666672,4.39266786 10.2740041,2 7.333336,2 C4.39266786,2 2,4.39266786 2,7.333336 C2,10.2740041 4.39266786,12.666672 7.333336,12.666672 C8.49133658,12.666672 9.56133711,12.2913385 10.4366709,11.6620048 L13.3640057,14.5893396 L14.5420063,13.4106724 Z M3.333334,7.333336 C3.333334,5.1273349 5.1273349,3.333334 7.333336,3.333334 C9.5393371,3.333334 11.333338,5.1273349 11.333338,7.333336 C11.333338,9.5393371 9.5393371,11.333338 7.333336,11.333338 C5.1273349,11.333338 3.333334,9.5393371 3.333334,7.333336 Z";
var MARKER = "M8,8 C6.89733333,8 6,7.10266667 6,6 C6,4.89733333 6.89733333,4 8,4 C9.10266667,4 10,4.89733333 10,6 C10,7.10266667 9.10266667,8 8,8 Z M8,5.33333333 C7.63266667,5.33333333 7.33333333,5.63266667 7.33333333,6 C7.33333333,6.368 7.63266667,6.66666667 8,6.66666667 C8.36733333,6.66666667 8.66666667,6.368 8.66666667,6 C8.66666667,5.63266667 8.36733333,5.33333333 8,5.33333333 Z M8,15 C6.315,12.8681957 3,8.40813858 3,5.741859 C3,3.12706247 5.24285714,1 8,1 C10.7571429,1 13,3.12706247 13,5.741859 C13,8.40813858 9.685,12.8688731 8,15 Z M8,2.35481686 C6.03071429,2.35481686 4.42857143,3.87424396 4.42857143,5.741859 C4.42857143,7.49702424 6.64785714,10.8786471 8,12.7130691 C9.35142857,10.8779697 11.5714286,7.49566942 11.5714286,5.741859 C11.5714286,3.87424396 9.96928571,2.35481686 8,2.35481686 Z";
var MINUS = "M 2,7 H 14 V 9 H 2 Z";
var PAUSE = "M8,15 C4.1402,15 1,11.8605 1,8 C1,4.1409 4.1402,1 8,1 C11.8598,1 15,4.1402 15,8 C15,11.8605 11.8598,15 8,15 Z M8,2.4 C4.9123,2.4 2.4,4.9123 2.4,8 C2.4,11.0877 4.9123,13.6 8,13.6 C11.0877,13.6 13.6,11.0877 13.6,8 C13.6,4.9123 11.0877,2.4 8,2.4 Z M6,5.5 L7.333334,5.5 L7.333334,10.5 L6,10.5 L6,5.5 Z M8.666668,5.5 L10.000002,5.5 L10.000002,10.5 L8.666668,10.5 L8.666668,5.5 Z";
var PENCIL = "M13.8806736,2.11933439 C13.3740067,1.61200081 12.6993397,1.333334 11.9826727,1.333334 C11.2666723,1.333334 10.5920053,1.61200081 10.0853384,2.11933439 L2.47933457,9.72467153 C2.47933457,9.72467153 2.47866791,9.72667153 2.47733457,9.7273382 C2.42333454,9.78200489 2.3313345,9.92600496 2.30333448,10.0346717 L1.35333401,13.8373403 C1.29600065,14.064007 1.36333402,14.3053405 1.52866743,14.4700072 L1.5293341,14.4706739 L1.53000077,14.4713406 C1.69533418,14.636674 1.9353343,14.7040074 2.16266775,14.6473407 L5.96533632,13.6960068 C6.07400304,13.6680068 6.21866978,13.5760068 6.2726698,13.5220068 C6.27333647,13.5213401 6.27533647,13.5200068 6.27533647,13.5200068 L13.8813403,5.91533629 C14.3880072,5.4080027 14.6673407,4.73466903 14.666674,4.01733534 C14.666674,3.30066832 14.3880072,2.62666798 13.8813403,2.11933439 L13.8806736,2.11933439 Z M9.60733814,4.48533558 L11.5160058,6.3940032 L5.8040029,12.1060061 L3.89533528,10.1973384 L9.60733814,4.48533558 Z M2.91666813,13.0840065 L3.31333499,11.5013391 L4.50000225,12.688673 L2.91666813,13.0840065 Z M12.9393398,3.0626682 C13.4486734,3.57266845 13.4486734,4.46200223 12.9393398,4.97200249 L12.4600062,5.45200273 L10.5493386,3.54200177 L11.0300055,3.0626682 C11.5400058,2.55333461 12.4293395,2.55266794 12.9393398,3.0626682 Z";
var PLAY = "M8,15 C4.1402,15 1,11.8605 1,8 C1,4.1409 4.1402,1 8,1 C11.8598,1 15,4.1402 15,8 C15,11.8605 11.8598,15 8,15 Z M8,2.4 C4.9123,2.4 2.4,4.9123 2.4,8 C2.4,11.0877 4.9123,13.6 8,13.6 C11.0877,13.6 13.6,11.0877 13.6,8 C13.6,4.9123 11.0877,2.4 8,2.4 Z M6.5,10.733336 L6.5,5.4 L10.500002,8.066668 L6.5,10.733336 Z";
var PLUS = "M7,7 L7,2 L9,2 L9,7 L14,7 L14,9 L9,9 L9,14 L7,14 L7,9 L2,9 L2,7 L7,7 Z";
var POINTS = "M 7,1 H 9 V 3 H 7 Z M 7,7 H 9 V 9 H 7 Z m 0,6 h 2 v 2 H 7 Z";
var QUESTION = "M8,15 C4.1402,15 1,11.8605 1,8 C1,4.1409 4.1402,1 8,1 C11.8598,1 15,4.1402 15,8 C15,11.8605 11.8598,15 8,15 Z M8,2.4 C4.9123,2.4 2.4,4.9123 2.4,8 C2.4,11.0877 4.9123,13.6 8,13.6 C11.0877,13.6 13.6,11.0877 13.6,8 C13.6,4.9123 11.0877,2.4 8,2.4 Z M8.666671,10.000005 L7.333337,10.000005 L7.333337,8.000004 L8.000004,8.000004 C8.73600437,8.000004 9.333338,7.4020037 9.333338,6.66667 C9.333338,5.93066963 8.73600437,5.333336 8.000004,5.333336 C7.26400363,5.333336 6.66667,5.93066963 6.66667,6.66667 L5.333336,6.66667 C5.333336,5.19666927 6.53000326,4.000002 8.000004,4.000002 C9.47000473,4.000002 10.666672,5.19666927 10.666672,6.66667 C10.666672,7.90667062 9.81533824,8.95200448 8.666671,9.25000463 L8.666671,10.000005 Z M8.58927096,10.744072 C8.91470779,11.0695089 8.91470779,11.5971458 8.58927096,11.922586 C8.26383413,12.2480228 7.7361972,12.2480228 7.41075704,11.922586 C7.08532021,11.5971491 7.08532021,11.0695122 7.41075704,10.744072 C7.73619387,10.4186352 8.2638308,10.4186352 8.58927096,10.744072 Z";
var REDO = "M5.05733586,13.1380066 C3.21933494,13.1380066 1.72400086,11.6426725 1.72400086,9.80467157 C1.72400086,7.96667065 3.21933494,6.47133657 5.05733586,6.47133657 L12.1146727,6.47133657 L10.5860053,4.94266914 L11.5286724,4.000002 L14.666674,7.13800357 L11.5286724,10.2760051 L10.5860053,9.333338 L12.1146727,7.80467057 L5.05733586,7.80467057 C3.95466864,7.80467057 3.05733486,8.70200435 3.05733486,9.80467157 C3.05733486,10.9073388 3.95466864,11.8046726 5.05733586,11.8046726 L8.39067086,11.8046726 L8.39067086,13.1380066 L5.05733586,13.1380066 Z";
var SETTINGS = "M12.666673,5.99933633 C11.7986726,5.99933633 11.0660055,5.44066939 10.7900054,4.66600233 L1.333334,4.66600233 L1.333334,3.33266833 L10.7900054,3.33266833 C11.0660055,2.55800128 11.7986726,1.99933433 12.666673,1.99933433 C13.7693402,1.99933433 14.666674,2.89666812 14.666674,3.99933533 C14.666674,5.10200255 13.7693402,5.99933633 12.666673,5.99933633 Z M12.666673,3.33266833 C12.2993395,3.33266833 12.000006,3.63200182 12.000006,3.99933533 C12.000006,4.36800218 12.2993395,4.66600233 12.666673,4.66600233 C13.0340065,4.66600233 13.33334,4.36800218 13.33334,3.99933533 C13.33334,3.63200182 13.0340065,3.33266833 12.666673,3.33266833 Z M6.000003,5.99933633 C6.86800343,5.99933633 7.60067047,6.55800328 7.87667061,7.33267033 L14.666674,7.33267033 L14.666674,8.66600433 L7.87667061,8.66600433 C7.60067047,9.44067139 6.86733677,9.99933833 6.000003,9.99933833 C5.13266923,9.99933833 4.39933553,9.44067139 4.1233354,8.66600433 L1.333334,8.66600433 L1.333334,7.33267033 L4.1233354,7.33267033 C4.39933553,6.55800328 5.13200257,5.99933633 6.000003,5.99933633 Z M6.000003,8.66600433 C6.36733652,8.66600433 6.66667,8.36800418 6.66667,7.99933733 C6.66667,7.63200382 6.36733652,7.33267033 6.000003,7.33267033 C5.63266948,7.33267033 5.333336,7.63200382 5.333336,7.99933733 C5.333336,8.36800418 5.63266948,8.66600433 6.000003,8.66600433 Z M12.666673,9.99933833 C13.7693402,9.99933833 14.666674,10.8966721 14.666674,11.9993393 C14.666674,13.1020066 13.7693402,13.9993403 12.666673,13.9993403 C11.7993392,13.9993403 11.0660055,13.4406734 10.7900054,12.6660063 L1.333334,12.6660063 L1.333334,11.3326723 L10.7900054,11.3326723 C11.0660055,10.5580053 11.7986726,9.99933833 12.666673,9.99933833 Z M12.666673,12.6660063 C13.0340065,12.6660063 13.33334,12.3680062 13.33334,11.9993393 C13.33334,11.6320058 13.0340065,11.3326723 12.666673,11.3326723 C12.2993395,11.3326723 12.000006,11.6320058 12.000006,11.9993393 C12.000006,12.3680062 12.2993395,12.6660063 12.666673,12.6660063 Z";
var TICK_CIRCLE_FILL = "M8,15 C4.1402,15 1,11.8598 1,8 C1,4.1402 4.1402,1 8,1 C11.8598,1 15,4.1402 15,8 C15,11.8598 11.8598,15 8,15 Z M7.4113,11.4496 L11.5119,5.7089 L10.0874,4.6918 L7.188,8.7511 L5.8181,7.3819 L4.5812,8.6195 L7.4113,11.4496 Z";
var TICK_CIRCLE = "M8,15 C4.1402,15 1,11.8598 1,8 C1,4.1402 4.1402,1 8,1 C11.8598,1 15,4.1402 15,8 C15,11.8598 11.8598,15 8,15 Z M8,2.4 C4.9123,2.4 2.4,4.9123 2.4,8 C2.4,11.0877 4.9123,13.6 8,13.6 C11.0877,13.6 13.6,11.0877 13.6,8 C13.6,4.9123 11.0877,2.4 8,2.4 Z M7.4113,11.4496 L4.5812,8.6195 L5.8181,7.3819 L7.188,8.7511 L10.0874,4.6918 L11.5119,5.7089 L7.4113,11.4496 Z";
var TICK = "M 5.3626012,14 1,9.669206 2.5649039,8.115148 5.2873229,10.81717 13.362475,2 15,3.4784647 Z";
var TWITTER = "M15.585592,2.24001476 C14.9910018,2.6160691 14.3323823,2.88920145 13.6314057,3.03641675 C13.0700099,2.39858132 12.2702184,2 11.3851092,2 C9.68550422,2 8.30758258,3.46940291 8.30758258,5.28180108 C8.30758258,5.53901826 8.33485131,5.78950661 8.38730386,6.02969691 C5.82963898,5.89283817 3.56205421,4.58627317 2.04422254,2.60073905 C1.77932624,3.0854495 1.62756502,3.64920919 1.62756502,4.25065038 C1.62756502,5.38922846 2.17090969,6.39375636 2.99665313,6.98226647 C2.49215406,6.96523958 2.01766707,6.81761471 1.60271041,6.57180729 C1.60249095,6.58549901 1.60249095,6.59924925 1.60249095,6.613058 C1.60249095,8.20317043 2.66328322,9.5296294 4.07110721,9.83108139 C3.81284977,9.90609331 3.5409854,9.94617379 3.2602875,9.94617379 C3.06199934,9.94617379 2.86919785,9.9256362 2.68133435,9.88731107 C3.07291781,11.1911845 4.20942609,12.1400094 5.55607374,12.1665151 C4.50285306,13.0467058 3.17590256,13.5713797 1.7341161,13.5713797 C1.48573466,13.5713797 1.24075497,13.5558741 1,13.5255651 C2.36190058,14.4567194 3.97953473,15 5.71743662,15 C11.3779217,15 14.4732799,9.99918534 14.4732799,5.66236081 C14.4732799,5.52006049 14.4703172,5.37852083 14.4643915,5.23780032 C15.0656206,4.77509024 15.5874026,4.19705371 16,3.53891474 C15.4480961,3.79993519 14.59375,4 14.2324701,4.05568958 C14.59375,3.5389148 15.3558104,3.00634176 15.585592,2.24001476 Z";
var UNDO = "m 11.333339,13.138007 c 1.838001,0 3.333335,-1.495334 3.333335,-3.3333354 0,-1.838001 -1.495334,-3.333335 -3.333335,-3.333335 H 4.2760022 L 5.8046696,4.9426691 4.8620025,4.000002 1.7240009,7.1380036 4.8620025,10.276005 5.8046696,9.333338 4.2760022,7.8046706 h 7.0573368 c 1.102667,0 2.000001,0.8973337 2.000001,2.000001 0,1.1026674 -0.897334,2.0000014 -2.000001,2.0000014 H 8.000004 v 1.333334 z";
var paths = {
	ALERT_FILL: ALERT_FILL,
	ALERT: ALERT,
	ARROW_DOWN: ARROW_DOWN,
	ARROW_LEFT: ARROW_LEFT,
	ARROW_RIGHT: ARROW_RIGHT,
	ARROW_UP: ARROW_UP,
	CHEVRON_DOWN: CHEVRON_DOWN,
	CHEVRON_LEFT: CHEVRON_LEFT,
	CHEVRON_RIGHT: CHEVRON_RIGHT,
	CHEVRON_UP: CHEVRON_UP,
	CLOSE: CLOSE,
	FACEBOOK: FACEBOOK,
	HAMBURGUER: HAMBURGUER,
	HAMBURGER: HAMBURGER,
	HOME: HOME,
	INFO: INFO,
	LINKEDIN: LINKEDIN,
	MAGNIFY: MAGNIFY,
	MARKER: MARKER,
	MINUS: MINUS,
	PAUSE: PAUSE,
	PENCIL: PENCIL,
	PLAY: PLAY,
	PLUS: PLUS,
	POINTS: POINTS,
	QUESTION: QUESTION,
	REDO: REDO,
	SETTINGS: SETTINGS,
	TICK_CIRCLE_FILL: TICK_CIRCLE_FILL,
	TICK_CIRCLE: TICK_CIRCLE,
	TICK: TICK,
	TWITTER: TWITTER,
	UNDO: UNDO
};

function icon(name, color = '#000', props) {
    const path = paths[name];
    return (h("svg", Object.assign({ width: '16px', height: '16px', viewBox: '0 0 16 16', xmlns: 'http://www.w3.org/2000/svg' }, props),
        h("path", { fill: color, d: path })));
}

function sameData(first, second) {
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
function prepareData$1(data) {
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

const SCRUBBER_SIZE = 6;
class TimeSeriesWidget {
    constructor() {
        this.showHeader = true;
        this.disableInteractivity = false;
        this.data = [];
        this.backgroundData = [];
        this.color = DEFAULT_BAR_COLOR;
        this.unselectedColor = DEFAULT_BACKGROUND_BAR_COLOR;
        this.isLoading = false;
        this.error = '';
        this.errorDescription = '';
        this.noDataHeaderMessage = 'NO DATA AVAILABLE';
        this.noDataBodyMessage = 'There is no data to display.';
        this.responsive = true;
        this.progress = 0;
        this.playing = false;
        this.animated = false;
        this.timeFormat = '%x - %X';
        this.clearText = 'Clear selection';
        this.range = null;
        this.disableAnimation = false;
        this.xAxisOptions = {};
        this.yAxisOptions = {};
        this.axisFormatter = this.axisFormatter.bind(this);
    }
    onDataChanged(newData, oldData) {
        if (sameData(newData, oldData)) {
            return;
        }
        else {
            this._data = prepareData$1(newData);
        }
    }
    onBackgroundDataChanged(newData) {
        this._backgroundData = prepareData$1(newData);
    }
    onProgressChanged() {
        this._render();
    }
    onTimeFormatChanged(newFormat) {
        this._formatter = timeFormat(newFormat);
        this.histogram.forceUpdate();
    }
    onTimeFormatLocaleChanged(newLocale) {
        try {
            defaultLocale(newLocale);
            if (this.timeFormat) {
                this.onTimeFormatChanged(this.timeFormat);
            }
        }
        catch (e) {
            throw new Error('Invalid time format.');
        }
    }
    defaultFormatter(data) {
        return this.histogram.defaultFormatter(data);
    }
    async getSelection() {
        return this.histogram.getSelection();
    }
    setSelection(values) {
        this.histogram.setSelection(values);
    }
    clearSelection() {
        this.histogram.clearSelection();
    }
    xFormatter(value$$1) {
        return this.histogram.xFormatter(value$$1);
    }
    async componentWillLoad() {
        this.onDataChanged(this.data, []);
        this.onBackgroundDataChanged(this.backgroundData);
    }
    async componentDidLoad() {
        console.warn('[as-time-series-widget] This is an unreleased component, use at your own risk');
        if (this.timeFormatLocale) {
            defaultLocale(this.timeFormatLocale);
        }
        this._formatter = timeFormat(this.timeFormat);
        this.histogram.addEventListener('selectionInput', (evt) => {
            if (evt.detail === null) {
                this._selection = null;
            }
            else {
                this._selection = evt.detail.selection;
            }
            this._render();
        });
        this.histogram.addEventListener('selectionChanged', (evt) => {
            evt.stopPropagation();
            if (evt.detail === null) {
                this.selectionChanged.emit(null);
                return;
            }
            const selectedDates = evt.detail.selection.map((epoch) => new Date(epoch));
            this.selectionChanged.emit(selectedDates);
            this._render();
        });
        this.histogram.addEventListener('drawParametersChanged', (evt) => {
            this._renderOptions = evt.detail;
            this._render();
        });
        this._selection = await this.histogram.getSelection();
    }
    render() {
        return [
            this._renderButton(),
            h("as-histogram-widget", { ref: (ref) => { this.histogram = ref; }, heading: this.heading, description: this.description, showHeader: this.showHeader, showClear: this.showClear, disableInteractivity: this.disableInteractivity, data: this._data, backgroundData: this._backgroundData, color: this.color, unselectedColor: this.unselectedColor, colorRange: this.colorRange, axisFormatter: this.axisFormatter, tooltipFormatter: this.tooltipFormatter, xLabel: this.xLabel, yLabel: this.yLabel, isLoading: this.isLoading, error: this.error, errorDescription: this.errorDescription, noDataHeaderMessage: this.noDataHeaderMessage, noDataBodyMessage: this.noDataBodyMessage, responsive: this.responsive, clearText: this.clearText, range: this.range, disableAnimation: this.disableAnimation, xAxisOptions: this.xAxisOptions, yAxisOptions: this.yAxisOptions })
        ];
    }
    axisFormatter(value$$1) {
        return this._formatter(new Date(value$$1));
    }
    _renderButton() {
        if (!this.animated) {
            return null;
        }
        const classes = {
            'as-time-series--play-button': true,
            'as-time-series--play-button-hidden': !this.data.length || this.isLoading || !!this.error,
            'as-time-series--play-button-x-label': !!this.xLabel
        };
        return h("div", { class: classes, onClick: this._playPauseClick.bind(this) }, icon(this.playing ? 'PAUSE' : 'PLAY', 'var(--as--color--primary)', { width: '32px', height: '32px' }));
    }
    _playPauseClick() {
        this.playing ? this.pause.emit() : this.play.emit();
    }
    _render() {
        if (!this._renderOptions) {
            return;
        }
        const { container, height, width, padding, xScale, binsScale, handleWidth } = this._renderOptions;
        let timeSeries = container.select('.as-time-series--g');
        if (!this.animated) {
            if (!timeSeries.empty()) {
                timeSeries.remove();
            }
            return;
        }
        const { left } = container.node().getBoundingClientRect();
        const [X_PADDING, Y_PADDING] = padding;
        const progressScale = linear().domain([0, 100]);
        let trackOffset = 0;
        if (this._selection) {
            const selection = this._selection.map((e) => xScale(binsScale(e)));
            trackOffset = handleWidth / 2;
            progressScale.range([
                selection[0] + trackOffset + (SCRUBBER_SIZE / 2),
                selection[1] - trackOffset - (SCRUBBER_SIZE / 2)
            ]);
        }
        else {
            progressScale.range([0, width - X_PADDING]);
        }
        const xPos = progressScale(this.progress);
        container.on('click', () => {
            const evt = event;
            const pctX = Math.round(progressScale.invert(evt.clientX - left - X_PADDING + 8));
            if (pctX > 100 || pctX < 0) {
                return;
            }
            this.seek.emit(pctX);
        });
        if (timeSeries.empty()) {
            timeSeries = container
                .append('g')
                .attr('class', 'as-time-series--g');
            timeSeries.append('line')
                .attr('class', 'as-time-series--preview')
                .attr('stroke-width', 4)
                .attr('stroke', 'gray')
                .attr('opacity', '0');
            timeSeries.append('line')
                .attr('class', 'as-time-series--line')
                .attr('stroke-width', 4);
            timeSeries.append('circle')
                .attr('class', 'as-time-series--scrubber')
                .attr('r', SCRUBBER_SIZE)
                .attr('stroke-width', 0);
            timeSeries.append('line')
                .attr('class', 'as-time-series--track')
                .attr('stroke-width', 16)
                .attr('stroke', 'black')
                .attr('opacity', '0')
                .on('mouseleave', () => {
                this._lastMousePosition = -1;
                timeSeries.select('.as-time-series--preview')
                    .attr('opacity', '0');
            });
        }
        timeSeries.select('.as-time-series--line')
            .attr('x1', progressScale(0) - (SCRUBBER_SIZE / 2))
            .attr('x2', xPos)
            .attr('y1', height - Y_PADDING)
            .attr('y2', height - Y_PADDING);
        timeSeries.select('.as-time-series--track')
            .attr('y1', height - Y_PADDING)
            .attr('y2', height - Y_PADDING)
            .attr('x1', progressScale(0) + trackOffset)
            .attr('x2', progressScale(100) - trackOffset)
            .on('mousemove', () => {
            const evt = event;
            this._lastMousePosition = evt.clientX - left - X_PADDING + 8;
            if (this._lastMousePosition > progressScale(this.progress)) {
                timeSeries.select('.as-time-series--preview')
                    .attr('x2', this._lastMousePosition)
                    .attr('opacity', '1');
            }
        });
        timeSeries.select('.as-time-series--preview')
            .attr('x1', xPos - (SCRUBBER_SIZE / 2))
            .attr('y1', height - Y_PADDING)
            .attr('y2', height - Y_PADDING)
            .attr('opacity', () => {
            if (this._lastMousePosition > xPos) {
                return '1';
            }
            return '0';
        });
        timeSeries.select('.as-time-series--scrubber')
            .attr('transform', `translate(${xPos - (SCRUBBER_SIZE / 2)},${height - Y_PADDING})`);
    }
    static get is() { return "as-time-series-widget"; }
    static get properties() { return {
        "animated": {
            "type": Boolean,
            "attr": "animated",
            "reflectToAttr": true
        },
        "backgroundData": {
            "type": "Any",
            "attr": "background-data",
            "watchCallbacks": ["onBackgroundDataChanged"]
        },
        "clearSelection": {
            "method": true
        },
        "clearText": {
            "type": String,
            "attr": "clear-text"
        },
        "color": {
            "type": String,
            "attr": "color"
        },
        "colorRange": {
            "type": "Any",
            "attr": "color-range"
        },
        "data": {
            "type": "Any",
            "attr": "data",
            "watchCallbacks": ["onDataChanged"]
        },
        "defaultFormatter": {
            "method": true
        },
        "description": {
            "type": String,
            "attr": "description"
        },
        "disableAnimation": {
            "type": Boolean,
            "attr": "disable-animation"
        },
        "disableInteractivity": {
            "type": Boolean,
            "attr": "disable-interactivity"
        },
        "error": {
            "type": String,
            "attr": "error"
        },
        "errorDescription": {
            "type": String,
            "attr": "error-description"
        },
        "getSelection": {
            "method": true
        },
        "heading": {
            "type": String,
            "attr": "heading"
        },
        "isLoading": {
            "type": Boolean,
            "attr": "is-loading"
        },
        "noDataBodyMessage": {
            "type": String,
            "attr": "no-data-body-message"
        },
        "noDataHeaderMessage": {
            "type": String,
            "attr": "no-data-header-message"
        },
        "playing": {
            "type": Boolean,
            "attr": "playing"
        },
        "progress": {
            "type": Number,
            "attr": "progress",
            "watchCallbacks": ["onProgressChanged"]
        },
        "range": {
            "type": "Any",
            "attr": "range"
        },
        "responsive": {
            "type": Boolean,
            "attr": "responsive"
        },
        "setSelection": {
            "method": true
        },
        "showClear": {
            "type": Boolean,
            "attr": "show-clear"
        },
        "showHeader": {
            "type": Boolean,
            "attr": "show-header"
        },
        "timeFormat": {
            "type": String,
            "attr": "time-format",
            "watchCallbacks": ["onTimeFormatChanged"]
        },
        "timeFormatLocale": {
            "type": "Any",
            "attr": "time-format-locale",
            "watchCallbacks": ["onTimeFormatLocaleChanged"]
        },
        "tooltipFormatter": {
            "type": "Any",
            "attr": "tooltip-formatter"
        },
        "unselectedColor": {
            "type": String,
            "attr": "unselected-color"
        },
        "xAxisOptions": {
            "type": "Any",
            "attr": "x-axis-options"
        },
        "xFormatter": {
            "method": true
        },
        "xLabel": {
            "type": String,
            "attr": "x-label"
        },
        "yAxisOptions": {
            "type": "Any",
            "attr": "y-axis-options"
        },
        "yLabel": {
            "type": String,
            "attr": "y-label"
        }
    }; }
    static get events() { return [{
            "name": "play",
            "method": "play",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "pause",
            "method": "pause",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "selectionChanged",
            "method": "selectionChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "seek",
            "method": "seek",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "as-time-series-widget{--as--time-series--line-color:var(--as--color--primary,#1785fb);--as-histogram-widget--background-color:var(--as--color--ui-01);display:-ms-flexbox;display:flex;-ms-flex-align:end;align-items:flex-end;height:100%;background:var(--as-histogram-widget--background-color,#fff)}as-time-series-widget as-histogram-widget{overflow:unset}as-time-series-widget as-histogram-widget .content,as-time-series-widget as-histogram-widget as-widget-header,as-time-series-widget as-histogram-widget as-widget-selection{margin-left:-32px}as-time-series-widget .as-time-series--play-button{margin-bottom:2px;cursor:pointer}as-time-series-widget .as-time-series--play-button-hidden{opacity:0}as-time-series-widget .as-time-series--play-button-x-label{margin-bottom:27px}as-time-series-widget .as-time-series--line,as-time-series-widget .as-time-series--scrubber{stroke:var(--as--time-series--line-color);fill:var(--as--time-series--line-color)}as-time-series-widget .as-time-series--line,as-time-series-widget .as-time-series--scrubber,as-time-series-widget .as-time-series--track{cursor:pointer}"; }
}

export { HistogramWidget as AsHistogramWidget, TimeSeriesWidget as AsTimeSeriesWidget };
