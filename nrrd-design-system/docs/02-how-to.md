---
title: How to use this styleguide
status: draft
---

This [Fractal](https://fractal.build/) styleguide is used to to develop and document our design system.


### Templates

We're using [handlebars](http://handlebarsjs.com/) for the templating language.
Note this is different than the Liquid system that Jekyll uses. Fractal provides
a [few extra helpers](https://fractal.build/guide/core-concepts/views#using-handlebars)
to the templates.


### Assets

Use the `path` helper to map asset paths to their correct URL.

    <img class="header-image" src="\{{ path '/img/NRRD-logo.svg' }}" alt="Logo">
