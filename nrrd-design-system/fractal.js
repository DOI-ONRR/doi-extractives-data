'use strict';

const path = require('path');

const fractal = module.exports = require('@frctl/fractal').create();
const mandelbrot = require('@frctl/mandelbrot');

const customTheme = mandelbrot({
  skin: 'blue',
  panels: ['notes', 'html', 'view', 'context', 'resources', 'info'],
  styles: [
    'default',
    '/css/styleguide.css',
  ]
});

fractal.set('project.title', 'NRRD Design System');

fractal.components.set('path', path.join(__dirname, 'components'));
fractal.components.set('statuses', {
  blocked: {
    label: "Tech help required",
    description: "Blocked.",
    color: "#be4900"
  },
  jscomponent: {
    label: "JS web component",
    description: "JS web component required to render this.",
    color: "#851482"
  },
  review: {
    label: "Ready for review",
    description: "Ready for another team member to review.",
    color: "#f4b400"
  },
  draft: {
    label: "In progress",
    description: "Work in progress.",
    color: "#ccc"
  },
  ready: {
    label: "Ready",
    description: "Accessibility review finished, documentation complete.",
    color: "#0baf00"
  },
  deprecated: {
    label: "Deprecated",
    description: "Component exists only for backwards compatibility.",
    color: "#8e8e8e"
  },
  enhancement: {
    label: "Potential enhancement",
    description: "This feature might prove useful.",
    color: "#1168a6"
  }
});

fractal.docs.set('path', path.join(__dirname, 'docs'));
fractal.docs.set('statuses', {
  draft: {
    label: "Draft",
    description: "Work in progress. There may be gaps in this documentation.",
    color: "#f4b400"
  },
  ready: {
    label: "Ready",
    description: "Reviewed and considered reasonably complete.",
    color: "#0baf00"
  }
});

fractal.web.set('static.path', path.join(__dirname, '../_site'));
fractal.web.set('builder.dest', __dirname + '/build');

fractal.web.theme(customTheme);
