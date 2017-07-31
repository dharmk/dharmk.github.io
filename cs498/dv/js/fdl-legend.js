/**
 * @author Dharmendra Kumar
 * Legends for the FDL Code
 * This code hasnt been refactored to make use of the utility classes
 */

 var FDLLegend = function(colorText, colors, ranges, sizeText, sizes) {
   this.render = function(parent) {
     var u = parent.append("svg")
      .attr("width", "100%")
      .attr("height", "80")
      .append("g")
      .attr("transform", "translate(125, 20)");

      u.append("text")
      .text(colorText);

      u = u.append("g")
        .attr("class", "g-key-color")
        .attr("transform", "translate(100,-7)");

      var w = 40;
      colors.forEach(function(c, i) {
        u.append("rect")
          .attr("height", 8)
          .attr("width", w)
          .attr("fill", c)
          .attr("x", i*w);
      });

      ranges.forEach(function(c, i) {
        u.append("g")
          .attr("class", "tick major")
          .attr("transform", "translate(" + i*w + ", 0)")
          .append("text")
          .attr("y", 16)
          .attr("x", 0)
          .attr("dy", ".71em")
          .text(c);
      });

      u.append("g")
        .attr("transform", "translate(280, 7)")
        .append("text")
        .text("sizes show rank: bigger sizes means higher rank");
   }
 }
