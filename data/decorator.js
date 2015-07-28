var Festoon = require('festoon');
var path = __dirname;

console.warn('data/decorate path:', path);

module.exports = new Festoon({
  path: path,
  sources: {
    // master resources (commodities) list, plus other metadata
    resources:  'commodities.json',

    // single resource: {slug, name, colors, (sub-)commodities}
    resource: Festoon.transform('resources', function(resources, params) {
      var slug = params.resource;
      // console.log('**** resource:', slug);
      if (slug === 'all') {
        return {slug: slug, name: 'All'};
      } else if (!resources.groups[slug]) {
        return null;
      }
      return {
        slug: slug,
        name: resources.groups[slug],
        colors: resources.colors[slug],
        commodities: Object.keys(resources.commodities)
          .map(function(name) {
            return resources.commodities[name].group === slug;
          })
      };
    }),

    locations: {
      onshore: '#states',
      offshore: '#offshoreAreas'
    },

    // revenues
    nationalRevenue: {
      onshore: '#stateRevenues',
      offshore: '#offshoreRevenues'
    },

    // production volumes
    nationalProduction: {
      onshore: '#stateProduction',
      offshore: '#offshoreProduction'
    },

    // state data sources
    states: 'input/geo/states.csv',
    state: {
      // {{ state.meta.name }}
      meta: Festoon.findByParam('states', 'state', 'abbr'),
      // {{ state.revenues[] }}
      revenues: Festoon.transform.filter('stateRevenues', function(d) {
        return d.State === this.state;
      }),
      // {{ state.production[] }}
      production: Festoon.transform.filter('stateProduction', function(d) {
        return d.State === this.state;
      })
    },

    // topology: 'geo/us-topology.json',

    counties: 'output/county/by-state/:state/counties.tsv',

    allCounties: 'output/county/counties.tsv',

    county: {
      name: function(params, done) {
        return done(null, params.county);
      },
      revenues: Festoon.transform.filter('countyRevenues', function(d) {
        return d.County === this.county;
      })
    },

    areas: '#offshoreAreas',
    area: '#offshoreArea',

    // offshore planning areas
    offshoreAreas: 'input/geo/offshore/areas.tsv',
    offshoreArea: {
      // {{ area.meta.name }}
      meta: Festoon.findByParam('offshoreAreas', 'area', 'id'),
      // {{ area.revenues[] }}
      // TODO: Area column should be a 3-letter ID, not name
      revenues: Festoon.transform.filter('offshoreRevenues', function(d) {
        return d.Area === this.area;
      }),
      // {{ area.production[] }}
      // TODO: Area column should be a 3-letter ID, not name
      production: Festoon.transform.filter('offshoreProduction', function(d) {
        return d.Area === this.area;
      })
    },

    // state (onshore) sources
    stateRevenues:      'output/state/revenues.tsv',
    stateProduction:    'output/state/production.tsv',

    // county data sources
    countyRevenues:     'output/county/by-state/:state/revenues.tsv',
    allCountyRevenues:  'output/county/revenues.tsv',

    // offshore (planning area) sources
    offshoreRevenues:   'output/offshore/revenues.tsv',
    offshoreProduction: 'output/offshore/production.tsv',
  }
});
