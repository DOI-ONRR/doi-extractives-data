(function(exports) {

  var initialize = function() {
    this._cells = [].slice.call(this.querySelectorAll('tr > [data-value]'));
    this.nested_cells = [].slice.call(this.querySelectorAll('tr > [data-value] > [data-value]'));
    this._cells = this._cells.concat(this.nested_cells)
    this.eitiDataMap = this.parentNode.parentNode.querySelector('eiti-data-map');

    this.setYear();
    this.update();
  };

  var setYear = function(year) {

    var root = d3.select(this);

    var year = year || '2013';
    var bars = root.selectAll('[data-value]');
    var texts = root.selectAll('[data-value-text]');
    var swatches = root.selectAll('[data-value-swatch]');
    var label = d3.select(this.parentElement).select('label');

    bars.datum(function() {
        var yearVals = this.getAttribute('data-year-values') &&
          this.getAttribute('data-year-values') !== 'null'
            ? this.getAttribute('data-year-values')
            : '{}';
        var data = JSON.parse(yearVals);
        if (data) {
          return data[year] || 0;
        } else {
          return 0;
        }
      })
      .attr('data-value', function(d) {
        console.log('data-value', d)
        return d;
      });

    texts.datum(function() {
        var yearVals = this.getAttribute('data-year-values') &&
          this.getAttribute('data-year-values') !== 'null'
            ? this.getAttribute('data-year-values')
            : '{}';
        var data = JSON.parse(yearVals);
        if (data) {
          return data[year] || 0;
        } else {
          return 0;
        }
      })
      .attr('data-value-text', function(d) {
        return d;
      })
      .text(function(d) {
        var format = d3.format(this.getAttribute('data-format') || ',')
        console.log('data-value', d)
        if (format) {
          return format(d);
        } else {
          return d;
        }
      });

    var that = this;
    swatches.datum(function() {
        var yearVals = this.getAttribute('data-year-values') &&
            this.getAttribute('data-year-values') !== 'null'
              ? this.getAttribute('data-year-values')
              : '{}';
        var data = JSON.parse(this.getAttribute('data-year-values') || '{}');
        if (data) {
          return data[year] || 0;
        } else {
          return 0;
        }
      })
      .attr('data-value-swatch', function(d) {
        console.log('data-value-swatch', d)
        return d;
      })
      .style('background-color', function (d) {
        if (d && that.eitiDataMap.scale) {
          return that.eitiDataMap.scale(d);
        }
      });

    label.select('[data-year]')
      .attr('data-year', year)
      .text(year)
  }

  var update = function() {
    if (!this._cells.length) {
      return;
    }

    var series = {};
    var autolabel = this.getAttribute('autolabel') === 'true';

    this._cells.forEach(function(cell) {
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
        } else if (cell.parentNode.hasAttribute('data-value')) {
          console.warn('cell is child', i);
        }

        var childCell = cell.querySelector('[data-value]');

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


        var barExtent = cell.querySelector('.bar');
        if (barExtent) {
          var bar = barExtent.querySelector('.bar');
        }

        if (!barExtent && !bar) {
          barExtent = document.createElement('div');
          barExtent.className = 'bar';
          bar = document.createElement('div');
          bar.className = 'bar';
          var span = cell.querySelector('span');
          if (span && barExtent && bar) {
            cell.insertBefore(barExtent,span);
            barExtent.appendChild(bar);
          }
        }

        if (childCell) {
          var childBar = document.createElement('div');
          childBar.className = 'bar';
          bar.appendChild(childBar);
        }

        var value = +cell.dataset.value;
        var size = width(value);

        if (childCell) {
          var childValue = +childCell.dataset.value;
          size = width(value) + width(childValue);
          var diff = childValue - value;
          var largerSize = diff > 0
            ? width(childValue) / (size / 100)
            : width(value) / (size / 100);
          bar.style.setProperty(sizeProperty, Math.abs(size) + '%');
          childBar.style.setProperty(sizeProperty, Math.abs(largerSize) + '%');
        } else {
          bar.style.setProperty(sizeProperty, Math.abs(size) + '%');
        }

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

        setYear: {value: setYear},

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
