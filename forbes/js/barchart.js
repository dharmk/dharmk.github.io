var BarChart = function(width, height, x, y, c, xField, yField, cField, data, selectable, cbk) {
  var tooltip = new Tooltip(d3.select("body"));

  function mouseover(d) {
    var text;
    // Bad hardcoding
    if(d.Company) {
      text = "<strong>" + d.Company + "</strong><br/>"
               + "Profits: <strong>" + d.Profits + "</strong><br/>"
               + "Market Value: <strong>" + d.MarketValue + "</strong><br/>"
               + "Rank: <strong>" + d.Rank + "</strong>";
    } else {
      text = "<strong>" + d.Sector + "</strong><br/>"
               + "Avg Profit: <strong>" + d.Profits + "</strong>";
    }

    tooltip.show(200,
      null,
      d3.event.pageX,
      d3.event.pageY,
      text);

    d3.select(this).attr("fill", "red");
  }

  function mouseout(d) {
    tooltip.hide();
    d3.select(this).attr("fill", c(d[cField]));
  }

  function click(d, i) {
    d3.select(this.parentNode)
      .selectAll(".bar")
      .attr("stroke-width", 0);

    d3.select(this)
      .attr("fill", c(d[cField]))
      .attr("stroke-width", 4).attr("stroke", "black");

    if(cbk)
      cbk(d, i);
  }

  this.render = function(parent) {
    // Select only top 10
    // append the rectangles for the bar chart
    this.data(parent, data);

  }

  this.data = function(parent, data, x1) {
    if(x1) {
      x = x1;
    }
    parent.selectAll(".bar").remove();
    parent.selectAll(".bar-text").remove();

    var bars = parent.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .on('mouseover', mouseover)
        .on('mouseout', mouseout);

      if(selectable) {
        d3.select(".bar")
          .attr("stroke-width", 4).attr("stroke", "black");

        bars.attr("class", "bar selectable")
          .on('click', click);
      }

      bars.transition(3000)
        .ease(d3.easeCubic)
        .attr("x", function(d) {
          return x(d[xField]);
        })
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

        parent.selectAll(".bar-text")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "bar-text")
          .attr("y", function(d) {
            var val = d[yField];
            if(val > 0)
              return y(val);
            return y(0);
          })
          .attr("dx", 50) //margin right
          .attr("dy", "-.35em") //vertical align middle
          .attr("text-anchor", "end")
          .text(function(d) {
              return (d[yField]+"%");
          })
          .attr("x", function(d) {
            return x(d[xField]);
          });
  }
};
