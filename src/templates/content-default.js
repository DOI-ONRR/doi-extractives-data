import React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import Helmet from 'react-helmet'

import { hydrate as hydateDataManagerAction } from '../state/reducers/data-sets'

import * as CONSTANTS from '../js/constants'

import hastReactRenderer from '../js/hast-react-renderer'

import utils from '../js/utils'

import { PageToc } from '../components/navigation/PageToc'

import DefaultLayout from '../components/layouts/DefaultLayout'

class DefaultTemplate extends React.Component {
  constructor (props) {
    super(props)
    if (this.props.pageContext.disbursements) {
      this.hydrateStore()
    }
  }

  /**
   * Add the data to the redux store to enable
   * the components to access filtered data using the
   * reducers
   **/
  hydrateStore () {
    this.props.hydateDataManager([
      { key: CONSTANTS.DISBURSEMENTS_ALL_KEY, data: this.props.pageContext.disbursements },
    ])
  }

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

              // description
              { name: 'og:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
              { name: 'twitter:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
            ]}

          />
          <section className='layout-content container-page-wrapper container-margin'>
            <article className="container-left-9">
              {hastReactRenderer(this.props.pageContext.markdown.htmlAst)}
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
export default connect(
  state => ({}),
  dispatch => ({ hydateDataManager: dataSets => dispatch(hydateDataManagerAction(dataSets)),
  })
)(DefaultTemplate)
