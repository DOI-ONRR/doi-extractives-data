var assert = require('assert');
var parse = require('../lib/parse');

describe('parse.dollars()', function() {
  var dollars = parse.dollars;
  it('parses numeric strings', function() {
    assert.equal(dollars('1,234.56'), 1234.56);
  });
  it('parses dollar strings', function() {
    assert.equal(dollars('$1,234,567.89'), 1234567.89);
  });
  it('parses strings with copious whitespace', function() {
    assert.equal(dollars(' $ 1,234.56 '), 1234.56);
  });
  it('parses negative strings in parentheses', function() {
    assert.equal(dollars(' $ (3,790.83)'), -3790.83);
  });
  it('parses n/a values ("$ -")', function() {
    assert.equal(dollars(' $ -'), 0);
  });
});
