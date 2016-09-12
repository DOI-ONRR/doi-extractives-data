$( document ).ready(function() {
  // ARIA Tab Interface
  // Thanks to Practical ARIA Examples
  // http://heydonworks.com/practical_aria_examples/#tab-interface

  // The class for the container div

  var $container = '.tab-interface';

  // The setup

  $($container +' [role=tablist] li')
    .attr('role', 'presentation');

  $($container + ' [role=tablist] a[href^="#"]')
    .attr({
      'role': 'tab',
      'tabindex': '-1'
    })
    // Make each aria-controls correspond id of targeted section (re href)
    .each(function() {
      $(this).attr(
        'aria-controls', $(this).attr('href').substring(1)
      );
    });

  // Make the first tab selected by default and allow it focus

  $($container + ' [role="tablist"] li:first-child a')
    .attr({
      'aria-selected': 'true',
      'tabindex': '0'
    });

  // Make first child of each panel focusable programmatically
  $($container +' [role=tabpanel] > *:first-child')
    .attr({
      'tabindex': '0'
    });

  // Make all but the first section hidden (ARIA state and display CSS)

  $($container + ' [role=tabpanel]:not(:first-of-type)')
    .attr({
      'aria-hidden': 'true'
    });

  // Change focus between tabs with arrow keys

  $('[role=tab]').on('keydown', function(e) {

    // define current, previous and next (possible) tabs

    var $original = $(this);
    var $prev = $(this).parents('li').prev().children('[role=tab]');
    var $next = $(this).parents('li').next().children('[role=tab]');
    var $target;

    // find the direction (prev or next)

    switch (e.keyCode) {
      case 37:
        $target = $prev;
        break;
      case 39:
        $target = $next;
        break;
      default:
        $target = false
        break;
    }

    if ($target.length) {
      $original.attr({
        'tabindex': '-1',
        'aria-selected': null
      });
      $target.attr({
        'tabindex': '0',
        'aria-selected': true
      }).focus();
    }

    // Hide panels

    $($container +' [role=tabpanel]')
      .attr('aria-hidden', 'true');

    // Show panel which corresponds to target

    $('#' + $(document.activeElement).attr('href').substring(1))
      .attr('aria-hidden', null);

  });

  // Handle click on tab to show + focus tabpanel

  $('[role=tab]').on('click', function(e) {

    e.preventDefault();

    // remove focusability [sic] and aria-selected

    $(this).find('[role=tab]')
      .attr({
        'tabindex': '-1',
        'aria-selected': null
      });

    // replace above on clicked tab

    $(this).attr({
      'aria-selected': true,
      'tabindex': '0'
    });

    // Hide panels

    $($container +' [role=tabpanel]')
      .attr('aria-hidden', 'true');

    // show corresponding panel

    $('#' + $(this).attr('href').substring(1))
      .attr('aria-hidden', null);

  });

});
