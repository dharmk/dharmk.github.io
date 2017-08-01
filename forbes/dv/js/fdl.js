/**
 * @author Dharmendra Kumar
 * Simple force directed layout
 */
var FDL = function(rField, fField, xField, rScale, cScale, xScale, data) {
  var tooltip = new Tooltip(d3.select("body"));

  function mouseover(d) {
    var text = "<strong>" + d.Company + "</strong><br/>"
              + "Profits: <strong>" + d.Profits + "</strong><br/>"
              + "Market Value: <strong>" + d.MarketValue + "</strong><br/>"
              + "Rank: <strong>" + d.Rank + "</strong>";

    tooltip.show(200,
      null,
      d3.event.pageX,
      d3.event.pageY,
      text);
  }

  function mouseout(d) {
    tooltip.hide();
  }

  this.render = function(parent) {
    var u = parent
      .append("g")
      .attr("transform", "translate(0, " + (height / 2) + ")")
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .merge(parent)
      .attr('r', function(d) {
        if(d[rField])
          return rScale(parseInt(d[rField]));
        return 0;
      })
      .style('fill', function(d) {
        if(d[fField])
          return cScale(parseInt(d[fField]));
        return 0;
      })
      .style('stroke', function(d) {
        return 'black';
      })
      .style('stroke-width', '0.5')
      .attr('cx', function(d) {
        if(d[xField])
          return xScale(parseInt(d[xField]));
        return 0;
      })
      .attr('cy', function(d) {
        return 0;
      })
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

      var simulation = d3.forceSimulation(data)
        .force('x', d3.forceX().x(function(d) {
          if(d[xField])
            return xScale(parseInt(d[xField]));
          return 0;
        }).strength(8))
        .force('y', d3.forceY().y(function(d) {
          return 0;
        }))
        .force('collision', d3.forceCollide().radius(function(d) {
          if(d[rField])
            return rScale(parseInt(d[rField])+20);
          return 0;
        }).strength(1))
        .on('tick', function() {
          u.attr('cy', function(d) {
            return d.y;
          });
          u.attr('cx', function(d) {
            return d.x;
          });
        });
  }
};
