(function(exports) {

  var scrollLeft,
    scrollTop;

  var findScrollPositions = function(){
    scrollLeft = (window.pageXOffset !== undefined)
      ? window.pageXOffset
      : (document.documentElement
        || document.body.parentNode
        || document.body).scrollLeft;
    scrollTop = (window.pageYOffset !== undefined)
      ? window.pageYOffset
      : (document.documentElement
        || document.body.parentNode
        || document.body).scrollTop;

  };

  var StickyNav = function() {

    this.elems = {
      sticky : document.querySelector('.sticky_nav'),
      main: document.querySelector('main')
    };

    this.attrStickyOffset = this.elems.sticky.getAttribute('data-sticky-offset');
    this.attrOffsetBottom = parseInt(this.elems.sticky.getAttribute('data-offset-bottom')) || 0;
    this.maxWidth = this.elems.sticky.getAttribute('data-max-width');
    var attrAbsolute = this.elems.sticky.getAttribute('data-absolute');

    this.attrParent = this.elems.sticky.getAttribute('data-offset-parent');

    this.elems.parent = this.elems.sticky.getAttribute('data-offset-parent')
      ? this.elems.sticky.parentNode
      : null;

    this.determineScreen = function() {
      var windowWidth = window.innerWidth || document.body.clientWidth;
      this.wasMobile = this.isMobile;
      this.isMobile = windowWidth < 768;
    };

    this.determineScreen();

    this.isAbsolute = function() {

      var isAbsolute = (attrAbsolute === 'true' && !this.isMobile)
        ? true
        : false;
      return isAbsolute;
    }




    this.status;
    this.lastStatus;
    this.lastWidth;
    this.lastWindowWidth;
  };

  StickyNav.prototype = {
    setOffset: function () {
      this.offset = this.attrStickyOffset
        ? parseInt(this.attrStickyOffset)
        : !this.elems.parent
          ? this.elems.sticky.offsetTop
          : ( this.attrParent === 'mobile' && this.isMobile )
            ? this.elems.parent.offsetTop - this.elems.sticky.offsetHeight
            : this.elems.sticky.offsetTop
    },
    getPositions: function () {

      this.height = this.elems.sticky.clientHeight;

      this.lastWidth = this.width || 'initial';
      var windowWidth = window.innerWidth || document.body.clientWidth,
        windowBump = windowWidth > 1044 || this.isMobile ? 0 : -20;
      this.width = this.elems.parent
        ? this.elems.parent.clientWidth + windowBump + 'px'
        : this.maxWidth;

      this.mainOffset = this.elems.main.offsetTop;
      this.mainHeight = this.elems.main.clientHeight;

      this.diffTop = scrollTop - this.mainOffset - this.offset;

      this.diffBottom = scrollTop + this.height - this.mainHeight - this.mainOffset;
      this.lastStatus = this.status;
      if (this.diffTop >= 0){
        this.status = 'fixed';
        if (this.diffBottom >= 0){
          this.status = 'absolute';
        }
      } else {
        this.status = 'static';
      }
    },
    needsUpdate: function(init) {
      var statusChange = this.status !== this.lastStatus;
      var sizeChange = this.width !== this.lastWidth;
      var updateNeeded = undefined;
      if (!statusChange && sizeChange) {
        updateNeeded = 'size';
      } else if (statusChange && !sizeChange) {
        updateNeeded = 'status';
      } else if (statusChange && sizeChange || init === 'init') {
        updateNeeded = 'both';
      }
      return updateNeeded;
    },
    update: function(updateNeeded) {
      if (!updateNeeded) {
        return;
      } else {
        if (this.diffTop >= 0){
          if (updateNeeded === 'status' || updateNeeded === 'both') {
            this.elems.sticky.style.position = 'fixed';
            this.elems.sticky.style.top = 0;
            this.elems.sticky.classList.remove('js-transparent');
            this.elems.sticky.classList.add('js-color');
          }

          if (updateNeeded === 'size' || updateNeeded === 'both') {
            this.elems.sticky.style.width = this.width;
          }

          if (this.diffBottom >= 0){
            if (updateNeeded === 'status' || updateNeeded === 'both') {
              this.elems.sticky.style.position = 'absolute';

              if ( this.attrParent === 'mobile' && this.isMobile ) {
                this.elems.sticky.style.top = this.mainHeight - this.offset - this.height - this.attrOffsetBottom + 'px';
              } else {
                this.elems.sticky.style.top = this.mainHeight - this.height - this.attrOffsetBottom + 'px';
              }
            }
          }
        } else {
          if (updateNeeded === 'status' || updateNeeded === 'both') {
            this.elems.sticky.classList.remove('js-color');
            this.elems.sticky.classList.add('js-transparent');
            if (this.isAbsolute()) {
              this.elems.sticky.style.position = 'absolute';
            } else {
              this.elems.sticky.style.position = 'static';
            }
          }

          if (updateNeeded === 'size' || updateNeeded === 'both') {
            this.elems.sticky.style.width = this.width;
          }
        }
      }
    },
    throttle : function (fn, threshhold, scope) {
      threshhold || (threshhold = 250);
      var last,
          deferTimer;
      return function () {
        var context = scope || this;

        var now = +new Date,
            args = arguments;
        if (last && now < last + threshhold) {
          // hold on to it
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function () {
            last = now;
            fn.apply(context, args);
          }, threshhold);
        } else {
          last = now;
          fn.apply(context, args);
        }
      };
    },
    run: function(init) {
      findScrollPositions();
      if (init === 'init') {
        this.setOffset();
      }
      this.getPositions();
      this.update(this.needsUpdate(init));
    }
  };

  var stickyNav = new StickyNav();

  var loadDelay = stickyNav.elems.sticky.getAttribute('data-load-delay');
  if (loadDelay) {
    setTimeout(function() {
      stickyNav.run('init');
    }, parseInt(loadDelay));
  } else {
    stickyNav.run('init');
  }



  window.addEventListener('scroll', stickyNav.throttle(stickyNav.run, 130, stickyNav));

  window.addEventListener('resize', stickyNav.throttle(stickyNav.run, 150, stickyNav));

  // documentation: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  var observer = new MutationObserver(function () {
    stickyNav.run();
  });

  // set up your configuration
  // this will watch to see if you insert or remove any children
  var config = { subtree: true, childList: true };

  // start observing
  observer.observe(stickyNav.elems.sticky, config);

  // other potential elem listener
  // http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/

  exports.stickyNav = stickyNav;


})(this);
