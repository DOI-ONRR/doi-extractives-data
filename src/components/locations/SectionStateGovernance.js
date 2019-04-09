import React from 'react'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import Link from '../utils/temp-link'

import lazy from 'lazy.js'

import utils from '../../js/utils'

const SectionStateGovernance = props => {
  const usStateData = props.usStateMarkdown.frontmatter
  const usStateFields = props.usStateMarkdown.fields || {}

  return (
    <div>
      {usStateData.opt_in &&
				<section id="state-governance">
				  <h2>State governance</h2>
  					<p>The state of {usStateData.title} participated in additional reporting about state and local natural resource governance, revenues, and disbursements.</p>

  					{ ReactHtmlParser(props.usStateMarkdown.html) }
				</section>
      }

      {usStateData.priority &&
				<section id="state-governance">
				  <h2>State governance</h2>
				  <p>Because {usStateData.title} has significant natural resource extraction, we gathered additional information about state agencies and regulations that govern natural resource extraction in {usStateData.title}:</p>

  					{ ReactHtmlParser(props.usStateMarkdown.html) }
				</section>
      }
    </div>
  )
}

export default SectionStateGovernance
