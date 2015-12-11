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
    this.offset = attrStickyOffset
      ? parseInt(attrStickyOffset)
      : this.elems.sticky.offsetTop;
    this.absolute = (attrAbsolute === 'true')
      ? true
      : false
    this.status;
    this.lastStatus;
  };

  StickyNav.prototype = {
    setPositions : function () {
      this.height = this.elems.sticky.clientHeight;
      this.mainOffset = this.elems.main.offsetTop;
      this.mainHeight = this.elems.main.clientHeight;
      this.diffTop = scrollTop - this.mainOffset - this.offset;
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
    needsUpdate : function() {
      return this.status !== this.lastStatus;
    },
    update: function(){
      if (this.diffTop >= 0){
        this.elems.sticky.style.position = 'fixed';
        this.elems.sticky.style.top = 0;
        this.elems.sticky.classList.remove('js-transparent');
        this.elems.sticky.classList.add('js-color');
        if (this.diffBottom >= 0){
          this.elems.sticky.style.position = 'absolute';
          this.elems.sticky.style.top = this.mainHeight - this.height - 50 + 'px';
          this.elems.sticky.classList.remove('js-transparent');
          this.elems.sticky.classList.add('js-color');
        } else {
          this.elems.sticky.style.position = 'fixed';
          this.elems.sticky.style.top = 0;
          this.elems.sticky.classList.remove('js-transparent');
          this.elems.sticky.classList.add('js-color');
        }
      } else {
        this.elems.sticky.classList.remove('js-color');
        this.elems.sticky.classList.add('js-transparent');

        if (this.absolute) {
          this.elems.sticky.style.position = 'absolute';
        } else {
          this.elems.sticky.style.position = 'static';
        }

      }
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

    stickyNav.setPositions();
    if (stickyNav.needsUpdate()) {
      stickyNav.update();
    }
  }

  var scrollTimer, lastScrollFireTime = 0;

  window.addEventListener('scroll', function() {

    var minScrollTime = 100;
    var now = new Date().getTime();

    function processScroll() {
      // console.log(new Date().getTime().toString());
      runStickyPositions();
    }

    if (!scrollTimer) {
        if (now - lastScrollFireTime > (3 * minScrollTime)) {
            processScroll();   // fire immediately on first scroll
            lastScrollFireTime = now;
        }
        scrollTimer = setTimeout(function() {
            scrollTimer = null;
            lastScrollFireTime = new Date().getTime();
            processScroll();
        }, minScrollTime);
    }
  });


  exports.stickyNav = stickyNav;


})(this);
