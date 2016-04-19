(function(exports) {
  'use strict';

  // for instructions on use: http://jsfiddle.net/brianhedberg/b84u31m1/
  exports.Accordion = function() {
    this.accordions = document.querySelectorAll('[accordion]');
    this.EMPTY_STRING = '';
    this.setAttributes();
  };

  exports.Accordion.prototype = {

    // iterator for NodeLists
    forEach: function (array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]);
      }
    },

    // determine truthiness an attribute of an element
    elemStatus: function (elem, attr) {
      if (elem.getAttribute(attr) === 'true' ||
        elem.getAttribute(attr) === true) {
        return true;
      } else if (elem.getAttribute(attr) === 'false' ||
          elem.getAttribute(attr) ||
          !elem.hasAttribute(attr)) {
        return false;
      } else {
        return false;
      }
    },

    toggleAttribute: function(elem, attr) {
      elem.setAttribute(attr, !this.elemStatus(elem, attr));
    },
    /**
     * Used to traverse up the DOM tree to find a parent with
     * the a specific attribute
     *
     * @param String parentAttr
     * @param Object childObj
     * @return Obj
     */
    findParentNode: function (parentAttr, childObj) {
      var obj = childObj.parentNode;
      while(!obj.hasAttribute(parentAttr)) {
        obj = obj.parentNode;
      }
      return obj;
    },
    /**
     * Triggered by a click handler
     * finds a parent node and toggles the 'aria-expanded' attribute
     *
     * @return void
     */
    toggleAccordion: function (e) {
      var e = e || window.event;
      var target = e.target || e.srcElement;

      var accordionItem = this.findParentNode('accordion-item', target),
        contentSelector = '#' + target.getAttribute('aria-controls'),
        contentElem = accordionItem.querySelector(contentSelector);

      this.toggleAttribute(accordionItem, 'aria-expanded');
      this.toggleAttribute(contentElem, 'aria-hidden')
    },

    // sets [accordion-item], [accordion-button], [accordion-content]
    setAttributes: function () {
      for (var i = 0; i < this.accordions.length; i++) {

        var accordion = this.accordions[i],
          accordionName = accordion.getAttribute('accordion'),
          accordionItems;

        if (accordion.hasAttribute('accordion-item')) {
          accordionItems = [accordion];
        } else {
          accordionItems = accordion.querySelectorAll('[accordion-item]');
          // check if node list is different than list of children
          if (accordionItems.length !== accordion.children.length) {
            this.forEach(accordion.children, function(index, item) {
              // add [accordion-item] attribute to list items
              if (item.tagName.toLowerCase() === 'li' &&
                !item.hasAttribute('accordion-item')) {
                item.setAttribute('accordion-item', true);
              }
            });
          }
          accordionItems = accordion.querySelectorAll('[accordion-item]');
        }

        for (var j = 0; j < accordionItems.length; j++) {
          var accordionItem = accordionItems[j];

          // default to setting [accordion-expanded='false']
          if (!accordionItem.hasAttribute('aria-expanded')) {
            accordionItem.setAttribute('aria-expanded', false);
          }
          var itemContent = this.setItemContent(accordionItem,
            accordionName,
            j,
            this.elemStatus(accordionItem,'aria-expanded'));

          this.setButton(accordionItem, itemContent.id);
        }

      }
    },

    // sets new attributes on [accordion-content] and returns the DOM node
    setItemContent: function (accordionItem, accordionName,
      iteration, expanded) {
      var itemContent = accordionItem.querySelector('[accordion-content]');
      if (!itemContent) {
        itemContent = accordionItem.querySelector('.accordion-content');
      }
      if (!itemContent) {
        itemContent = accordionItem.querySelector('div');
      }

      itemContent.setAttribute('accordion-content', this.EMPTY_STRING);
      itemContent.id = accordionName + '--content--' + iteration;
      itemContent.setAttribute('role', 'content');
      itemContent.setAttribute('aria-hidden', !expanded);
      return itemContent;
    },

    // sets new attributes on [accordion-button] and returns the DOM node
    setButton: function (accordionItem, itemContentId) {
      var itemButton = accordionItem.querySelector('[accordion-button]');

      if (!itemButton) {
        itemButton = accordionItem.querySelector('button');
        itemButton.setAttribute('accordion-button', this.EMPTY_STRING);
      }
      itemButton.setAttribute('role', 'button');
      itemButton.setAttribute('aria-controls', itemContentId);
      this.registerButton(itemButton);
    },

    // add click handler to each button
    registerButton: function(button) {
      button.addEventListener('click', this.toggleAccordion.bind(this));
    }
  };

  module.exports = exports.Accordion;

})(this);
