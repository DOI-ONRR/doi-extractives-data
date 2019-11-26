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
      }
`)

  let fiscalYearData = JSON.parse(JSON.stringify(data.allMonthlyRevenuesByFiscalYear.group)).sort((a, b) => (a.fiscalYear < b.fiscalYear) ? 1 : -1)

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

  // If current fiscal year date is September then we have the full year and we should include it in the trend lines
  let beginTrendDataLimit = (currentYearDate.getMonth() === 8) ? 0 : 1
  let trendData = fiscalYearData.splice(beginTrendDataLimit, TREND_LIMIT)

  let previousYearDataIndex = (beginTrendDataLimit === 0) ? 1 : 0
  let previousYearData = JSON.parse(JSON.stringify(trendData))[previousYearDataIndex]
  previousYearData.data = previousYearData.data.filter(item => new Date(item.node.RevenueDate) <= previousYearMaxDate)

  previousYearData = [previousYearData].map(calculateRevenueTypeAmountsByYear)[0]
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

  return (
    <section className={styles.root}>
      <h3 className={styles.title + ' h3-bar'}>Revenue trends</h3>
          Includes federal and Native American revenue through {currentYearDate.toLocaleString('en-us', { timeZone: 'UTC', month: 'long' })} {currentYearDate.getUTCFullYear()}
      <table className={styles.revenueTable}>
        <thead>
          <tr>
            <th>{'FY' + trendData[0].fiscalYear.slice(2) + ' - ' +
              'FY' + trendData[trendData.length - 1].fiscalYear.slice(2)} trend</th>
            <th className={styles.alignRight}>{currentFiscalYearText}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Royalties</td>
            <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.amountByRevenueType.Royalties, 3)}</td>
          </tr>
          <tr>
            <td><Sparkline data={royalties} /></td>
            <td className={styles.alignRight}>
              <PercentDifference
                currentAmount={currentYearData.amountByRevenueType.Royalties}
                previousAmount={previousYearData.amountByRevenueType.Royalties}
              />{' ' + previousFiscalYearText}
            </td>
          </tr>
          <tr>
            <td>Bonuses</td>
            <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.amountByRevenueType.Bonus, 3)}</td>
          </tr>
          <tr>
            <td><Sparkline data={bonuses} /></td>
            <td className={styles.alignRight}>
              <PercentDifference
                currentAmount={currentYearData.amountByRevenueType.Bonus}
                previousAmount={previousYearData.amountByRevenueType.Bonus}
              />{' ' + previousFiscalYearText}
            </td>
          </tr>
          <tr>
            <td>Rents</td>
            <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.amountByRevenueType.Rents, 3)}</td>
          </tr>
          <tr>
            <td><Sparkline data={rents} /></td>
            <td className={styles.alignRight}>
              <PercentDifference
                currentAmount={currentYearData.amountByRevenueType.Rents}
                previousAmount={previousYearData.amountByRevenueType.Rents}
              />{' ' + previousFiscalYearText}
            </td>
          </tr>
          <tr>
            <td>Other revenues</td>
            <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentYearData.amountByRevenueType['Other Revenues'], 3)}</td>
          </tr>
          <tr>
            <td><Sparkline data={otherRevenues} /></td>
            <td className={styles.alignRight}>
              <PercentDifference
                currentAmount={currentYearData.amountByRevenueType['Other Revenues']}
                previousAmount={previousYearData.amountByRevenueType['Other Revenues']}
              />{' ' + previousFiscalYearText}
            </td>
          </tr>
          <tr>
            <td><strong>Total revenues</strong></td>
            <td className={styles.alignRight}><strong>{utils.formatToSigFig_Dollar(currentYearTotal, 3)}</strong></td>
          </tr>
          <tr>
            <td><Sparkline data={totalRevenues} /></td>
            <td className={styles.alignRight}>
              <PercentDifference
                currentAmount={currentYearTotal}
                previousAmount={previousYearTotal}
              />{' ' + previousFiscalYearText}</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export default RevenueTrends

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
*  PercentDifference({currentAmount,previousAmount}) - calculates other revenus from other revenues, inspections fees and civil penalties.
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
