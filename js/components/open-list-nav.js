(function(exports) {
    function getScrollTop() {
      return (window.pageYOffset !== undefined)
        ? window.pageYOffset
        : (document.documentElement
          || document.body.parentNode
          || document.body).scrollTop;
    }



    exports.OpenListNav = function() {
      // init OpenListNav Properties
      this.active = window.location.hash || '#intro';
      this.navItems = document.querySelectorAll('[data-nav-item]');
      this.navSelect = $('[data-nav-options]');
      this.navIsSelect = !!this.navSelect.length;
      // initialize at maximum value
      this.defaultTop = window.innerHeight || document.documentElement.clientHeight;
      this.closestToTop = this.defaultTop;
      this.viewportElements = 0;
      this.subnavItemClass = 'sticky_nav-nav_item-sub';
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

      isActiveElement: function(el) {
        if (!el) {
          return;
        }

        var status = false;
        var rect = el.getBoundingClientRect();

        var elementInViewport = rect.bottom > 0 &&
            rect.right > 0 &&
            rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
            rect.top < (window.innerHeight || document.documentElement.clientHeight);

        var elTop = Math.abs(rect.top);

        if (elementInViewport && (elTop < this.closestToTop) ) {
          this.closestToTop = elTop;
          this.viewportElements++;
          status = true;
        } else if (elementInViewport &&
                  (this.viewportElements < 1) &&
                  (elTop >= this.closestToTop) ) {
          this.viewportElements++;
          status = true;
        }

        return status;
      },

      resetTop: function(){
        this.closestToTop = this.defaultTop;
        this.viewportElements = 0;
      },

      removeActive: function(){
        this.active = null;
        for (var i = 0; i < this.navItems.length; i++) {
          this.navItems[i].setAttribute('data-active', false);
        }
      },

      addActive: function(el, name, parent){
        if (!el){
          el = document.querySelector('[data-nav-item="' + name + '"]');
          parent = document.querySelector('[data-nav-item="' + parent + '"]');
          this.active = name;
          el.setAttribute('data-active', true);
          if (parent) {
            parent.setAttribute('data-active', true);
          }

        } else {
          this.active = el.getAttribute('data-nav-item');
          el.setAttribute('data-active', true);
          if (parent) {
            parent.setAttribute('data-active', true);
          }
        }
      },

      update: function(el, name, parent){
        this.removeActive();
        this.addActive(el, name, parent);
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
        var parentName,
          newName;

        // initialize nav status as not updated
        var updated = false;

        Array.prototype.forEach.call(this.navItems, function(item){
          var header = document.getElementById(item.dataset.navItem);

          var isActiveElement = self.isActiveElement(header);

          if (isActiveElement && !self.navIsSelect) {
            newName = header.id;

            if (item.classList.contains(self.subnavItemClass)) {
              parentName = item.parentElement.previousElementSibling
                .getAttribute('data-nav-item');
            }

            self.update(null, newName, parentName);

          } else if (isActiveElement && self.navIsSelect && !updated) {
            newName = header.name || header.id;
            self.updateSelectField(newName);
            updated = true;
          }
        });

        this.resetTop();
      }
    };

    module.exports = exports.OpenListNav;
  })(this);
