(function(exports) {
    function getScrollTop() {
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
          rect.left < (window.innerWidth || document. documentElement.clientWidth) &&
          rect.top < (window.innerHeight || document. documentElement.clientHeight);
    }

    var ActiveNav = function() {
      // init ActiveNav Properties
      this.active = window.location.hash || '#intro';
      this.navItems = document.querySelectorAll('[data-nav-item]');
      this.navHeaders = document.querySelectorAll('[data-nav-header]');
      this.scrollTop = {
        current: getScrollTop(),
        prev: getScrollTop(),
        direction: 'down'
      }
    }

    ActiveNav.prototype.updateScrollTop = function() {
      this.scrollTop.prev = this.scrollTop.current;
      this.scrollTop.current = getScrollTop();
      this.scrollTop.direction = (this.scrollTop.current >= this.scrollTop.prev)
        ? 'down'
        : 'up';
    }

    ActiveNav.prototype.removeActive = function(){
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

    ActiveNav.prototype.detectNavChange = function(){

      function reverseH(navHeaders) {
        var newHeaders = [];
        for (var i = navHeaders.length - 1; i >= 0; i--) {
          newHeaders.push(navHeaders[i])
        };
        return newHeaders;
      }

      var navHeaders = (this.scrollTop.direction === 'up')
        ? reverseH(this.navHeaders)
        : this.navHeaders;

      Array.prototype.forEach.call(navHeaders, function(header){

        var inViewPort = isElementInViewport(header);
        if (inViewPort) {
          activeNav.update(null, header.name);
        }
      });
    };

    window.addEventListener('scroll', function() {
      activeNav.updateScrollTop();
      activeNav.detectNavChange();
    });

    window.addEventListener('resize', function(){
      activeNav.detectNavChange();
    });

    exports.activeNav = activeNav;
  })(this);
