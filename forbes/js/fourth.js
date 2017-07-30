/**
 * @author Dharmendra Kumar
 * Driver code for the force directed graph plot
 */

// Always good to start with some hardcoding :)
var margins = {top: 60, right: 50, bottom: 60, left: 60},
    width = 800,
    height = 150;

 readCSV('./data/forbes_500_full.csv', function(data) {
   var labels = ['MarketValue (in Billion $)', 'Assets (in Billion $)', 'Sales (in Billion $)', 'Profits (in %)'];
   var scales = {};

   var xmax = d3.max(data, function(d) { return parseInt(d.Rank); });
   var xmin = d3.min(data, function(d) { return parseInt(d.Rank); });
   var xScale = d3.scaleLinear().domain([xmin, xmax]).range([0, width]).nice();
   var bAxis = d3.axisBottom().scale(xScale);
   var tAxis = d3.axisTop().scale(xScale);

   // Create FDL
   xmax = d3.max(data, function(d) { return parseInt(d.Profits); });
   xmin = d3.min(data, function(d) { return parseInt(d.Profits); });
   xScale = d3.scaleLinear().domain([xmin, xmax]).range([0, width]).nice();

   height = height;

   bAxis = d3.axisBottom().scale(xScale);
   tAxis = d3.axisTop().scale(xScale);
   var rmax = d3.max(data, function(d) { return parseInt(d.Rank); });
   var rmin = d3.min(data, function(d) { return parseInt(d.Rank); });
   var yScale = d3.scaleLinear().domain([rmax, rmin]).range([0, height]).nice();
   var cScale = d3.scaleQuantize()
     // .domain([xmin, 0, 5, 15, 25, 35, 45, xmax])
     // .range(['#542788', '#998EC3', '#d8daeb', '#fee0b6', '#f1a340', '#b35806']);
     .domain([xmin, xmax])
     .range(['#b2182b','#ef8a62','#fddbc7','#d1e5f0','#67a9cf','#2166ac']).nice();

   lAxis = d3.axisLeft().scale(yScale);
   rAxis = d3.axisRight().scale(yScale);
   var rScale = d3.scalePow().exponent(0.01).domain([rmax, rmin]).range([1, 10]);

   var sectors = ["Information Technology", "Energy", "Telecommunication Services", "Health Care", "Financials", "Consumer Staples", "Consumer Discretionary", "Industrials", "Materials", "Utilities"];
   for(var i=0; i<sectors.length; ++i) {
     var sector = sectors[i];
     var cs = data.filter(function(d) { return d.Sector == sector });
     canvas = new Canvas("canvas-fdl-"+i,
         width,
         height,
         margins,
         {'x': xScale, 'y': yScale},
         {'bottom': bAxis, 'left': lAxis, 'top': tAxis, 'right': rAxis},
         {'bottom': sector + ": Profits (in %)",
           'left': "Market Value (in Billion $)",
           'top': "",
           'right': ''});
     canvas.render(d3.select("#main-chart"));

     fdl = new FDL('Rank', 'Profits', 'Profits', rScale, cScale, xScale, cs);
     fdl.render(d3.select("#canvas-fdl-" + i + " g"));
   }

   // Add annotations
   var annotations = [
     {'x': 728, 'y': -2605, 'width': 100, 'height': null, 'text': 'Average Profit: <strong>7.99</strong>'},
     {'x': 728, 'y': -2320, 'width': 100, 'height': null, 'text': 'Average Profit: <strong>2.35</strong>'},
     {'x': 728, 'y': -2050, 'width': 100, 'height': null, 'text': 'Average Profit: <strong>4.65</strong>'},
     {'x': 728, 'y': -1780, 'width': 100, 'height': null, 'text': 'Average Profit: <strong>4.33</strong>'},
     {'x': 728, 'y': -1510, 'width': 100, 'height': null, 'text': 'Average Profit: <strong>4.11</strong>'},
     {'x': 728, 'y': -1240, 'width': 100, 'height': null, 'text': 'Average Profit: <strong>3.46</strong>'},
     {'x': 728, 'y': -970, 'width': 100, 'height': null, 'text': 'Average Profit: <strong>3.43</strong>'},
     {'x': 728, 'y': -700, 'width': 100, 'height': null, 'text': 'Average Profit: <strong>2.64</strong>'},
     {'x': 728, 'y': -430, 'width': 100, 'height': null, 'text': 'Average Profit: <strong>2.30</strong>'},
     {'x': 728, 'y': -160, 'width': 100, 'height': null, 'text': 'Average Profit: <strong>1.83</strong>'}
   ];

   annotations.forEach(function(an) {
     var an1 = new Annotation(an.width, an.height, an.x, an.y, an.text);
     an1.render(d3.select("#main-chart-annotations"));
   });

   var colors = ['#b2182b','#ef8a62','#fddbc7','#d1e5f0','#67a9cf','#2166ac'];
   var ranges = [-15, -5, 5, 15, 25, 35, 45];

   var legend = new FDLLegend("Color shows Profits: ", colors, ranges);
   legend.render(d3.select("#main-chart-annotations"));
 });
