import React, { useEffect, useRef, useState }  from 'react'
import ReactDOM from 'react-dom'
import { useStaticQuery, graphql } from "gatsby"
import styles from './TotalDisbursements.module.scss'
import CONSTANTS from '../../../js/constants'
//import ToggleButton from '@material-ui/lab/ToggleButton';
//import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Toggle from '../../selectors/Toggle'
import DropDown from '../../selectors/DropDown'
import { StackedBarChartLayout } from '../../layouts/charts/StackedBarChartLayout'

const TotalDisbursements = (props) => {
    
    const [revenueToggle, setRevenueToggle]=useState("year");
    const [revenuePeriod, setRevenuePeriod]=useState("year");
    const [revenueYearlyPeriod, setRevenueYearlyPeriod]=useState('fiscal_year');
    const results=useStaticQuery(graphql`
          query TotalDisbursementsQuery {
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


    const YEARLY_DROPDOWN_VALUES = {
	Fiscal: 'fiscal_year',
	Calendar: 'calendar_year'
    }
    
    const MONTHLY_DROPDOWN_VALUES = {
	Recent: 'recent',
	Fiscal: 'fiscal',
	Calendar: 'calendar'
    }
    
    const TOGGLE_VALUES = {
	Year: 'year',
	Month: 'month'
    }
    const toggleValue= (newValue) => {

	//console.debug("TOGGGGGGGGGGGGLED",newValue);
	setRevenueToggle(newValue);
    }
    const revenuePeriodSelected = (e,v) => {
		//("period", v);
    }
    const revenueYearlyPeriodSelected = (e,v) => {
		//console.debug("period", v);
    }

    const getDropdown = () => {
	if(revenueToggle === 'month') {
	    return (
		  <DropDown
		    key={'RevenuePeriod'}
		    action={revenuePeriodSelected}
		    options={[
			{ key: MONTHLY_DROPDOWN_VALUES.Recent,
			  name: 'Most recent 12 months',
			  default: (revenuePeriod === MONTHLY_DROPDOWN_VALUES.Recent) },
			{ key: MONTHLY_DROPDOWN_VALUES.Fiscal,
			  name: 'Fiscal year ',
			  default: (revenuePeriod === MONTHLY_DROPDOWN_VALUES.Fiscal) },
			{ key: MONTHLY_DROPDOWN_VALUES.Calendar,
			  name: 'Calendar year ',
		    default: (revenuePeriod === MONTHLY_DROPDOWN_VALUES.Calendar) }]}>
		  </DropDown>
	    )
	} else {
	    return( 
		    <DropDown
		key={'RevenueYearlyPeriod'}
		action={revenueYearlyPeriodSelected} 
		options={[
		    { key: YEARLY_DROPDOWN_VALUES.Fiscal,
		      name: 'Fiscal year',
		      default: (revenueYearlyPeriod === YEARLY_DROPDOWN_VALUES.Fiscal) },
		    { key: YEARLY_DROPDOWN_VALUES.Calendar,
		      name: 'Calendar year',
		      default: (revenueYearlyPeriod === YEARLY_DROPDOWN_VALUES.Calendar) }]}>
		    </DropDown>
		    
	    )
	}
    }
    
    

    
    const CHART_STYLE_MAP = {
	'bar': styles.chartBar,
	[CONSTANTS.FEDERAL_OFFSHORE]: styles.federalOffshore,
	[CONSTANTS.FEDERAL_ONSHORE]: styles.federalOnshore,
	[CONSTANTS.NATIVE_AMERICAN]: styles.nativeAmerican,
	hover: {
	    [CONSTANTS.FEDERAL_OFFSHORE]: styles.federalOffshoreHover,
	    [CONSTANTS.FEDERAL_ONSHORE]: styles.federalOnshoreHover,
	    [CONSTANTS.NATIVE_AMERICAN]: styles.nativeAmericanHover,
	}
    }
    const CHART_SORT_ORDER = [CONSTANTS.FEDERAL_ONSHORE, CONSTANTS.FEDERAL_OFFSHORE, CONSTANTS.NATIVE_AMERICAN]
    
    return (
	<section className={styles.root}>
	  <div className={styles.contentHeader}>
	    <h3 className={styles.title+" h3-bar"}>Total revenue</h3>
	    <span className={styles.info}>
	      {props.info}
	    </span>
	  </div>
	  <div>
	     <div className={styles.itemToggle}>
	              <div className={styles.toggle}>
			Show:
			<Toggle action={toggleValue}
				buttons={
				    [
					{ key: TOGGLE_VALUES.Year, name: CONSTANTS.YEARLY, default: true },
					{ key: TOGGLE_VALUES.Month, name: CONSTANTS.MONTHLY }
				]}
				></Toggle>
	              </div>
		      <div className={styles.dropdown}>
			Period:
			{getDropdown()}
		      </div>
	     </div>
	  </div>
	</section>
    )



}


export default TotalDisbursements


