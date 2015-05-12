(function(exports) {

  var data = exports.data = {
  };

  var slug = location.search && location.search.length > 1
    ? location.search.substr(1)
    : null;

  var body = d3.select('body');

  if (slug) {
    body.classed('place-selected', true);

    var path = decodeURIComponent(slug).split('/');
    var offshore = path.shift();
    var prefix = '?' + offshore + '/';
    d3.select('nav ul.breadcrumb')
      .selectAll('li.dynamic')
      .data(path)
      .enter()
      .append('li')
        .append('a')
          .attr('href', function(d, i) {
            return prefix + path.slice(0, i + 1).join('/');
          })
          .text(dl.identity);
  }

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
        d.slug = [
          d.properties.offshore ? 'offshore' : 'onshore',
          encodeURIComponent(d.properties.name || d.id)
        ].join('/');
      })
      .classed('enabled', function(d) {
        return !!d.revenue;
      })
      .classed('selected', function(d) {
        return d.slug === slug;
      });

    region.filter('.enabled')
      .select('a')
        .attr('xlink:href', function(d) {
          return '?' + d.slug;
        });
  }

})(this);
