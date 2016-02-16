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

    exports.OpenListNav = function() {
      // init OpenListNav Properties
      this.active = window.location.hash || '#intro';
      this.navItems = document.querySelectorAll('[data-nav-item]');
      this.navSelect = $('[data-nav-options]');
      this.navIsSelect = !!this.navSelect.length;
      this.navHeaders = document.querySelectorAll('[data-nav-header]');
      this.scrollTop = {
        current: getScrollTop(),
        prev: getScrollTop(),
        direction: 'down'
      };

      this.registerEventHandlers();
    };

    exports.OpenListNav.prototype = {
      updateScrollTop: function() {
        this.scrollTop.prev = this.scrollTop.current;
        this.scrollTop.current = getScrollTop();
        this.scrollTop.direction = (this.scrollTop.current >= this.scrollTop.prev)
          ? 'down'
          : 'up';
      },

      removeActive: function(){
        this.active = null;
        for (var i = 0; i < this.navItems.length; i++) {
          this.navItems[i].setAttribute('data-active', false);
        }
      },

      addActive: function(el, name){
        if (!el){
          el = document.querySelector('[data-nav-item="' + name + '"]');
          this.active = name;
          el.setAttribute('data-active', true);
        } else {
          this.active = el.getAttribute('data-nav-item');
          el.setAttribute('data-active', true);
        }
      },

      update: function(el, name){
        this.removeActive();
        this.addActive(el, name);
      },

      updateSelectField: function(newValue) {
        if (newValue){
          this.navSelect.val(newValue);
        }
      },

      registerEventHandlers: function(){
        var self = this;
        if (!this.navIsSelect) {
          for (var i = 0; i < this.navItems.length; i++) {
            var item = this.navItems[i];
            item.addEventListener('click', function () {
              self.update(this);
            });
          }
        }

        window.addEventListener('scroll', function() {
          self.updateScrollTop();
          // TODO: throttle
          self.detectNavChange();
        });

        window.addEventListener('resize', function(){
          // TODO: throttle
          self.detectNavChange();
        });

      },

      changeHandler: function(selector) {
        window.location.hash = selector.value;
      },


      detectNavChange: function(){

        var self = this;

        // initialize nav status as not updated
        var updated = false;

         Array.prototype.forEach.call(this.navHeaders, function(header){
           var inViewPort = isElementInViewport(header);
           if (inViewPort && !self.navIsSelect && !updated) {
             self.update(null, header.name);
             updated = true;
           } else if(inViewPort && self.navIsSelect && !updated) {
             var newName = header.name || header.id;
            self.updateSelectField(newName);
             updated = true;
           }
        });
      }
    };

    module.exports = exports.OpenListNav;
  })(this);
