(function() {

  var pixelize = function(value) {
    return value + 'px';
  };

  var attached = function() {
    var root = d3.select(this);
    var win = d3.select(win);

    var collapsedHeaderHeight = root.node().getBoundingClientRect().height;
    var links = root.selectAll('a');
    var toggles = root.selectAll('[is="aria-toggle"]');

    var button = root.select('button');

    var content = root.select('#mobile-nav-content');

    var jump = function() {
      toggles.each(function() {
        this.collapse();
      });
    };

    var resize = function(e) {
      var windowHeight  = window.innerHeight || e.clientHeight;
      var newHeight = windowHeight - collapsedHeaderHeight;
      content.style('height', pixelize(newHeight));
    }

    links.on('click.nav', function() {
      jump();
    });

    button.on('click.open', function() {
      resize();
    })

    window.addEventListener('resize', function(){
      eiti.util.throttle(resize, 100);
    });
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
