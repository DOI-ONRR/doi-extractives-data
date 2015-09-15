
  (function(exports) {
    var scrollLeft, scrollTop;
    var findScrollPositions = function(){
      scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
      scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    };
    var communitiesContent = document.getElementsByClassName("communities-content")[0];
    var csn = document.getElementsByClassName("communities-sticky-nav")
    var child = csn
    


    var removeActive = function(){
      var communitiesNavItems = document.getElementsByClassName("communities-nav-item")
      for (var i = 0; i < communitiesNavItems.length; i++) {
        communitiesNavItems[i].classList.remove('active');
      }
    }
    var addActive = function(){
      console.log('add active')
      var communitiesNavItems = document.getElementsByClassName("communities-nav-item")
      for (var i = 0; i < communitiesNavItems.length; i++) {
        var item = communitiesNavItems[i];
        item.addEventListener('click', function () {
          console.log('click')
          removeActive()
           this.classList.add('active');
        });
      }
    }
    window.onload = function(){
      addActive()
    }
    
    



    var setStickyPos = function () {
      var stickyNav = document.getElementsByClassName("communities-sticky-nav")[0],
          ccOffsetTop = communitiesContent.offsetTop;
      // console.log(csn, communitiesNavItems, communitiesNavItems[0])
      addActive()

      // for (var i = 0; i < communitiesNavItems.length; i++) {
      //   item = communitiesNavItems[i];
      //   console.log(item)
      //   var href = item.getAttribute('href')
      //   console.log(href)
      // };
        
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
    };
  })();
