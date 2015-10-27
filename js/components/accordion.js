(function(exports) {
	console.log('hello')
	function getElementsByAttribute(attribute, context) {
	  var nodeList = (context || document).getElementsByTagName('*');
	  var nodeArray = [];
	  var iterator = 0;
	  var node = null;

	  while (node = nodeList[iterator++]) {
	    if (node.getAttribute(attribute)) nodeArray.push(node);
	  }

	  return nodeArray;
	}
	var accordion = document.querySelectorAll('[accordion]')
	var accordionButtons = document.querySelectorAll('[accordion-button]');

	

  function findParentNode(parentAttr, childObj) {
    var obj = childObj.parentNode;

    while(obj.getAttribute(parentAttr)) {
        obj = obj.parentNode;
    }
    return obj; 
  }

	function toggleAccordion () {
		var e = e || window.event;
    var target = e.target || e.srcElement

    var accordionItem = findParentNode('accordion-item', target)

		var accordionStatus = accordionItem.getAttribute('accordion-open');

		if (accordionStatus == 'true') {
			accordionStatus = 'false'
		} else {
			accordionStatus = 'true'
		}
		accordionItem.setAttribute('accordion-open', accordionStatus);
	}

	// register Event Listener
	for (var i = 0; i < accordionButtons.length; i++) {
		accordionButtons[i].addEventListener("click", toggleAccordion);
	};



	

})();
