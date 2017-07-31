/**
 * @author Dharmendra Kumar
 * Driver code for the force directed graph plot
 */

// Always good to start with some hardcoding :)
var margins = {top: 20, right: 50, bottom: 60, left: 60},
    width = 800,
    height = 200;

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

   canvas = new Canvas("canvas-fdl",
       width,
       height,
       margins,
       {'x': xScale, 'y': yScale},
       {'bottom': bAxis, 'left': lAxis, 'top': tAxis, 'right': rAxis},
       {'bottom': "Profits (in %)",
         'left': "Market Value (in Billion $)",
         'top': "",
         'right': ''});
   canvas.render(d3.select("#main-chart"));

   var rScale = d3.scalePow().exponent(0.01).domain([rmax, rmin]).range([1, 10]);

   var fdl = new FDL('Rank', 'Profits', 'Profits', rScale, cScale, xScale, data);
   fdl.render(d3.select("#canvas-fdl g"));

   // Add annotations
   var annotations = [
     {'x': 80, 'y': -220, 'width': 100, 'height': null, 'text': '15 of the 500 companies in the top 500 list were actually in loss!'},
     {'x': 230, 'y': -70, 'width': 100, 'height': null, 'text': '387 of the 500 companies in the top 500 list (more than 75%) had a profit range between 0-5%.'}
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
