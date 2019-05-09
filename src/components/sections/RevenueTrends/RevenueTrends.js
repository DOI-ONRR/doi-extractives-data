import React, { useEffect, useRef }  from 'react'
import ReactDOM from 'react-dom'
import { StaticQuery, graphql } from "gatsby"

import * as d3 from 'd3'
import utils from '../../../js/utils'

import styles from './RevenueTrends.module.scss'

const TREND_LIMIT = 10;

const RevenueTrends = props => (
  <StaticQuery
    query={graphql`
      query RevenueTrendsQuery {
        allMonthlyRevenuesByFiscalYear: allResourceRevenuesMonthly(
          filter: {RevenueCategory: {ne: null}}, 
          sort: {fields: [RevenueDate], order: DESC}) {
          group(field: CalendarYear) {
            fiscalYear: fieldValue
            data: edges {
              node {
                id
                FiscalYear
                Revenue
                RevenueCategory
                RevenueType
              }
            }
          }
        }
      }
    `}
    render={data => {
      let fiscalYearData = JSON.parse(JSON.stringify(data.allMonthlyRevenuesByFiscalYear.group))
      let sorted = fiscalYearData.sort((a, b) => (a.fiscalYear < b.fiscalYear) ? 1 : -1)

      sorted = sorted.splice(0,TREND_LIMIT);
      sorted = sorted.sort((a, b) => (a.fiscalYear > b.fiscalYear) ? 1 : -1)

      let currentFiscalYearText = 'FY'+sorted[0].fiscalYear.slice(2)+' so far';
      let previousFiscalYearText = 'from FY'+sorted[1].fiscalYear.slice(2);

      let revenueTrendData = sorted.map((yearData, index) => {

        let fiscalYear = yearData.fiscalYear;
        let sums = yearData.data.reduce((total, item) => {
          total[item.node.RevenueType] =
            (total[item.node.RevenueType] !== undefined)
              ? total[item.node.RevenueType] + item.node.Revenue
              : item.node.Revenue

          return total
        }, {})


        return { 'year': fiscalYear, 'amountByRevenueType': sums};
      })

      let royalties = revenueTrendData.map(yearData => ({'year':yearData.year, 'amount': yearData.amountByRevenueType.Royalties}) )
      let bonuses = revenueTrendData.map(yearData => ({'year':yearData.year, 'amount': yearData.amountByRevenueType.Bonus}) )
      let rents = revenueTrendData.map(yearData => ({'year':yearData.year, 'amount': yearData.amountByRevenueType.Rents}) )
      let otherRevenues = revenueTrendData.map(yearData => ({'year':yearData.year, 'amount': yearData.amountByRevenueType['Other Revenues']}) )
      let totalRevenues = revenueTrendData.map(yearData => (
        {
          'year':yearData.year, 
          'amount': (
            yearData.amountByRevenueType.Royalties+
            yearData.amountByRevenueType.Bonus+
            yearData.amountByRevenueType.Rents+
            yearData.amountByRevenueType['Other Revenues']
          )
        })
      )

      console.log(totalRevenues);

      return (
        <section className={styles.root}>
          <h3 className={styles.title+" h3-bar"}>Revenue Trends</h3>
          Includes federal and Native American revenue
          <table className={styles.revenueTable}>
            <thead>
              <tr>
                <th>10 year trend</th>
                <th>{currentFiscalYearText}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Royalties</td>
                <td>{utils.formatToSigFig_Dollar(royalties[(TREND_LIMIT-1)].amount, 2)}</td>
              </tr>
              <tr>
                <td><SparkLine data={royalties} /></td>
                <td>^XX% {previousFiscalYearText}</td>
              </tr>
              <tr>
                <td>Bonuses</td>
                <td>{utils.formatToSigFig_Dollar(bonuses[(TREND_LIMIT-1)].amount, 2)}</td>
              </tr>
              <tr>
                <td><SparkLine data={bonuses} /></td>
                <td>^XX% {previousFiscalYearText}</td>
              </tr>
              <tr>
                <td>Rents</td>
                <td>{utils.formatToSigFig_Dollar(rents[(TREND_LIMIT-1)].amount, 2)}</td>
              </tr>
              <tr>
                <td><SparkLine data={rents} /></td>
                <td>^XX% {previousFiscalYearText}</td>
              </tr>
              <tr>
                <td>Other revenues</td>
                <td>{utils.formatToSigFig_Dollar(otherRevenues[(TREND_LIMIT-1)].amount, 2)}</td>
              </tr>
              <tr>
                <td><SparkLine data={otherRevenues} /></td>
                <td>^XX% {previousFiscalYearText}</td>
              </tr>
              <tr>
                <td>Total revenues</td>
                <td>{utils.formatToSigFig_Dollar(totalRevenues[(TREND_LIMIT-1)].amount, 2)}</td>
              </tr>
              <tr>
                <td><SparkLine data={totalRevenues} /></td>
                <td>^XX% {previousFiscalYearText}</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}
    }
  />

)

export default RevenueTrends

const SparkLine = ({data}) => {

  const spakeStyles = {
    stroke: 'steelblue',
    strokeWidth: 1,
    fill: 'none',
  }

  const elemRef = useRef(null);

  useEffect(() => {
    var width = 90;
    var height = 20;
    var x = d3.scaleLinear().range([0, width - 3]);
    var y = d3.scaleLinear().range([height - 4, 0]);
    var line = d3.line()
                 .curve(d3.curveBasis)
                 .x(function(d) { return x(d.year); })
                 .y(function(d) { return y(d.amount); });

    x.domain(d3.extent(data, function(d) { return +d.year; }));
    y.domain(d3.extent(data, function(d) { return +d.amount; }));
    var svg = d3.select(elemRef.current)
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .style('height', (height+5))
                .append('g')
                .attr('transform', 'translate(0, 2)');
    svg.append('path')
       .datum(data)
       .attr('class', 'sparkline')
       .attr('d', line);
    svg.append('circle')
       .attr('class', 'sparkcircle')
       .attr('cx', x(data[data.length - 1].year))
       .attr('cy', y(data[data.length - 1].amount))
       .attr('r', 2.5);  
  });

  return (
    <div style={spakeStyles} ref={elemRef}></div>
  )
}


/*{utils.formatToSigFig_Dollar(totalRevenues[(TREND_LIMIT-1)], 2)}*/