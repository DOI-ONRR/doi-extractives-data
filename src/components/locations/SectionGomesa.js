import React from 'react'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import Link from '../utils/temp-link'
import StickyHeader from '../layouts/StickyHeader'
import { StickyWrapper } from '../utils/StickyWrapper'

import lazy from 'lazy.js'

import utils from '../../js/utils'

const SectionStateGomesa = props => {
  const usStateData = props.usStateMarkdown.frontmatter
  const usStateFields = props.usStateMarkdown.fields || {}

  return (
    <div>
      {usStateData.gomesa &&
				<div id="state-gomesa">
				  <h3>GOMESA disbursements</h3>
				  <p>{usStateData.title} receives disbursements in accordance with the <Link to="/how-it-works/gomesa/">Gulf of Mexico Energy Security Act</Link> (GOMESA).</p>

  					{ ReactHtmlParser(props.usStateMarkdown.html) }
				</div>
      }
      {usStateData.opt_in &&
				<section id="state-governance">
				  <h2>State governance</h2>
  					<p>The state of {usStateData.title} participated in additional reporting about state and local natural resource governance, revenues, and disbursements.</p>

  					{ ReactHtmlParser(props.usStateMarkdown.html) }
				</section>
      }
    </div>
  )
}

export default SectionStateGomesa
