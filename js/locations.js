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
    .defer(mapLoaded)
    .await(function(error) {
      if (error) return console.error(error.responseText);
      loaded(data);
    });

  function mapLoaded(done) {
    if (map.property('loaded')) {
      return done();
    }
    map.on('load', done);
  }

  function loaded(data) {
    var region = map.selectAll('g.region');
    region.select('a')
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
