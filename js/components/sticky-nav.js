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
    }
    this.height = this.elems.sticky.clientHeight;
    this.offset = this.elems.sticky.offsetTop;
  };

  StickyNav.prototype = {
    setPositions : function () {
      this.mainOffset = this.elems.main.offsetTop;
      this.mainHeight = this.elems.main.clientHeight;
      this.diffTop = scrollTop - this.mainOffset - this.offset;
      this.diffBottom = scrollTop + this.height - this.mainHeight - this.mainOffset;
    },
    update: function(){
      if (this.diffTop >= 0){
        this.elems.sticky.style.position = 'fixed';
        this.elems.sticky.style.top = 0;
        if (this.diffBottom >= 0){
          this.elems.sticky.style.position = 'absolute';
          this.elems.sticky.style.top = this.mainHeight - this.height - 50 + 'px';
        } else {
          this.elems.sticky.style.position = 'fixed';
          this.elems.sticky.style.top = 0;
        }
      } else {
        this.elems.sticky.style.position = 'static';
      }
    }
  }

  var stickyNav = new StickyNav();

  findScrollPositions();
  stickyNav.setPositions();
  stickyNav.update();

  window.addEventListener('scroll', function() {
    findScrollPositions();
    stickyNav.setPositions();
    stickyNav.update();
  });


  exports.stickyNav = stickyNav;


})(this);
