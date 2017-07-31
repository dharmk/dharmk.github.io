/**
 * @author Dharmendra Kumar
 * Simple annotation class
 */
var Annotation = function(width, height, x, y, text) {
  var div;

  this.render = function(parent) {
    div = parent
      .append("div")
      .attr("class", "annotation")
      .style("left", x + "px")
      .style("width", width + "px")
      .html(text);

    if(height) {
      div.style("height", height + "px");
    }

    if(y) {
      div.style("top", y + "px");
    }
  }

  this.text = function(text) {
    div.html(text);
  }
}
