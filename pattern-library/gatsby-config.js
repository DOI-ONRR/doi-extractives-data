const path = require(`path`)

module.exports = {
  pathPrefix: `${process.env.BASEURL}/patterns`,
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve(path.join(__dirname, `../gatsby-site`, `src/components`)),
        name: `components`,
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
    },
    {
      resolve: `gatsby-transformer-react-docgen`,
    },
    {
      resolve: `gatsby-transformer-remark`,
    },
  ],
}
