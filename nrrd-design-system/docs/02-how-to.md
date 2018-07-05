---
title: How to use this styleguide
status: draft
---

This [Fractal](https://fractal.build/) styleguide is used to to develop and document our design system.


## Templates

We're using [handlebars](http://handlebarsjs.com/) for the templating language.
Note this is different than the Liquid system that Jekyll uses. Fractal provides
a [few extra helpers](https://fractal.build/guide/core-concepts/views#using-handlebars)
to the templates.


## Assets

Use the `path` helper to map asset paths to their correct URL.

    <img class="header-image" src="\{{ path '/img/NRRD-logo.svg' }}" alt="Logo">


## Utilities

These are some helpful utilities to build components within the styleguide.

### Context variables

**container** (object)

An object to configure the preview container and how it should behave. Include
this variable in a components' context in order to add a container class to the
preview. By default, no container element is used.

Property | Type | Description | Example
---      | ---  | ---         | ---
`classes`   | `string` | The container classes to add. | `container-left-9`
`slab`   | `string` | The slab suffix to add a slab to the container. | `beta-mid`
