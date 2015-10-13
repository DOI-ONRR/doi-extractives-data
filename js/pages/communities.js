(function(exports) {
    var scrollLeft, 
      scrollTop, 
      sections;
    var findScrollPositions = function(){
      scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
      scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    };
    var communitiesContent = document.getElementsByClassName("communities-content")[0];
    


    var removeActive = function(){
      var communitiesNavItems = document.getElementsByClassName("communities-nav-item")
      for (var i = 0; i < communitiesNavItems.length; i++) {
        communitiesNavItems[i].classList.remove('active');
      }
    }
    var addActive = function(name){
      if (name){
        removeActive();
        var navItem = document.querySelector(('.'+name));
        navItem.classList.add('active');
      }
    }

    var communitiesNavItems = document.getElementsByClassName("communities-nav-item");
    for (var i = 0; i < communitiesNavItems.length; i++) {
      var item = communitiesNavItems[i];
      item.addEventListener('click', function () {
        removeActive();
        this.classList.add('active');
      });
    }

    
    var setPageSections = function(){
      var communitiesSections = document.getElementsByClassName("communities-section"),
        sections = [];
      for (var i = 0; i < communitiesSections.length; i++) {
        var section = communitiesSections[i];
        sections.push({
          name : section.getAttribute('name'),
          top : section.offsetTop - section.offsetHeight + communitiesContent.offsetTop
        });
      }
      return sections;
    }
    sections = setPageSections();
    var chooseNavByScroll = function(){

      for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        if(scrollTop >= section.top){
          addActive(section.name);
        }
      }
    }

    var setStickyPos = function () {
      var stickyNav = document.getElementsByClassName("communities-sticky-nav")[0],
          ccOffsetTop = communitiesContent.offsetTop;

      // scrollDifference is the difference in height between the location of the top of the window and the top of the 'communities-content' div
      var scrollDifference = scrollTop - ccOffsetTop;

      var combinedOffset = ccOffsetTop + communitiesContent.offsetHeight;
      var stickyNavHeight = stickyNav.clientHeight;
      var ccPadding = 50; // set value at all widths (I believe)

      // scrollTopFooterOffset is the combined height of the content offsets less the height the sticky div and the content's bottom padding
      // when scrollTop is greater than scrollTopFooterOffset 'top' property of stickyFooter should be set to scrollTopFooterOffset
      var scrollTopFooterOffset = combinedOffset - stickyNavHeight - 50;

      if (scrollDifference >= 0){
        stickyNav.style.position = 'fixed';
        stickyNav.style.top = 0;
        if (scrollTop > scrollTopFooterOffset){
          stickyNav.style.position = 'absolute';
          stickyNav.style.top = scrollTopFooterOffset - ccOffsetTop + 'px';
        } else {
          stickyNav.style.position = 'fixed';
          stickyNav.style.top = 0;
        }
      } else {
        stickyNav.style.position = 'absolute';
      }
    };

    window.onscroll = function() {
        findScrollPositions();
        setStickyPos();
        chooseNavByScroll();
    };
    window.onresize = function(){
      sections = setPageSections();
      chooseNavByScroll();
    }
  })();
