import React from 'react'
import Link from '../utils/temp-link'
import { useStaticQuery, graphql } from "gatsby"

//import FEDERAL_DISBURSEMENTS from '../../data/federal_disbursements.yml'
import * as GOMESA_STATE_DISBURSEMENTS from '../../data/gomesa_state_disbursements'

import StickyHeader from '../layouts/StickyHeader'
import { StickyWrapper } from '../utils/StickyWrapper'
import DataAndDocs from '../layouts/DataAndDocs'

import utils from '../../js/utils'

let year = 2019



const FederalDisbursements=(id,data) => {
   // console.debug("id:", id,data);
    let max_year=data[0].Fiscal_Year;
    let nodes=data.filter( node => node.State==id && node.Fiscal_Year==max_year);
    let All=nodes.map(item => item._Total_).reduce((prev, next) => prev + next,null);
    let Onshore=nodes.filter(node=>node.Onshore_Offshore=="Onshore")
	.map(item => item._Total_).reduce((prev, next) => prev + next, 0);
    let Offshore=nodes.filter(node=>node.Onshore_Offshore=="Offshore")
	.map(item => item._Total_).reduce((prev, next) => prev + next, 0);
    let r={All: {All: {}, Onshore: {}, Offshore: {} }};

    r.All.All[max_year]=All;
    r.All.Onshore[max_year]=Onshore;
    r.All.Offshore[max_year]=Offshore;
	   
    //console.debug("results:", r);
    return r;
}

const SectionDisbursements = props => {
    
    const results=useStaticQuery(graphql`
       query DisbursementTotalQuery {
       StateDisbursements :   allDisbursementsXlsxData(sort: {fields: Fiscal_Year, order: DESC})  {
    nodes {
      State
      Fiscal_Year
      Onshore_Offshore
      _Total_
    }
  }
}
`)

    const usStateData = props.usStateMarkdown.frontmatter
//    const usStateDisbursements = FEDERAL_DISBURSEMENTS[usStateData.unique_id]
 //   console.debug("Federal", usStateDisbursements)
    const usStateDisbursements = FederalDisbursements(usStateData.unique_id,results.StateDisbursements.nodes);
  const usGomesaStateDisbursements = GOMESA_STATE_DISBURSEMENTS[usStateData.unique_id]
  const usGomesaStateDisbursementsYears = usGomesaStateDisbursements && Object.keys(usGomesaStateDisbursements)
  const usGomesaStateDisbursementsCounties = usGomesaStateDisbursements && getCounties()

  function getCounties () {
    let countiesData = {}
    usGomesaStateDisbursementsYears.forEach(year => {
      let counties = Object.keys(usGomesaStateDisbursements[year].Counties)
      counties.forEach(county => {
        if (countiesData[county] === undefined) {
          countiesData[county] = {}
        }
        countiesData[county][year] = usGomesaStateDisbursements[year].Counties[county]
      })
    })

    return countiesData
  }

  function getDisbursementsContent () {
    let content
    const onshoreDisbursements = (usStateDisbursements && usStateDisbursements.All.Onshore) ? usStateDisbursements.All.Onshore[year] : 0
    const offshoreDisbursements = (usStateDisbursements && usStateDisbursements.All.Offshore) ? usStateDisbursements.All.Offshore[year] : 0
    const allDisbursements = (usStateDisbursements && usStateDisbursements.All.All) ? usStateDisbursements.All.All[year] : 0

    if (usStateDisbursements && offshoreDisbursements > 0) {
     content = <div>
        <p>
            ONRR also disburses some revenue from natural resource extraction to state governments. <strong>In { year }, ONRR disbursed {utils.formatToDollarInt(allDisbursements)} to {usStateData.title}. </strong>
            This included revenues from both onshore and offshore extraction in or near {usStateData.title}:
        </p>
        <ul>
          <li>{utils.formatToDollarInt(onshoreDisbursements)} was from onshore revenues</li>
          <li>{utils.formatToDollarInt(offshoreDisbursements)} was from offshore revenues</li>
        </ul>
      </div>
    }
    else if (usStateDisbursements && allDisbursements > 0) {
      content = <p>ONRR also disburses some revenue from natural resource extraction to state governments. <strong>In { year }, ONRR disbursed {utils.formatToDollarInt(usStateDisbursements.All.All[year])} to {usStateData.title}.</strong></p>
    }
    else {
      content = <p>
        <strong>
          {usStateData.title} did not receive any disbursements from ONRR in { year }
          . This is usually because there was no natural resource extraction on federal land in the state.
        </strong>
      </p>
    }

    return content
  }

  return (
    <section id="federal-disbursements" className="disbursements">
      <StickyWrapper bottomBoundary="#federal-disbursements" innerZ="10000">
        <StickyHeader headerText={'Federal disbursements'} />
      </StickyWrapper>

      <p>After collecting revenue from natural resource extraction, the Office of Natural Resources Revenue distributes that money to different agencies
        , funds, and local governments for public use. This process is called “disbursement.”</p>
      <p>
				Most federal revenue disbursements go into national funds
        . For detailed data about which expenditures and projects from those national funds are in {usStateData.title}
        , see <Link to="/explore/#federal-disbursements">nationwide federal disbursements</Link>.
      </p>

      {getDisbursementsContent()}

      {usGomesaStateDisbursements &&
        <section id="gomesa-disbursements" className="disbursements">
          <StickyWrapper bottomBoundary="#gomesa-disbursements" innerZ="10000">
            <StickyHeader headerText={'GOMESA disbursements'} />
          </StickyWrapper>
          <p>State and local governments in {usStateData.title} receive a portion of revenue generated
           from offshore oil and gas production under the <Link to="/how-it-works/gomesa/">Gulf of Mexico Energy Security Act (GOMESA)</Link>.</p>
          <table className="table-basic u-margin-top u-margin-bottom">
            <thead>
              <tr>
                <th>Recipient</th>
                {usGomesaStateDisbursementsYears.map((year, index) => <th key={index}>{'FY' + year}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{'State of ' + usStateData.title}</td>
                {usGomesaStateDisbursementsYears.map((year, index) => <td key={index} className="numeric">
                  { utils.formatToDollarFloat(usGomesaStateDisbursements[year].State)}</td>)}
              </tr>
              {Object.keys(usGomesaStateDisbursementsCounties).map((county, index) => {
                return (
                  <tr key={index}>
                    <td>{utils.toTitleCase(county)}</td>
                    {usGomesaStateDisbursementsYears.map((year, index) => <td key={index} className="numeric">
                      { utils.formatToDollarFloat(usGomesaStateDisbursementsCounties[county][year])}</td>)}
                  </tr>
                )
              })}

            </tbody>
          </table>
        </section>
      }

      <p>
        <Link to="/downloads/disbursements/" className="data-downloads">
          <DataAndDocs />
        </Link>
      </p>
    </section>
  )
}

export default SectionDisbursements
