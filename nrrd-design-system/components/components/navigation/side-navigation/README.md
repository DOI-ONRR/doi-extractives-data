# Sticky side navigation

This sticky component helps users keep track of where they are on some of the longer pages of the site. As the user scrolls, the name of the active section changes to bold, and if it includes subsections, those expand into view.

In the Explore section, this component includes an icon-sized US map, where the state or offshore-region page being viewed is highlighted. These function as buttons that link back to the Explore data landing page.


## How to use

Include the Jekyll component in your template.

```
{% include case-studies/_nav-list.html %}
```

And specify the navigation items in your front matter.

```yaml
nav_items:
  - name: top
    title: Top
  - name: section-a
    title: Section A
    subnav_items:
      - name: sub-item-a
        title: Sub-item A
      - name: sub-item-b
        title: Sub-item B
  - name: section-B
    title: Section B
  - name: section-c
    title: Section C
  - name: section-d
    title: Section D
```

In your page content, specify the `id` attributes for each nav item name.
**Note: if the content does not include elements matching the names of your nav
items, those nav items will be hidden in the sticky side navigation even if the
nav items appear in the markup or front matter.**

```html
<div class="container">
  <div class="container-left-8 container-shift-reverse-1">
    <h1 id="top">Top of the page</h1>
    <section class="container">
      <h2 id="section-a">Section A</h2>

      <h3 id="sub-item-a">Sub-item A</h3>

      <h3 id="sub-item-b">Sub-item B</h3>
    </section>

    <section class="container">
      <h2 id="section-b">Section B</h2>
    </section>

    <section class="container">
      <h2 id="section-c">Section C</h2>
    </section>

    <section class="container">
      <h2 id="section-d">Section D</h2>
    </section>
  </div>
</div>
```
