/**
 * @author Dharmendra Kumar
 * Driver code for the insights into the forbes 500 list
 */

// Always good to start with some hardcoding :)
 var margins = {top: 20, right: 50, bottom: 60, left: 60},
     width = 800,
     height = 200;

readCSV('./data/forbes_500_full.csv', function(data) {
  var params = ["MarketValue", "Assets", "Sales", "Profits"];
  var clazzes = ['market-value', 'assets', 'sales', 'profits'];
  var labels = ['MarketValue (in Billion $)', 'Assets (in Billion $)', 'Sales (in Billion $)', 'Profits (in %)'];
  var scales = {};

  var xmax = d3.max(data, function(d) { return parseInt(d.Rank); });
  var xmin = d3.min(data, function(d) { return parseInt(d.Rank); });
  var xScale = d3.scaleLinear().domain([xmin, xmax]).range([0, width]).nice();
  var bAxis = d3.axisBottom().scale(xScale);
  var tAxis = d3.axisTop().scale(xScale);

  params.forEach(function(p, i) {
   var ymax = d3.max(data, function(d) { return parseInt(d[p]); });
   var ymin = d3.min(data, function(d) { return parseInt(d[p]); });
   var yScale = d3.scaleLinear().domain([ymax, ymin]).range([0, height]).nice();

   scales[p] = yScale;

   var lAxis = d3.axisLeft().scale(yScale);
   var rAxis = d3.axisRight().scale(yScale);

   var canvas = new Canvas("canvas" + p,
       width,
       height,
       margins,
       {'x': xScale, 'y': yScale},
       {'bottom': bAxis, 'left': lAxis, 'top': tAxis, 'right': rAxis},
       {'bottom': "Company Rankings",
         'left': labels[i],
         'top': "",
         'right': ''});
   canvas.render(d3.select("#main-chart"));

   var areaChart = new AreaChart(data, xScale, yScale, 'Rank', p, clazzes[i]);
   areaChart.render(d3.select("#canvas" + p + " g"));
  });
});
