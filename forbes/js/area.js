/**
 * @author Dharmendra Kumar
 * Simple area chart
 */
var AreaChart = function(data, xScale, yScale, xField, yField, clazz) {
  this.data = data;

  this.render = function(parent) {
    var area = d3.area()
      .x(function(d) { return xScale(parseInt(d[xField])); })
      .y0(yScale(0))
      .y1(function(d) {
        return yScale(parseInt(d[yField]));
      });

    // add the area
    parent.append('g')
        .append("path")
        .data([this.data])
        .attr("class", "area-chart " + clazz)
        .attr("d", area);
  }
}
