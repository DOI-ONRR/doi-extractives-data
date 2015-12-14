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
    var attrAbsolute = this.elems.sticky.getAttribute('data-absolute');

    this.attrParent = this.elems.sticky.getAttribute('data-offset-parent');

    this.elems.parent = this.elems.sticky.getAttribute('data-offset-parent')
      ? this.elems.sticky.parentNode
      : null;

    this.determineScreen = function() {
      var windowWidth = window.innerWidth || document.body.clientWidth;
      this.wasMobile = this.isMobile;
      this.isMobile = windowWidth < 768;
    }

    this.determineScreen();

    this.isAbsolute = function() {

      var isAbsolute = (attrAbsolute === 'true' && !this.isMobile)
        ? true
        : false;
      return isAbsolute;
    }

      this.offset = this.attrStickyOffset
        ? parseInt(this.attrStickyOffset)
        : !this.elems.parent
          ? this.elems.sticky.offsetTop
          : this.attrParent === 'mobile' && this.isMobile
            ? this.elems.parent.offsetTop - this.elems.sticky.offsetHeight
            : this.elems.sticky.offsetTop

    this.status;
    this.lastStatus;
    this.lastWidth;
    this.lastWindowWidth;
  };

  StickyNav.prototype = {
    setOffset: function() {
      console.log('~~offset before~~~~', this.offset)
      this.offset = this.attrStickyOffset
        ? parseInt(this.attrStickyOffset)
        : !this.elems.parent
          ? this.elems.sticky.offsetTop
          : this.attrParent === 'mobile' && this.isMobile
            ? this.elems.parent.offsetTop - this.elems.sticky.offsetHeight
            : this.elems.sticky.offsetTop
      console.log('~~offset after~~~~', this.offset)
    },
    setPositions: function (mutate) {

      this.height = this.elems.sticky.clientHeight;

      this.lastWidth = this.width || 'initial';
      var windowWidth = window.innerWidth || document.body.clientWidth;
      windowBump = windowWidth > 1044 || this.isMobile ? 0 : -20;
      this.width = this.elems.parent
        ? this.elems.parent.clientWidth + windowBump + 'px'
        : 'initial';

      this.mainOffset = this.elems.main.offsetTop;
      this.mainHeight = this.elems.main.clientHeight;
      // Todo diff bottom and diff top aren't working, and aren't
      // maintainable
      this.diffTop = scrollTop - this.mainOffset - this.offset;

      // this.diffBottom = distance from top of screen to bottom of stickyNav (scrollTop + this.height)
      // minus height of height of main and it
      this.diffBottom = scrollTop + this.height - this.mainHeight - this.mainOffset;
      this.lastStatus = this.status;
      if (this.diffTop >= 0){
        this.status = 'fixed';
        if (this.diffBottom >= 0){
          this.status = 'absolute';
        } else {
          this.status = 'fixed';
        }
      } else {
        this.status = 'static';
      }
    },
    screenUpdate: function() {
      var windowChange = this.isMobile !== this.wasMobile;
      if (windowChange) {
        console.log('======windowChange=====')
        // debugger
        this.setOffset();
      }
    },
    needsUpdate: function(mutate) {
      var statusChange = this.status !== this.lastStatus;
      var sizeChange = this.width !== this.lastWidth;
      // this.determineScreen();
      // var windowChange = this.isMobile !== this.wasMobile;
      // return true;
      return statusChange || sizeChange;
    },
    update: function() {
      if (this.diffTop >= 0){
        this.elems.sticky.style.position = 'fixed';
        this.elems.sticky.style.top = 0;
        this.elems.sticky.classList.remove('js-transparent');
        this.elems.sticky.classList.add('js-color');
        this.elems.sticky.style.width = this.width;

        // for bottom
        // console.log(this.diffBottom)
        if (this.diffBottom >= 0){
          this.elems.sticky.style.position = 'absolute';
          console.log(this.mainHeight, this.height, this.offset, this.mainOffset)

      // this.diffBottom = scrollTop + this.height - this.mainHeight - this.mainOffset;
          console.log(this.mainHeight - this.height - this.offset - this.mainOffset + 'px')
          // this.elems.sticky.style.top = this.mainHeight - this.mainOffset - this.height + 'px';
          this.elems.sticky.style.top = this.mainHeight - this.height - this.mainOffset - this.offset - 50 + 'px';

          this.elems.sticky.classList.remove('js-transparent');
          this.elems.sticky.classList.add('js-color');
          this.elems.sticky.style.width = this.width;
        } else {
          this.elems.sticky.style.position = 'fixed';
          this.elems.sticky.style.top = 0;
          this.elems.sticky.classList.remove('js-transparent');
          this.elems.sticky.classList.add('js-color');
          this.elems.sticky.style.width = this.width;
        }
      } else {
        this.elems.sticky.classList.remove('js-color');
        this.elems.sticky.classList.add('js-transparent');
        this.elems.sticky.style.width = this.width;

        if (this.isAbsolute()) {
          this.elems.sticky.style.position = 'absolute';
        } else {
          this.elems.sticky.style.position = 'static';
        }

      }
    },
    throttle : function (fn, threshhold, scope) {
      console.log('throttle')
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
    run: function(mutate) {
      if (mutate === 'mutate') {
        console.log('------mutate event------')
        this.setPositions();
        this.setOffset();
        if (this.needsUpdate()) {
          this.update();
        }
      } else {
        findScrollPositions();
        this.determineScreen();
        this.screenUpdate();
        this.setPositions();
        if (this.needsUpdate()) {
          this.update();
        }
      }

    }
  };

  var stickyNav = new StickyNav();

  stickyNav.run();

  window.addEventListener('scroll', stickyNav.throttle(stickyNav.run, 150, stickyNav));

  window.addEventListener('resize', stickyNav.throttle(stickyNav.run, 150, stickyNav));

  // documentation: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
  var observer = new MutationObserver(function (mutations) {
    stickyNav.run('mutate');
  });

  // set up your configuration
  // this will watch to see if you insert or remove any children
  var config = { subtree: true, childList: true };

  //start observing
  observer.observe(stickyNav.elems.sticky, config);

  // other potential elem listener
  // http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/

  exports.stickyNav = stickyNav;


})(this);
