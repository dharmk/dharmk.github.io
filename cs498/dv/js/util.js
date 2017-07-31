/**
 * @author Dharmendra Kumar
 * Utility functions for Data Visualization Task
 */

function readCSV(uri, cbk) {
  d3.csv(uri, function(data) {
    cbk(data);
  })
}

function readJSON(uri, cbk) {
  d3.json(uri, function(data) {
    cbk(data);
  });
}
