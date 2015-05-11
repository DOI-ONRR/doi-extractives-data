(function(exports) {

  var data = exports.data = {
  };

  var prog = progressive();
  d3.select('#progress')
    .call(progressive.bar(prog));

  var get = dl.accessor;

  var dataPath = 'output/';
  queue()
    .defer(prog, d3.tsv, dataPath + 'national/revenues-yearly.tsv')
    .defer(prog, d3.tsv, dataPath + 'national/volumes-yearly.tsv')
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
