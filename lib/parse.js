// parse dolloar string -> Number or NaN
module.exports.dollars = function(str) {
  str = str.trim(); // trim whitespace
  // "n/a" value
  if (str.substr(-1) === '-') {
    return 0;
  }
  str = str.replace(/\$\s*/, '');
  if (str.charAt(0) === '(') {
    str = str.replace(/\(\s*(.+)\s*\)/, '-$1');
  }
  str = str.replace(/,/g, '');
  return str ? +str : null;
};

module.exports.number = function(str) {
  str = str.trim();
  if (str.charAt(0) === '(') {
    str = str.replace(/\(\s*(.+)\s*\)/, '-$1');
  }
  str = str.replace(/,/g, '');
  return str ? +str : null;
};

// parse dolloar string -> Number or NaN
module.exports.percent = function(str) {
  str = str.trim();
  if (str.charAt(0) === '(') {
    str = str.replace(/\(\s*(.+)\s*\)/, '-$1');
  }
  str = str.replace(/,/g, '');
  str = str.replace(/%/g, '');
  return str ? +str : null;
};

module.exports.units = function(str) {
  var match = str.match(/^(.+)\s\((.+)\)\s*$/) ||
              str.match(/^(.+)\s+-\s+(.+)\s*$/);
  if (match) {
    return [match[1], match[2]];
  } else {
    return [str, ''];
  }
};
