(function(exports) {

  var app = exports.app = {
    /**
     * the default app routes
     */
    routes: {
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
    },

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

    // all data URLs provided to load() will be prefixed with this
    // path unless they start with "./"
    dataPath: 'output/',

    /**
     * initialize the app
     */
    init: function() {
      // create the router
      app.router = new Router(app.routes)
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

      if (!Array.isArray(urls)) urls = [urls];

      urls.forEach(function(url) {
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
      });

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
        done.apply(this, arguments);
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
      return next();
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
        return next();
      });
    }
  }

  function listCommodities(next) {
    console.log('[route] list commodities');

    var root = app.root.select('#commodities')
      .classed('commodity-selected', false);
    if (root.classed('loaded')) {
      // already loaded
      return next();
    } else {
      app.load([
        'national/revenues-yearly.tsv',
        'national/volumes-yearly.tsv',
        'state/revenues-yearly.tsv',
      ], function(error, revenues, production, stateRevenues) {

        var template = root.select('.commodity-template')
          .style('display', null)
          .remove()
          .node();

        var sections = root.select('section.list--commodities')
          .selectAll('section.commodity')
          .data(app.commodityGroups)
          .enter()
          .append(function(d) { return template.cloneNode(true); })
            .attr('class', 'commodity')
            .attr('id', dl.template('commodities/{{ slug }}'));

        var name = dl.accessor('name');
        var href = dl.template('#/commodities/{{ slug }}');
        sections.selectAll('.commodity-title')
          .call(rebind)
          .text(name);

        sections.selectAll('a')
          .filter(function() {
            return this.href.indexOf('{{') > -1;
          })
          .call(rebind)
          .attr('href', expandHrefTemplate);

        revenues.forEach(setCommodityGroup);
        production.forEach(setCommodityGroup);

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

        stateRevenues.forEach(setCommodityGroup);

        var index = d3.nest()
          .key(dl.accessor('CommodityGroup'))
          .key(dl.accessor('State'))
          .rollup(sumRevenues)
          .map(stateRevenues);
        // console.log('revenues index:', index);

        sections.append('region-map')
          .attr('class', 'detail')
          .on('load', function(d) {
            // console.log('region map:', d);

            var revenuesByState = index[d.name];
            var regions = d3.select(this)
              .selectAll('g.region')
              .filter(function(f) {
                return f.revenue = revenuesByState[f.properties.abbr];
              })
              .classed('enabled', true);

            var hrefTemplate = dl.template('#/commodities/{{ slug }}/%')(d);
            regions.select('a')
              .attr('xlink:href', function(d) {
                return getFeatureHref(d, hrefTemplate);
              });

            regions.select('path');
          });

        root.classed('loaded', true);
        return next();
      });
    }
  }

  function showCommodity(commodity, next) {
    listCommodities(function() {
      console.log('[route] show commodity:', commodity);

      var root = app.root.select('#commodities')
        .classed('commodity-selected', true);

      var section = root.selectAll('section.commodity')
        .classed('selected', function(d) {
          return d.slug === commodity;
        })
        .filter('.selected');

      return next();
    });
  }

  function showRevenue(next) {
    console.log('[route] show revenues');
    next();
  }

  function showCommodityRevenue(commodity, next) {
    console.log('[route] show commodity revenues:', commodity);
    next();
  }

  function showProduction(next) {
    console.log('[route] show production');
    next();
  }

  function listCommodityProducts(commodity, next) {
    console.log('[route] list commodity products');
    next();
  }

  function showCommodityProduct(commodity, product, next) {
    console.log('[route] show commodity product:', commodity, product);
    next();
  }

  function listLocations(next) {
    console.log('[route] list locations');

    var root = app.root.select('#locations');
    if (root.classed('loaded')) {
      // already loaded
      return next();
    } else {
      loadLocations(function(error, groups) {
        if (error) return next(error);

        var list = root.select('.select--locations')
          .call(locationSelector()
            .groups(groups))
          .on('change', function() {
            if (!this.value) return;
            app.router.setRoute(this.value);
          });

        // select the active one
        var value = '/' + app.router.getRoute().join('/');
        list.property('value', value);

        var region = root.selectAll('region-map g.region')
          .each(function(d) {
            d.href = getFeatureHref(d, '#/locations/%');
            d.selected = d.href === location.hash;
          })
          .classed('enabled', true)
          .classed('selected', function(d) {
            return d.selected;
          });

        region.select('a')
          .attr('xlink:href', function(d) {
            return d.href;
          });

        next();

        // FIXME we can only update the breadcrumb after the
        // route has "finished"
        list.selectAll('option')
          .filter(function(d) {
            return d && d.value === value;
          })
          .each(function(d) {
            app.breadcrumb.select('li:last-child a')
              .text(d.label || '???');
          });
      });
    }
  }

  function showState(state, next) {
    console.log('[route] show state:', state);
    listLocations(function() {
      next();
    });
  }

  function showCounty(state, county, next) {
    console.log('[route] show county:', state, county);
    listLocations(function() {
      next();
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
    listLocations(function() {
      next();
    });
  }

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
        return done(null, [
          {
            label: 'Onshore',
            values: states.map(function(d) {
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
      d.properties.offshore ? d.id : d.properties.abbr
    ].join('/');
    return template
      ? template.replace('%', path)
      : '#/locations/' + path;
  }


  function showCommodityForCounty(state, county, next) {
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
      d.properties.offshore ? d.id : d.properties.abbr
    ].join('/');
    return template
      ? template.replace('%', path)
      : '#/locations/' + path;
  }

})(this);
