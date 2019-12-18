import React from 'react'
import Helmet from 'react-helmet'
import { withPrefixSVG } from '../components/utils/temp-link'
import hastReactRenderer from '../js/hast-react-renderer'

import DefaultLayout from '../components/layouts/DefaultLayout'

class HowItWorksReconciliation extends React.Component {
  componentDidMount () {
    const script1 = document.createElement('script')

    script1.src = withPrefixSVG('/public/js/main.min.js')
    script1.async = false

    document.body.appendChild(script1)

    const script2 = document.createElement('script')

    script2.src = withPrefixSVG('/public/js/reconciliation.min.js')
    script2.async = false

    document.body.appendChild(script2)
  }

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
              { name: 'og:title', content: title + ' | Natural Resources Revenue Data' },
              { name: 'twitter:title', content: title + ' | Natural Resources Revenue Data' },

              // description
              { name: 'og:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
              { name: 'twitter:description', content: 'This site provides open data about natural resource management on federal lands and waters in the United States, including oil, gas, coal, and other extractive industries.' },
            ]}

          />
          {hastReactRenderer(this.props.pageContext.markdown.htmlAst)}
        </div>
      </DefaultLayout>
    )
  }
}
export default HowItWorksReconciliation
