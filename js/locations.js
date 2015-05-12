(function(exports) {

  var data = exports.data = {
  };

  var place = location.search
    ? decodeURIComponent(location.search.substr(1))
    : null;

  var body = d3.select('body')
    .classed('place-selected', !!place);

  var title = d3.selectAll('.place-title')
    .style('display', place ? null : 'none')
    .text(place);

  var map = d3.select('#regions');

  var prog = progressive();
  d3.select('#progress')
    .call(progressive.bar(prog));

  var get = dl.accessor;

  var dataPath = 'output/';
  queue()
    .defer(prog, d3.csv, 'input/geo/states.csv')
    .defer(prog, d3.tsv, dataPath + 'state/revenues-yearly.tsv')
    .defer(mapLoaded)
    .await(function(error, states, revenues) {
      if (error) return console.error(error.responseText);

      data.states = states;

      data.revenuesByState = d3.nest()
        .key(dl.accessor('State'))
        .rollup(function(d) {
          return d3.sum(d, dl.accessor('Revenue'));
        })
        .map(revenues);

      loaded(data);
    });

  function mapLoaded(done) {
    if (map.property('loaded')) {
      return done();
    }
    map.on('load', done);
  }

  function loaded(data) {
    var abbrName = d3.nest()
      .key(dl.accessor('abbr'))
      .rollup(function(d) { return d[0].name; })
      .map(data.states);

    var region = map.selectAll('g.region');

    region.filter(function(d) {
        return d.properties.onshore;
      })
      .each(function(d) {
        var abbr = d.properties.abbr;
        if (!abbr) return console.warn('no state:', d.properties);
        d.revenue = data.revenuesByState[abbr];
        d.properties.name = abbrName[abbr];
      })
      .classed('active', function(d) {
        return !!d.revenue;
      });

    region.filter('.active')
      .select('a')
        .attr('xlink:href', function(d) {
          // if (d.properties.offshore) console.log(d.properties);
          return [
            '?',
            d.properties.offshore ? 'offshore' : 'onshore',
            '/',
            // FIXME: offshore areas don't all have IDs!
            encodeURIComponent(d.properties.name || d.id || '__NO_ID__')
          ].join('');
        });
  }

})(this);
