/**
 * @author Dharmendra Kumar
 * Driver code for the exploration dashboard
 */

// Always good to start with some hardcoding :)
var margins = {top: 40, right: 50, bottom: 60, left: 60},
    width = 800,
    height = 250;

var activeSectorIndex = 0;
   var sectors = ["Information Technology", "Energy", "Telecommunication Services", "Health Care", "Financials", "Consumer Staples", "Consumer Discretionary", "Industrials", "Materials", "Utilities"];
var sectorColors = ['#7f3b08','#b35806','#e08214','#fdb863','#fee0b6','#d8daeb','#b2abd2','#8073ac','#542788','#2d004b'];

readCSV('data/forbes_summary.csv', function(data) {
  // set the ranges
  var x = d3.scaleBand()
            .domain(data.map(function(d) { return d.Sector; }))
            .range([0, width])
            .padding(0.1);
  var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return parseFloat(d.Profits); })]).nice()
            .range([height, 0]);

  // Render a bar chart
  canvas = new Canvas("canvas-bar",
      width,
      height,
      margins,
      {'x': x, 'y': y},
      {'bottom': d3.axisBottom(x), 'left': d3.axisLeft(y), 'top': d3.axisTop(x), 'right': d3.axisRight(y)},
      {'bottom': "Sectors",
        'left': "Average Profits (in %)",
        'top': "Sectors sorted by Average Profits",
        'right': null},
      null,
      false);

  canvas.render(d3.select("#main-chart"));

  var c = d3.scaleOrdinal()
    .domain(sectors)
    .range(sectorColors);

  var bar = new BarChart(width, height, x, y, c, "Sector", "Profits", "Sector", data, true, onClick);
  bar.render(d3.select("#canvas-bar g"));

  // Add annotation to show the selection
  // Add annotations
  var annotations = [
    {'x': 640, 'y': -990, 'width': 200, 'height': null, 'text': 'Selected Sector: <strong>Information Technology</strong>'},
  ];

  var an1;
  annotations.forEach(function(an) {
    an1 = new Annotation(an.width, an.height, an.x, an.y, an.text);
    an1.render(d3.select("#main-chart-annotations"));
  });

  function onClick(d, i) {
    console.log(d);
    activeSectorIndex = i;
    an1.text('Selected Sector: <strong>' + d.Sector + '</strong>');

    var cs = forbesData.filter(function(d) { return d.Sector == sectors[activeSectorIndex] });
    cs.sort(function(x, y) {
       return d3.descending(parseFloat(x.Profits), parseFloat(y.Profits));
    });
    // Top 10
    cs.splice(10);

    var x = d3.scaleBand()
              .domain(cs.map(function(d) { return d.Company; }))
              .range([0, width])
              .padding(0.1);

    top10Bar.data(d3.select("#canvas-bar-filtered-top g"), cs, x);

    var cs1 = forbesData.filter(function(d) { return d.Sector == sectors[activeSectorIndex] });
    cs1.sort(function(x, y) {
       return d3.ascending(parseFloat(x.Profits), parseFloat(y.Profits));
    });
    // Top 10
    cs1.splice(10);

    var x1 = d3.scaleBand()
              .domain(cs1.map(function(d) { return d.Company; }))
              .range([0, width])
              .padding(0.1);

    bottom10Bar.data(d3.select("#canvas-bar-filtered-bottom g"), cs1, x1);
  }

  // Filtered bar chart test
  var top10Bar, bottom10Bar, forbesData;
  readCSV('data/forbes_500_full.csv', function(data) {
    forbesData = data;

    var c = d3.scaleOrdinal()
      .domain(sectors)
      .range(sectorColors);

    var cs = data.filter(function(d) { return d.Sector == sectors[activeSectorIndex] });
    cs.sort(function(x, y) {
       return d3.descending(parseFloat(x.Profits), parseFloat(y.Profits));
    });
    // Top 10
    cs.splice(10);

    // set the ranges
    var y = d3.scaleLinear()
              .domain([d3.min(data, function(d) { return parseFloat(d.Profits); }), d3.max(data, function(d) { return parseFloat(d.Profits); })]).nice()
              .range([height, 0]);

    var x = d3.scaleBand()
              .domain(cs.map(function(d) { return d.Company; }))
              .range([0, width])
              .padding(0.1);

    // Render a bar chart
    canvas = new Canvas("canvas-bar-filtered-top",
        width,
        height,
        margins,
        {'x': x, 'y': y},
        {'bottom': d3.axisBottom(x), 'left': d3.axisLeft(y), 'top': d3.axisTop(x), 'right': d3.axisRight(y)},
        {'bottom': "Company",
          'left': "Profits (in %)",
          'top': "Top 10 companies in the selected sector wrt Profits",
          'right': ''},
        null,
        false);

    canvas.render(d3.select("#main-chart"));

    top10Bar = new BarChart(width, height, x, y, c, "Company", "Profits", "Sector", cs);
    top10Bar.render(d3.select("#canvas-bar-filtered-top g"));

    // Bottom 10

    // Render a bar chart
    var cs1 = data.filter(function(d) { return d.Sector == sectors[activeSectorIndex] });
    cs1.sort(function(x, y) {
       return d3.ascending(parseFloat(x.Profits), parseFloat(y.Profits));
    });
    // Top 10
    cs1.splice(10);
    // set the ranges
    var x1 = d3.scaleBand()
              .domain(cs1.map(function(d) { return d.Company; }))
              .range([0, width])
              .padding(0.1);

    canvas = new Canvas("canvas-bar-filtered-bottom",
        width,
        height,
        margins,
        {'x': x1, 'y': y},
        {'bottom': d3.axisBottom(x1), 'left': d3.axisLeft(y), 'top': d3.axisTop(x1), 'right': d3.axisRight(y)},
        {'bottom': "Company",
          'left': "Profits (in %)",
          'top': "Bottom 10 companies in the selected sector wrt Profits",
          'right': ''},
        null,
        false);

    canvas.render(d3.select("#main-chart"));

    bottom10Bar = new BarChart(width, height, x1, y, c, "Company", "Profits", "Sector", cs1);
    bottom10Bar.render(d3.select("#canvas-bar-filtered-bottom g"));
  });  
});
