(function() {

  var pixelize = function(value) {
    return value + 'px';
  };

  var attached = function() {
    var root = d3.select(this);
    var win = d3.select(window);
    var doc = d3.select(document);
    var navIsFull = false;

    var collapsedHeaderHeight = root.node().getBoundingClientRect().height;
    var links = root.selectAll('a');
    var toggles = root.selectAll('[is="aria-toggle"]');
    var navItems = root.selectAll('[mobile-nav-item]');

    var button = root.select('button');

    var content = root.select('#mobile-nav-content');

    navItems.each(function () {
      var item = d3.select(this);
      var itemID = item.attr('mobile-nav-item');
      var elementDoesntExists = doc.select('#' + itemID).empty();
      if (elementDoesntExists) {
        item.attr('aria-hidden', true);
      }
    });

    var jump = function() {
      toggles.each(function() {
        this.collapse();
      });
      makeFullScreen(false, false);
    };

    var makeFullScreen = function (toggle, fullScreen) {
      var fullScreen = fullScreen || false;

      if (toggle) {
        fullScreen = !navIsFull;
      }

      root
        .classed('full-screen', fullScreen)
        .classed('container-page-inner-wrapper', fullScreen);

      navIsFull = !navIsFull;
    };

    var resize = function(e) {
      var windowHeight  = window.innerHeight || e.clientHeight;
      var newHeight = windowHeight - collapsedHeaderHeight;
      content.style('height', pixelize(newHeight));

      if (d3.event.type === 'click' || d3.event.type === 'touch') {
        if (root.classed('stuck')) {
          makeFullScreen(true);
        }
      }
    };

    links.on('click.nav', jump);
    button.on('click.toggle', resize);
    win.on('resize.sticky', eiti.util.throttle(resize, 100));
  };

  var detached = function() {
  };

  document.registerElement('mobile-nav', {
    'extends': 'div',
    prototype: Object.create(
      HTMLElement.prototype,
      {
        attachedCallback: {value: attached},
        detachedCallback: {value: detached}
      }
    )
  });

})();
