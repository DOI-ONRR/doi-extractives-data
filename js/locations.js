(function(exports) {

  var data = exports.data = {
  };

  var prog = progressive();
  d3.select('#progress')
    .call(progressive.bar(prog));

  var get = dl.accessor;

  var dataPath = 'output/';
  queue()
    .defer(prog, d3.csv, 'input/geo/states.csv')
    .defer(prog, d3.json, dataPath + 'geo/us-topology.json')
    .await(function(error, states, topology) {
      if (error) return console.error(error.responseText);

      loaded(data);
    });

  function loaded(data) {
    // TODO
  }

})(this);
