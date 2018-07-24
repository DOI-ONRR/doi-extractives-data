const path = require(`path`)

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve(path.join(__dirname, `../gatsby-site`, `src/components`)),
        name: `components`,
      },
    },
    {
      resolve: `gatsby-transformer-react-docgen`,
    },
    {
      resolve: `gatsby-transformer-remark`,
    },
  ],
}
