// Quick and Easy Javascript Detection
$("html").removeClass( "no-js" );

// Init-ing the #ESCAPE button
$("#escape").hover(
  function() {
    $('.container').hide();
    $('.usa').hide();
    $('.section-highlight').hide();
  }, function() {
    $('.container').show();
    $('.section-highlight').show();
    $('.usa').show();
  }
);
$("#escape").on('click', function(){
  window.location = "http://www.google.com/";
});

// Quick Tooltip for Search Form Use
// $( "#search-form #q" ).focusin(function() {
//   $(".search-action-tip").toggleClass( "active" );
// });
// $( "#search-form #q" ).focusout(function() {
//   $(".search-action-tip").toggleClass( "active" );
// });

// Navigation
//// Add the mobile nav option
$(".site-header").prepend('<button type="button" class="nav-toggle btn btn-default"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span><span class="sr-only">Toggle Navigation</span></button>');

// Logo

//// Activate nav on mobile nav toggle click
$(".nav-toggle").click(function() {
  $(".main-nav").toggleClass("active");
  $(".site-title").toggle();
});

// Subnav

// Add default position on scroll back to top
$(document).ready(function () {
  // ;)
  window.console && console.log("Crafted with love by Presidential Innovation Fellows <http://whitehouse.gov/innovationfellows> and 18F <https://18f.gsa.gov>>.");
});



// collapsible sections
$(function() {
  var last_scrollTop = 0;

  if (window.location.pathname.match(/^\/(students|schools)/)) {
    $collapsibles = $('h2');
    $collapsibles.not(':first')
      .before('<div class="close-collapsible"><button class="btn">Close</button></div>');
    $collapsibles.last().nextUntil('footer').last()
      .after('<div class="close-collapsible"><button class="btn">Close</button></div>');
    $collapsibles.addClass('collapsible').nextUntil('h2,footer').addClass('inactive');
    
    $collapsibles.on('click', function() {
      $collapsibles.not(this).removeClass('selected').nextUntil('h2,footer').addClass('inactive');
      $(this).toggleClass('selected');
      $(this).nextUntil('h2,footer').toggleClass('inactive');
      last_scrollTop = $(window).scrollTop(); // save current position
    });

    $('.close-collapsible button.btn').on('click', function() {
      ;
      $(this).parent().addClass('inactive'); // hide the close button itself
      $(this).parent().prevUntil('h2').addClass('inactive'); // roll up
      var $section_header = $(this).parent().prevUntil('h2').last().prev();
      $section_header.toggleClass('selected'); // un-select section header
      $(window).scrollTop(last_scrollTop); // scroll to where you were when you expanded this section
    }); 
    if (window.location.hash != '') {
      $(window.location.hash).nextUntil('h2,footer').removeClass('inactive');
      $(window.location.hash).toggleClass('selected');
    }
  }
});

$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - 200
        }, 1000);
        return false;
      }
    }
  });
  
  if (window.location.hash != '') {
    var target = window.location.hash;
    $(target).addClass('hash-scrolled');
    var scrolly = $(target).offset().top;
    $(window).scrollTop(scrolly - 160);
  }
});