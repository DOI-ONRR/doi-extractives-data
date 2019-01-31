import React from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'

import Layout from '../components/layout'
import { rhythm, scale } from '../utils/typography'
import favicon from '../../static/img/favicon.ico'

class BlogIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const siteDescription = get(
      this,
      'props.data.site.siteMetadata.description'
    )
    const siteAnalytics = get(this, 'props.data.site.siteMetadata.googleAnalyticsId')
    const posts = get(this, 'props.data.allMarkdownRemark.edges')

    return (
      <Layout location={this.props.location}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={siteTitle}
          link={[{ rel: 'shortcut icon', type: 'image/png', href: `${favicon}` }]}
        >
          {/* Digital Analytics Program roll-up, see the data at https://analytics.usa.gov */}
          <script src="https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js" id="_fed_an_ua_tag"></script>
          {siteAnalytics &&
            <script>
              {"(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', '"+siteAnalytics+"', 'auto');ga('set', 'anonymizeIp', true);ga('set', 'forceSSL', true);ga('send', 'pageview');"}
            </script>
          }
        </Helmet>  

        {posts.map(({ node }) => {
          const title = get(node, 'frontmatter.title') || node.fields.slug
          return (
            <div 
              style={{
                marginBottom: rhythm(1.2),
              }}
              key={node.fields.slug}>
              <h2
                style={{
                  marginBottom: rhythm(-0.1),
                }}
              >
                <Link 
                  style={{ 
                    boxShadow: 'none',
                    textDecoration: 'none',
                  }} 
                  to={node.fields.slug}>
                  {title}
                </Link>
              </h2>
              <small
                style={{
                  color: '#768d99',
                }}
              >{node.frontmatter.date}</small>
              <p
                style={{
                  marginTop: rhythm(.3),
                }}
              >{node.frontmatter.excerpt}</p>
            </div>
          )
        })}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        googleAnalyticsId
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM D, YYYY")
            title
            excerpt
          }
        }
      }
    }
  }
`
