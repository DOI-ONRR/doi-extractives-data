// Federalist provides the BASEURL env variable for preview builds.
// https://github.com/18F/federalist-garden-build#variables-exposed-during-builds
const BASEURL = process.env.BASEURL || undefined;



// Federalist provides the google_analytics env variable
const GOOGLE_ANALYTICS_ID = (process.env.google_analytics) ?
                (process.env.google_analytics[process.env.BRANCH] || process.env.google_analytics.default)
                :
                "UA-48605964-8";



let config = {
  siteMetadata: {
    title: 'Natural Resources Revenue Data',
    description: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.',
    version: 'v5.2.0',
    googleAnalyticsId: GOOGLE_ANALYTICS_ID,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Natural Resources Revenue Data',
        short_name: 'NRRD',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/img/favicon-32x32.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        includePaths: [`${__dirname}/src/styles`, `${__dirname}/src/css-global`, `${__dirname}/src/components`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/src/markdown/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data-graphql`,
        path: `${__dirname}/src/data-graphql/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `downloads-revenues`,
        path: `${__dirname}/downloads/revenues`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `downloads-production`,
        path: `${__dirname}/downloads/production`,
      },
    },
    'gatsby-transformer-excel',
    'gatsby-transformer-yaml',
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        // CommonMark mode (default: true)
        commonmark: true,
        // Footnotes mode (default: true)
        footnotes: true,
        // Pedantic mode (default: true)
        pedantic: true,
        // GitHub Flavored Markdown mode (default: true)
        gfm: true,
        // Plugins configs
        plugins: [],
      },
    },
    'custom-excel-transformer',
    `gatsby-plugin-meta-redirect`, // make sure to put last in the array
  ],
};

if(BASEURL) {
  config.pathPrefix = `${BASEURL}`;
}

module.exports = config;
