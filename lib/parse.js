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
  return +str.replace(/,/g, '');
};
