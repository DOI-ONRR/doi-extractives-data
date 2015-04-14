var assert = require('assert');
var util = require('../lib/util');

describe('util.getter()', function() {
  var get = util.getter;
  it('maps keys', function() {
    assert.equal(get('foo')({foo: 'bar'}), 'bar');
  });
  it('accepts functions', function() {
    var foo = function(d) { return d.foo; };
    assert.equal(get(foo)({foo: 'bar'}), 'bar');
  });
  it('uses identity() if key is falsy', function() {
    assert.equal(get(null)('foo'), 'foo');
  });
});

describe('util.map()', function() {
  var map = util.map;
  it('groups multiple objects', function() {
    var input = [{a: 1, b: 2}, {a: 2, b: 1}];
    assert.deepEqual(map(input, 'a'), {
      1: [input[0]],
      2: [input[1]]
    });
  });
  it('groups single objects with one=true', function() {
    var input = [{a: 1, b: 2}, {a: 2, b: 1}];
    assert.deepEqual(map(input, 'a', true), {
      1: input[0],
      2: input[1]
    });
  });
});

describe('util.readData()', function() {
  var readData = util.readData;
  var tito = require('tito').formats;
  it('reads from tsv', function(done) {
    var read = tito.createReadStream('tsv');
    readData(__dirname + '/data.tsv', read, function(error, data) {
      assert.ok(!error);
      assert.deepEqual(data, [
        {x: 'a', y: 'b', z: 'c'},
        {x: 1, y: 2, z: 3},
      ]);
      done();
    });
  });

  // TODO: test piping stdin w/head
});

xdescribe('util.sequences()', function() {
});

describe('util.readJSON()', function() {
  var readJSON = util.readJSON;
  it('reads JSON', function(done) {
    readJSON(__dirname + '/data.json', function(error, data) {
      assert.ok(!error);
      assert.deepEqual(data, {foo: 'bar'});
      done();
    });
  });
});

describe('util.trimKeys()', function() {
  var trimKeys = util.trimKeys;
  it('trims keys', function() {
    var d = {' foo': 1, 'bar': 2, 'baz \t': 3};
    trimKeys(d);
    assert.deepEqual(d, {foo: 1, bar: 2, baz: 3});
  });
});

describe('util.group()', function() {
  var group = util.group;
  it('groups on one key', function() {
    var data = [
      {foo: 1, bar: 2},
      {foo: 2, bar: 3},
      {foo: 1, bar: 4}
    ];
    assert.deepEqual(group(data, ['foo']), [
      {
        key: {foo: 1},
        values: [
          data[0],
          data[2]
        ]
      },
      {
        key: {foo: 2},
        values: [
          data[1]
        ]
      }
    ]);
  });

  it('groups on multiple keys', function() {
    var data = [
      {foo: 1, bar: 2},
      {foo: 2, bar: 3},
      {foo: 1, bar: 4}
    ];
    assert.deepEqual(group(data, ['foo', 'bar']), [
      {
        key: data[0],
        values: [data[0]]
      },
      {
        key: data[1],
        values: [data[1]]
      },
      {
        key: data[2],
        values: [data[2]]
      }
    ]);
  });

  it('rolls up groups', function() {
    var data = [
      {foo: 1, bar: 2},
      {foo: 2, bar: 3},
      {foo: 1, bar: 4}
    ];
    var count = function(d) { return d.values.length; };
    assert.deepEqual(group(data, ['foo'], count), [
      {
        key: {foo: 1},
        value: 2
      },
      {
        key: {foo: 2},
        value: 1
      }
    ]);
  });
});

describe('util.range()', function() {
  var range = util.range;
  it('returns a single number', function() {
    assert.deepEqual(range(2001), [2001]);
  });
  it('returns a range of number', function() {
    assert.deepEqual(range(2001, 2006), [2001, 2002, 2003, 2004, 2005, 2006]);
  });
  it('returns a sequence of numbers', function() {
    assert.deepEqual(range('2001,2006'), [2001, 2006]);
  });
  it('parses mixed sequences and ranges', function() {
    assert.deepEqual(range('2001,2006-2008'), [2001, 2006, 2007, 2008]);
  });
});
