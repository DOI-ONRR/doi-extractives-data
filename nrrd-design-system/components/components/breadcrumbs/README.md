# Breadcrumbs

The breadcrumbs component is used for navigation and to reinforce for the user where they are within the site structure, especially for deeper site pages. Always add a slash after the text, to indicate the parent category.

Similar type styling and positioning is also used as a non-link running subhead. The [case studies section](https://revenuedata.doi.gov/case-studies/campbell/) serves as an example, where an icon is added for visual interest. Since these instances are visually similar to breadcrumbs – but don't behave like breadcrumbs – we haven't included an example here.


## When to use


### When to consider something else


## How to use

In your page's front matter, include the `breadcrumb` property with a list of
the breadcrumbs. The `content` layout automatically includes the breadcrumbs.

```yaml
breadcrumb:
  - title: How it works
    permalink: /how-it-works/
```
