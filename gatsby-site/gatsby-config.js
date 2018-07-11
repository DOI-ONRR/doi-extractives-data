module.exports = {
  
  // Note: it must *not* have a trailing slash.
  // This is currently the realtive path in our Jekyl deployment. This path points to our Gatsby Pages. 
  // This prefix is appended to load all our related images and code.
  // PREVIEW
  pathPrefix: `/preview/onrr/doi-extractives-data/gatsby-dev/gatsby-public`,
  // PROD/LOCAL JEKYLL
  // pathPrefix: `/gatsby-public`,
  
  siteMetadata: {
    title: 'Natural Resources Revenue Data',
    description: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.',
    version: 'v3.1.9'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-resolve-src',
    'gatsby-plugin-sass',
    `gatsby-transformer-yaml`,
    'gatsby-transformer-remark',
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
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },
  ],
};
