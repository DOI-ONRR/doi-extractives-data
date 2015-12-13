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
    // throttle = function(fn, frequency) {
    //   console.log('scroll')
    //   var scrollTimer, lastScrollFireTime = 0;

    //   var minScrollTime = 100;
    //   var now = new Date().getTime();

    //   function processScroll() {
    //     // console.log(new Date().getTime().toString());
    //     // runStickyPositions();
    //     fn()
    //   }

    //   if (!scrollTimer) {
    //       if (now - lastScrollFireTime > (3 * minScrollTime)) {
    //           processScroll();   // fire immediately on first scroll
    //           lastScrollFireTime = now;
    //       }
    //       scrollTimer = setTimeout(function() {
    //           scrollTimer = null;
    //           lastScrollFireTime = new Date().getTime();
    //           processScroll();
    //       }, minScrollTime);
    //   }
    // },
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
    }
  };

  var stickyNav = new StickyNav();

  findScrollPositions();
  stickyNav.setPositions();
  if (stickyNav.needsUpdate()) {
    stickyNav.update();
  }

  var runStickyPositions = function () {

    findScrollPositions();
    console.log('run sticky', stickyNav.needsUpdate())
    stickyNav.setPositions();
    if (stickyNav.needsUpdate()) {
      stickyNav.update();
    }
  };

  var scrollTimer, lastScrollFireTime = 0;

  window.addEventListener('scroll', runStickyPositions, 100)

  window.addEventListener('resize', runStickyPositions, 100)


  // window.addEventListener('scroll', function() {
  //   // console.log('scroll')

  //   // var minScrollTime = 100;
  //   // var now = new Date().getTime();

  //   // function processScroll() {
  //   //   // console.log(new Date().getTime().toString());
  //   //   runStickyPositions();
  //   // }

  //   // if (!scrollTimer) {
  //   //     if (now - lastScrollFireTime > (3 * minScrollTime)) {
  //   //         processScroll();   // fire immediately on first scroll
  //   //         lastScrollFireTime = now;
  //   //     }
  //   //     scrollTimer = setTimeout(function() {
  //   //         scrollTimer = null;
  //   //         lastScrollFireTime = new Date().getTime();
  //   //         processScroll();
  //   //     }, minScrollTime);
  //   // }
  //   stickyNav.throttle(runStickyPositions, 100);
  // });

  // window.addEventListener('resize', function() {
    // console.log('resize')
    // var minScrollTime = 100;
    // var now = new Date().getTime();

    // function processScroll() {
    //   console.log('process resize')
    //   // console.log(new Date().getTime().toString());
    //   runStickyPositions();
    // }

    // if (!scrollTimer) {
    //     if (now - lastScrollFireTime > (3 * minScrollTime)) {
    //         processScroll();   // fire immediately on first scroll
    //         lastScrollFireTime = now;
    //     }
    //     scrollTimer = setTimeout(function() {
    //         scrollTimer = null;
    //         lastScrollFireTime = new Date().getTime();
    //         processScroll();
    //     }, minScrollTime);
    // }
  //   stickyNav.throttle(runStickyPositions, 100);
  // });

  exports.stickyNav = stickyNav;


})(this);
