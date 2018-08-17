
// Federalist provides the BASEURL env variable for preview builds.
// https://github.com/18F/federalist-garden-build#variables-exposed-during-builds
const BASEURL = process.env.BASEURL || '';

// Federalist provides the google_analytics env variable
const GOOGLE_ANALYTICS_ID = (process.env.google_analytics) ?
                (process.env.google_analytics[process.env.BRANCH] || process.env.google_analytics.default)
                :
                "UA-48605964-8";

module.exports = {
  // Note: it must *not* have a trailing slash.
  // This is currently the realtive path in our Jekyl deployment. This path points to our Gatsby Pages. 

  // This prefix is prepended to load all our related images, code, and pages.
  pathPrefix: `${BASEURL}/gatsby-public`,

  siteMetadata: {
    title: 'Natural Resources Revenue Data',
    description: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.',
    version: 'v3.1.9',
    googleAnalyticsId: GOOGLE_ANALYTICS_ID,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-resolve-src',
    'gatsby-plugin-sass',
    `gatsby-transformer-yaml`,
    'gatsby-transformer-remark',
    'gatsby-transformer-excel',
    // You can have multiple instances of this plugin
    // to read source nodes from different locations on your
    // filesystem.
    //
    // The following sets up the Jekyll pattern of having a
    // "pages" directory for Markdown files and a "data" directory
    // for `.json`, `.yaml`, `.csv`.
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
        name: `data-graphql`,
        path: `${__dirname}/src/data-graphql/`,
      },
    },  
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/src/markdown/`,
      },
    },                                                              
  ],
};
