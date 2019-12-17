import React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import Helmet from 'react-helmet'

import hastReactRenderer from '../js/hast-react-renderer'

import utils from '../js/utils'

import { PageToc } from '../components/navigation/PageToc'
import GlossaryTerm from '../components/utils/glossary-term'

import CONTACT_INFO from '../data/contact.yml'

import DefaultLayout from '../components/layouts/DefaultLayout'

class DownloadsTemplate extends React.Component {
  render () {
    let title = this.props.pageContext.markdown.frontmatter.title || 'Natural Resources Revenue Data'

    return (
      <DefaultLayout>
        <main id="main-content">
          <Helmet
            title={title}
            meta={[
              // type
              { name: 'og:type', content: 'website' },

              // title
              { name: 'og:title', content: title + ' | Natural Resources Revenue Data' },
              { name: 'twitter:title', content: title + ' | Natural Resources Revenue Data' },

              // img
              { name: 'og:image', content: meta_image },
              { name: 'twitter:card', content: 'summary_large_image' },
              { name: 'twitter:image', content: meta_image },

              // description
              { name: 'og:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
              { name: 'twitter:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
            ]}

          />
          <section className='layout-content container-page-wrapper container-margin'>
            <article className="container-left-9">
              {hastReactRenderer(this.props.pageContext.markdown.htmlAst)}
              <p>Do you have questions about the data or need data that isn't here?

						Contact our { CONTACT_INFO.data_retrieval.name } at <a href={'mailto:' + CONTACT_INFO.data_retrieval.email}>{CONTACT_INFO.data_retrieval.email }</a>.</p>
            </article>
            <MediaQuery minWidth={768}>
              <div className="container-right-3">
                <PageToc scrollOffset={190}/>
              </div>
            </MediaQuery>
            <MediaQuery maxWidth={767}>
              <div style={{ position: 'absolute', width: '100%', top: '-45px' }}>
                <PageToc scrollOffset={190}/>
              </div>
            </MediaQuery>
          </section>
        </main>
      </DefaultLayout>
    )
  }
}
export default DownloadsTemplate
