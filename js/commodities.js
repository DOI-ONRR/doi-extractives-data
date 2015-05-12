(function(exports) {

  var data = exports.data = {
  };

  var slug = location.search
    ? decodeURIComponent(location.search.substr(1))
    : null;

  var body = d3.select('body');

  if (slug) {
    body.classed('commodity-selected', true);

    var path = decodeURIComponent(slug).split('/');
    d3.select('nav ul.breadcrumb')
      .selectAll('li.dynamic')
      .data(path)
      .enter()
      .append('li')
        .append('a')
          .attr('href', function(d, i) {
            return '?' + path.slice(0, i + 1).join('/');
          })
          .text(dl.identity);
  }

  var commodities = new eiti.data.Commodities();

  var prog = progressive();
  d3.select('#progress')
    .call(progressive.bar(prog));

  var get = dl.accessor;

  var dataPath = 'output/';
  queue()
    .defer(prog, d3.tsv, dataPath + 'national/revenues-yearly.tsv')
    .defer(prog, d3.tsv, dataPath + 'national/volumes-yearly.tsv')
    .defer(prog, commodities.load, 'data/commodities.json')
    .await(function(error, natlRevenue, natlProduction) {
      if (error) return console.error(error.responseText);

      data.revenue = {
        national: natlRevenue
      };

      data.production = {
        national: natlProduction
      };

      loaded(data);
    });

  function loaded(data) {
    // TODO
  }

})(this);
