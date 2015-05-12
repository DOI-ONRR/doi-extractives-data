(function(exports) {

  var data = exports.data = {
  };

  var commodity = location.search
    ? decodeURIComponent(location.search.substr(1))
    : null;

  var body = d3.select('body')
    .classed('commodity-selected', !!commodity);

  var title = d3.selectAll('.commodity-title')
    .style('display', commodity ? null : 'none')
    .text(commodity);

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
