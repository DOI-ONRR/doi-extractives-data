import React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import Link from '../components/utils/temp-link'

import * as CONSTANTS from '../js/constants'

import { hydrate as hydateDataManagerAction } from '../state/reducers/data-sets'

import hastReactRenderer from '../js/hast-react-renderer'
import { PageToc } from '../components/navigation/PageToc'

import CoalIcon from '-!svg-react-loader!../img/svg/icon-coal.svg'
import OilGasIcon from '-!svg-react-loader!../img/svg/icon-oil.svg'
import MineralsIcon from '-!svg-react-loader!../img/svg/icon-hardrock.svg'
import RenewablesIcon from '-!svg-react-loader!../img/svg/icon-renewables.svg'
import ChevronIcon from '-!svg-react-loader!../img/svg/chevron-lt.svg'

import DefaultLayout from '../components/layouts/DefaultLayout'

class HowItWorksProcess extends React.Component {
  constructor (props) {
    super(props)

    this.hydrateStore()
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
          <div className='pre-footer'>
            <section className="container-page-wrapper">
              <ul>
                <h3>Choose a resource to explore:</h3>
                <li><Link to="/how-it-works/coal/"><CoalIcon /> Coal</Link></li>
                <li><Link to="/how-it-works/offshore-oil-gas/"><OilGasIcon /> Oil &amp; Gas</Link></li>
                <li><Link to="/how-it-works/minerals/"><MineralsIcon /> Nonenergy Minerals</Link></li>
                <li><Link to="/how-it-works/offshore-renewables/"><RenewablesIcon /> Renewables</Link></li>
                <li><Link to="/how-it-works/"><ChevronIcon /> Back to How it works</Link></li>
              </ul>
            </section>
          </div>
        </div>
      </DefaultLayout>
    )
  }
}
export default connect(
  state => ({}),
  dispatch => ({ hydateDataManager: dataSets => dispatch(hydateDataManagerAction(dataSets)),
  })
)(HowItWorksProcess)
