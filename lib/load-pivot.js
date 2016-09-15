var fs = require('fs');
var tito = require('tito').formats;

module.exports = function loadPivotTable(filename, done) {
  var format = filename.split('.').pop();
  var rows = [];
  var columns = [];
  var fill = function(row) {
    var prev = rows[rows.length - 1];
    columns.forEach(function(column) {
      if (!row[column] && prev[column]) {
        row[column] = prev[column];
      }
    });
  };

  return fs.createReadStream(filename)
    .pipe(tito.createReadStream(format))
    .on('error', done)
    .on('data', function(row) {
      if (!rows.length) {
        columns = Object.keys(row);
      } else {
        fill(row);
      }
      rows.push(row);
    })
    .on('end', function() {
      return done(null, rows);
    });
};
