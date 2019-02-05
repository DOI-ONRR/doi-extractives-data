// Federalist provides the BASEURL env variable for preview builds.
// https://github.com/18F/federalist-garden-build#variables-exposed-during-builds
const BASEURL = process.env.BASEURL || '';

// Federalist provides the google_analytics env variable
const GOOGLE_ANALYTICS_ID = (process.env.google_analytics) ?
                (process.env.google_analytics[process.env.BRANCH] || process.env.google_analytics.default)
                :
                "UA-48605964-8";

module.exports = {
  siteMetadata: {
    title: 'Open data design at the Department of the Interior',
    author: 'Ryan Johnson',
    description: 'Our blog about data, design, and innovation at the Department of the Interior',
    siteUrl: 'https://revenuedata.doi.gov/',
    googleAnalyticsId: GOOGLE_ANALYTICS_ID,
  },
  pathPrefix: `${BASEURL}/blog`,
  mapping: {
    "MarkdownRemark.frontmatter.authors": `AuthorYaml`,
  },
  plugins: [
    `gatsby-transformer-yaml`,
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
        path: `${__dirname}/src/data`,
        name: 'data',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-graph',
            options: {
              // this is the language in your code-block that triggers mermaid parsing
              language: 'mermaid', // default
              theme: 'default' // could also be dark, forest, or neutral
            }
          },
          `gatsby-remark-autolink-headers`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 650,
              quality: 80,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: GOOGLE_ANALYTICS_ID,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
  ],
}
