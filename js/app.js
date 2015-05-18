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
      // false means: don't show this path component
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

    commodityColors: {
    },

    // TODO: this should come from the data
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
          // '/': showIndex,
          '/index': showIndex,

          '/commodities': {
            on: listCommodities,
            '/:commodity': {
              on: showCommodity,
              '/onshore/:state': {
                on: showCommodityForState,
                '/:county': showCommodityForCounty
              },
              '/offshore/:region': {
                on: showCommodityForOffshoreRegion,
                '/:area': showCommodityForOffshoreArea
              }
            }
          },

          '/revenue': {
            on: showRevenue,
            '/:commodity': showCommodityRevenue
          },

          '/production': {
            on: showProduction,
            '/:commodity': {
              on: listCommodityProducts,
              '/:product': showCommodityProduct
            }
          },

          '/locations': {
            on: listLocations,
            '/onshore/:state': {
              on: showState,
              '/:county': showCounty
            },
            '/offshore/:region': {
              on: showOffshoreRegion,
              '/:area': showOffshoreArea
            }
          }
        };
      }

      // create the router
      app.router = new Router(routes)
        .configure({
          async:    true,
          recurse: 'forward',
          before:   app.beforeRoute,
          on:       app.onRoute,
          after:    app.afterRoute,
          notfound: app.notFound
        });

      // set up d3 selections for the important page elements
      var root = app.root = d3.select('#app');
      app.status = root.select('#status');
      app.sections = root.selectAll('main section.primary');
      app.description = root.select('.page-description');
      app.breadcrumb = root.select('nav ul.breadcrumb');

      app.initializeYearSliders();
      app._routeEnds = [];

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
          return q.defer(url);
        }
        if (url.indexOf('./') !== 0) url = app.dataPath + url;
        var ext = url.split('.').pop();
        var load = eiti.load;
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
      var path = app.router.getRoute();
      // console.info('[app] before route:', path, arguments);
      app.root.attr('data-path', path.join('/'));
      var path = app.router.getRoute();
      app.updatePath(path);
      var next = last(arguments);
      // always get the commodity configuration before
      // running a route
      app.loadCommodities(function() {
        app.loadLocations(next);
      });
    },

    /**
     * this runs after the current route was executed, and is used
     * to update the nav and any other URL-specific elements on the
     * page.
     */
    onRoute: function() {
      // console.info('[app] on route:', arguments);
      var path = app.router.getRoute();
      app.updatePath(path);
      var next = last(arguments);
      next();
    },

    /**
     * this runs after a route is pushed onto the stack.
     */
    afterRoute: function() {
      // console.info('[app] after route:', arguments);
      while (app._routeEnds.length) {
        app._routeEnds.pop().call(this, arguments);
      }
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
        .classed('active', function() {
          return this.id === path[0];
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

    /**
     * load the commodity configuration JSON and set up
     * `app.commodityGroups` for general use.
     */
    loadCommodities: function(done) {
      if (app.commodities) return done();
      app.commodities = new eiti.data.Commodities();
      app.commodities.load('data/commodities.json', function(error, commodity) {

        var slugs = reverseLookup(commodity.groups);
        for (var slug in commodity.groups) {
          app.pathTitles[slug] = commodity.groups[slug];
          commodity.colors[commodity.groups[slug]] = commodity.colors[slug];
        }

        app.commodityGroups = app.commodityGroups.map(function(name) {
          return {
            name: name,
            slug: slugs[name]
          };
        });

        app.commodityColors = commodity.colors;

        done();
      });
    },

    loadLocations: function(done) {
      loadLocations(function(error, groups) {
        d3.selectAll('select.select--locations')
          .call(locationSelector()
            .groups(groups))
          .property('loaded', true)
          .each(function() {
            this.dispatchEvent(new CustomEvent('load', groups));
          });
        done();

        groups.forEach(function(group) {
          if (group.label === 'Offshore') {
            app.offshoreRegionLookup = {};
          }
          group.values.forEach(function(d) {
            var id = d.value.split('/').pop();
            app.pathTitles[id] = d.label;
            if (group.label === 'Offshore') {
              app.offshoreRegionLookup[d.label] = id;
            }
          });
        });
      });
    },

    initializeYearSliders: function() {
      var sliders = app.root.selectAll('x-slider')
        .call(initializeYearSlider, app.years);
      var sync = function() {
        sliders.on('change.sync', null);
        sliders.property('value', this.value);
        sliders.on('change.sync', sync);
      };
      sliders.on('change.sync', sync);
    },

    /**
     * register a route "cleanup" function, rather than resetting
     * state in parent routes
     */
    cleanup: function(callback) {
      this._routeEnds.push(callback);
    }
  };

  var ZOOM_TIME = 400;

  /**
   * Construct a new, configurable view function with a slew of options and
   * lifecycle methods.
   *
   * @example
   * var view = createView()
   *   .root('#selector')
   *   // call these functions in context before the main function
   *   .before([commonSetupFunction, etc])
   *   // set context.params to {foo, bar} from positional arguments
   *   .params(['foo', 'bar'])
   *   // specify a load function that only gets called once
   *   .load(function(next) {
   *   })
   *   // the main function may be synchronous; just leave off the next
   *   // argument
   *   .main(function(next) {
   *   })
   *   // call this function when the next view is called
   *   .after([teardown])
   *   // set the calling context object
   *   .context({baz: 0xBADBAD});
   *
   */
  var createView = function(main) {
    if (!main) main = function(next) { next(); };

    var before = [];
    var after = [];
    var params;
    var load;
    var loadOnce = true;

    var root = '#app';
    var context = {};

    var onerror = function(error) {
      console.error('view error:', error);
      throw new Error('view error: ' + error.message);
    };

    var view = function() {
      var args = [].slice.call(arguments);
      var next = args.pop();

      if (root) {
        context.root = typeof root === 'string'
          ? d3.select(root)
          : root;
      }

      if (params) {
        var param = {};
        params.forEach(function(key, i) {
          param[key] = args[i];
        });
        context.params = param;
      } else {
        context.params = args;
      }

      var run = function() {
        if (before.length) {
          before.each(function(fn) {
            fn.apply(context, args);
          });
        }
        // synchronous: no callback
        if (!main.length) {
          main.call(context);
          return next();
        }
        return main.call(context, next);
      };

      if (load) {
        load.call(context, function(error, data) {
          if (error) {
            onerror.call(context, error);
          } else {
            // unset the load function if alwaysLoad is false
            if (loadOnce) load = null;
            run();
          }
        });
      } else {
        run();
      }

      app.cleanup(function() {
        // XXX preserve context object
        after.forEach(function(fn) {
          fn.apply(context, args);
        });
      });
    };

    view.main = function(fn) {
      if (!arguments.length) return main;
      main = fn;
      return view;
    };

    view.root = function(selector) {
      if (!arguments.length) return root;
      root = selector;
      return view;
    };

    view.before = function(fns) {
      if (!arguments.length) return before;
      before = Array.isArray(fns) ? fns : [fns];
      return view;
    };

    view.after = function(fns) {
      if (!arguments.length) return before;
      after = Array.isArray(fns) ? fns : [fns];
      return view;
    };

    view.params = function(keys) {
      if (!arguments.length) return params;
      params = keys;
      return view;
    };

    view.error = function(fn) {
      if (!arguments.length) return onerror;
      onerror = fn;
      return view;
    };

    view.load = function(fn, always) {
      if (!arguments.length) return load;
      load = fn;
      loadOnce = always !== true;
      return view;
    };

    view.context = function(ctx) {
      if (!arguments.length) return context;
      context = ctx || {};
      return view;
    };

    // create a child of this view with the same:
    // - root
    // - parameters
    // - context
    view.child = function() {
      return createView()
        .root(root)
        .params(params)
        .context(context);
    };

    return view;
  };

  var showIndex = createView()
    .root('#index')
    .main(function(next) {
      console.log('[view] index');
      var root = this.root;
      var list = root.select('.select--locations')
        .call(routeToLocation, '/locations', true);
      var item = root.select('ul.list--commodities')
        .selectAll('li')
        .data(app.commodityGroups);
      item.exit().remove();
      item.enter()
        .append('li')
          .append('a');
      item
        .attr('class', function(d) {
          return ['commodity', 'commodity--' + d.slug].join(' ');
        })
        .select('a')
          .attr('href', dl.template('#/commodities/{{ slug }}'))
          .text(dl.accessor('name'));
      return next();
    });

  var listCommodities = createView()
    .root('#commodities')
    .params(['commodity', 'region', 'subregion'])
    .load(function(next) {
      var context = this;
      var root = context.root;

      app.load({
        revenues: 'national/revenues-yearly.tsv',
        production: 'national/volumes-yearly.tsv',
        stateRevenues: 'state/revenues-yearly.tsv',
        offshoreRevenues: 'offshore/revenues-yearly.tsv'
      }, function(error, data) {

        context.sections = createCommoditySections(
          root.select('section.list--commodities')
        );

        data.revenues.forEach(setCommodityGroup);
        data.production.forEach(setCommodityGroup);

        data.stateRevenues.forEach(setCommodityGroup);
        data.stateRevenues.forEach(setStateRegion);

        data.offshoreRevenues.forEach(setCommodityGroup);
        data.offshoreRevenues.forEach(setOffshoreRegion);

        data.regionalRevenues = data.stateRevenues.concat(data.offshoreRevenues);

        context.data = data;
        return next();
      });
    })
    .main(function(done) {
      console.log('[view] list commodities');
      var context = this;
      var root = context.root
        .classed('commodity--selected', false);
      var data = context.data;
      var sections = context.sections;
      var slider = root.select('x-slider');

      function update() {
        var year = slider.property('value');
        root.selectAll('.current-year')
          .text(year);
        var filter = function(d) { return d.Year == year; };

        var revenues = data.revenues.filter(filter);
        var production = data.production.filter(filter);
        var regionalRevenues = data.regionalRevenues.filter(filter);

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

        var revenuesByCommodity = d3.nest()
          .key(dl.accessor('CommodityGroup'))
          .key(dl.accessor('Region'))
          .rollup(sumRevenues)
          .map(regionalRevenues);

        var detail = sections.select('.detail');

        detail.select('region-map')
          .call(onceLoaded, function(d) {
            var revenuesByRegion = revenuesByCommodity[d.name] || {};
            var regions = d3.select(this)
              .selectAll('g.region')
                .each(function(f) {
                  return f.revenue = revenuesByRegion[f.id];
                })
                .classed('active', function(f) {
                  return !!f.revenue;
                });

            var hrefTemplate = dl.template('#/commodities/{{ slug }}/%')(d);
            regions.select('a')
              .attr('xlink:href', function(f) {
                return getFeatureHref(f, hrefTemplate);
              });
          });
      }

      slider.on('change', throttle(update));
      update();
      return done();
    })
    .after(function() {
    });

  var showCommodity = createView()
    .root('#commodities')
    .params(['commodity'])
    .main(function showCommodity(next) {
      var commodity = this.params.commodity;
      console.log('[view] show commodity:', commodity);

      var root = this.root
        .classed('commodity--selected', true);

      var baseURL = '/commodities/' + commodity;
      this.list = root.select('.select--locations')
        .call(routeToLocation, baseURL);

      var section = root.selectAll('section.commodity')
        .classed('selected', function(d) {
          return d.slug === commodity;
        })
        .filter('.selected');

      this.list
        .call(relocateLocationSelector, section.select('.selector'));

      return next();
    })
    .after(function() {
      console.log('[view] after show commodity');
      this.list.property('value', '');
    });

  var showRevenue = createView()
    .root('#revenue')
    .params(['commodity'])
    .load(function(next) {
      var context = this;
      var root = this.root;
      app.load([
        'state/revenues-yearly.tsv',
        'offshore/revenues-yearly.tsv'
      ], function(error, onshore, offshore) {
        context.sections = createCommoditySections(
          root.select('section.list--commodities')
        );

        context.sections.selectAll('g.region')
          .append('title');

        // set the CommodityGroup field so we can nest on commodity "group"
        // (e.g. "Geothermal" goes into "Renewables", etc.)
        onshore.forEach(setCommodityGroup);
        offshore.forEach(setCommodityGroup);

        // set the Region field so that we can associate revenues with
        // geographic features
        // (TODO: for offshore areas we should not need a lookup; the data
        // should include the planning area ID in addition to title)
        onshore.forEach(setStateRegion);
        offshore.forEach(setOffshoreRegion);

        // combine the list of offshore and onshore revenues for grouping
        var revenues = onshore.concat(offshore);
        var nameToSlug = reverseLookup(app.pathTitles);
        revenues.forEach(function(d) {
          d.slug = nameToSlug[d.CommodityGroup];
        });

        context.revenues = revenues;

        // nest revenues by year then commodity for fast lookups
        context.revenuesByYearCommodity = d3.nest()
          .key(dl.accessor('Year'))
          .key(dl.accessor('CommodityGroup'))
          .rollup(sumRevenues)
          .map(revenues);

        // nest revenues by year then commodity *and region*,
        // also for fast lookups
        context.revenuesByYearCommodityRegion = d3.nest()
          .key(dl.accessor('Year'))
          .key(dl.accessor('CommodityGroup'))
          .key(dl.accessor('Region'))
          .rollup(sumRevenues)
          .map(revenues);

        // get the sum of revenues for each unique combination of
        // year, commodity and region (nested)
        var extents = d3.nest()
          .key(dl.accessor('Year'))
          .key(dl.accessor('CommodityGroup'))
          .key(dl.accessor('Region'))
          .rollup(sumRevenues)
          .map(revenues);

        // then pick through the values and cacluate the extent
        // (min and max) for each year/commodity group, so that
        // we can color the regions in each subgroup consistently
        forEach(extents, function(byYear, year) {
          forEach(byYear, function(regions, commodity) {
            var values = d3.values(regions);
            var extent = d3.extent(values);
            if (extent[0] > 0) extent[0] = 0;
            extents[year][commodity] = extent;
          });
        });

        // console.log('revenue extents by year/commodity:', extents);
        context.extentsByYearCommodity = extents;

        return next();
      });
    })
    .main(function showRevenue(next) {
      console.log('[view] show revenue');
      var root = this.root;
      var sections = this.sections;
      var updated = this.updated || false;
      var params = this.params;
      var slider = root.select('x-slider');

      // onshore and offshore values
      var revenues = this.revenues;

      // {year: {commodity: value}}
      var revenuesByYearCommodity = this.revenuesByYearCommodity;
      // {year: {commodity: extent}}
      var extentsByYearCommodity = this.extentsByYearCommodity;
      // {year: {commodity: {region: value}}}
      var revenuesByYearCommodityRegion = this.revenuesByYearCommodityRegion;
      // console.log('revenues by year, commodity, region:', revenuesByYearCommodityRegion);

      function update() {
        var year = slider.property('value');
        root.selectAll('.current-year')
          .text(year);

        // console.log('[update] show revenue', year);
        var revenuesByCommodity = revenuesByYearCommodity[year];

        var format = eiti.format.shortDollars;
        sections.select('.revenue--total')
          .text(function(d) {
            return format(revenuesByCommodity[d.name] || 0);
          });

        sections.select('region-map')
          .call(onceLoaded, function(d) {
            var extent = extentsByYearCommodity[year][d.name];
            // console.log('extent:', d.name, extent);
            var colors = getCommodityColorRange(d.name);
            var scale = d3.scale.quantize()
              .domain(extent)
              .range(colors);

            var revenuesByRegion = revenuesByYearCommodityRegion[year][d.name] || {};
            // console.log('revenuesByRegion:', revenuesByRegion);

            var regions = d3.select(this)
              .selectAll('g.region')
              .each(function(f) {
                f.value = revenuesByRegion[f.id] || 0;
              });

            regions.select('path')
              .style('fill', function(f) {
                return scale(f.value);
              });

            regions.select('title')
              .text(function(f) {
                return format(f.value);
              });
          });

        var chart = root.select('svg.revenue--area');
        var node = chart.node();

        var margin = {
          left: 40,
          right: 15,
          top: 5,
          bottom: 5
        };

        var slug = params.commodity;
        var colors = app.commodityColors;
        var sort = orderOf(app.commodityGroups.map(dl.accessor('name')));
        var area = eiti.charts.area()
          .width(960)
          .height(100)
          .margin(margin)
          .x('Year')
          .y('slug')
          .fill(function(d) {
            return colors[d.key]
              ? colors[d.key].primary
              : colors.other.primary;
          })
          .value(slug
            ? function(d) {
                return d.slug === slug ? +d.Revenue : 0;
              }
            : 'Revenue')
          .sort(function(a, b) {
            return sort(a.key, b.key);
          })
          .stacked(true)
          .voronoi(true);

        // FIXME: only do this when the selected commodity changes
        if (updated) {
          chart = chart.transition()
            .duration(ZOOM_TIME * 2);
        }
        chart.call(area, revenues);
      }

      slider.on('change', throttle(update));
      update();

      this.updated = true;

      return next();
    })
    .after(function() {
      console.log('[view] after show revenue');
      // XXX remove listener?
    });

  var showCommodityRevenue = createView()
    .root('#revenue')
    .params(['commodity'])
    .main(function showCommodityRevenue(next) {
      var params = this.params;
      console.log('[view] show commodity revenue:', params);

      var root = this.root
        .classed('commodity--selected', true);

      root.selectAll('section.commodity')
        .classed('selected', function(d) {
          return d.slug === params.commodity;
        });

      root.select('.select--locations')
        .call(relocateLocationSelector, root.select('.commodity.selected .selector'));

      return next();
    })
    .after(function() {
      console.log('[view] after showCommodityRevenue');
      this.root.classed('commodity--selected', false);
    });


  var showProduction = createView()
    .root('#production')
    .load(function(next) {
      var context = this;
      var root = context.root;

      app.load([
        'national/volumes-yearly.tsv'
      ], function(error, production) {

        production.forEach(setCommodityGroup);

        var productsByCommodity = d3.nest()
          .key(dl.accessor('CommodityGroup'))
          .rollup(d3.nest()
            // .key(dl.accessor('Year'))
            .key(dl.accessor('Product'))
            .rollup(function(d) {
              return sum(d, 'Volume');
            })
            .entries)
          .map(production);

        var sections = createCommoditySections(
          root.select('section.list--commodities')
        );

        var products = sections.select('ul.list--products')
          .selectAll('li')
          .data(function(d) {
            return productsByCommodity[d.name].map(function(p) {
              var product = parseProductName(p.key, d.name);
              var slug = slugify(product.name);
              app.pathTitles[slug] = product.name;
              return {
                commodity: d,
                product: {
                  name: product.name,
                  slug: slug,
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

        return next();
      });
    })
    .main(function showProduction(next) {
      console.log('[view] showProduction');
      var root = this.root;
      // TODO: update on year change
      next();
    });

  var listCommodityProducts = createView()
    .root('#production')
    .params(['commodity'])
    .main(function listCommodityProducts(next) {
      var params = this.params;
      console.log('[view] list commodity products:', params);

      var root = this.root
        .classed('commodity--selected', true);

      root.selectAll('section.commodity')
        .classed('selected', function(d) {
          return d.slug === params.commodity;
        });

      return next();
    })
    .after(function() {
      console.log('[view] after list commodity products');
      this.root
        .classed('commodity--selected', false);
    });

  var showCommodityProduct = createView()
    .root('#production')
    .main(function showCommodityProduct(next) {
      var params = this.params;
      console.log('[view] show commodity product:', params);
      // TODO: select the product
      return next();
    });

  var listLocations = createView()
    .root('#locations')
    .load(function(next) {
      var context = this;
      app.load([
        'state/revenues-yearly.tsv',
        'offshore/revenues-yearly.tsv'
      ], function(error, onshore, offshore) {

        onshore.forEach(setStateRegion);
        offshore.forEach(setOffshoreRegion);

        var rows = onshore.concat(offshore);

        context.revenues = d3.nest()
          .key(dl.accessor('Year'))
          .key(dl.accessor('Region'))
          .rollup(sumRevenues)
          .map(rows);

        return next();
      });
    })
    .main(function(next) {
      var root = this.root;
      var map = root.select('region-map');
      var list = root.select('.select--locations')
        .call(routeToLocation, '/locations');

      var revenuesByYear = this.revenues;
      var slider = root.select('x-slider');

      function update() {
        var year = slider.property('value');
        var revenuesByRegion = revenuesByYear[year];
        var region = map.selectAll('g.region')
          .each(function(d) {
            d.href = getFeatureHref(d, '#/locations/%');
            d.selected = d.href === location.hash;
            d.revenue = revenuesByRegion[d.id];
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

      slider.on('change', throttle(update));
      list.property('value', '');
      update();
      return next();
    });

  var showState = createView()
    .root('#locations')
    .params(['state'])
    .main(function showState(next) {
      var params = this.params;
      console.log('[view] show state:', params);

      var root = this.root;
      var map = root.select('region-map');

      var feature;
      map.selectAll('g.region')
        .filter(function(d) { return d.selected; })
        .each(function(d) { feature = d; });

      map.call(zoomTo, feature);

      // select the active one
      var list = root.select('.select--locations')
        .call(onceLoaded, function() {
          if (!root) return;
          this.value = 'onshore/' + params.state;
        });

      return next();
    })
    .after(function() {
      console.log('[view] after show state');
      this.root.select('region-map')
        .call(zoomTo, null);
    });

  var showCounty = createView()
    .root('#locations')
    .params(['state', 'county'])
    .main(function showCounty(next) {
      var params = this.params;
      console.log('[view] show county:', params);
      return next();
    });

  var showOffshoreRegion = createView()
    .root('#locations')
    .params(['region'])
    .main(function showOffshoreRegion(next) {
      var params = this.params;
      console.log('[view] show offshore region:', params);

      var root = this.root;
      var map = this.map = root.select('region-map');
      var feature;
      map.selectAll('g.region')
        .filter(function(d) { return d.selected; })
        .each(function(d) { feature = d; });

      map.call(zoomTo, feature);

      // select the active one
      var list = root.select('.select--locations')
        .call(onceLoaded, function() {
          if (!root) return;
          this.value = 'offshore/' + params.region;
        });

      return next();
    })
    .after(function() {
      this.map.call(zoomTo, null);
    });

  var showOffshoreArea = createView()
    .params(['region', 'area'])
    .main(function showOffshoreArea(next) {
      var params = this.params;
      console.log('[view] show offshore area:', params);
      return next();
    });

  var showCommodityForState = createView()
    .root('#commodities')
    .params(['commodity', 'state'])
    .main(function showCommodityForState(next) {
      var params = this.params;
      console.log('[route] state commodity view:', params);

      var root = this.root;
      var section = root.select('section.commodity.selected');

      root.select('.select--locations')
        .call(onceLoaded, function() {
          this.value = 'onshore/' + params.state;
        });

      var map = section.select('region-map');

      var feature;
      map.selectAll('g.region')
        .classed('selected', function(d) {
          d.selected = d.id === params.state;
          if (d.selected) feature = d;
          return d.selected;
        });

      map.call(zoomTo, feature);

      return next();
    })
    .after(function afterCommodityState() {
      this.root.selectAll('region-map')
        .call(zoomTo, null)
        .selectAll('g.region')
          .classed('selected', false);
    });

  var showCommodityForCounty = createView()
    .root('#commodities')
    .params(['commodity', 'state', 'county'])
    .main(function showCommodityForCounty(next) {
      var params = this.params;
      console.log('[view] county commodity view:', params);
      return next();
    });

  var showCommodityForOffshoreRegion = createView()
    .root('#commodities')
    .params(['commodity', 'region'])
    .main(function showCommodityForOffshoreRegion(next) {
      var params = this.params;
      console.log('[view] offshore region commodity view:', params);

      var root = this.root;
      var section = root.select('section.commodity.selected');

      root.select('.select--locations')
        .call(onceLoaded, function() {
          this.value = 'offshore/' + params.region;
        });

      var map = section.select('region-map');

      var feature;
      map.selectAll('g.region')
        .classed('selected', function(d) {
          d.selected = d.id === params.region;
          if (d.selected) feature = d;
          return d.selected;
        });

      console.log('offshore feature:', params.region, '->', feature);

      map.call(zoomTo, feature);
    })
    .after(function() {
      this.root.selectAll('region-map')
        .call(zoomTo, null)
        .selectAll('g.region')
          .classed('selected', false);
    });

  var showCommodityForOffshoreArea = createView()
    .root('#commodities')
    .params(['commodity', 'region', 'area'])
    .main(function showCommodityForOffshoreArea(next) {
      var params = this.params;
      console.log('[view] offshore area commodity view:', params);
      return next();
    });

  /**
   * utility functions
   */

  function noop() {
  }

  function last(list) {
    return list[list.length - 1];
  }

  var loadLocations = (function() {
    var groups;
    return function loadLocations(done) {
      if (groups) return done(null, groups);
      return queue()
        .defer(eiti.load, 'input/geo/states.csv')
        .defer(eiti.load, 'input/geo/offshore/areas.tsv')
        .await(function(error, states, offshore) {
          if (error) return done(error);

          var territories = d3.set(['AS', 'GU', 'PR', 'VI']);
          return done(null, groups = [
            {
              label: 'Onshore',
              values: states
                .filter(function(d) {
                  return !territories.has(d.abbr);
                })
                .map(function(d) {
                  return {
                    label: d.name,
                    value: 'onshore/' + d.abbr
                  };
                })
            },
            {
              label: 'Offshore',
              values: offshore
                .map(function(d) {
                  return {
                    label: d.name,
                    value: 'offshore/' + d.id
                  };
                })
            }
          ]);
        });
    };
  })();

  function lookup(list, key, value) {
    if (typeof key !== 'function') key = dl.accessor(key);
    if (typeof value !== 'function') value = dl.accessor(value);
    var map = {};
    list.forEach(function(d) {
      map[key(d)] = value(d);
    });
    return map;
  }

  function reverseLookup(map, value) {
    if (!value) value = dl.identity;
    var reverse = {};
    for (var key in map) {
      var k = value.call(map, map[key], key);
      reverse[k] = key;
    }
    return reverse;
  }

  /**
   * rebind a selection to the closest ancestor with data
   */
  function rebind(selection, skipCurrentData) {
    selection.each(function(_d) {
      var node = this;
      var d = skipCurrentData ? null : _d;
      while (!d && node.parentNode) {
        node = node.parentNode;
        d = d3.select(node).datum();
      }
      d3.select(this).datum(d);
    });
  }

  function sum(d, key) {
    key = dl.accessor(key);
    return d3.sum(d, function(x) {
      return +key(x);
    });
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

  function initializeYearSlider(slider, years) {
    slider
      .attr('min', years[0])
      .attr('max', years[1])
      .attr('value', years[1]);

    var x = d3.scale.linear()
      .domain(years)
      .range([0, 100]);

    var ticks = slider.selectAll('.tick')
      .data(d3.range(years[0], years[1] + 1))
      .enter()
      .append('div')
        .attr('class', 'tick')
        .style('left', function(y) {
          return x(y).toFixed(2) + '%';
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
    slider.on('change.ticks', throttle(updateTicks));
    slider.each(updateTicks);
  }

  function createCommoditySections(root, templateSelector) {
    var template = root.select(templateSelector || '.template')
      .style('display', null)
      .remove()
      .node();

    var sections = root.selectAll('section.commodity')
      .data(app.commodityGroups);

    sections.exit().remove();
    sections.enter()
      .append(function(d) { return template.cloneNode(true); });

    sections.attr('class', function(d) {
      return ['commodity', 'commodity--' + d.slug].join(' ');
    });

    var name = dl.accessor('name');
    sections.selectAll('.commodity__name')
      .call(rebind)
      .text(name);

    sections.selectAll('.swatch')
      .call(rebind)
      .style('background-color', function(d) {
        return app.commodityColors[d.slug].primary;
      });

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

  /**
   * assign the 'CommodityGroup' property to an object based on the
   * value of its 'Commodity' property.
   */
  function setCommodityGroup(d) {
    d.CommodityGroup = app.commodities.getGroup(d.Commodity);
  }

  function setStateRegion(d) {
    d.Region = d.State;
  }

  function setOffshoreRegion(d) {
    d.Region = app.offshoreRegionLookup[d.Area] || d.Area;
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

  function throttle(fn, repeatRate) {
    if (!repeatRate) repeatRate = 100; // 100ms default
    var timeout;
    return function() {
      if (!timeout) {
        fn.apply(this, arguments);
        timeout = setTimeout(function() {
          clearTimeout(timeout);
          timeout = null;
        }, repeatRate);
      }
    };
  }

  function onceLoaded(selection, callback) {
    var cb = function() {
      d3.select(this).on('load.once', null);
      return callback.apply(this, arguments);
    };
    selection.each(function() {
      if (this.loaded) return cb.apply(this, arguments);
      d3.select(this).on('load.once', cb);
    });
  }

  function routeToLocation(select, baseURL, empty) {
    var prefix = baseURL;
    if (prefix.substr(-1) !== '/') prefix += '/';
    select.on('change', function() {
      if (!this.value) {
        return empty
          ? false
          : app.router.setRoute(baseURL);
      }
      app.router.setRoute(prefix + this.value);
    });
  }

  function zoomTo(selection, feature, time) {
    if (arguments.length < 3) time = ZOOM_TIME;
    selection.each(function() {
      this.zoomTo(feature, time);
    });
  }

  function forEach(d, fn, context) {
    if (Array.isArray(d)) return d.forEach(fn, context || d);
    return Object.keys(d)
      .map(function(k) {
        return fn.call(context || this, d[k], k);
      });
  }

  function getCommodityColorRange(name) {
    var color = app.commodityColors[name];
    if (color.range) return color.range;

    var scale = d3.scale.linear()
      .domain([0, 8])
      .range([color.lowest || '#eee', color.primary])
    return color.scale = d3.range(0, 9).map(scale);
  }

  function orderOf(items) {
    var i = 0;
    var map = items.reduce(function(map, d) {
      return map.set(d, i++), map;
    }, d3.map());
    var order = function(d) {
      return map.has(d) ? map.get(d) : map.set(d, i++);
    };
    return function(a, b) {
      return order(a) - order(b);
    };
  }

  function relocateLocationSelector(list, newParent) {
    var node = list.node();

    var parent = newParent
      // .each(function() { console.warn('moving location selector to:', this); })
      .node();

    if (parent) {
      parent.appendChild(node);
      return true;
    }
    console.warn('no such parent:', newParentSelector, 'in:', root.node());
    return false;
  }

})(this);
