(function(exports) {

  // TODO: conditionally load dependencies?

  exports.EITIRegionMap = registerElement('region-map', {
    createdCallback: function() {
    },

    attachedCallback: function() {
      this.__svg = this.querySelector('svg') || this.appendChild(document.createElementNS(d3.ns.prefix.svg, 'svg'));

      if (this.hasAttribute('onload')) {
        var callback = new Function('event', this.getAttribute('onload')).bind(this);
        this.addEventListener('load', callback);
      }

      var prog = progressive()
        .on('progress', getListener('progress', this));

      this.loaded = false;
      this.classList.add('__loading');

      var path = this.getAttribute('data-path') || '';
      var q = queue();
      q.defer(prog, d3.csv, path + 'input/geo/states.csv');
      q.defer(prog, d3.json, path + 'output/geo/us-states.json');
      q.defer(prog, d3.json, path + 'output/geo/offshore.json');
      q.await((function onload(error, states, onshore, offshore) {
        this.classList.remove('__loading');
        this.classList.add('__loaded');
        if (error) {
          console.warn('map load error:', error);
          this.classList.add('__error');
          this.dispatchEvent(new CustomEvent('error', {text: error.responseText}));
          return;
        }

        var meshes = [];
        meshes.push(topojson.mesh(onshore, onshore.objects.states));

        var stateProperties = d3.nest()
          .key(function(d) { return d.abbr; })
          .rollup(function(d) { return d[0]; })
          .map(states);

        var stateFeatures = topojson.feature(onshore, onshore.objects.states)
          .features
          .map(function(state) {
            state.properties.name = stateProperties[state.properties.abbr].name;
            state.properties.onshore = true;
            return state;
          });

        // console.log('states:', stateFeatures);
        // console.log('offshore:', offshore);
        // offshore.transform.scale[1] += 2;

        var regionFeatures = Object.keys(offshore.objects)
          .reduce(function(regions, key) {
            var features = topojson.feature(offshore, offshore.objects[key])
              .features
              .map(function(region) {
                region.properties.offshore = true;
                return region;
              });
            meshes.push(topojson.mesh(offshore, offshore.objects[key]));
            return regions.concat(features);
          }, []);

        this.regions = regionFeatures.concat(stateFeatures);
        this.meshes = meshes;

        // console.log('loaded:', this.regions);
        render.call(this);

        this.loaded = true;
        this.dispatchEvent(new CustomEvent('load'));
        this.removeAttribute('unresolved');

      }).bind(this));
    },

    detachedCallback: function() {
    },

    attributeChangedCallback: function(attr, prev, value) {
    },

    zoomTo: function(feature, duration) {
      var bbox = this.__viewBox;
      var svg = d3.select(this.__svg);
      if (feature) {
        if (typeof feature !== 'object') {
          svg.selectAll('g.region')
            .filter(function(d) { return d.id == featureId; })
            .each(function(d) { feature = d; });
        }

        if (feature) {
          var bounds = this.__path.bounds(feature);
          var padding = 10;
          bbox = [
            bounds[0][0] - padding,
            bounds[0][1] - padding,
            bounds[1][0] - bounds[0][0] + padding * 2,
            bounds[1][1] - bounds[0][1] + padding * 2
          ].join(' ');
        } else {
          console.warn('no such feature:', feature);
        }
      } else {
        // XXX
      }

      if (!isNaN(duration)) {
        svg = svg.transition().duration(duration);
      }
      svg.attr('viewBox', bbox);
    },

    loaded: accessor('loaded', Boolean)
  });

  var events = {
    progress: function(e) {
      this.dispatchEvent(new CustomEvent('progress', e));
    }
  };

  function render() {
    var href = this.hasAttribute('data-href')
      ? new Function('d', this.getAttribute('data-href'))
      : null;

    var proj = this.getAttribute('projection') || 'albersCustom';
    if (typeof d3.geo[proj] !== 'function') {
      throw new Error('invalid projection: "' + proj + '"');
    }

    proj = d3.geo[proj]();

    var size = proj.size
      ? proj.size()
      : null;

    var path = d3.geo.path()
      .projection(proj);

    this.__proj = proj;
    this.__path = path;

    var svg = d3.select(this.__svg);

    if (!svg.attr('viewBox')) {
      if (proj.size) {
        svg.attr('viewBox', [0, 0].concat(proj.size()).join(' '));
      } else {
        var bounds = path.bounds({
          type: 'FeatureCollection',
          features: this.regions
        });
        svg.attr('viewBox', [
          bounds[0][0],
          bounds[0][1],
          bounds[1][0] - bounds[0][0],
          bounds[1][1] - bounds[0][1]
        ].join(' '));
      }
    }

    this.__viewBox = svg.attr('viewBox');

    var g = svg.selectAll('g.region')
      .data(this.regions)
      .enter()
      .append('g')
        .attr('class', 'region')
        .classed('onshore', function(d) {
          return d.properties.onshore;
        })
        .classed('offshore', function(d) {
          return d.properties.offshore;
        });

    var a = g.append('a')
      .attr('xlink:href', href);

    a.append('path')
      .attr('class', 'region')
      .attr('d', path);

    var mesh = svg.selectAll('path.mesh')
      .data(this.meshes || [])
      .enter()
      .append('path')
        .attr('class', 'mesh')
        .attr('d', path);
  }

  function getListener(type, obj) {
    var key = '__' + type;
    return obj[key] || (obj[key] = events[type].bind(obj));
  }

  function registerElement(name, proto, parent) {
    if (!parent) parent = HTMLElement;
    for (var key in proto) {
      if (typeof proto[key] === 'function') {
        proto[key] = {value: proto[key]};
        if (key.indexOf('__') === 0) {
          proto[key].enumerable = false;
        }
      }
    }
    return document.registerElement(name, {
      prototype: Object.create(
        parent.prototype,
        proto
      )
    });
  }

  function accessor(name, parse, format, change) {
    var key = '__' + name;
    return {
      enumerable: false,
      get: function() {
        var val = this[key];
        return format
          ? format.call(this, val, key)
          : val;
      },
      set: function(value) {
        if (parse) value = parse.call(this, value, name);
        if (value !== this[key]) {
          this[key] = value;
          if (change) change.call(this, value, key);
        }
      }
    };
  }

  function parseCoordinate(str) {
    return str.split(',').map(Number);
  }

})(this);
