/**
 * @author Dharmendra Kumar
 * Simple tooltip class
 */
var Tooltip = function(parent) {
  var div = parent
    .append("div")
    .attr("class", "tooltip");

  this.show = function(width, height, x, y, text) {
    div
      .style("left", x + "px")
      .style("top", y + "px")
      .style("visibility", "visible")
      // .style("width", width + "px")
      .html(text);
  }

  this.hide = function() {
    div.style("visibility", "hidden");
  }
}
