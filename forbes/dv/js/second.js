/**
 * @author Dharmendra Kumar
 * Driver code for the parallel coordinates plot
 * This code hasnt been refactored to make use of the utility classes
 */

// Always good to start with some hardcoding :)
 var margin = {top: 20, right: 50, bottom: 60, left: 80},
     width = 920,
     height = 700;

var x = d3.scaleOrdinal(),
    y = {},
    actives = [],
    selections = [];

var line = d3.line(),
    axis = d3.axisLeft(),
    background,
    foreground;

// Helper functions
// Read data and call the cbk
function readCSV(uri, cbk) {
  d3.csv(uri, function(data) {
    cbk(data);
  })
}

function onDataLoaded(data) {
  // drawTopXAxis(0, width, height-2, xScale, svg);
  drawParallelCoordinatePlot(data);
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
}

function drawParallelCoordinatePlot(data) {
  var numericalColumns = [0, 3, 4, 5, 6];
  var nominalColumns = [1, 2, 7, 8];

  var svg = d3.select("#main-chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = d3.keys(data[0]).filter(function(d,i) {
      return nominalColumns.indexOf(i) == -1 && (y[d] = d3.scaleLinear()
          .domain(d3.extent(data, function(p) { return +p[d]; })).nice()
          .range([height, 0]));
    }));
    var xRange = [];

    for(var i=0; i<dimensions.length; ++i) {
      xRange[i] = i * width / dimensions.length;
    }

    x.range(xRange);

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
      .selectAll("path")
        .data(data)
      .enter().append("path")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
      .selectAll("path")
        .data(data)
      .enter().append("path")
        .attr("d", path);

    // Add a group element for each dimension.
     var g = svg.selectAll(".dimension")
         .data(dimensions)
       .enter().append("g")
         .attr("class", "dimension")
         .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

    var titles = {
      'Rank': 'Rank (smaller is better)',
      'Sales': 'Sales (in Billion $)',
      'Profits': 'Profits (in %)',
      'Assets': 'Assets (in Billion $)',
      'MarketValue': 'Market Value (in Billion $)'
    }
     // Add an axis and title.
     g
     .append("text")
       .style("text-anchor", "middle")
       .attr("y", height + 25)
       .text(function(d) {
         return titles[d];
       });

      g.append("g")
         .attr("class", "axis")
         .each(function(d) { d3.select(this).call(axis.scale(y[d])); });

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function(d) {
          y[d].brush = d3.brushY().on("brush", brush).extent([[0, 0], [width, height]]).on("end", brush);
          d3.select(this).call(y[d].brush);
        })
      .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);
}

// Handles a brush event, toggling the display of foreground lines.
function brush(type) {
  d3.select(this).selectAll("rect")
    .attr("x", -8)
    .attr("width", 16);

  if(d3.event.selection) {
    actives[type] = type, selections[type] = d3.event.selection;
  }
  else {
    actives[type] = null, selections[type] = null;
  }
  if(!Object.keys(actives)) return foreground.style("display", null);

  var extents = Object.keys(actives).map(function(p) { return selections[p] ? selections[p].map(y[p].invert) : [] });
  foreground.style("display", function(d) {
    return Object.keys(actives).every(function(p, i) {
      if(actives[p]) {
        var domain = extents[i];
        return domain[1] <= d[p] && d[p] <= domain[0];
      } else {
        return true;
      }
    }) ? null : "none";
  });
}

readCSV("/data/forbes_500_full.csv", onDataLoaded);
