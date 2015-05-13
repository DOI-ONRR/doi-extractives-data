var fs = require('fs');
var rw = require('rw');

module.exports = {
  map: map,
  getter: getter,
  identity: identity,
  readData: readData,
  sequences: sequences,
  readJSON: readJSON,
  trimKeys: trimKeys,
  group: group,
  titleCase: titleCase,
  normalizeCommodity: normalizeCommodity,
  normalizeRevenueType: normalizeRevenueType,
  normalizeOffshoreRegion: normalizeOffshoreRegion,
  range: range
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
  // TODO: use rw.fileReader()?
  var stream = fs.createReadStream(filename);

  if (typeof parse === 'function') {
    stream = parse(stream);
  } else {
    stream = stream.pipe(parse);
  }

  var data = [];
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
  rw.readFile(filename, "utf8", function(error, buffer) {
    if (error) return done(error);
    try {
      var data = JSON.parse(buffer.toString());
    } catch (error) {
      return done(error);
    }
    return done(null, data);
  });
}

function trimKeys(d, keys) {
  if (!keys) keys = Object.keys(d);
  keys.forEach(function(src) {
    var dst = src.trim();
    if (src != dst) {
      d[src.trim()] = d[src];
      delete d[src];
    }
  });
  return d;
}

function group(rows, keys, rollup) {
  var sep = ';;';
  var key = function(d) {
    return keys.map(function(k) {
      return d[k];
    }).join(sep);
  };
  var dict = {};
  rows.forEach(function(d) {
    var k = key(d);
    if (dict.hasOwnProperty(k)) {
      dict[k].push(d);
    } else {
      dict[k] = [d];
    }
  });

  var result = Object.keys(dict)
    .map(function(k) {
      var key = {};
      k.split(sep).forEach(function(v, i) {
        key[keys[i]] = v;
      });
      return {
        key: key,
        values: dict[k]
      };
    });

  if (rollup) {
    return result.map(function(d) {
      return {
        key: d.key,
        length: d.values.length,
        value: rollup(d)
      };
    });
  }
  return result;
}

function titleCase(str) {
  var words = str.split(' ');
  return words.map(function(word) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  }).join(' ');
}

function range(start, end, step) {
  if (!end) {
    start = String(start);
    if (start.indexOf(',') > -1) {
      return start.split(',').reduce(function(r, d) {
        return r.concat(range(d));
      }, []);
    } else if (start.indexOf('-') > -1) {
      var v = start.split('-');
      return range(+v[0], +v[1]);
    }
    return [+start];
  }
  var d = [];
  if (!step) step = 1;
  for (var v = start; v <= end; v += step) {
    d.push(v);
  }
  return d;
}

var commodityMap = {
  'Oil and Gas': 'Oil & Gas',
  'Other Products': 'Other',
  'Other Commodities': 'Other'
};

function normalizeCommodity(str) {
  str = str.trim().replace(/ \(.+\)$/, '');
  return commodityMap[str] || str;
}

var typeMap = {
  'Other Roy Vals': 'Other Royalties',
  'Other Royalty Vals': 'Other Royalties'
};

function normalizeRevenueType(type) {
  type = type.trim();
  return typeMap[type] || type;
}

var regionNameMap = {
  'Alaska- Offshore': 'Alaska',
  'Gulf of Mexico': 'Gulf',
};

function normalizeOffshoreRegion(region) {
  region = region.trim();
  return regionNameMap[region] || region;
}
