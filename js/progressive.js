(function(exports) {

  var progressive = function() {
    var reqs = [];
    var loaded = 0;
    var total = 0;
    var indeterminate = true;
    var dispatch = d3.dispatch('progress', 'load', 'error');

    var progress = function() {
      // console.warn('progress:', arguments);
      var args = [].slice.call(arguments);
      var fn = args.shift();
      return fn.apply(this, args)
	.on('error.p', onerror)
        .on('progress.p', onprogress)
        .on('load.p', onload);
    };

    function onprogress() {
      var req = this;
      var e = d3.event;
      req.loaded = e.loaded;
      req.total = e.total;
      if (reqs.indexOf(req) === -1) {
        reqs.push(req);
      }
      update();
    }

    function onload() {
      var req = this;
      req.loaded = req.total = Math.max(req.loaded, req.total);
      update();
      reqs.splice(reqs.indexOf(req), 1);
      if (reqs.length === 0) {
        dispatch.load({
          total: total
        });
      }
    }

    function onerror(error) {
      console.log('error:', this, error);
      dispatch.error.call(this, error);
    }

    function update() {
      var totals = [];
      loaded = 0;
      reqs.forEach(function(req) {
        totals.push(req.total);
        loaded += req.loaded;
      });
      indeterminate = totals.some(function(t) {
        return !t;
      });
      total = totals.reduce(function(x, y) {
        return (x || 0) + y;
      }, 0);
      dispatch.progress({
        loaded: loaded,
        total: total,
        indeterminate: indeterminate,
        requests: reqs
      });
    }

    return d3.rebind(progress, dispatch, 'on');
  };

  progressive.bar = function(prog) {
    var format = d3.format('.2s');

    var bar = function(selection) {
      prog.on('progress', function(e) {
        // console.log('progress:', e);
        var width = e.indeterminate
          ? 100
          : (e.loaded / e.total * 100).toFixed(1);
        selection.select('.bar')
          .classed('indeterminate', e.indeterminate)
          .style('width', width + '%')
          .select('.label')
            .text([
              'loaded',
              format(e.loaded), 'of',
              format(e.total), 'total'
            ].join(' '));
      })
      .on('load', function(e) {
        // console.log('load:', e);
        selection
          .classed('loaded', true)
          .select('.bar')
            .classed('indeterminate', false)
            .style('width', '100%')
            .select('.label')
              .text('loaded ' + format(e.total) + ' of data');
      })
      .on('error', function(req) {
	selection.classed('error', true)
	  .select('.bar')
	    .style('width', '100%')
	    .select('.label')
	      .text('error: ' + req.status + ' ')
	      .append('tt')
		.text(req.responseURL);
      });
    };

    return bar;
  };

  exports.progressive = progressive;

})(this);
