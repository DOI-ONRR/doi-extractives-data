import React, { useEffect, useRef }  from 'react'
import ReactDOM from 'react-dom'
import { useStaticQuery, graphql } from "gatsby"

import * as d3 from 'd3'
import utils from '../../../js/utils'

import Sparkline from '../../data-viz/Sparkline'

import TriangleUpIcon from '-!svg-react-loader!../../../img/svg/arrow-up.svg'
import TriangleDownIcon from '-!svg-react-loader!../../../img/svg/arrow-down.svg'

import styles from './DisbursementTrends.module.scss'

const TREND_LIMIT = 10;

/**
* DisbursmentTrends - react functional component that generates revenue trends graph
*
* uses hook useStaticQuery and graphl to get revenu data then 
* summarizes data for graphical representation
*/

const DisbursementTrends = () => {

    const results=useStaticQuery(graphql`
       query DisbursementTrendsQuery {
allYearlyDispursements :  allDisbursementsXlsxData(sort: {fields: [Fiscal_Year], order: DESC}) {
    nodes {
      Fiscal_Year
      Fund_Type
      State
      County
      _Total_
    }
  }
}

`) 
//    console.debug(results);
    let data=results.allYearlyDispursements.nodes;
    let currentYear=data[0].Fiscal_Year
    let previousYear=currentYear - 1;
    let trends=aggregateData(data);

    let currentFiscalYearText = 'FY'+currentYear.toString().substr(2,2)+' year to date so far';
    let previousFiscalYearText = 'from FY'+previousYear.toString().substr(2,2);
    
      return (
        <section className={styles.root}>
          <h3 className={styles.title+" h3-bar"}>Dispersement trends</h3>
              Includes dispursments through {currentFiscalYearText} 
          <table className={styles.dispersementTable}>
            <thead>
              <tr>
                <th>10-year trend</th>
                <th className={styles.alignRight}>{currentFiscalYearText}</th>
              </tr>
            </thead>
	      {trends.map( (trend, index) => (
		      <tbody key={'tbody'+index} >
		      <tr className={styles[trend.className]}>
                      <td>{trend.fund}</td>
                <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(trend.current, 3)}</td>
              </tr>
		      <tr   >
                      <td><Sparkline key={'spark'+index} data={trend.histData} /></td>
                <td className={styles.alignRight}>
                      <PercentDifference key={'percent'+index}
                    currentAmount={trend.current} 
                    previousAmount={trend.previous} 
                  />{' '+previousFiscalYearText}
                </td>
		      </tr>
		      </tbody>
	      ))}


          </table>
        </section>
      )

}

/*              <tr>
                <td><strong>Total revenues</strong></td>
                <td className={styles.alignRight}><strong>{utils.formatToSigFig_Dollar(123212, 3)}</strong></td>
              </tr>
              <tr>
                <td><Sparkline data={totalDisbursments} /></td>
                <td className={styles.alignRight}>
                  <PercentDifference 
                    currentAmount={currentYearTotal} 
                    previousAmount={previousYearTotal} 
                  />{' '+previousFiscalYearText}</td>
              </tr>
*/


export default DisbursementTrends




const aggregateData= (data) => {

    let r=[
	{fund: 'U.S. Treasury', current: 0, previous: 0, histSum: {}, histData:[] },
	{fund: 'States & counties', current: 0, previous: 0, histSum:{}, histData:[] },
	{fund: 'Reclamation fund', current: 0, previous: 0, histSum:{}, histData:[]},
	{fund: 'Native Americans', current: 0, previous: 0, histSum:{}, histData:[]},
	{fund: 'Other Funds', current: 0, previous: 0, histSum:{}, histData:[]},
	{fund: 'Total', current: 0, previous: 0, histSum: {},histData:[], className : 'strong'}
    ]
    let currentYear=data[0].Fiscal_Year


    for(let ii=0; ii<data.length; ii++) {
	let item=data[ii];
	if(item.Fund_Type.match(/U.S. Treasury/))  {
	    sumData(item,r,0,currentYear); //sum into us treasury
	} else if (item.Fund_Type.match(/State/))  {
	    sumData(item,r,1, currentYear); //sum into state
	} else if (item.Fund_Type.match(/Reclamation/))  {
	    sumData(item,r,2, currentYear); //sum into Reclamation
	} else if (item.Fund_Type.match(/American Indian/))  {
	    sumData(item,r,3, currentYear); //sum into Native
	} else {
	    sumData(item,r,4, currentYear); //sum into other
	}
	sumData(item,r,5, currentYear); //sum into Total

    }

    r.map((row,i) => { let a=[];
		       let years=Object.keys(row.histSum).sort();
		       a=years.map((year,i)=> ({year: year, amount:row.histSum[year]}))
		       r[i].histData=a;
		       return a
		     })
    
    
    return r;
}

const sumData= (item,r,index,currentYear) => {
    let previousYear=currentYear - 1;
    if(item.Fiscal_Year==currentYear) r[index].current+=item._Total_ ;
    if(item.Fiscal_Year==previousYear) r[index].previous+=item._Total_;
    if(r[0].histSum[item.Fiscal_Year]) {
	if(! isNaN(Number(item._Total_)))  r[index].histSum[item.Fiscal_Year]+=Number(item._Total_);
    } else {
	r[index].histSum[item.Fiscal_Year]=Number(item._Total_);
    }
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

const calculateOtherRevenues = (data) => {

  let otherRevenuesAmount = (data.amountByRevenueType['Other Revenues'])? data.amountByRevenueType['Other Revenues'] : 0;
  let inspectionFeesAmount = (data.amountByRevenueType['Inspection Fees'])? data.amountByRevenueType['Inspection Fees'] : 0;
  let civilPenaltiesAmount = (data.amountByRevenueType['Civil Penalties'])? data.amountByRevenueType['Civil Penalties'] : 0;
  
  data.amountByRevenueType['Other Revenues'] = otherRevenuesAmount+inspectionFeesAmount+civilPenaltiesAmount;
}

/**
* calculateRevenueTypeAmountsByYear(data,index) - calculates other revenus from other revenues, inspections fees and civil penalties.
*
*  
**/


const calculateRevenueTypeAmountsByYear = (yearData, index) => {
  let fiscalYear = yearData.fiscalYear;
  let sums = yearData.data.reduce((total, item) => {
    total[item.node.RevenueType] =
      (total[item.node.RevenueType] !== undefined)
        ? total[item.node.RevenueType] + item.node.Revenue
        : item.node.Revenue
    return total
  }, {})

  return { 'year': fiscalYear, 'amountByRevenueType': sums};
}

/**
* PercentDifference({currentAmount,previousAmount}) - calculates other revenus from other revenues, inspections fees and civil penalties.
*
*  @return TriangleUpIcon || TriangleDownIcon
**/



const PercentDifference = ({currentAmount, previousAmount}) => {
  let percentIncrease = ((currentAmount - previousAmount)/previousAmount) * 100;
  return (
    <span>
      {percentIncrease > 0 ?
          <TriangleUpIcon viewBox="-20 -15 50 40"/>
        :
          <TriangleDownIcon viewBox="-20 -10 50 40"/>
      }
      <span>
        {utils.round(percentIncrease, 0)+'%'}
      </span>  
    </span>
  );
}
