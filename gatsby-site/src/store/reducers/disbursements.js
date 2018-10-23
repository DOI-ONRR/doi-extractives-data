'use strict';

import FUND_INFO from '../../data/fund_names.yml';
import utils from '../../js/utils';
import lazy from 'lazy.js';

// Initial state is used for the pattern library and seeding any additional data
const initialState = {

    disbursements: {
        2017: {
            year: "2017",
            total: 10000,
            highestFundValue: 10000,
            disbursements: [{
                States: {
                    description: "Fund Description",
                    name: "Fund Display Name",
                    sortOrderIndex: 0,
                    total: 10000,
                    disbursements: [{Onshore: 5000, GOMESA: 3000, Offshore: 2000}]
                }
            }]
        }
    },
    fundInfo: FUND_INFO
};

// Define Action Types
const SELECT_YEAR = 'SELECT_YEAR';
const HYDRATE_DISBURSEMENTS = 'HYDRATE_DISBURSEMENTS';

// Define Action Creators 
export const selectYear = (year) => ({ type: SELECT_YEAR, payload: year});
export const hydateDisbursements = (disbursements) => ({ type: HYDRATE_DISBURSEMENTS, payload: disbursements});

// Define Reducers
export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SELECT_YEAR:
            return ({...state, 'year': payload});
        case HYDRATE_DISBURSEMENTS:
            let newState = hydrateDisbursements(payload, state.year, state.fundInfo);
            return ({...state, ...newState});
        default:
            return state;
    }
};

const hydrateDisbursements = (data, year, fundInfo) => {
    let newState = {};
    let sortedByYear = lazy(data).sortBy("Year", true).toArray();
    newState.years = lazy(utils.range(parseInt(sortedByYear[sortedByYear.length-1].Year), parseInt(sortedByYear[0].Year))).sort(null,true).toArray();
    newState.year = Math.max(...newState.years);
    
    let fundSortOrder = {};
    newState.disbursements = {};
    sortedByYear.map((disbursementsForYear, index) => {
        newState.disbursements[disbursementsForYear.Year] = hydrateDisbursementsForYear(disbursementsForYear, fundInfo, fundSortOrder);

        // Set Sort order for funds by the highest year value
        // The display order should not change from year to year and is set by the last year of data
        // Using zero index since we already have the data sorted descending by year
        if(index === 0) {
            // Sort descending by total
            newState.disbursements[disbursementsForYear.Year].disbursements.sort(function(a, b) {
                return (b[Object.keys(b)[0]].total - a[Object.keys(a)[0]].total);
            }); 

            newState.disbursements[disbursementsForYear.Year].disbursements.map((fund, index) => {
                fund[Object.keys(fund)[0]].sortOrderIndex = index
                fundSortOrder[Object.keys(fund)[0]] = index;
            });
        }
        else {
            // Sort ascending by sortOrderIndex
            newState.disbursements[disbursementsForYear.Year].disbursements.sort(function(a, b) {
                return (a[Object.keys(a)[0]].sortOrderIndex - b[Object.keys(b)[0]].sortOrderIndex);
            });         
        }

    });

    return newState;
}

const hydrateDisbursementsForYear = (disbursementsForYear, fundInfo, fundSortOrder) => {
    let newState = {
        year: disbursementsForYear.Year,
        total: 0,
        highestFundValue: 0,
        disbursements: []
    };

    if(disbursementsForYear) {
        let disbursementsByFund = utils.groupBy(disbursementsForYear.disbursements, "disbursement.Fund");
        
        // Go through all the funds if a fund has no data it will be zero, with no disbursements
        for(let fundKey in fundInfo) {
            let fundToAdd = {};
            fundToAdd[fundKey] = {
                total: 0,
                disbursements: [],
                name: (fundInfo[fundKey])? fundInfo[fundKey].name : fundKey,
                description: (fundInfo[fundKey])? fundInfo[fundKey].description : "",
                link: (fundInfo[fundKey])? fundInfo[fundKey].link : undefined,
                sortOrderIndex: fundSortOrder[fundKey]
            }

            let sourceData;

            if(disbursementsByFund[fundKey]) {
                sourceData = {};
                disbursementsByFund[fundKey].map((fundData, index) => {
                    sourceData[fundData.disbursement.Source] = Math.round(fundData.disbursement.Disbursement);
                    
                    fundToAdd[fundKey].total += fundData.disbursement.Disbursement;
                    newState.total += fundData.disbursement.Disbursement;
                });
            }
            if(sourceData){
                fundToAdd[fundKey].disbursements.push(sourceData);
            }
            else{
                fundToAdd[fundKey].disbursements = undefined;
            }
            

            if(newState.highestFundValue < fundToAdd[fundKey].total) {
                newState.highestFundValue = fundToAdd[fundKey].total;
            }

            newState.disbursements.push(fundToAdd);
        }
    }

    return newState;
}

