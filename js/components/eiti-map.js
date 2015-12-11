(function(exports) {
  'use strict';

  // XXX requires d3, topojson

  exports.EITIMap = document.registerElement('eiti-map', {
    // 'extends': 'svg',
    prototype: Object.create(
      HTMLElement.prototype,
      {

        createdCallback: {value: function() {
        }},

        attachedCallback: {value: function() {
          this.load();
        }},

        attributeChangedCallback: {value: function(attr, old, value) {
          switch (attr) {
            case 'width':
            case 'height':
              updateSize(this.querySelector('svg'));
              break;

            case 'zoom-to':
              this.zoomTo(value);
              break;
          }
        }},

        detachedCallback: {value: function() {
        }},

        load: {value: function() {
          this.loaded = false;

          var map = this.querySelector('svg');
          var layers = getDataLayers(this);

          var q = queue();
          var len = 0;
          layers.each(function() {
            if (this.getAttribute('data-load') === 'false') {
              console.warn('<eiti-map> not loading layer:', this);
              return;
            }
            var layer = this;
            q.defer(function(done) {
              loadLayer(layer, done);
            });
            len++;
          });

          if (len) {
            var selection = d3.select(this)
              .classed('js-loading', true);

            var self = this;
            q.await(function(error) {
              selection.classed('js-loading', false);
              if (error) {
                selection.classed('js-error', true);
                return self.dispatchEvent(new CustomEvent('error', error));
              }
              render(map);

              if (self.hasAttribute('zoom-to')) {
                self.zoomTo(self.getAttribute('zoom-to'));
              } else {
                updateBBox(map);
              }

              selection.classed('js-loaded', true);

              self.dispatchEvent(new CustomEvent('load'));
              self.loaded = true;
            });

          } else {
            console.warn('no data layers in:', this);
          }
        }},

        zoomTo: {value: function(featureId, duration) {
          var map = this.querySelector('svg');
          var selection = d3.select(map);

          var feature;
          selection
            .selectAll('path')
            .classed('zoomed', function(d) {
              if (!feature && d.id && d.id == featureId) {
                feature = d;
                return true;
              }
              return false;
            });

          var viewBox;
          if (feature) {
            var path = getSVGPath(map);
            var bbox = path.bounds(feature);
            viewBox = bboxToViewBox(bbox);
          } else {
            console.warn('zoom to:', featureId, 'no such feature');
            viewBox = getViewBox(map);
          }

          if (!isNaN(duration) && duration > 0) {
            selection = selection.transition()
              .duration(duration);
          }
          selection.attr('viewBox', viewBox);
        }}

      })
    });

  function render(map) {
    var path = getSVGPath(map);
    var layers = getDataLayers(map);
    layers.call(renderLayer(path));
    map.dispatchEvent(new CustomEvent('render'));
  }

  function getProjection(map) {
    if (map.__projection) {
      return map.__projection;
    }
    var proj = map.getAttribute('projection') ||
      map.parentNode.getAttribute('projection') || 'albersUsa';
    if (!d3.geo[proj]) {
      throw new Error('invalid projection: "' + proj + '"');
    }
    proj = d3.geo[proj]();
    // TODO: additional projection parameters?
    return map.__projection = proj;
  }

  function getSVGPath(map) {
    var proj = getProjection(map);

    var path = d3.geo.path()
      .projection(proj);

    if (map.hasAttribute('simplify')) {
      var area = +map.getAttribute('simplify');
      var skipped = 0;
      var simplify = d3.geo.transform({
        point: function(x, y, z) {
          if (z >= area) {
            var p = proj([x, y]);
            this.stream.point(p[0], p[1]);
          } else {
            skipped++;
          }
        },
        polygon: function(d) {
          skipped = 0;
          this.stream.polygon(d);
          if (skipped) {
            console.log('skipped %d points in polygon:', skipped, polygon);
          }
        }
      });
      return path.projection(simplify);
    }

    return path;
  }

  function renderLayer(path) {
    return function(selection) {
      selection.each(function(d) {
        var layer = d3.select(this)
          .attr('data-type', d.type);

        var filter = this.getAttribute('data-filter');
        var features = [];
        var key;
        switch (d.type) {

          case 'Topology':
            d = topojson.presimplify(d);
            features = getTopologyFeatures(this, d, filter);
            layer.classed('topology', true);
            if (!d.bbox) {
              d.bbox = getBBox(features.map(path.bounds));
            }
            break;

          case 'FeatureCollection':
            features = d.features;
            layer.classed('collection', true);
            // FIXME: presimplify?
            break;

          default:
            features = [d];
            layer.classed('feature', true);
            // FIXME: presimplify?
            break;
        }

        if (filter) {
          // console.log('filter %d features with expression:', features.length, '"' + filter + '"');
          filter = evaluator(filter);
          // only apply the filter to non-mesh features
          features = features.filter(function(d) {
            return d.mesh || filter(d);
          });
          // console.log('filtered %d features', features.length);
        }

        var feature;
        if (this.hasAttribute('data-href')) {

          var link = layer.selectAll('a')
            .data(features, function(d, i) {
              return d.id || i;
            });

          link.exit().remove();
          link.enter().append('a')
            .append('path')
              .append('title');

          var href = evaluator(this.getAttribute('data-href'));
          link
            .filter(function(d) { return !d.mesh; })
            .attr('xlink:href', href);

          feature = link.select('path');

        } else {

          feature = layer.selectAll('path')
            .data(features);

          feature.exit().remove();
          feature.enter().append('path')
            .append('title');

        }

        feature
          .attr('d', path)
          .attr('id', evaluator(this.getAttribute('data-id') || 'id'))
          .attr('class', function(d) {
            var klass = [];
            if (d.mesh) klass.push('mesh');
            else klass.push('feature');
            return klass.join(' ');
          });

        if (this.hasAttribute('data-title')) {
          var title = evaluator(this.getAttribute('data-title'));
          feature.select('title')
            .filter(function(d) { return !d.mesh; })
            // .each(function(d) { console.log('title:', d); })
            .text(title);
        }

        this.dispatchEvent(new CustomEvent('renderLayer'));
      });
    };
  }

  function updateSize(map) {
    var width = map.getAttribute('width') || 800;
    var height = map.getAttribute('height') || 600;
    var viewBox = [0, 0, width, height];
    d3.select(map)
      .attr('viewBox', viewBox.join(' '));
  }

  function updateBBox(map) {
    if (!map.hasAttribute('viewBox')) {
      var viewBox = getViewBox(map);
      d3.select(map)
        .attr('viewBox', viewBox);
    }
  }

  function getViewBox(map) {
    var bbox = map.getAttribute('bounds');
    var path = getSVGPath(map);
    var proj = getProjection(map);

    var bounds = function(d) {
      if (d.type === 'Topology') {
        return d.bbox;
      } else {
        return path.bounds(d);
      }
    };

    if (bbox) {
      // "xmin ymin xmax ymax"
      var parts = bbox.split(' ').map(Number);
      bbox = [
        proj([parts[0], parts[1]]),
        proj([parts[2], parts[3]])
      ];
    } else {
      var layers = getDataLayers(map);

      layers.filter('[bbox="true"]')
        .each(function(d) {
          bbox = bounds(d);
        });

      if (!bbox) {
        var bboxes = layers.data()
          .filter(function(d) { return d; })
          .map(function(d) {
            return bounds(d);
          });
        bbox = getBBox(bboxes);
      }
      // console.log('bbox:', bbox);
    }

    return bbox ? bboxToViewBox(bbox) : null;
  }


  function bboxToViewBox(bbox, padding) {
    padding = isNaN(padding) ? 10 : padding;
    return [
      bbox[0][0] - padding,
      bbox[0][1] - padding,
      bbox[1][0] - bbox[0][0] + padding * 2,
      bbox[1][1] - bbox[0][1] + padding * 2
    ].join(' ');
  }


  function getDataLayers(map) {
    return d3.select(map)
      .selectAll('[data-url], [data-feature]');
  }

  function loadLayer(layer, done) {
    if (layer.hasAttribute('data-feature')) {
      var feature = layer.getAttribute('data-feature');
      try {
        feature = JSON.parse(feature);
      } catch (error) {
        throw new Error('Unable to parse data-feature="' + feature + '"');
      }
      var selection = d3.select(layer)
        .datum(feature);
      layer.classList.add('js-loaded');
      return done(null, selection);
    }

    var parent = layer.parentNode;
    while (!is(parent, 'eiti-map')) {
      parent = parent.parentNode;
    }
    var path = parent.getAttribute('data-path') || '';
    var url = path + layer.getAttribute('data-url');
    // console.log('url:', layer, path, '->', url);
    if (!url) return done('no URL');

    layer.classList.add('js-loading');
    eiti.load(url, function(error, data) {
      layer.classList.remove('js-loading');
      if (error) {
        layer.classList.add('js-error');
        return done(error);
      }
      layer.classList.add('js-loaded');
      var selection = d3.select(layer)
        .datum(data);
      done(null, selection);
    });
  }

  function parseBBox(value) {
    return value
      ? value.trim().split(/\s+/).map(Number)
      : null;
  }

  function getBBox(bboxes) {
    var xmin = Infinity,
        ymin = Infinity,
        xmax = -Infinity,
        ymax = -Infinity,
        len = bboxes.length;
    for (var i = 0; i < len; i++) {
      var b = bboxes[i];
      if (!b) continue;
      if (b[0][0] < xmin) xmin = b[0][0];
      if (b[0][1] < ymin) ymin = b[0][1];
      if (b[1][0] > xmax) xmax = b[1][0];
      if (b[1][1] > ymax) ymax = b[1][1];
    }
    return [[xmin, ymin], [xmax, ymax]];
  }

  function getTopologyFeatures(node, d, filter) {
    var key;
    var mesh = node.getAttribute('data-mesh');
    var features;

    if (node.hasAttribute('data-object')) {
      key = node.getAttribute('data-object');

      var obj = d.objects[key];
      if (!obj) {
        throw new Error(
          'invalid object: "' +
          key + '" in: ["' +
          Object.keys(d.objects).join('", "') +
          '"]'
        );
      }

      features = getFeatures(d, obj);

      if (mesh) {
        features.push(d.objects[mesh]
          ? getMesh(d, d.objects[mesh], filter)
          : getMesh(d, obj, filter));
      }
    } else {
      features = [];
      var keys = Object.keys(d.objects);
      var meshIds = (mesh || '').split(',');
      for (key in d.objects) {
        features = features.concat(topojson.feature(d, d.objects[key]).features);
        if (mesh === 'true' || meshIds.indexOf(key) > -1) {
          features.push(getMesh(d, d.objects[key], filter));
        }
      }
    }
    return features;
  }

  function getMesh(topology, object, filter) {
    if (!object) {
      console.warn('no mesh!');
      return {
        type: 'Geometry',
        geom: {
          type: 'Point',
          coordinates: [0, 0]
        },
        properties: {}
      };
    }
    if (filter) {
      filter = evaluator(filter);
      // console.log('filtering %d geometries', object.geometries.length);
      object = {
        type: 'GeometryCollection',
        geometries: object.geometries
          .filter(filter)
      };
      // console.log('filtered %d geometries', object.geometries.length);
    }
    var mesh = topojson.mesh(topology, object);
    mesh.mesh = true;
    return mesh;
  }

  function extend(parent, proto) {
    var constructor = document.createElement(parent).constructor;
    for (var key in proto) {
      if (typeof proto[key] === 'function') {
        proto[key] = {value: proto[key]};
      }
    }
    return Object.create(constructor.prototype, proto);
  }

  function assign(obj, keys) {
    for (var key in keys) {
      obj[key] = keys[key];
    }
    return obj;
  }

  function is(node, name) {
    return node.nodeName.toLowerCase() === name
        || node.getAttribute('is') === name;
  }

  function evaluator(expression) {
    return new Function(
      'd', [
        'with (d) { try { ',
          'return (' + expression + '); ',
        '} catch (error) { ',
          'return null; ',
        '} }'
      ].join(''));
  }

  function getFeatures(topology, obj) {
    return topojson.feature(topology, obj).features;
  }

})(this);
