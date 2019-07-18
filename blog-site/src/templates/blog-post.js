import React from 'react'
import Helmet from 'react-helmet'
import { Link,graphql } from 'gatsby'
import get from 'lodash/get'

import Layout from '../components/layout'
import { rhythm, scale } from '../utils/typography'
import favicon from '../../static/img/favicon.ico'

class BlogPostTemplate extends React.Component {
  render() {
    const siteAnalytics = get(this.props, 'data.site.siteMetadata.googleAnalyticsId')
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const siteDescription = post.excerpt
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={`${post.frontmatter.title} | ${siteTitle}`}
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

        <h1 className="post-heading">{post.frontmatter.title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: 'block',
            color: '#768d99',
            marginBottom: rhythm(1),
            marginTop: rhythm(-.7),
            color: '#768d99',
          }}
        >
          {post.frontmatter.date}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        
      {
        (post.frontmatter.authors).map((author, index) => (
          <div key={index}
            style={{
              display: 'flex',
            }}
          >
            <img
                    src={author.pic}
                    alt={author.id + ` profile image`}
                    className="author-image"
                  />
            <p
              style={{
                marginRight: rhythm(1 / 2),
              }}
            ><strong>{author.id}</strong> is a {author.bio}.
            </p>
          </div>
        ))
      }
        <ul className='other-posts'
          style={{
            marginTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            listStyle: 'none',
            padding: 0,
          }}
        >
          <li>
            {
              previous &&
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            }
          </li>
          <li>
            {
              next &&
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            }
          </li>
        </ul>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        title
        authors {
          id
          bio
          pic
        }
        date(formatString: "MMMM D, YYYY")
      }
    }
  }
`
