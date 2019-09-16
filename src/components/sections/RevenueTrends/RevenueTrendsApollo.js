import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useStaticQuery, graphql } from 'gatsby'

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

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
const REVENUE_TRENDS_GQL= gql`
{
  revenue_trends {
    current_month
    fiscal_year
    total
    total_ytd
    trend_type
  }
}
`


const RevenueTrendsApollo = () => {

    const { loading, error, data } = useQuery(REVENUE_TRENDS_GQL);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error </p>;
				 
    return data.revenue_trends.map((row, index) => (
	    <div key={row.fiscal_year}>
	    <p>
            {row.total_ytd}: {row.fiscal_year}
	</p>
	    </div>
    ));				 

}

export default RevenueTrendsApollo

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
