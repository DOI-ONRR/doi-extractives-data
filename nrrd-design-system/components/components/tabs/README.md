# Tabs

Tabs manage peer groups of content within one parent category. They create shorter pages, and give users the ability to view (and load) only the content group they need. Each tab button has a corresponding content section.

Tabs are currently in use on national data pages for [revenue tables](https://revenuedata.doi.gov/explore/#revenue).


## How to use

The tabs with their panels live in a `.tab-interface` container.

Note the `role` attributes in the elements. You should have a `tablist`,
`presentation` for `li`s, `tab` for the tab `a` tags, and `tabpanel` for the tab
content containers.

For the initial state, the first tab should have the `aria-selected="true"` attribute.
All inactive tab panels should be initialized with `aria-hidden="true"`.
