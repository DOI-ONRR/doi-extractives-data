var fs = require('fs');

module.exports = {
  map: map,
  getter: getter,
  identity: identity,
  readData: readData,
  sequences: sequences,
  readJSON: readJSON
};

function map(list, key, one) {
  key = getter(key);
  var map = {};
  list.forEach(function(d) {
    var k = key(d);
    if (!one && map.hasOwnProperty(k)) {
      map[k].push(d);
    } else {
      map[k] = one ? d : [d];
    }
  });
  return map;
}

function getter(key) {
  if (!key) return identity;
  else if (typeof key === 'function') return key;
  return function(d) { return d[key]; };
}

function identity(d) {
  return d;
}

function readData(filename, parse, done) {
  var data = [];

  var stream = fs.createReadStream(filename);

  if (typeof parse === 'function') {
    stream = parse(stream);
  } else {
    stream = stream.pipe(parse);
  }

  return stream
    .on('data', function(d) {
      data.push(d);
    })
    .on('error', done)
    .on('end', function() {
      done(null, data);
    });
}

function sequences(lines, offset) {
  offset = offset || 0;
  var len = lines.length;
  if (len < 2) return lines.join(', ');
  var seq = [];
  var l0 = lines[0];
  var last = l0;
  for (var i = 1; i < len; i++) {
    if (lines[i] === last + 1) {
      last = lines[i];
      continue;
    }
    last = lines[i - 1];
    if (l0 === last) {
      seq.push(last + offset);
    } else {
      seq.push([l0 + offset, last + offset].join('-'));
    }
    l0 = last = lines[i];
  }
  if (l0 === last) {
    seq.push(last + offset);
  }
  return seq.join(', ');
}

function readJSON(filename, done) {
  fs.readFile(filename, function(error, buffer) {
    if (error) return done(error);
    try {
      var data = JSON.parse(buffer.toString());
    } catch (error) {
      return done(error);
    }
    return done(null, data);
  });
}
