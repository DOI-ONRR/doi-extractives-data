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

    var attrStickyOffset = this.elems.sticky.getAttribute('data-sticky-offset'),
      attrAbsolute = this.elems.sticky.getAttribute('data-absolute');

    this.attrParent = this.elems.sticky.getAttribute('data-offset-parent');

    this.elems.parent = this.elems.sticky.getAttribute('data-offset-parent')
      ? this.elems.sticky.parentNode
      : null;

    this.offset = attrStickyOffset
      ? parseInt(attrStickyOffset)
      : this.parent
        ? this.elems.parent.offsetTop - this.elems.sticky.offsetHeight - 50
        : this.elems.sticky.offsetTop;

    this.isAbsolute = function() {
      var windowWidth = window.innerWidth || document.body.clientWidth;
      this.isMobile = windowWidth < 768;

      var isAbsolute = (attrAbsolute === 'true' && !this.isMobile)
        ? true
        : false;
      return isAbsolute;
    }

    this.status;
    this.lastStatus;
  };

  StickyNav.prototype = {
    setPositions : function () {
      this.height = this.elems.sticky.clientHeight;

      this.lastWidth = this.width || 'initial';
      this.width = this.elems.parent
      ? this.elems.parent.clientWidth + 'px'
      : 'initial';

      this.mainOffset = this.elems.main.offsetTop;
      this.mainHeight = this.elems.main.clientHeight;
      this.diffTop = scrollTop - this.mainOffset - this.offset;
      this.diffBottom = scrollTop + this.height - this.mainHeight - this.mainOffset;
      this.lastStatus = this.status;
      this.lastWidth;

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
    needsUpdate : function() {
      var statusChange = this.status !== this.lastStatus;
      var sizeChange = this.width !== this.lastWidth;
      return statusChange || sizeChange;
    },
    update: function(){
      if (this.diffTop >= 0){
        this.elems.sticky.style.position = 'fixed';
        this.elems.sticky.style.top = 0;
        this.elems.sticky.classList.remove('js-transparent');
        this.elems.sticky.classList.add('js-color');
        this.elems.sticky.style.width = this.width;
        if (this.diffBottom >= 0){
          this.elems.sticky.style.position = 'absolute';
          this.elems.sticky.style.top = this.mainHeight - this.height - 50 + 'px';
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
    run: function() {
      findScrollPositions();
      this.setPositions();
      if (this.needsUpdate()) {
        this.update();
      }
    }
  };

  var stickyNav = new StickyNav();

  stickyNav.run();


  window.addEventListener('scroll', stickyNav.throttle(stickyNav.run, 150, stickyNav));

  window.addEventListener('resize', stickyNav.throttle(stickyNav.run, 150, stickyNav));


  exports.stickyNav = stickyNav;


})(this);
