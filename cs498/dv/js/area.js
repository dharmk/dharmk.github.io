/**
 * @author Dharmendra Kumar
 * Simple area chart
 */
var AreaChart = function(data, xScale, yScale, xField, yField, clazz) {
  this.data = data;
  var tooltip = new Tooltip(d3.select("body"));
  var svg;

  this.render = function(parent) {
    var area = d3.area()
      .x(function(d) { return xScale(parseFloat(d[xField])); })
      .y0(yScale(0))
      .y1(function(d) {
        return yScale(parseFloat(d[yField]));
      });

    // add the area
    svg = parent.append('g')
        .append("path")
        .data([this.data])
        .attr("class", "area-chart " + clazz)
        .attr("d", area)
        .on('mousemove', mouseover)
        .on('mouseout', mouseout);
  }

  function mouseover(d) {
    // Bad hardcoding
    var coordinates = d3.mouse(svg.node());
    var rank = parseInt(xScale.invert(coordinates[0]));
    if(rank > 0 && rank <= 500) {
      var d = data[rank];
      if(d) {
        var text = "<strong>" + d.Company + "</strong>"
          + "<br/>Rank: <strong>" + d.Rank + "</strong>"
          + "<br/>Profit: <strong>" + d.Profits + "</strong>"
          + "<br/>MarketValue: <strong>" + d.MarketValue + "</strong>"
          + "<br/>Assets: <strong>" + d.Assets + "K</strong>"
          + "<br/>Sale: <strong>" + d.Sales + "</strong>";

        tooltip.show(200,
          null,
          d3.event.pageX,
          d3.event.pageY,
          text);
      }
    }
  }

  function mouseout(d) {
    tooltip.hide();
  }
}
