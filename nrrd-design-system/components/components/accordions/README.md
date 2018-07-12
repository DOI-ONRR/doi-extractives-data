# Accordions

Accordions are collapsible panels that provide users with the ability to expand
and collapse content as needed. They can simplify the interface by hiding
content until it is needed.

With so much data, hiding some is essential. This is especially true for mobile
where some content shown by default in the desktop view becomes hidden.


## How to use

The toggle behavior is triggered by the `aria-` attributes. `.hide-expanded` is
the label used when in the collapsed state. `.show-expanded` is the label to
show in the expanded state. `aria-controls` on the toggle should be set to the
`id` of the expandable content container.


## Responsive behavior

See individual variants for responsive behavior.


## Variants


### Plus-button

Floating accordion unit, used with county maps on Explore state pages.


### In-table


### Mobile

This is a special case of the accordion that occurs within the `.chart-list`
component. On larger screens, the content is expanded an no toggle exists. On
smaller screens, the toggle is visible and the accordion is collapsed by
default.


### Mobile-menu

This is a special case of the accordion used on small screens to provide a
toggleable menu. It is hidden on larger screens.
