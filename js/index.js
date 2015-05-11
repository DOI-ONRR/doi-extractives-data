(function(exports) {

  var data = exports.data = {
  };

  var commodities = new eiti.data.Commodities();

  var prog = progressive();
  d3.select('#progress')
    .call(progressive.bar(prog));

  var get = dl.accessor;

  var dataPath = 'output/';
  queue()
    .defer(prog, d3.tsv, dataPath + 'national/revenues-yearly.tsv')
    .defer(prog, d3.csv, 'input/geo/states.csv')
    .defer(prog, d3.tsv, dataPath + 'offshore/revenues-yearly.tsv')
    .await(function(error, natlRevenues, states, offshoreRevenues) {
      if (error) return console.error(error.responseText);

      natlRevenues.forEach(function(d) {
        d.Commodity = commodities.getGroup(d.Commodity);
      });

      data.revenues = natlRevenues;

      data.states = states;

      data.locationGroups = [
        {
          label: 'Onshore',
          values: states.map(function(d) {
            return {
              value: 'onshore/' + encodeURIComponent(d.name),
              label: d.name
            };
          })
        },
        {
          label: 'Offshore Regions',
          values: dl.unique(offshoreRevenues, get('Region'))
            .map(function(region) {
              return {
                value: 'offshore/' + encodeURIComponent(region),
                label: region
              };
            })
        },
      ];

      loaded(data);
    });

  function loaded(data) {
    var commodityRevenues = d3.nest()
      .key(get('Commodity'))
      .rollup(function(d) {
        return d3.sum(d, get('Revenue'));
      })
      .entries(data.revenues)
      .map(function(d) {
        d.value = d.values;
        delete d.values;
        return d;
      })
      .sort(dl.comparator('+key'));

    var li = d3.select('ul.list--commodities')
      .selectAll('li')
      .data(commodityRevenues)
      .enter()
      .append('li')
        .attr('class', 'commodity');

    var format = eiti.format.shortDollars;
    li.append('a')
      .attr('href', function(d) {
        return 'commodities.html#/' + encodeURIComponent(d.key);
      })
      .text(get('key'))
      .append('span')
        .attr('class', 'revenue')
        .text(function(d) {
          return ' ' + format(d.value);
        });

    d3.select('.select--locations')
      .on('change', function() {
        if (!this.value) return;
        window.location = 'locations.html#/' + this.value;
      })
      .selectAll('optgroup')
      .data(data.locationGroups)
      .enter()
      .append('optgroup')
        .attr('label', get('label'))
        .selectAll('option')
        .data(get('values'))
        .enter()
        .append('option')
          .attr('value', get('value'))
          .text(get('label'));
  }

})(this);
