(function(exports) {

  var data = exports.data = {
  };

  var path = location.search
    ? decodeURIComponent(location.search.substr(1))
    : null;

  if (path) {
    path = path.slice('/');
    d3.selectAll('.revenue-title')
      .text(path[0]);
  }

  var commodities = new eiti.data.Commodities();

  var body = d3.select('body');

  var prog = progressive();
  d3.select('#progress')
    .call(progressive.bar(prog));

  var get = dl.accessor;

  var dataPath = 'output/';
  queue()
    .defer(prog, d3.tsv, dataPath + 'national/revenues-yearly.tsv')
    .defer(prog, commodities.load, 'data/commodities.json')
    .await(function(error, natlRevenue) {
      if (error) return console.error(error.responseText);

      data.revenue = {
        national: natlRevenue
      };

      loaded(data);
    });

  function loaded(data) {
    // TODO
  }

})(this);
