(function(exports) {

	var Accordion = function() {
		this.accordionButtons = document.querySelectorAll('[accordion-button]');
  };

  Accordion.prototype = {
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

	    while(obj.getAttribute(parentAttr)) {
	        obj = obj.parentNode;
	    }
	    return obj; 
	  },
	  /**
     * Triggered by a click handler 
     * finds a parent node and toggles the 'accordion-open' attribute
     *
     * @return void
     */
	  toggleAccordion: function () {
			var e = e || window.event;
	    var target = e.target || e.srcElement;

	    var accordionItem = this.findParentNode('accordion-item', target),
				accordionStatus = accordionItem.getAttribute('accordion-open');

			accordionStatus = (accordionStatus == 'true') ? 'false' : 'true';

			accordionItem.setAttribute('accordion-open', accordionStatus);
		},
		/**
     * Event handler that binds 
     * to the toggleAccordion function
     *
     * @return void
     */
		registerEventListeners: function () {
			for (var i = 0; i < this.accordionButtons.length; i++) {
				this.accordionButtons[i].addEventListener("click", this.toggleAccordion.bind(this));
			};
		}
	};

	var accordion = new Accordion();

	accordion.registerEventListeners();
	
})(this);
