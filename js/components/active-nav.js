(function(exports) {
    var getScrollTop = function(){
      return scrollTop = (window.pageYOffset !== undefined)
        ? window.pageYOffset
        : (document.documentElement
          || document.body.parentNode
          || document.body).scrollTop;
    };

    function isElementInViewport(el) {
      console.log(el)
      var rect = el.getBoundingClientRect();

      return rect.bottom > 0 &&
          rect.right > 0 &&
          rect.left < (window.innerWidth || document. documentElement.clientWidth) /*or $(window).width() */ &&
          rect.top < (window.innerHeight || document. documentElement.clientHeight) /*or $(window).height() */;
    }

    var ActiveNav = function() {
      // init ActiveNav Properties
      this.active = window.location.hash || '#intro';
      this.navItems = document.querySelectorAll('[data-nav-item]');
      this.navHeaders = document.querySelectorAll('[data-nav-header]');
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

    ActiveNav.prototype.addActive = function(el, name){
      if (!el){
        el = document.querySelector('[data-nav-item="' + name + '"]');
        this.active = name;
        el.setAttribute('data-active', true);
      } else {
        this.active = el.getAttribute('data-nav-item');
        el.setAttribute('data-active', true);
      }
    };

    ActiveNav.prototype.update = function(el, name){
      this.removeActive();
      this.addActive(el, name);
    }

    var activeNav = new ActiveNav();

    // init click handlers
    for (var i = 0; i < activeNav.navItems.length; i++) {
      var item = activeNav.navItems[i];
      item.addEventListener('click', function () {
        activeNav.update(this);
      });
    }

    ActiveNav.prototype.chooseNavByScroll = function(){
      // console.log(typeof(this.navHeaders))

      Array.prototype.forEach.call(this.navHeaders, function(header){

        var inViewPort = isElementInViewport(header);
        if (inViewPort) {
          activeNav.update(null, header.name);
        }

      });
    };

    window.addEventListener('scroll', function() {
      // console.log('scroll')
      activeNav.chooseNavByScroll();
    });

    window.addEventListener('resize', function(){
      // console.log('resize')
      // sections = setPageSections();
      activeNav.chooseNavByScroll();
    });


    exports.activeNav = activeNav;
  })(this);
