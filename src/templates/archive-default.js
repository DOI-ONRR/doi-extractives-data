import React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import * as CONSTANTS from '../js/constants'
import { PageToc } from '../components/navigation/PageToc'

import hastReactRenderer from '../js/hast-react-renderer'

import DefaultLayout from '../components/layouts/DefaultLayout'

class ArchiveDefault extends React.Component {
  render () {
    let title = this.props.pathContext.markdown.frontmatter.title || 'Natural Resources Revenue Data'
    return (
      <DefaultLayout>
  			<div>
          <Helmet
            title={title}
            meta={[
              // title
              { name: 'og:title', content: title },
              { name: 'twitter:title', content: title },
            ]}

          />
          {hastReactRenderer(this.props.pathContext.markdown.htmlAst)}
        </div>
      </DefaultLayout>
    )
  }
}
export default ArchiveDefault
