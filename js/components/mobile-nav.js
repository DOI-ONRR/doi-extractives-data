(function() {

  var pixelize = function(value) {
    return String(value).match(/px/)
      ? value
      : value + 'px';
  };

  var rem = function (rems) {
    return Number(rems) * 16;
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

    var makeFullScreen = function (toggle, fullScreen) {
      fullScreen = fullScreen || false;

      if (toggle) {
        fullScreen = !navIsFull;
      }

      root
        .classed('full-screen', fullScreen)
        .classed('container-page-inner-wrapper', fullScreen);

      navIsFull = !navIsFull;
    };

    var hideNextSibling = function () {
      var nextSibling = d3.select(root.node().nextElementSibling);
      var nextSiblingTagName = root.node().nextElementSibling
        .tagName.toLowerCase();
      if (!nextSibling.empty()) {
        if (nextSiblingTagName !== 'section') {
          nextSibling.style('height', pixelize(rem(4)));
        }
      }
    };

    var jump = function() {
      toggles.each(function() {
        this.collapse();
      });
      makeFullScreen(false, false);
      hideNextSibling();
    };

    var resize = function(e) {
      var event = e || d3.event || window.event;
      var target = event.currentTarget
        || document.querySelector('.mobile-nav button');
      var type = event.type;
      var windowHeight  = window.innerHeight || e.clientHeight;
      var newHeight = windowHeight - collapsedHeaderHeight;

      if (type === 'click' || type === 'touch') {
        var isExpanded = target.getAttribute('aria-expanded') === 'true';
        if (root.classed('stuck')) {
          makeFullScreen(true);
        }
        if (!isExpanded) {
          hideNextSibling();
        }
      } else {
        content.style('height', pixelize(newHeight));
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
