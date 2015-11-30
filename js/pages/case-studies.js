(function() {
    var scrollLeft,
      scrollTop,

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
    var caseStudiesContent = document.querySelector('.case_studies_content');

    var removeActive = function(){
      var caseStudiesNavItems = document.querySelectorAll('.js-cs_nav_item');
      for (var i = 0; i < caseStudiesNavItems.length; i++) {
        caseStudiesNavItems[i].classList.remove('active');
      }
    };
    var addActive = function(name){
      if (name){
        removeActive();
        var navItem = document.querySelector(('.'+name));
        navItem.classList.add('active');
      }
    };

    var caseStudiesNavItems = document.querySelectorAll('.js-cs_nav_item');
    for (var i = 0; i < caseStudiesNavItems.length; i++) {
      var item = caseStudiesNavItems[i];
      item.addEventListener('click', function () {
        removeActive();
        this.classList.add('active');
      });
    }


    var setPageSections = function(){
      var caseStudiesSections = document.querySelector('.js-cs_section'),
        sections = [];
      for (var i = 0; i < caseStudiesSections.length; i++) {
        var section = caseStudiesSections[i];
        var top = section.offsetTop - section.offsetHeight + caseStudiesContent.offsetTop;
        sections.push({
          name : section.getAttribute('name'),
          top : top
        });
      }
      return sections;
    };
    sections = setPageSections();
    var chooseNavByScroll = function(){

      for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        if(scrollTop >= section.top){
          addActive(section.name);
        }
      }
    };

    window.onscroll = function() {
        chooseNavByScroll();
    };
    window.onresize = function(){
      sections = setPageSections();
      chooseNavByScroll();
    };
  })();
