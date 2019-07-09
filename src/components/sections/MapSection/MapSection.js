import React, { useEffect, useRef }  from 'react'
import ReactDOM from 'react-dom'
import { useStaticQuery, graphql } from "gatsby"

import * as d3 from 'd3'

import LocationSelector from '../../selectors/LocationSelector'
import Select from '../../selectors/Select'
import styles from './MapSection.module.scss'
 




const MapSection = ({props}) => {

/*
    const data=useStaticQuery(graphql`
          query RevenueTrendsQuery {
        allMonthlyRevenuesByFiscalYear: allResourceRevenuesMonthly(
          filter: {RevenueCategory: {ne: null}}, 
          sort: {fields: [RevenueDate], order: DESC}) {
          group(field: FiscalYear) {
            fiscalYear: fieldValue
            data: edges {
              node {
                id
                FiscalYear
                Revenue
                RevenueCategory
                RevenueDate
                RevenueType
              }
            }
          }
        }
      }
`) 


    console.debug(data);
*/
    
    console.debug(props)
    let states=props.data.states_data.states
    console.debug(states);
    let options=states.map((value)=>{ return {value:value.state.frontmatter.unique_id,
					      name:value.state.frontmatter.title}})
    console.debug(options);
    
    let offshore_regions =props.data.offshore_data.offshore_regions
return (
        <section className={styles.root}>
	<div className={styles.container +' container-page-wrapper'}>
	<div className={styles.containerLeft}>
	<h3>Learn about extractive industries in each state</h3>
	<p>Explore production, revenue, and disbursements data for each state.</p>
	<LocationSelector
    default='Choose location'
    states={states}
    offshore_regions={offshore_regions}
	/>
	<Select options={states} multiple={false} />
    </div>
	<div className={styles.containerRight}>right </div>

    </div>
    </section>
)
}
export default MapSection
