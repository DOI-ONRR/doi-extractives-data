(function(exports) {

  var app = exports.app = {

    // replacements for standard URL path components in the
    // breadcrumb nav
    pathTitles: {
      'index':        'Home',
      'commodities':  'Resources',
      'locations':    'Locations',
      'production':   'Production',
      'revenue':      'Revenue',
      'onshore':      false,
      'offshore':     false
    },

    // these are turned into objects in the form {name, slug}
    // in app.loadCommodities()
    commodityGroups: [
      'Oil & Gas',
      'Coal',
      'Hard Minerals',
      'Renewables'
    ],

    years: [2004, 2013],

    // all data URLs provided to load() will be prefixed with this
    // path unless they start with "./"
    dataPath: 'output/',

    /**
     * initialize the app
     */
    init: function(routes) {
      /**
       * the default app routes
       */
      if (!routes) {
        routes = {
          '/index': showIndex,

          '/commodities':             listCommodities,
          '/commodities/:commodity':  showCommodity,

          '/commodities/:commodity/onshore/:state':         showCommodityForState,
          '/commodities/:commodity/onshore/:state/:county': showCommodityForCounty,
          '/commodities/:commodity/offshore/:region':       showCommodityForOffshoreRegion,
          '/commodities/:commodity/offshore/:region/:area': showCommodityForOffshoreArea,

          '/revenue':             showRevenue,
          '/revenue/:commodity':  showCommodityRevenue,

          '/production':                      showProduction,
          '/production/:commodity':           listCommodityProducts,
          '/production/:commodity/:product':  showCommodityProduct,

          '/locations':                         listLocations,
          '/locations/onshore/:state':          showState,
          '/locations/onshore/:state/:county':  showCounty,
          '/locations/offshore/:region':        showOffshoreRegion,
          '/locations/offshore/:region/:area':  showOffshoreArea,
        };
      }

      // create the router
      app.router = new Router(routes)
        .configure({
          async: true,
          before: app.beforeRoute,
          on:     app.onRoute,
          after:  app.afterRoute,
          notfound: app.notFound
        });

      // set up d3 selections for the important page elements
      var root = app.root = d3.select('#app');
      app.status = root.select('#status');
      app.sections = root.selectAll('#index, section.primary')
        .datum(function() {
          return this.id;
        });
      app.description = root.select('.page-description');
      app.breadcrumb = root.select('nav ul.breadcrumb');

      var slider = root.select('#year-slider')
        .attr('min', app.years[0])
        .attr('max', app.years[1])
        .attr('value', app.years[1]);

      app.yearSlider = slider;

      var x = d3.scale.linear()
        .domain(app.years)
        .rangeRound([0, 100]);

      var ticks = slider.selectAll('.tick')
        .data(d3.range(app.years[0], app.years[1] + 1))
        .enter()
        .append('div')
          .attr('class', 'tick')
          .style('left', function(y) {
            return x(y) + '%';
          });
      ticks.append('span')
        .attr('class', 'label')
        .text(dl.identity);

      var updateTicks = function() {
        var year = this.value;
        ticks.classed('selected', function(y) {
          return y == year;
        });
      };
      slider.on('change.ticks', updateTicks);
      slider.each(updateTicks);

      // initialize the route, default to the index
      app.router.init('/index');
    },

    // a list of outbound requests initiated via load()
    requests: [],

    // the eiti.data.Commodities instance used for grouping
    commodities: null,

    /**
     * load one or more URLs in parallel, detecting the format based
     * on the file extension (e.g. '.csv', '.tsv', '.json').
     */
    load: function(urls, done) {
      // app.cancelAll();

      var q = queue();
      var keys;

      if (typeof urls !== 'object') {
        urls = [urls];
      }

      var defer = function(url) {
        if (typeof url === 'function') {
          return q.defer(function(next) {
          });
        }
        if (url.indexOf('./') !== 0) url = app.dataPath + url;
        var ext = url.split('.').pop();
        var load = d3[ext];
        q.defer(function(next) {
          var req = load(url, next);
          app.requests.push(req);
        });
      };

      if (Array.isArray(urls)) {
        urls.forEach(defer);
      } else {
        keys = Object.keys(urls);
        keys.forEach(function(key) {
          defer(urls[key]);
        });
      }

      app.root
        .classed('loaded', false)
        .classed('error', false)
        .classed('loading', true);
      return q.await(function(error) {
        app.root
          .classed('loaded', true)
          .classed('error', !!error)
          .classed('loading', false);
        app.requests = [];

        if (keys) {
          var data = {};
          var args = [].slice.call(arguments, 1);
          keys.forEach(function(key, i) {
            data[key] = args[i];
          });
          done.call(this, error, data);
        } else {
          done.apply(this, arguments);
        }
      });
    },

    /**
     * cancel all outbound requests made with load()
     */
    cancelAll: function() {
      while (app.requests.length) {
        var req = app.requests.shift();
        if (req.abort) req.abort();
      }
    },

    /**
     * this function executes asynchronously before each route, and
     * allows us to load generally required assets (such as the
     * commodity groupings) as needed.
     */
    beforeRoute: function() {
      console.info('[app] before route:', app.router.getRoute(), arguments);
      app.root.attr('data-path', location.hash.substr(1));
      var path = app.router.getRoute();
      app.updatePath(path);
      var next = last(arguments);
      // always get the commodity configuration before
      // running a route
      app.loadCommodities(next);
    },

    /**
     * this runs after the current route was executed, and is used
     * to update the nav and any other URL-specific elements on the
     * page.
     */
    onRoute: function() {
      console.info('[app] on route:', arguments);
      var path = app.router.getRoute();
      app.updatePath(path);
      var next = last(arguments);
      next();
    },

    /**
     * this runs after a route is pushed onto the stack.
     */
    afterRoute: function() {
      console.info('[app] after route:', arguments);
      // each view that cares about the year should add
      // a 'change' event handler, which should be exclusive
      app.yearSlider.on('change', null);
      var next = last(arguments);
      next();
    },

    /**
     * this is the 404 handler, which redirects to the index
     */
    notFound: function(next) {
      console.error('[app] 404', location.hash);
      // alert('404: ' + location.hash);
      app.router.setRoute('/index');
    },

    /**
     * update the breadcrumb nav with the components in the provided
     * path Array.
     */
    updatePath: function(path) {
      app.sections
        .style('display', 'none')
        .classed('active', function(id) {
          return id === path[0];
        })
        .filter('.active')
          .style('display', null);

      if (path[0] === 'index') path.shift();


      var ul = app.breadcrumb;
      var li = ul.selectAll('li.sub')
        .data(path);
      li.exit().remove();
      li.enter().append('li')
        .attr('class', 'sub')
        .append('a');
      li.select('a')
        .attr('href', function(part, i) {
          return '#/' + path.slice(0, i + 1).join('/');
        })
        .text(function(part) {
          return typeof part === 'object'
            ? part.text || part.value
            : app.pathTitles[part] || part;
        });

      // prune "hidden" path components
      // (namely, 'onshore' and 'offshore')
      li.filter(function(part) {
        return app.pathTitles[part] === false;
      })
      .remove();
    },

    loadCommodities: function(done) {
      if (app.commodities) return done();
      app.commodities = new eiti.data.Commodities();
      app.commodities.load('data/commodities.json', function(error, commodity) {

        var slugs = reverseLookup(commodity.groups);
        for (var slug in commodity.groups) {
          app.pathTitles[slug] = commodity.groups[slug];
        }

        app.commodityGroups = app.commodityGroups.map(function(name) {
          return {
            name: name,
            slug: slugs[name]
          };
        });

        done();
      });
    },
  };

  function showIndex(next) {
    console.log('[route] index');

    var root = app.root.select('#index');
    if (root.classed('loaded')) {
      // already loaded
      return next(null, root);
    } else {
      loadLocations(function(error, groups) {

        var list = root.select('.select--locations')
          .call(locationSelector()
            .groups(groups))
          .on('change', function() {
            if (!this.value) return;
            app.router.setRoute(this.value);
          });

        root.select('ul.list--commodities')
          .selectAll('li')
          .data(app.commodityGroups)
          .enter()
          .append('li')
            .append('a')
              .attr('href', dl.template('#/commodities/{{ slug }}'))
              .text(dl.accessor('name'));

        root.classed('loaded', true);
        return next(null, root);
      });
    }
  }

  var listCommodities = (function() {
    var data, root, sections;

    function update() {
      var year = app.yearSlider.property('value');
      var filter = function(d) { return d.Year == year; };

      var revenues = data.revenues.filter(filter);
      var production = data.production.filter(filter);
      var stateRevenues = data.stateRevenues.filter(filter);

      var revenuesByCommodity = d3.nest()
        .key(dl.accessor('CommodityGroup'))
        .rollup(sumRevenues)
        .map(revenues);

      var productsByCommodity = d3.nest()
        .key(dl.accessor('CommodityGroup'))
        .rollup(function(d) {
          return countUnique(d, 'Product');
        })
        .map(production);

      var stats = sections.select('table.stats');
      stats.select('.stat__revenue')
        .call(rebind)
        .text(function(d) {
          return eiti.format.shortDollars(revenuesByCommodity[d.name]);
        });

      stats.select('.stat__products')
        .call(rebind)
        .datum(function(d) {
          return productsByCommodity[d.name];
        })
        .text(function(products) {
          return products
            ? pluralize(products, ' product')
            : '(no products)';
        })
        // unset the href attribute on links without products
        .filter(function(products) {
            return this.nodeName === 'A' && !products;
          })
          .attr('href', null);

      var index = d3.nest()
        .key(dl.accessor('CommodityGroup'))
        .key(dl.accessor('State'))
        .rollup(sumRevenues)
        .map(stateRevenues);
      // console.log('revenues index:', index);

      var detail = sections.select('.detail');

      detail.select('region-map')
        .call(whenLoaded, function(d) {
          // console.log('region map:', index[d.name]);

          var revenuesByState = index[d.name] || {};
          var regions = d3.select(this)
            .selectAll('g.region')
            .each(function(f) {
              return f.revenue = revenuesByState[f.id];
            })
            .classed('active', function(f) {
              return !!f.revenue;
            });

          var hrefTemplate = dl.template('#/commodities/{{ slug }}/%')(d);
          regions.select('a')
            .attr('xlink:href', function(f) {
              return getFeatureHref(f, hrefTemplate);
            });

          regions.select('path');
        });
    }

    return function listCommodities(next) {
      console.log('[route] list commodities');

      root = app.root.select('#commodities')
        .classed('commodity-selected', false);

      if (data) {
        app.yearSlider.on('change', update);
        update();
        return next(null, root);
      } else {
        app.load({
          revenues: 'national/revenues-yearly.tsv',
          production: 'national/volumes-yearly.tsv',
          stateRevenues: 'state/revenues-yearly.tsv',
        }, function(error, _data) {

          root.classed('loaded', true);

          sections = createCommoditySections(
              root.select('section.list--commodities')
            )
            .attr('id', dl.template('commodities/{{ slug }}'));

          _data.revenues.forEach(setCommodityGroup);
          _data.production.forEach(setCommodityGroup);
          _data.stateRevenues.forEach(setCommodityGroup);

          data = _data;

          console.warn('+ add change listener');
          app.yearSlider.on('change', update);
          update();

          return next(null, root);
        });
      }
    };
  })();

  function showCommodity(commodity, next) {
    listCommodities(function(error, root) {
      console.log('[route] show commodity:', commodity);

      root.classed('commodity-selected', true);

      var section = root.selectAll('section.commodity')
        .classed('selected', function(d) {
          return d.slug === commodity;
        })
        .filter('.selected');

      return next(null, root);
    });
  }

  function showRevenue(next) {
    console.log('[route] show revenues');
    var root = app.root.select('#revenue')
        .classed('commodity-selected', false);
    if (root.classed('loaded')) {
      return next(null, root);
    } else {
      app.load([
        'national/revenue-yearly.tsv'
      ], function(error, revenues) {

        var sections = createCommoditySections(
            root.select('section.list--commodities')
          )
          .attr('id', dl.template('revenue/{{ slug }}'));

        root.classed('loaded', true);
        return next(null, root);
      });
    }
  }

  function showCommodityRevenue(commodity, next) {
    console.log('[route] show commodity revenues:', commodity);
    showRevenue(function() {
      var root = app.root.select('#revenue')
        .classed('commodity-selected', true);
      root.selectAll('section.commodity')
        .classed('selected', function(d) {
          return d.slug === commodity;
        });
      return next(null, root);
    });
  }

  function showProduction(next) {
    console.log('[route] show production');
    var root = app.root.select('#production')
        .classed('commodity-selected', false);
    if (root.classed('loaded')) {
      return next(null, root);
    } else {
      app.load([
        'national/volumes-yearly.tsv'
      ], function(error, production) {

        var sections = createCommoditySections(
            root.select('section.list--commodities')
          )
          .attr('id', dl.template('production/{{ slug }}'));

        production.forEach(setCommodityGroup);

        var productsByCommodity = d3.nest()
          .key(dl.accessor('CommodityGroup'))
          .rollup(d3.nest()
            .key(dl.accessor('Product'))
            .rollup(function(d) {
              return sum(d, 'Volume');
            })
            .entries)
          .map(production);

        var products = sections.select('ul.list--products')
          .selectAll('li')
          .data(function(d) {
            return productsByCommodity[d.name].map(function(p) {
              var product = parseProductName(p.key, d.name);
              return {
                commodity: d,
                product: {
                  name: product.name,
                  slug: slugify(product.name),
                  units: product.units,
                  volume: p.values
                }
              };
            });
          })
          .enter()
          .append('li')
            .append('a')
              // .each(function(d) { console.log(d); })
              .attr('href', dl.template('#/production/{{ commodity.slug }}/{{ product.slug }}'))
              .text(dl.accessor('product.name'))
              .append('span')
                .attr('class', 'product__volume')
                .html(function(d) {
                  return [
                    ' &mdash;',
                    eiti.format.metric(d.product.volume),
                    d.product.units
                  ].join(' ');
                });


        root.classed('loaded', true);
        return next(null, root);
      });
    }
  }

  function listCommodityProducts(commodity, next) {
    console.log('[route] list commodity products');
    return showProduction(function(error, root) {
      root.classed('commodity-selected', true);
      root.selectAll('section.commodity')
        .classed('selected', function(d) {
          return d.slug === commodity;
        });
      return next(null, root);
    });
  }

  function showCommodityProduct(commodity, product, next) {
    console.log('[route] show commodity product:', commodity, product);
    return listCommodityProducts(commodity, function(error, root) {
      // TODO: select the product
      return next(null, root);
    });
  }

  var listLocations = (function() {
    var root, map, list, revenuesByYear;

    function activate(next) {
      // select the active one
      var value = '/' + app.router.getRoute().join('/');
      list.property('value', value);

      map.node().zoomTo(null, 400);

      app.yearSlider.on('change', update);
      update();
      return next(null, root);
    }

    function update() {
      var year = app.yearSlider.property('value');
      var revenuesByState = revenuesByYear[year];

      var region = map.selectAll('g.region')
        .each(function(d) {
          d.href = getFeatureHref(d, '#/locations/%');
          d.selected = d.href === location.hash;
          d.revenue = revenuesByState[d.id];
        })
        .classed('active', function(d) {
          return d.revenue;
        })
        .classed('selected', function(d) {
          return d.selected;
        });

      region.select('a')
        .attr('xlink:href', function(d) {
          return d.href;
        });
    }

    return function listLocations(next) {
      console.log('[route] list locations');

      root = app.root.select('#locations');
      map = root.select('region-map');

      if (revenuesByYear) {
        return activate(next);
      } else {
        loadLocations(function(error, groups) {
          if (error) return next(error);

          list = root.select('.select--locations')
            .call(locationSelector()
              .groups(groups))
            .on('change', function() {
              if (!this.value) return;
              app.router.setRoute(this.value);
            });

          app.load([
            'state/revenues-yearly.tsv'
          ], function(error, revenues) {

            revenuesByYear = d3.nest()
              .key(dl.accessor('Year'))
              .key(dl.accessor('State'))
              .rollup(function(d) {
                return sum(d, 'Revenue');
              })
              .map(revenues);

            return activate(next);
          });
        });
      }
    };
  })();

  function showState(state, next) {
    console.log('[route] show state:', state);
    listLocations(function(error, root) {
      var map = root.select('region-map');
      var feature;
      map.selectAll('g.region')
        .filter(function(d) { return d.selected; })
        .each(function(d) { feature = d; });

      map.node().zoomTo(feature, 400);
      return next(null, root);
    });
  }

  function showCounty(state, county, next) {
    console.log('[route] show county:', state, county);
    showState(state, function(error, root) {
      return next(null, root);
    });
  }

  function showOffshoreRegion(region, next) {
    console.log('[route] show offshore region:', region);
    listLocations(function() {
      next();
    });
  }

  function showOffshoreArea(region, area, next) {
    console.log('[route] show offshore area:', region, area);
    showOffshoreRegion(region, function(error, root) {
      return next(null, root);
    });
  }

  function showCommodityForState(commodity, state, next) {
    console.log('[route] state commodity view');
    next();
  }

  function showCommodityForCounty(commodity, state, county, next) {
    console.log('[route] county commodity view');
    next();
  }

  function showCommodityForOffshoreRegion(commodity, region, next) {
    console.log('[route] offshore region commodity view');
    next();
  }

  function showCommodityForOffshoreArea(commodity, region, area, next) {
    console.log('[route] offshore area commodity view');
    next();
  }


  /**
   * utility functions
   */

  function noop() {
  }

  function last(list) {
    return list[list.length - 1];
  }

  function loadLocations(done) {
    return queue()
      .defer(d3.csv, 'input/geo/states.csv')
      .defer(d3.json, app.dataPath + 'geo/offshore.json')
      .await(function(error, states, offshore) {
        if (error) return done(error);
        var territories = d3.set(['AS', 'GU', 'PR', 'VI']);
        return done(null, [
          {
            label: 'Onshore',
            values: states
              .filter(function(d) {
                return !territories.has(d.abbr);
              })
              .map(function(d) {
                return {
                  label: d.name,
                  value: '/locations/onshore/' + d.abbr
                };
              })
          },
          {
            label: 'Offshore',
            values: Object.keys(offshore.objects)
              .reduce(function(regions, key) {
                var collection = topojson.feature(offshore, offshore.objects[key]);
                return regions.concat(collection.features);
              }, [])
              .map(function(d) {
                return {
                  label: d.properties.name || d.id,
                  value: '/locations/offshore/' + d.id
                };
              })
          }
        ]);
      });
  }

  function locationSelector() {
    var groups = [];

    var selector = function(select) {
      var group = select.selectAll('optgroup')
        .data(groups);
      group.exit().remove();
      group.enter().append('optgroup');
      group.attr('label', dl.accessor('label'));

      var option = group.selectAll('option')
        .data(function(d) { return d.values; });
      option.exit().remove();
      option.enter().append('option');
      option
        .attr('value', dl.accessor('value'))
        .text(dl.accessor('label'));
    };

    selector.groups = function(_) {
      if (!arguments.length) return groups;
      groups = _;
      return selector;
    };

    return selector;
  }

  function lookup(list, key, value) {
    value = dl.accessor(value);
    return d3.nest()
      .key(dl.accessor(key))
      .rollup(function(d) {
        return value(d[0]);
      })
      .map(list);
  }

  function reverseLookup(map) {
    return d3.nest()
      .key(dl.accessor('value'))
      .rollup(function(d) {
        return d[0].key;
      })
      .map(d3.entries(map));
  }

  function setCommodityGroup(d) {
    d.CommodityGroup = app.commodities.getGroup(d.Commodity);
  }

  function rebind(selection, parent) {
    selection.each(function(d) {
      var node = this;
      while (!d && node.parentNode) {
        node = node.parentNode;
        d = d3.select(node).datum();
      }
      d3.select(this).datum(d);
    });
  }

  function sum(d, key) {
    key = dl.accessor(key);
    return d3.sum(d, function(x) { return +key(x); });
  }

  function sumRevenues(d) {
    return sum(d, 'Revenue');
  }

  function countUnique(d, key) {
    return d3.nest()
      .key(dl.accessor(key))
      .entries(d)
      .length;
  }

  function pluralize(value, text, plural) {
    return (value == 1)
      ? [value, text].join('')
      : [value, plural || (text + 's')].join('');
  }

  function expandHrefTemplate(d) {
    return dl.template(this.getAttribute('href'))(d);
  }

  function getFeatureHref(d, template) {
    var path = [
      d.properties.offshore ? 'offshore' : 'onshore',
      d.id
    ].join('/');
    return template
      ? template.replace('%', path)
      : '#/locations/' + path;
  }

  function locationSelector() {
    var groups = [];

    var selector = function(select) {
      var group = select.selectAll('optgroup')
        .data(groups);
      group.exit().remove();
      group.enter().append('optgroup');
      group.attr('label', dl.accessor('label'));

      var option = group.selectAll('option')
        .data(function(d) { return d.values; });
      option.exit().remove();
      option.enter().append('option');
      option
        .attr('value', dl.accessor('value'))
        .text(dl.accessor('label'));
    };

    selector.groups = function(_) {
      if (!arguments.length) return groups;
      groups = _;
      return selector;
    };

    return selector;
  }

  function lookup(list, key, value) {
    value = dl.accessor(value);
    return d3.nest()
      .key(dl.accessor(key))
      .rollup(function(d) {
        return value(d[0]);
      })
      .map(list);
  }

  function reverseLookup(map) {
    return d3.nest()
      .key(dl.accessor('value'))
      .rollup(function(d) {
        return d[0].key;
      })
      .map(d3.entries(map));
  }

  function createCommoditySections(root, templateSelector) {
    var template = root.select(templateSelector || '.template')
      .style('display', null)
      .remove()
      .node();

    var sections = root.selectAll('section.commodity')
      .data(app.commodityGroups)
      .enter()
      .append(function(d) { return template.cloneNode(true); })
        .attr('class', 'commodity');

    var name = dl.accessor('name');
    sections.selectAll('.commodity-title')
      .call(rebind)
      .text(name);

    // qualify links with an href attribute,
    // which excludes SVG <a> elements
    sections.selectAll('a[href]')
      .filter(function() {
        return this.href.indexOf('{{') > -1;
      })
      .call(rebind)
      .attr('href', expandHrefTemplate);

    return sections;
  }

  function setCommodityGroup(d) {
    d.CommodityGroup = app.commodities.getGroup(d.Commodity);
  }

  function rebind(selection, parent) {
    selection.each(function(d) {
      var node = this;
      while (!d && node.parentNode) {
        node = node.parentNode;
        d = d3.select(node).datum();
      }
      d3.select(this).datum(d);
    });
  }

  function sum(d, key) {
    key = dl.accessor(key);
    return d3.sum(d, function(x) { return +key(x); });
  }

  function sumRevenues(d) {
    return sum(d, 'Revenue');
  }

  function countUnique(d, key) {
    return d3.nest()
      .key(dl.accessor(key))
      .entries(d)
      .length;
  }

  function pluralize(value, text, plural) {
    return (value == 1)
      ? [value, text].join('')
      : [value, plural || (text + 's')].join('');
  }

  function expandHrefTemplate(d) {
    return dl.template(this.getAttribute('href'))(d);
  }

  function parseProductName(name, commodity) {
    if (commodity && name.indexOf(commodity) === 0) {
      name = name.substr(commodity.length + 1);
    }
    var match = name.match(/\(([a-z]+)\)$/);
    if (match) {
      return {
        name: name.split(' (').shift(),
        units: match[1]
      };
    }
    return {name: name, units: 'units'};
  }

  function slugify(str) {
    return str.toLowerCase()
      .replace(/\s*\([^\)]+\)\s/g, '')
      .replace(/\W+/g, '-');
  }

  function whenLoaded(selection, callback) {
    selection.each(function() {
      if (this.loaded) return callback.apply(this, arguments);
      d3.select(this).on('load', callback);
    });
  }

  function zoomMapToFeature(selection, feature, duration) {
    selection.each(function() {
      var selected;
      d3.select(this).selectAll('g.region')
        .each(function(d) {
          if (d === feature || d.id === feature || d.id === feature.id) {
            selected = d;
          }
        });
      this.zoomTo(selected, duration);
    });
  }

})(this);
