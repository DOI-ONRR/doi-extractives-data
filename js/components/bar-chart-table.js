(function(exports) {

  var initialize = function() {
    this.cells = [].slice.call(this.querySelectorAll('tr > [data-value]'));
    this.update();
  };

  var update = function() {
    if (!this.cells.length) {
      return;
    }

    var series = {};
    var autolabel = this.getAttribute('autolabel') === 'true';

    this.cells.forEach(function(cell) {
      var key = cell.dataset.series || 'default';
      if (key in series) {
        series[key].push(cell);
      } else {
        series[key] = [cell];
      }
    });

    Object.keys(series).forEach(function(key) {
      var cells = series[key];
      var values = cells.map(function(cell) {
        return +cell.dataset.value;
      });

      var extent = d3.extent(values);
      if (this.hasAttribute('data-' + key + '-min')) {
        extent[0] = +this.dataset[key + 'Min'];
      } else if (this.hasAttribute('data-min')) {
        extent[0] = +this.dataset.min;
      } else {
        extent[0] = Math.min(extent[0], 0);
      }

      if (this.hasAttribute('data-' + key + '-max')) {
        extent[1] = +this.dataset[key + 'Max'];
      } else if (this.hasAttribute('data-max')) {
        extent[1] = +this.dataset.max;
      }

      var range = [0, 100];
      var min = extent[0];
      var max = extent[1];
      var negative = min < 0;
      var zero = 0;
      var width = d3.scale.linear()
        .domain(extent)
        .range(range)
        .clamp(true);

      var offset;
      var sizeProperty = 'width';
      var offsetProperty = 'margin-left';

      if (negative) {
        var length = max - min;
        zero = 100 * (0 - min) / length;
        offset = d3.scale.linear()
          .domain([min, 0, max])
          .range([0, zero, zero])
          .clamp(true);
        width = d3.scale.linear()
          .domain([min, 0, max])
          .range([100 * -min / length, 0, 100 * max / length])
          .clamp(true);
      }

      if (this.orient === 'vertical') {
        sizeProperty = 'height';
        offsetProperty = 'bottom';
      }

      cells.forEach(function(cell, i) {
        if (!cell) {
          console.warn('no cell @', i);
          return;
        }

        // TODO only do this if autolabel="true"?
        if (cell.childNodes.length === 1 && cell.firstChild.nodeType === Node.TEXT_NODE) {
          if (autolabel) {
            cell.setAttribute('aria-label', cell.firstChild.textContent);
            cell.removeChild(cell.firstChild);
          } else {
            var text = cell.removeChild(cell.firstChild);
            var span = cell.appendChild(document.createElement('span'));
            span.className = 'text';
            span.appendChild(text);
          }
        }

        var bar = cell.querySelector('.bar');
        if (!bar) {
          bar = document.createElement('div');
          bar.className = 'bar';
          cell.appendChild(bar);
        }

        var value = +cell.dataset.value;
        var size = width(value);
        bar.style.setProperty(sizeProperty, Math.abs(size) + '%');
        if (offset) {
          bar.style.setProperty(offsetProperty, offset(value) + '%');
        } else {
          bar.style.removeProperty(offsetProperty);
        }
      });

    }, this);
  };

  exports.EITIBarChartTable = document.registerElement('bar-chart-table', {
    'extends': 'table',
    prototype: Object.create(
      HTMLTableElement.prototype,
      {
        attachedCallback: {value: initialize},

        attributeChangedCallback: {value: function(attr, old, value) {
          switch (attr) {
            case 'orient':
              this.update();
          }
        }},

        update: {value: update},

        orient: {
          get: function() {
            return this.getAttribute('orient');
          },
          set: function(value) {
            if (value !== this.orient) {
              this.setAttribute('orient', value);
            }
          }
        }
      }
    )
  });

})(this);
