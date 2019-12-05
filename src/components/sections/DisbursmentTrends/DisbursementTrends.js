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
allYearlyDispursements : allFederalDisbursements (sort: {fields: [Year], order: DESC}){
    nodes {
      _Total_:Disbursement
      Fiscal_Year:Year
      Fund_Type:Fund
      County
      State:USState
    }
  }
    currentMonthlyDispursements : allDisbursementsMonthly {
    nodes {
      Month
      FiscalYear
      DisplayYear
      Disbursement
      Fund
    }
  }
}

`) 

    let dataYearly=results.allYearlyDispursements.nodes;
    let currentMonthly=results.currentMonthlyDispursements.nodes.map(obj=> ({...obj, month:monthLookup(obj.Month), FiscalMonth: fiscalMonthLookup(obj.Month), date: monthlyDate(obj)}));


    let maxMonth=getMaxMonth(currentMonthly).toLocaleString(undefined, { month: 'long' });
    let calendarYear=getMaxMonth(currentMonthly).getFullYear();
    let currentYear=getCurrentYear(currentMonthly);
    let currentTrends=aggregateMonthlyData(currentMonthly,currentYear);   
    //    let currentYear=data[0].Fiscal_Year
    let previousYear=getPreviousYear(currentMonthly);
    let trends=aggregateData(dataYearly)

    
    let minYear=trends[0].histData[0].year.substring(2);
    let maxYear=trends[0].histData[trends[0].histData.length-1].year.substring(2);
    
    let currentFiscalYearText = 'FY'+currentYear.substring(2)+' so far';
    let longCurrentText= maxMonth+" "+calendarYear;
    let previousFiscalYearText = 'from FY'+previousYear;
    
      return (
        <section className={styles.root}>
          <h3 className={styles.title+" h3-bar"}>Disbursement trends</h3>
              Includes disbursements through {longCurrentText} 
          <table className={styles.dispersementTable}>
            <thead>
              <tr>
              <th>FY{minYear} - FY{maxYear} trend</th>
                <th className={styles.alignRight}>{currentFiscalYearText}</th>
              </tr>
            </thead>
	      {trends.map( (trend, index) => (
		      <tbody key={'tbody'+index} >
		      <tr className={styles[trend.className]}>
                      <td>{trend.fund}</td>
                <td className={styles.alignRight}>{utils.formatToSigFig_Dollar(currentTrends[index].current, 3)}</td>
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
                <td><Sparkline data={totalDisbursements} /></td>
                <td className={styles.alignRight}>
                  <PercentDifference 
                    currentAmount={currentYearTotal} 
                    previousAmount={previousYearTotal} 
                  />{' '+previousFiscalYearText}</td>
              </tr>
*/


export default DisbursementTrends

const getCurrentYear = (data) => {

    let r=data.reduce((max, p) => p.FiscalYear > max ? p.FiscalYear : max, data[0].FiscalYear );

    return r;
    
}

const getPreviousYear = (data) => {

    let r=data.reduce((min, p) => p.FiscalYear < min ? p.FiscalYear : min, data[0].FiscalYear );

    return r;
    
}



const getMaxMonth = (data) => {
     let r=data.reduce((max, p) => p.date > max ? p.date : max, data[0].date );

    //let dates=data.map((row,i) => row.date.getTime());
    //let max_epoch=Math.max.apply(null,dates)
    //let  r=new Date(max_epoch)

    
    return r;
}
const monthLookup= (month) => {

    let monthNumber={
	"January":1,
	"February":2,
	"March":3,
	"April":4,
	"May":5,
	"June":6,
	"July":7,
	"August":8,
	"September":9,
	"October": 10,
	"November": 11,
	"December": 12
    }

    return monthNumber[month];
}
const fiscalMonthLookup= (month) => {
    let monthNumber={
	"January":4,
	"February":5,
	"March":6,
	"April":7,
	"May":8,
	"June":9,
	"July":10,
	"August":11,
	"September":12,
	"October": 1,
	"November": 2,
	"December": 3
    }

    return monthNumber[month];
}

/*
    "allDisbursementsMonthly": {
      "distinct": [
        "BLM-Nat Petrol Reserve-2",
        "Bureau of Land Management",
        "Bureau of Ocean Energy Management",
        "Bureau of Safety & Environmental Enforcement",
        "Fish & Wildlife",
        "Forest Service",
        "Land & Water Conservation Fund",
        "Lease Process Improvement (BLM)",
        "Native American Tribes & Allottees",
        "Reclamation Fund",
        "State",
        "U.S. Treasury",
        "U.S. TreasuryAI"
      ]
    },
    "allDisbursementsXlsxData": {
      "distinct": [
        "American Indian Tribes",
        "Historic Preservation Fund",
        "Land & Water Conservation Fund",
        "Land & Water Conservation Fund - GoMESA",
        "Land & Water Conservation Fund - GoMesa",
        "Other",
        "Reclamation",
        "State",
        "State - GoMESA",
        "State 8(g)",
        "U.S. Treasury",
        "U.S. Treasury - GoMESA"
      ]
    }
*/   

const aggregateMonthlyData= (data,currentYear) => {
    let r=[
	{fund: 'U.S. Treasury', current: 0, previous: 0, histSum: {}, histData:[] },
	{fund: 'States & counties', current: 0, previous: 0, histSum:{}, histData:[] },
	{fund: 'Reclamation fund', current: 0, previous: 0, histSum:{}, histData:[]},
	{fund: 'Native Americans', current: 0, previous: 0, histSum:{}, histData:[]},
	{fund: 'Other Funds', current: 0, previous: 0, histSum:{}, histData:[]},
	{fund: 'Total', current: 0, previous: 0, histSum: {},histData:[], className : 'strong'}
    ]

//    let currentYear=2019;
    
    for(let ii=0; ii<data.length; ii++) {
	let item=data[ii];
    	if(item.Fund.match(/U.S. Treasury/))  {
	    sumMonthlyData(item,r,0,currentYear); //sum into us treasury
	} else if (item.Fund.match(/State/))  {
	    sumMonthlyData(item,r,1, currentYear); //sum into state
	} else if (item.Fund.match(/Reclamation/))  {
	    sumMonthlyData(item,r,2, currentYear); //sum into Reclamation
	} else if (item.Fund.match(/Native American/))  {
	    sumMonthlyData(item,r,3, currentYear); //sum into Native
	} else {
	    sumMonthlyData(item,r,4, currentYear); //sum into other
	}
	sumMonthlyData(item,r,5, currentYear); //sum into Total
    
    }
    return r;
}
const sumMonthlyData= (item,r,index,currentYear) => {
    let previousYear=currentYear-1;
    if(item.FiscalYear==currentYear){
	r[index].current+=item.Disbursement;
    }
    if(item.FiscalYear==previousYear){
	r[index].previous+=item.Disbursement;
    }
    
 }

const monthlyDate = (obj) => {

    let month=monthLookup(obj.Month);
    if(month < 10) { month='0'+month};
    let year=Math.floor(obj.DisplayYear.substring(1))+2000;
    let date=new Date(year+'-'+month+'-02')
    return date;
}


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
		       r[i].histData=a.slice(-10);
		       return a.slice(-10)
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
  let fiscalYear = yearData.FiscalYear;
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
