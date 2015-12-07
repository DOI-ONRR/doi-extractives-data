(function(exports) {
    var scrollLeft,
      scrollTop,
      sections;

    var getScrollTop = function(){
      return scrollTop = (window.pageYOffset !== undefined)
        ? window.pageYOffset
        : (document.documentElement
          || document.body.parentNode
          || document.body).scrollTop;
    };

    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();

        return rect.bottom > 0 &&
            rect.right > 0 &&
            rect.left < (window.innerWidth || document. documentElement.clientWidth) /*or $(window).width() */ &&
            rect.top < (window.innerHeight || document. documentElement.clientHeight) /*or $(window).height() */;
    }

    var ActiveNav = function() {

      // console.log(window.location.hash)
      this.active = window.location.hash || '#intro';
      this.navItems = document.querySelectorAll('[data-nav-item]');
      // this.scrollTop = {
      //   current: getScrollTop(),
      //   prev: getScrollTop()
      // }

      // this.scrollDirection = function(current, prev) {
      //   return (current > prev)
      //     ? 'down'
      //     : 'up';
      // }
    }

    // ActiveNav.prototype.updateScrollTop = function() {
    //   this.scrollTop.prev = this.scrollTop.current;
    //   this.scrollTop.current = getScrollTop();
    //   this.scrollDirection(current, prev);
    // }



    ActiveNav.prototype.removeActive = function(){
      // console.log('navItems', navItems)
      this.active = null;
      for (var i = 0; i < this.navItems.length; i++) {
        this.navItems[i].setAttribute('data-active', false);
      }
    };

    ActiveNav.prototype.addActive = function(el){
      this.active = el.getAttribute('data-na-item');
      el.setAttribute('data-active', true);
    };

    ActiveNav.prototype.update = function(el){
      this.removeActive();
      this.addActive(el);
    }

    var activeNav = new ActiveNav();

    for (var i = 0; i < activeNav.navItems.length; i++) {
      var item = activeNav.navItems[i];
      item.addEventListener('click', function () {
        activeNav.update(this);
      });
    }

    var chooseNavByScroll = function(){
      //

      var navHeaders = document.querySelectorAll('[data-nav-header]');
      // console.log('navHeaders', navHeaders, typeof(navHeaders))

      Array.prototype.forEach.call(navHeaders, function(header){
        // console.log('header', header)
        var inViewPort = isElementInViewport(header)
        // console.log(header.name, inViewPort)
        if (inViewPort) {
          activeNav.active = header.name;
          removeActive();
          addActive(header.name);
        }

      });

      // console.log(activeNav)

    };




    window.addEventListener('scroll', function() {
      // console.log('scroll')
      // chooseNavByScroll();
    });

    window.addEventListener('resize', function(){
      // console.log('resize')
      // sections = setPageSections();
      chooseNavByScroll();
    });


    exports.activeNav = activeNav;
  })(this);
