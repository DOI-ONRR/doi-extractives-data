import React, { useEffect, useRef, useState, useCallBack }  from 'react'
import { connect } from 'react-redux'
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import ReactDOM from 'react-dom'
import { useStaticQuery, graphql } from "gatsby"
import styles from './TotalRevenue.module.scss'
import utils from '../../../js/utils'

import { setDataSelectedById as setDataSelectedByIdAction } from '../../../state/reducers/data-sets'
import CONSTANTS from '../../../js/constants'
//import ToggleButton from '@material-ui/lab/ToggleButton';
//import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Toggle from '../../selectors/Toggle'
import DropDown from '../../selectors/DropDown'
import { StackedBarChartLayout } from '../../layouts/charts/StackedBarChartLayout'
import {
	PRODUCT_VOLUMES_FISCAL_YEAR,
  REVENUES_MONTHLY,
  REVENUES_FISCAL_YEAR,
  BY_ID, BY_COMMODITY,
  BY_STATE, BY_COUNTY,
  BY_OFFSHORE_REGION,
  BY_LAND_CATEGORY,
  BY_LAND_CLASS,
  BY_REVENUE_TYPE,
  BY_FISCAL_YEAR,
  BY_CALENDAR_YEAR
} from '../../../state/reducers/data-sets'


const KEY_STATS_REVENUES_DATA_ID = 'KEY_STATS_REVENUES_DATA_ID'
const REVENUES_FISCAL_YEAR_OLD = 'RevenuesFiscalYear'
const REVENUES_CALENDAR_YEAR = 'RevenuesCalendarYear'




const TotalRevenue = (props) => {
    
    const [revenueToggle, setRevenueToggle]=useState("year");
    const [revenuePeriod, setRevenuePeriod]=useState("fiscal");
    const [revenueYearlyPeriod, setRevenueYearlyPeriod]=useState('fiscal_year');

    
    const results=useStaticQuery(graphql`
query TotalRevenueQueryApollo {
  yearlyFiscal: allYearlyFiscalRevenue {
    group(field: year) {
      year: fieldValue
      nodes {
        Federal_offshore
        Federal_onshore
        Native_American
        Not_tied_to_a_lease
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
	setRevenueToggle(newValue);
	console.debug("toggle",revenueToggle, newValue);
	getChart();
    }
    const revenuePeriodSelected = (newValue) => {
	setRevenuePeriod(newValue);
	console.debug("period",revenuePeriod, newValue );
	getChart();
    }
    const revenueYearlyPeriodSelected = (newValue) => {
	setRevenueYearlyPeriod(newValue);
	console.debug("yearly period", revenueYearlyPeriod, newValue);
	getChart();
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

    const getDataSet = () => {
	//let { data, selectedDataKey, groupNames, longUnits, xAxisLabels } = this.state.dataSet
	let data_set={data:[], lastUpdated: 0, groupNames: {}, longUnits: "dollars", units: "$", xAxisLabels: {}, legendLabels:{}  };
	console.debug ('build fiscal year dataset');
	console.debug(results.yearlyFiscal);
	data_set.data=results.yearlyFiscal.group.map( (g,ii) =>{ let label=g.year;
								 let t={};
								 //t[label]=g.nodes;
								 //t[label]=g.nodes;
								 t[label]=g.nodes.map((n,ii)=>{console.debug(n); let o={}; for(let okey in n) { let newkey=okey.replace('_', ' '); o[newkey]=n[okey]}; return o; });
								 return t;
							       });
	
	data_set.lastUpdated=new Date().getTime();
	data_set.groupNames['Fiscal year']=results.yearlyFiscal.group.map( (g,ii) =>{ return g.year});
	data_set.legendLabels=data_set.groupNames['Fiscal year'].reduce( (obj,item)  => { console.debug("Item:",item); console.debug(obj); obj[item]=item; return obj }, {});
	data_set.xAxisLabels=data_set.groupNames['Fiscal year'].reduce( (obj,item)  => { console.debug("Item:",item); console.debug(obj); obj[item]=item.substr(2); return obj }, {});
	data_set.selectedDataKey="2019";
	data_set.dataId=KEY_STATS_REVENUES_DATA_ID;
	
	console.debug("DATA_SET");
	console.debug(data_set);

/*	switch (revenueToggle) {
	case 'year':
	    switch (revenueYearlyPeriod) {
	    case 'fiscal_year':

	    case 'calendar_year':

	    default:
	    }
	    
	    break;
	case 'month':
	    switch (revenuePeriod) {
	    case 'fiscal':
		console.debug ('build monthly fiscal year dataset', revenuePeriod);
		
		break;
	    case 'calendar':
		console.debug ('build monthly calendar year dataset', revenuePeriod);
		
		break;
	    default:
		console.debug ('default', revenuePeriod);
	    }
	    
	    break;
	}*/
	    return data_set;
    }

    
    const dataKeySelectedHandler = (dataSetId, data, syncId) => {
	console.debug({ id: dataSetId, dataKey: Object.keys(data)[0], syncId: syncId })
	props.setDataSelectedById([{ id: dataSetId, dataKey: Object.keys(data)[0], syncId: syncId }])
    }
    
    const getChart = (id,title, format) => {
	console.debug(id,title, format);
	let dataSet=getDataSet();
	console.debug(dataSet);
	return (
		<div is="chart">
		<StackedBarChartLayout
	    dataSet= {dataSet}
	    
	    title= {title}
	    styleMap= {CHART_STYLE_MAP}
	    sortOrder= {CHART_SORT_ORDER}
	    legendTitle= 'Source'
	    legendDataFormatFunc= {format || utils.formatToCommaInt}
//	    barSelectedCallback= {dataKeySelectedHandler(id, dataSet.data, dataSet.syncId)}

	      >
	      </StackedBarChartLayout>
	    </div>
	)
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
	    <div className={styles.itemChart}>
	    {getChart(KEY_STATS_REVENUES_DATA_ID, CONSTANTS.REVENUE, utils.formatToDollarInt)}
	</div>
	    </div>
	    </section>
    )



}


export default  connect(
  state => ({
    [KEY_STATS_REVENUES_DATA_ID]: state[CONSTANTS.DATA_SETS_STATE_KEY][KEY_STATS_REVENUES_DATA_ID],
    [REVENUES_FISCAL_YEAR_OLD]: state[CONSTANTS.DATA_SETS_STATE_KEY][CONSTANTS.FISCAL_YEAR_KEY][CONSTANTS.REVENUES_ALL_KEY],
    [REVENUES_CALENDAR_YEAR]: state[CONSTANTS.DATA_SETS_STATE_KEY][CONSTANTS.CALENDAR_YEAR_KEY][CONSTANTS.REVENUES_ALL_KEY],
    [REVENUES_FISCAL_YEAR]: state[CONSTANTS.DATA_SETS_STATE_KEY][REVENUES_FISCAL_YEAR]
  }),
  dispatch => ({
  	updateBarChartDataSets: dataSets => dispatch(updateGraphDataSetsAction(dataSets)),
  	groupDataSetsByMonth: configs => dispatch(groupDataSetsByMonthAction(configs)),
  	groupDataSetsByMonth: configs => dispatch(groupDataSetsByMonthAction(configs)),
    groupDataSetsByYear: configs => dispatch(groupDataSetsByYearAction(configs)),
    setDataSelectedById: configs => dispatch(setDataSelectedByIdAction(configs)),

  })
    
)(TotalRevenue)


