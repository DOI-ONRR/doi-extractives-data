(function(exports) {
    function getScrollTop() {
      return (window.pageYOffset !== undefined)
        ? window.pageYOffset
        : (document.documentElement
          || document.body.parentNode
          || document.body).scrollTop;
    }

    function isElementInViewport(el) {
      var rect = el.getBoundingClientRect();

      return rect.bottom > 0 &&
          rect.right > 0 &&
          rect.left < (window.innerWidth || document. documentElement.clientWidth) &&
          rect.top < (window.innerHeight || document. documentElement.clientHeight);
    }

    var OpenListNav = function() {

      this.navSelect = $('[data-nav-options]');
      this.navHeaders = document.querySelectorAll('[data-nav-header]');
      this.scrollTop = {
        current: getScrollTop(),
        prev: getScrollTop(),
        direction: 'down'
      };
    };

    OpenListNav.prototype.updateScrollTop = function() {
      this.scrollTop.prev = this.scrollTop.current;
      this.scrollTop.current = getScrollTop();
      this.scrollTop.direction = (this.scrollTop.current >= this.scrollTop.prev)
        ? 'down'
        : 'up';
    };

    OpenListNav.prototype.updateSelectField = function(newValue) {
      if (newValue){
        return this.navSelect.val(newValue);
      }
    };

    OpenListNav.prototype.registerEventHandlers = function(){
      var self = this;

      window.addEventListener('scroll', function() {
        self.updateScrollTop();
        self.detectNavChange();
      });

      window.addEventListener('resize', function(){
        self.detectNavChange();
      });

    };

    OpenListNav.prototype.changeHandler = function(selector) {
      console.log('changeHandler')
      window.location.hash = selector.value;
    }

    OpenListNav.prototype.detectNavChange = function(){

      function reverseH(navHeaders) {
        var newHeaders = [];
        for (var i = navHeaders.length - 1; i >= 0; i--) {
          newHeaders.push(navHeaders[i]);
        }
        return newHeaders;
      }

      var navHeaders = (this.scrollTop.direction === 'up')
        ? reverseH(this.navHeaders)
        : this.navHeaders;

      var self = this;
      Array.prototype.forEach.call(navHeaders, function(header){

        var inViewPort = isElementInViewport(header);
        if (inViewPort) {
          self.updateSelectField(header.name)
        }
      });
    };

    var openListNav = new OpenListNav();

    console.log(openListNav)

    openListNav.registerEventHandlers();

    exports.openListNav = openListNav;
  })(this);
