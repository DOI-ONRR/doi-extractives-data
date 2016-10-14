(function() {

  var attached = function() {
    var root = d3.select(this);

    var links = root.selectAll('a');
    var toggles = root.selectAll('[is="aria-toggle"]');

    var jump = function() {
      toggles.each(function() {
        this.collapse();
      });
    };

    links.on('click.nav', function() {
      jump();
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
