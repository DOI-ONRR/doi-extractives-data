import React from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'

import Layout from '../components/layout'
import { rhythm, scale } from '../utils/typography'

class BlogIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const siteDescription = get(
      this,
      'props.data.site.siteMetadata.description'
    )
    const posts = get(this, 'props.data.allMarkdownRemark.edges')

    return (
      <Layout location={this.props.location}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={siteTitle}
        />
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
