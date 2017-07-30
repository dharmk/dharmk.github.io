/**
 * @author Dharmendra Kumar
 * Utility class for adding canvas (axis + labels) for data visualization
 * This is a very crude implementation and needs some refactoring
 * Its created on an ad-hoc basis for completing the CS 598 project work
 */
var Canvas = function(id, width, height, margins, scales, axes, axeslabels, axesmargins, xlinear = true, ylinear = true) {
  this.margins = margins;
  this.originalWidth = width;
  this.originalHeight = height;

  this.width = width + margins.left + margins.right;
  this.height = height + margins.top + margins.bottom;

  //hard-coded
  this.labelsize = 20;

  if(axesmargins) {
    this.axesmargins = axesmargins;
    this.width = this.width + axesmargins.left + axesmargins.right;
    this.height = this.height + axesmargins.top + axesmargins.bottom;
  }

  if(axeslabels) {
    this.axeslabels = axeslabels;
  } else {
    this.axeslabels = {top: "", right: "", bottom: "", left: ""};
  }

  this.render = function(parent) {
    var chart = parent
      .append("svg")
        .attr('id', id)
        .attr("class", "main-canvas")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
        .attr("transform", "translate(" + this.margins.left + ", " + this.margins.top + ")");

      var x = scales.x;
      var y = scales.y;

      var tAxis = axes.top;
      var bAxis = axes.bottom;
      var rAxis = axes.right;
      var lAxis = axes.left;

      if(xlinear) {
        chart.selectAll("line.x")
          .data(x.ticks(10))
          .enter().append("line")
          .attr("class", "x")
          .attr("x1", x)
          .attr("x2", x)
          .attr("y1", 0)
          .attr("y2", this.originalHeight)
          .attr("stroke-dasharray", "1, 1")
          .style("stroke", "#ccc");

          if(tAxis) {
            chart.append('g')
              .attr("class", "axis-top")
              .call(tAxis);
          }
      }

      if(axeslabels.top) {
        chart.append("text")
            .attr("transform",
                  "translate(" + (width/2) + " ," +
                                 (0 - this.margins.top + this.labelsize) + ")")
            .attr("class", "axis-top-label axis-label")
            .text(axeslabels.top);
      }      

      if(bAxis) {
        if(xlinear) {
          chart.append('g')
            .attr("class", "axis-bottom")
            .attr('transform', 'translate(0, ' + this.originalHeight + ')')
            .call(bAxis);
        }

        chart.append("text")
            .attr("transform",
                  "translate(" + (width/2) + " ," +
                                 (height + this.margins.bottom - this.labelsize) + ")")
            .attr("class", "axis-bottom-label axis-label")
            .text(axeslabels.bottom);
      }

      if(ylinear) {

        // Draw Y-axis grid lines
        chart.selectAll("line.y")
          .data(y.ticks(10))
          .enter().append("line")
          .attr("class", "y")
          .attr("x1", 0)
          .attr("x2", this.originalWidth)
          .attr("y1", y)
          .attr("y2", y)
          .attr("stroke-dasharray", "1, 1")
          .style("stroke", "#ccc");

          if(rAxis) {
            chart.append('g')
              .attr("class", "axis-right")
              .attr('transform', 'translate(' + this.originalWidth + ', 0)')
              .call(rAxis);

            // chart.append("text")
            //     .attr("transform", "rotate(-90)")
            //     .attr("y", this.width - this.margins.right - this.labelsize)
            //     .attr("x", 0 - (height / 2))
            //     .attr("dy", "1em")
            //     .attr("class", "axis-right-label axis-label")
            //     .text(axeslabels.right);
          }
      }

      if(lAxis) {
        if(ylinear) {
          chart.append('g')
            .attr("class", "axis-left")
            .call(lAxis);

          chart.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - this.margins.left)
              .attr("x", 0 - (height / 2))
              .attr("dy", "1em")
              .attr("class", "axis-left-label axis-label")
              .text(axeslabels.left);
        }
      }
    }
  }
