// globals d3, eiti, EITIBar
(function() {
  // 'use strict';

  var root = d3.select('#disbursements');

  var getter = eiti.data.getter;
  var formatNumber = eiti.format.shortDollars;

  var state = eiti.explore.stateManager()
    .on('change', update);

  var hash = eiti.explore.hash()
    .on('change', state.merge);

  var model = eiti.explore.model(eiti.data.path + 'disbursements/funds.tsv')
    .transform(function(d) {
      d.Total = +d.Total;
    })
    .filter('year', function(data, year) {
      return data.filter(function(d) {
        return d.Year === year;
      });
    })
    .filter('fund', function(data, fund) {
      return data.filter(function(d) {
        return d.Fund === fund;
      });
    })
    .filter('state', function(data, state) {
      return data.filter(function(d) {
        return d.State === state;
      });
    });

  var initialState = hash.read();

  var filters = root.selectAll('[name]');

  filters
    .each(function() {
      if (!(this.name in initialState)) {
        initialState[this.name] = this.value;
      }
    })
    .on('change', function() {
      if (this.type !== 'radio' || this.checked) {
        state.set(this.name, this.value);
      }
    });

  state.init(initialState);

  function update(state) {
    console.log('update:', state.toJS());
    model.load(state, function(error, data) {
      render(data, state);
    });
  }

  function render(data, state) {
    // console.log('render:', data);
    var keys = state.get('groups') || 'Fund,Shore,State';
    keys = keys.split(/,/g);
    console.log('keys:', keys);

    var last = keys.length - 1;
    var groupsText = keys.reduce(function(text, key, i) {
      var glue = ', ';
      switch (i) {
        case 0:
          glue = '';
          break;
        case last:
          glue = i === 1 ? ' and ' : ', and ';
          break;
      }
      return text + glue + key;
    }, '');

    root.select('#groups-text')
      .text(groupsText);

    var tree = nestWith(data, keys);
    tree.name = 'Total';

    console.log('tree:', tree);

    var size = [600, 600];

    var partition = d3.layout.partition()
      .size(size)
      .children(function(d) { return d.children; })
      .value(function(d) { return d.Total; });

    var blocks = partition(tree);
    blocks.forEach(function(d) {
      swap(d, 'x', 'y');
      swap(d, 'dx', 'dy');
    });

    console.log('got %d blocks', blocks.length);

    var fill = {
      root: '#999',
      fund: d3.scale.category10()
    };

    var rectId = function(d, i) {
      return 'rect' + i;
    };

    var textOffset = {
      x: .5,
      y: 1.2
    };

    var label = function(d) {
      var name = d.name || getAllLabelFor(d.level);
      return name + ' (' + formatNumber(d.value) + ')';
    };

    var svg = root.select('#tree')
      .attr('viewBox', [0, 0].concat(size).join(' '))
      .style('font-size', 14);

    var g = svg.selectAll('g')
      .data(blocks);

    g.exit().remove();

    var enter = g.enter().append('g');
    enter.append('title');
    enter.append('rect')
      .attr('stroke', '#fff');
    enter.append('text')
      .attr('fill', '#fff')
      .attr('dx', textOffset.x + 'em')
      .attr('dy', textOffset.y + 'em');

    g.attr('transform', function(d) {
      return 'translate(' + [d.x, d.y] + ')';
    });

    g.select('title')
      .text(label);

    g.select('rect')
      .attr('id', rectId)
      .attr('width', getter('dx'))
      .attr('height', getter('dy'))
      .attr('fill', function(d) {
        return d.hierarchy.level === 'root' ?
          fill.root :
          fill.fund(d.hierarchy.fund);
      });

    g.select('text')
      .text(label)
      .attr('visibility', function(d) {
        var height = this.getBoundingClientRect().height * textOffset.y;
        return (height >= d.dy) ? 'hidden' : null;
      });
  }

  function nestWith(data, keys) {
    var end = keys.length;

    function nest(node, data, index) {
      node.name = node.key;
      node.hierarchy = hierarchy(data, index);

      if (index < end) {
        node.children = groupBy(data, keys[index])
          .map(function(d, i) {
            d.level = keys[index];
            return nest(d, d.values, index + 1);
          });
      } else if (!node.Total) {
        node.Total = d3.sum(node.values, getter('Total'));
      }

      return node;
    }

    function hierarchy(data, index) {
      var hier = {
        level: keys[index - 1] || 'root'
      };
      for (var i = 0; i < index; i++) {
        hier[keys[i].toLowerCase()] = data[0][keys[i]];
      }
      for (i; i < end; i++) {
        hier[keys[i].toLowerCase()] = '*';
      }
      return hier;
    }

    return nest({key: 'root'}, data, 0);
  }

  function groupBy(data, key) {
    return d3.nest()
      .key(function(d) { return d[key]; })
      .entries(data);
  }

  function getAllLabelFor(level) {
    return 'no ' + level.toLowerCase();
  }

  function swap(obj, key1, key2) {
    var tmp = obj[key1];
    obj[key1] = obj[key2];
    obj[key2] = tmp;
  }

})(this);
