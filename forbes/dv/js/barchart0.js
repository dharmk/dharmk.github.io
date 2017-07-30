var BarChart = function(width, height, x, y, c, xField, yField, cField, data) {
  this.render = function(parent) {
    // Select only top 10
    // append the rectangles for the bar chart
      parent.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d[xField]); })
          .attr("width", x.bandwidth())
          .attr("y", function(d) {
            var val = d[yField];
            if(val > 0)
              return y(val);
            return y(0);
          })
          .attr("fill", function(d) { return c(d[cField])})
          .attr("height", function(d) {
            var val = d[yField];
            return Math.abs(y(val) - y(0));
          });
  }
};
