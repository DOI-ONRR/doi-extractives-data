import React from 'react'
import { StaticQuery, graphql } from "gatsby"

import utils from '../../../js/utils'

import styles from './RevenueTrends.module.scss'

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
      let sorted = data.allMonthlyRevenuesByFiscalYear.group.sort((a, b) => (a.fiscalYear < b.fiscalYear) ? 1 : -1)
      sorted = sorted.splice(0,10);
      console.log(sorted);

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

      console.log(revenueTrendData);

      let royalties = revenueTrendData.map(yearData => ({'year':yearData.year, 'amount': yearData.amountByRevenueType.Royalties}) )
      let bonuses = revenueTrendData.map(yearData => ({'year':yearData.year, 'amount': yearData.amountByRevenueType.Bonus}) )

      console.log(royalties, bonuses);

      console.log();

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
                <td>{utils.formatToSigFig_Dollar(royalties[0].amount, 2)}</td>
              </tr>
              <tr>
                <td>squiggly line</td>
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

/*
  {
    "year": "{{ item.year }}",
    "amount": "{{ item.amount }}"
  }
*/