import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useStaticQuery, graphql } from 'gatsby'

import * as d3 from 'd3'
import utils from '../../../js/utils'

import Sparkline from '../../data-viz/Sparkline'

import TriangleUpIcon from '-!svg-react-loader!../../../img/svg/arrow-up.svg'
import TriangleDownIcon from '-!svg-react-loader!../../../img/svg/arrow-down.svg'

import styles from './RevenueTrends.module.scss'

const TREND_LIMIT = 10

/**
* RevenueTrends - react functional component that generates revenue trends graph
*
* uses hook useStaticQuery and graphl to get revenu data then
* summarizes data for graphical representation
*/

const RevenueTrends = () => {

  const data = useStaticQuery(graphql`
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
	allRevenueTrends(sort: {fields: fiscal_year, order: DESC}) {
	group(field: fiscal_year) {
      	fiscal_year: fieldValue
	data: nodes {
        total_ytd
        total
        trend_type
        fiscal_year
        current_month

	}
    
	}
	}

	}
	
	`)


  let fiscalYearData = JSON.parse(JSON.stringify(data.allMonthlyRevenuesByFiscalYear.group)).sort((a, b) => (a.fiscalYear < b.fiscalYear) ? 1 : -1)

    console.debug(fiscalYearData)

  // Get the latest date then subtract 1 year to filter previous year data to compare current year data
  let currentYearDate = new Date(fiscalYearData[0].data[0].node.RevenueDate)
  let previousYearMaxDate = new Date(fiscalYearData[0].data[0].node.RevenueDate)

  previousYearMaxDate.setFullYear(previousYearMaxDate.getUTCFullYear() - 1)

  let currentYearData = (JSON.parse(JSON.stringify(fiscalYearData)).splice(0, 1)).map(calculateRevenueTypeAmountsByYear)[0]
  calculateOtherRevenues(currentYearData)
  let currentYearTotal = (currentYearData.amountByRevenueType.Royalties +
            currentYearData.amountByRevenueType.Bonus +
            currentYearData.amountByRevenueType.Rents +
            currentYearData.amountByRevenueType['Other Revenues'])

    let trendData = fiscalYearData.splice(0, TREND_LIMIT)
    console.debug(trendData);

    let previousYearData = JSON.parse(JSON.stringify(trendData))[1]

    previousYearData.data = previousYearData.data.filter(item => new Date(item.node.RevenueDate) <= previousYearMaxDate)
    
   // console.debug(previousYearData);


  previousYearData = [previousYearData].map(calculateRevenueTypeAmountsByYear)[0]
   /// console.debug(previousYearData);

    calculateOtherRevenues(previousYearData)
    
    let previousYearTotal = previousYearData.amountByRevenueType.Royalties +
                              previousYearData.amountByRevenueType.Bonus +
                              previousYearData.amountByRevenueType.Rents +
                              previousYearData.amountByRevenueType['Other Revenues']


  let currentFiscalYearText = 'FY' + currentYearData.year.slice(2) + ' so far'
  let previousFiscalYearText = 'from FY' + previousYearData.year.slice(2)

  // Sort trend data asc for spark lines
  trendData.sort((a, b) => (a.fiscalYear > b.fiscalYear) ? 1 : -1)
  let sparkLineData = trendData.map(calculateRevenueTypeAmountsByYear)
        
    let royalties = sparkLineData.map(yearData => ({ 'year': yearData.year, 'amount': yearData.amountByRevenueType.Royalties }))

    console.debug(royalties);

  let bonuses = sparkLineData.map(yearData => ({ 'year': yearData.year, 'amount': yearData.amountByRevenueType.Bonus }))
  let rents = sparkLineData.map(yearData => ({ 'year': yearData.year, 'amount': yearData.amountByRevenueType.Rents }))
  let otherRevenues = sparkLineData.map(yearData => {
    calculateOtherRevenues(yearData)
    return ({ 'year': yearData.year, 'amount': yearData.amountByRevenueType['Other Revenues'] })
  })
  let totalRevenues = sparkLineData.map(yearData => (
    {
      'year': yearData.year,
      'amount': (
        yearData.amountByRevenueType.Royalties +
            yearData.amountByRevenueType.Bonus +
            yearData.amountByRevenueType.Rents +
            yearData.amountByRevenueType['Other Revenues']
      )
    })
  )

/*

    
    const data = useStaticQuery(
	graphql `
query RevenueTrendsQuery {
  allRevenueTrends(sort: {fields: fiscal_year, order: DESC}) {
    group(field: fiscal_year) {
      	fiscal_year: fieldValue
      data: nodes {
        total_ytd
        total
        trend_type
        fiscal_year
      }
    
    }
  }
}
`
    );
    
*/
   
    let allData=data.allRevenueTrends.group.sort((a, b) => (a.fiscal_year < b.fiscal_year) ? 1 : -1)
    allData=allData.map(obj =>({...obj,
				ytd: (type)=>getYtd(obj.data,type),
				total: (type)=>getFiscalTotal(obj.data, type),
			       }
			      ));
    fiscalYearData=allData.slice(0,TREND_LIMIT);
    console.debug(fiscalYearData);
    previousYearData=allData[1];
    currentYearData=allData[0];
    console.debug("===============================================>");
    console.debug(currentYearData);
    currentFiscalYearText = 'FY' + currentYearData.fiscal_year.slice(2) + ' so far'
    previousFiscalYearText = 'from FY' + previousYearData.fiscal_year.slice(2)

      
    return (<>    <section className={styles.root}>
      <h3 className={styles.title + ' h3-bar'}>Revenue trends</h3>
            Includes federal and Native American revenue through {currentYearData.data[0].current_month} {currentYearData.fiscal_year}
	    <table className={styles.revenueTable}>
        <thead>
          <tr>
            <th>10-year trend</th>
            <th className={styles.alignRight}>{currentFiscalYearText}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Royalties</td>
            <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.ytd('Royalties'), 3)}</td>
          </tr>
          <tr>
            <td><Sparkline data={fiscalYearData.map((data,i)=>({year: data.fiscal_year, amount: data.total('Royalties')})).sort((a, b) => (a.year > b.year) ? 1 : -1)} /></td>
            <td className={styles.alignRight}>
              <PercentDifference
		currentAmount={currentYearData.ytd('Royalties')}
		previousAmount={previousYearData.ytd('Royalties')}
		/>{' ' + previousFiscalYearText}
            </td>
          </tr>
          <tr>
            <td>Bonuses</td>
	    <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.ytd('Bonus'), 3)}</td>
	  </tr>
          <tr>
            <td><Sparkline data={fiscalYearData.map((data,i)=>({year: data.fiscal_year, amount: data.total('Bonus')})).sort((a, b) => (a.year > b.year) ? 1 : -1)} /></td>
	    <td className={styles.alignRight}>
	      <PercentDifference
		currentAmount={currentYearData.ytd('Bonus')}
		previousAmount={previousYearData.ytd('Bonus')}
	    />{' ' + previousFiscalYearText}
            </td>
            </tr>
          <tr>
            <td>Rents</td>
            <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.ytd('Rents'), 3)}</td>
	  </tr>
	  <tr>
	    <td><Sparkline data={fiscalYearData.map((data,i)=>({year: data.fiscal_year, amount: data.total('Rents')})).sort((a, b) => (a.year > b.year) ? 1 : -1)} /></td>
	    <td className={styles.alignRight}>
	      <PercentDifference
		currentAmount={currentYearData.ytd('Rents')}
                previousAmount={previousYearData.ytd('Rents')}
              />{' ' + previousFiscalYearText}
            </td>
          </tr>
          <tr>
            <td>Other revenues</td>
            <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.ytd('Other Revenues'), 3)}</td>
          </tr>
          <tr>
            <td><Sparkline data={fiscalYearData.map((data,i)=>({year: data.fiscal_year, amount: data.total('Other Revenues')})).sort((a, b) => (a.year > b.year) ? 1 : -1)} /></td>

	            <td className={styles.alignRight}>
              <PercentDifference
                currentAmount={currentYearData.ytd('Other Revenues')}
                previousAmount={previousYearData.ytd('Other Revenues')}
		/>{' ' + previousFiscalYearText}
            </td>
          </tr>
          <tr>
            <td><strong>Total revenues</strong></td>
            <td className={styles.alignRight}><strong>{utils.formatToSigFig_Dollar(currentYearData.ytd('All Revenue'), 3)}</strong></td>
          </tr>
          <tr>
	    <td><Sparkline data={fiscalYearData.map((data,i)=>({year: data.fiscal_year, amount: data.total('All Revenue')})).sort((a, b) => (a.year > b.year) ? 1 : -1)} /></td>
	    
            <td className={styles.alignRight}>
              <PercentDifference
                currentAmount={currentYearData.ytd('All Revenue')}
                previousAmount={previousYearData.ytd('All Revenue')}
		/>{' ' + previousFiscalYearText}</td>
          </tr>
        </tbody>
	    </table>
    </section>
    <section className={styles.root}>
      <h3 className={styles.title + ' h3-bar'}>Revenue year to date trends</h3>
            Includes federal and Native American revenue through {currentYearData.data[0].current_month} {currentYearData.fiscal_year}
	    <table className={styles.revenueTable}>
        <thead>
          <tr>
            <th>10-year ytd trend</th>
            <th className={styles.alignRight}>{currentFiscalYearText}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Royalties</td>
            <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.ytd('Royalties'), 3)}</td>
          </tr>
          <tr>
            <td><Sparkline data={fiscalYearData.map((data,i)=>({year: data.fiscal_year, amount: data.ytd('Royalties')})).sort((a, b) => (a.year > b.year) ? 1 : -1)} /></td>
            <td className={styles.alignRight}>
              <PercentDifference
		currentAmount={currentYearData.ytd('Royalties')}
		previousAmount={previousYearData.ytd('Royalties')}
		/>{' ' + previousFiscalYearText}
            </td>
          </tr>
          <tr>
            <td>Bonuses</td>
	    <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.ytd('Bonus'), 3)}</td>
	  </tr>
          <tr>
            <td><Sparkline data={fiscalYearData.map((data,i)=>({year: data.fiscal_year, amount: data.ytd('Bonus')})).sort((a, b) => (a.year > b.year) ? 1 : -1)} /></td>
	    <td className={styles.alignRight}>
	      <PercentDifference
		currentAmount={currentYearData.ytd('Bonus')}
		previousAmount={previousYearData.ytd('Bonus')}
	    />{' ' + previousFiscalYearText}
            </td>
            </tr>
          <tr>
            <td>Rents</td>
            <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.ytd('Rents'), 3)}</td>
	  </tr>
	  <tr>
	    <td><Sparkline data={fiscalYearData.map((data,i)=>({year: data.fiscal_year, amount: data.ytd('Rents')})).sort((a, b) => (a.year > b.year) ? 1 : -1)} /></td>
	    <td className={styles.alignRight}>
	      <PercentDifference
		currentAmount={currentYearData.ytd('Rents')}
                previousAmount={previousYearData.ytd('Rents')}
              />{' ' + previousFiscalYearText}
            </td>
          </tr>
          <tr>
            <td>Other revenues</td>
            <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.ytd('Other Revenues'), 3)}</td>
          </tr>
          <tr>
            <td><Sparkline data={fiscalYearData.map((data,i)=>({year: data.fiscal_year, amount: data.ytd('Other Revenues')})).sort((a, b) => (a.year > b.year) ? 1 : -1)} /></td>

	            <td className={styles.alignRight}>
              <PercentDifference
                currentAmount={currentYearData.ytd('Other Revenues')}
                previousAmount={previousYearData.ytd('Other Revenues')}
		/>{' ' + previousFiscalYearText}
            </td>
          </tr>
          <tr>
            <td><strong>Total revenues</strong></td>
            <td className={styles.alignRight}><strong>{utils.formatToSigFig_Dollar(currentYearData.ytd('All Revenue'), 3)}</strong></td>
          </tr>
          <tr>
	    <td><Sparkline data={fiscalYearData.map((data,i)=>({year: data.fiscal_year, amount: data.ytd('All Revenue')})).sort((a, b) => (a.year > b.year) ? 1 : -1)} /></td>
	    
            <td className={styles.alignRight}>
              <PercentDifference
                currentAmount={currentYearData.ytd('All Revenue')}
                previousAmount={previousYearData.ytd('All Revenue')}
		/>{' ' + previousFiscalYearText}</td>
          </tr>
        </tbody>
	    </table>
	    </section>
	        <section className={styles.root}>
      <h3 className={styles.title + ' h3-bar'}>Revenue fiscal trends</h3>
            Includes federal and Native American revenue through {currentYearData.data[0].current_month} {currentYearData.fiscal_year}
	    <table className={styles.revenueTable}>
        <thead>
          <tr>
            <th>10-year trend</th>
            <th className={styles.alignRight}>{currentFiscalYearText}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Royalties</td>
            <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.total('Royalties'), 3)}</td>
          </tr>
          <tr>
            <td><Sparkline data={fiscalYearData.map((data,i)=>({year: data.fiscal_year, amount: data.total('Royalties')})).sort((a, b) => (a.year > b.year) ? 1 : -1)} /></td>
            <td className={styles.alignRight}>
              <PercentDifference
		currentAmount={currentYearData.total('Royalties')}
		previousAmount={previousYearData.total('Royalties')}
		/>{' ' + previousFiscalYearText}
            </td>
          </tr>
          <tr>
            <td>Bonuses</td>
	    <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.total('Bonus'), 3)}</td>
	  </tr>
          <tr>
            <td><Sparkline data={fiscalYearData.map((data,i)=>({year: data.fiscal_year, amount: data.total('Bonus')})).sort((a, b) => (a.year > b.year) ? 1 : -1)} /></td>
	    <td className={styles.alignRight}>
	      <PercentDifference
		currentAmount={currentYearData.total('Bonus')}
		previousAmount={previousYearData.total('Bonus')}
	    />{' ' + previousFiscalYearText}
            </td>
            </tr>
          <tr>
            <td>Rents</td>
            <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.total('Rents'), 3)}</td>
	  </tr>
	  <tr>
	    <td><Sparkline data={fiscalYearData.map((data,i)=>({year: data.fiscal_year, amount: data.total('Rents')})).sort((a, b) => (a.year > b.year) ? 1 : -1)} /></td>
	    <td className={styles.alignRight}>
	      <PercentDifference
		currentAmount={currentYearData.total('Rents')}
                previousAmount={previousYearData.total('Rents')}
              />{' ' + previousFiscalYearText}
            </td>
          </tr>
          <tr>
            <td>Other revenues</td>
            <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.total('Other Revenues'), 3)}</td>
          </tr>
          <tr>
            <td><Sparkline data={fiscalYearData.map((data,i)=>({year: data.fiscal_year, amount: data.total('Other Revenues')})).sort((a, b) => (a.year > b.year) ? 1 : -1)} /></td>

	            <td className={styles.alignRight}>
              <PercentDifference
                currentAmount={currentYearData.total('Other Revenues')}
                previousAmount={previousYearData.total('Other Revenues')}
		/>{' ' + previousFiscalYearText}
            </td>
          </tr>
          <tr>
            <td><strong>Total revenues</strong></td>
            <td className={styles.alignRight}><strong>{utils.formatToSigFig_Dollar(currentYearData.total('All Revenue'), 3)}</strong></td>
          </tr>
          <tr>
	    <td><Sparkline data={fiscalYearData.map((data,i)=>({year: data.fiscal_year, amount: data.total('All Revenue')})).sort((a, b) => (a.year > b.year) ? 1 : -1)} /></td>
	    
            <td className={styles.alignRight}>
              <PercentDifference
                currentAmount={currentYearData.total('All Revenue')}
                previousAmount={previousYearData.total('All Revenue')}
		/>{' ' + previousFiscalYearText}</td>
          </tr>
        </tbody>
	    </table>
	    </section>
	    </>
  )

}

export default RevenueTrends

const getYtd = (data, type) => {
    return data.filter(revenue=>revenue.trend_type === type ).reduce((sum,obj)=> sum + obj.total_ytd,0);
}

const getFiscalTotal = (data, type) => {
	      return data.filter(revenue=>revenue.trend_type === type ).reduce((sum,obj)=> sum + obj.total,0);
    
}


/**
* calculateOtherRevenues(data) - calculates other revenus from other revenues, inspections fees and civil penalties.
*
*  @param {object} data item
*
*  @example
*            calculateOtherRevenues(yearData);
*
**/

const calculateOtherRevenues = data => {
  let otherRevenuesAmount = (data.amountByRevenueType['Other Revenues']) ? data.amountByRevenueType['Other Revenues'] : 0
  let inspectionFeesAmount = (data.amountByRevenueType['Inspection Fees']) ? data.amountByRevenueType['Inspection Fees'] : 0
  let civilPenaltiesAmount = (data.amountByRevenueType['Civil Penalties']) ? data.amountByRevenueType['Civil Penalties'] : 0

  data.amountByRevenueType['Other Revenues'] = otherRevenuesAmount + inspectionFeesAmount + civilPenaltiesAmount
}

/**
* calculateRevenueTypeAmountsByYear(data,index) - calculates other revenus from other revenues, inspections fees and civil penalties.
*
*
**/



const calculateRevenueTypeAmountsByYear = (yearData, index) => {

  let fiscalYear = yearData.fiscalYear
  let sums = yearData.data.reduce((total, item) => {
    total[item.node.RevenueType] =
      (total[item.node.RevenueType] !== undefined)
        ? total[item.node.RevenueType] + item.node.Revenue
          : item.node.Revenue

    return total
  }, {})


  return { 'year': fiscalYear, 'amountByRevenueType': sums }
}

/**
* PercentDifference({currentAmount,previousAmount}) - calculates other revenus from other revenues, inspections fees and civil penalties.
*
*  @return TriangleUpIcon || TriangleDownIcon
**/

const PercentDifference = ({ currentAmount, previousAmount }) => {
  let percentIncrease = ((currentAmount - previousAmount) / previousAmount) * 100
  return (
    <span>
      {percentIncrease > 0
        ? <TriangleUpIcon viewBox="-20 -15 50 40"/>
        : <TriangleDownIcon viewBox="-20 -10 50 40"/>
      }
      <span>
        {utils.round(percentIncrease, 0) + '%'}
      </span>
    </span>
  )
}
