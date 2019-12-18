import React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import * as CONSTANTS from '../js/constants'
import { PageToc } from '../components/navigation/PageToc'

import hastReactRenderer from '../js/hast-react-renderer'

import DefaultLayout from '../components/layouts/DefaultLayout'

class ArchiveDefault extends React.Component {
  render () {
    let title = this.props.pageContext.markdown.frontmatter.title || 'Natural Resources Revenue Data'
    return (
      <DefaultLayout>
  			<div>
          <Helmet
            title={title}
            meta={[
              // type
              { name: 'og:type', content: 'website' },

              // title
              { name: 'og:title', content: 'Archive | Natural Resources Revenue Data' },
              { name: 'twitter:title', content: 'Archive | Natural Resources Revenue Data' },

              // description
              { name: 'description', content: 'Archive of open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
              { name: 'og:description', content: 'Archive of open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
              { name: 'twitter:description', content: 'Archive of open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
            ]}

          />
          {hastReactRenderer(this.props.pageContext.markdown.htmlAst)}
        </div>
      </DefaultLayout>
    )
  }
}
export default ArchiveDefault
