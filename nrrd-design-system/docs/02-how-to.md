---
title: How to use this styleguide
status: draft
---

This [Fractal](https://fractal.build/) styleguide is used to to develop and document our design system.


## Documentation

The component documentation should include:

* Details on what the purpose of the component is and what problem does it solve
* Implementation details on how to use this component
* When not to use this component, or similar components to consider instead
* Mobile behavior

Include a `How to use` section that covers any technical implementation details,
like how to structure the HTML elements, `aria` attributes, or any "gotchas"
about using. This should also contain any implementation details around Jekyll
includes or layouts and any front matter that should be configured to use the
component. If there is anything special about how the interactive JavaScript is
triggered for the component, like class names or id attributes, please note that
as well.


## Templates

We're using [handlebars](http://handlebarsjs.com/) for the templating language.
Note this is different than the Liquid system that Jekyll uses. Fractal provides
a [few extra helpers](https://fractal.build/guide/core-concepts/views#using-handlebars)
to the templates.

The template itself is documentation and should only include the markup core to
the component. Including complex use cases distracts from the core functionality.
Including container elements for display is also confusing because it becomes
unclear if the containing element is required for the component to work.


## Assets

Use the `path` helper to map asset paths to their correct URL.

    <img class="header-image" src="\{{ path '/img/NRRD-logo.svg' }}" alt="Logo">


## Use variants when appropriate

When components come in different flavors, use variants to show them.

If the markup or purpose of a component is significantly different, you probably
want a separate component rather than a variant.


## Responsive components

For responsive components, set the display min-width/max-width in the component
configuration so that they display correctly in the styleguide. This avoids
elements disappearing because the viewport is too small or too big (triggering
the wrong responsive behavior).


## Utilities

These are some helpful utilities to build components within the styleguide.


### Helpers

These helpers can be used within the handlebar templates.

**jsonify**

Converts an object to a JSON string. This can be used to convert a data object
into a string for use in a `data` attribute in HTML. e.g.

```hbs
<eiti-bar-chart data="\{{jsonify data}}"></eiti-bar-chart>
```


### Context variables

**container** (object)

An object to configure the preview container and how it should behave. Include
this variable in a components' context in order to add a container class to the
preview. By default, no container element is used.

Property | Type | Description | Example
---      | ---  | ---         | ---
`classes`   | `string` | The container classes to add. | `container-left-9`
`slab`   | `string` | The slab suffix to add a slab to the container. | `beta-mid`
