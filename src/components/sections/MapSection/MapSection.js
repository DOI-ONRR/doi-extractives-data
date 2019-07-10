import React, { useEffect, useRef }  from 'react'
import ReactDOM from 'react-dom'
import { useStaticQuery, graphql } from "gatsby"

import * as d3 from 'd3'

import LocationSelector from '../../selectors/LocationSelector'
import Select from '../../selectors/Select'
import styles from './MapSection.module.scss'
import Map from '../../data-viz/Map' 




const MapSection = (props) => {

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
    let states=props.states
    console.debug(states);
    let options=states.map((value)=>{ return {value:value.state.frontmatter.unique_id,
					      name:value.state.frontmatter.title}})
    console.debug(options);
    
    let offshore_regions =props.offshore_regions
return (
        <section className={styles.root}>
	<div className={styles.container +' container-page-wrapper'}>
	<div className={styles.containerLeft}>
	<h3>{props.title}</h3>
	<p>{props.info}</p>
	<LocationSelector
    default='Choose location'
    states={states}
    offshore_regions={offshore_regions}
	/>
	{/*
	  *     Eventually use more generalized MUI based combonent for now LocationSelector more plug and play here
	  *
	  *	<Select options={states} multiple={false} />
	  *
	  */}
	   

    </div>
	<div className={styles.containerRight}><Map /> </div>

    </div>
    </section>
)
}
export default MapSection

