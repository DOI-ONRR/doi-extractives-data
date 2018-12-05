"use strict";
/***
 * This reducer handles the state of data for the application.
 * For example when data is selcted or needs to be synchronized
 * we will handle it in this reducer for all slices of our data.
 **/
import { createReducer } from './index.js';
import CONSTANTS from '../../js/constants';
import utils from '../../js/utils';


// Define Initial State
const initialState = {
	FiscalYear: {},
	CalendarYear: {},
	SourceData: {},
	SyncIds: {},
};


// Define Action Types
const HYDRATE = 'HYDRATE_DATA_SETS';
const GROUP_BY_YEAR = 'GROUP_DATA_SETS_BY_YEAR';
const GROUP_BY_MONTH = 'GROUP_DATA_SETS_BY_MONTH';
const SET_DATA_SELECTED_BY_ID = 'SET_DATA_SELECTED_BY_ID';


// Define Action Creators 
export const hydrate = (dataSets) => ({ type: HYDRATE, payload: dataSets });
export const groupByYear = (configs) => ({ type: GROUP_BY_YEAR, payload: configs });
export const groupByMonth = (configs) => ({ type: GROUP_BY_MONTH, payload: configs });
export const setDataSelectedById = (configs) => ({ type: SET_DATA_SELECTED_BY_ID, payload: configs });


// Define Action Handlers
const hydrateHandler = (state, action) => {
	const { payload } = action;

	let {SourceData, FiscalYear, CalendarYear} = state;
	payload.forEach((dataSet) => {
		SourceData[dataSet.key] = dataSet.data;
		setFiscalCalendarYear(dataSet.key, dataSet.data, FiscalYear, CalendarYear);
	});

  return ({...state, FiscalYear: FiscalYear, CalendarYear: CalendarYear, SourceData: SourceData});
}

const groupByYearHandler = (state, action) => {
	const { payload } = action;

	let results = {};
	results.SyncIds = {...state.SyncIds};

	payload.forEach((config) => {

		results[config.id] = dataSetByYear(config.sourceKey, state.SourceData[config.sourceKey], config.filter, config.options);
		
		addDataSetSync(config.options.syncId, config.id, results);

	});

	return ({...state, ...results });
}

const groupByMonthHandler = (state, action) => {
	const { payload } = action;
	
	let results = {};
	results.SyncIds = {...state.SyncIds};

	payload.forEach((config) => {
		results[config.id] = 
			dataSetByMonth(config.sourceKey, state.SourceData[config.sourceKey], config.filter, config.options, state.FiscalYear[config.sourceKey], state.CalendarYear[config.sourceKey]);

		addDataSetSync(config.options.syncId, config.id, results);

	});

	return ({...state, ...results });
}

const setDataSelectedByIdHandler = (state, action) => {
	const { payload } = action;

	let results = {};
	payload.forEach((config) => {
		results[config.id] = {...state[config.id], selectedDataKey: config.dataKey, lastUpdated: Date.now()};
		// Synchronize datasets
		if(state.SyncIds[config.syncId]) {
			state.SyncIds[config.syncId].forEach((dataId) => {
				results[dataId] = {...state[dataId], selectedDataKey: config.dataKey, lastUpdated: Date.now()};
			})
		}

	});

	return ({...state, ...results });
}

const addDataSetSync = (syncId, dataId, results) => {
	if(syncId){
		if(results.SyncIds[syncId]){
			results.SyncIds[syncId].push(dataId);
		}
		else {
			results.SyncIds[syncId] = [dataId];
		}
	}
}


// Export reducer
export default createReducer(initialState, {
	[HYDRATE]: hydrateHandler,
	[GROUP_BY_YEAR]: groupByYearHandler,
	[GROUP_BY_MONTH]: groupByMonthHandler,
	[SET_DATA_SELECTED_BY_ID]: setDataSelectedByIdHandler
});


// Utils

// The following Utils are used to resolve differences in data identifiers
const getDate = (data) => data.ProductionDate || data.RevenueDate;
const getMonth = (data) => data.ProductionMonth || data.RevenueMonth;
const getYear = (data) => data.ProductionYear || data.RevenueYear || data.Year;
const getMonthKey = (data) => {
	let key;
	if(data.ProductionMonth) {
		key = "data.ProductionMonth";
	}
	else if(data.RevenueMonth) {
		key = "data.RevenueMonth";
	}

	return key;
}
const getYearKey = (data) => {
	let key;
	if(data.ProductionYear) {
		key = "data.ProductionYear";
	}
	else if(data.RevenueYear) {
		key = "data.RevenueYear";
	}
	else if(data.Year) {
		key = "data.Year";
	}
	return key;
}
const getDateKey = (data) => {
	let key;
	if(data.ProductionDate) {
		key = "data.ProductionDate";
	}
	else if(data.RevenueDate) {
		key = "data.RevenueDate";
	}

	return key;
}
// Used to get the data attribute that will be added
const getNumToSum = (data) => data.Volume || data.Revenue || data.Disbursement || 0;

/**
 * Set the most recent year available in our data
 * for Fiscal and Calendar year. Data is assumed to
 * be sorted descending by production date. If that changes
 * we should add a sort function.
 *
 * Fiscal Year is Oct (Year-1) to Sept (Year)
 * It is assumed if we have Sept data we have the fiscal year data
 * for that year.
 *
 * For Calendar Year it is assumed if we have Dec data we have 
 * all data for that year
 **/
const setFiscalCalendarYear = (key, source, fiscalYear, calendarYear) => {

	let fiscalYearItem = source.find(item => (getMonth(item.data) === "September"));
	let calendarYearItem = source.find(item => (getMonth(item.data) === "December"));

	fiscalYear[key] = (fiscalYearItem && parseInt(getYear(fiscalYearItem.data)));
	calendarYear[key] = (calendarYearItem) ? parseInt(getYear(calendarYearItem.data)) : parseInt(getYear(source[0].data));

}

/** 
 * 
 * @returns {Object}
 **/
const dataSetByYear = (key, source, filter, options) => {
	if(source === undefined) return source;

	let xAxisLabels, legendLabels, groupNames, units, longUnits, selectedDataKey;

	// We add this for now until we update our data to always include units and long units
	units = source[0].data.Units || "$";
	longUnits = source[0].data.Units || "dollars";

	let results = Object.entries(utils.groupBy(source, getYearKey(source[0].data))).map(e => ({[e[0]] : e[1] }) );

	// We assume if the data matches current year that we dont have the year of data, so we remove it
	let currentYear = new Date().getFullYear();
	results = results.filter((yearData) => parseInt(Object.keys(yearData)[0]) !== currentYear);

	results.sort((a,b) => ( getYear(a[Object.keys(a)[0]][0].data) - getYear(b[Object.keys(b)[0]][0].data) ));

	// Get display names before we filter the data.
	if(options && options.includeDisplayNames) {
		xAxisLabels = {};
		legendLabels = {}
		results.forEach((item) => {
			xAxisLabels[Object.keys(item)[0]] = item[Object.keys(item)[0]][0].data.DisplayYear;
			if(units === "$"){
				legendLabels[Object.keys(item)[0]] = getYear(item[Object.keys(item)[0]][0].data).toString();
			}
			else {
				legendLabels[Object.keys(item)[0]] = getYear(item[Object.keys(item)[0]][0].data)+" ("+units+")";
			}
			
		});
	}

	if(filter) {

		// Sum volume by data key and assign year key to the result
		if(filter.sumBy) {
			results = results.map((yearData) => {
				let year = Object.keys(yearData)[0];
				let sums = [yearData[year].reduce((total, item) => {
					total[item.data[filter.sumBy]] = 
						(total[item.data[filter.sumBy]] !== undefined) ?
							total[item.data[filter.sumBy]]+getNumToSum(item.data) 
							: 
							getNumToSum(item.data);

					return total;},{})];

				return {[year]: sums}
			});
		}
		
		if(filter.limit > 0 ) {
			results = results.splice(0,  filter.limit );
		}

	}

	// Set sub group name
	if(options && options.subGroupName) {
		groupNames = {};
		results.map((item) => {
			let key = Object.keys(item)[0];
			if(groupNames[options.subGroupName]) {
				groupNames[options.subGroupName].push(key);
			}
			else{
				groupNames[options.subGroupName] = [key];
			}
		});
	}

	if(options && options.selectedDataKeyIndex) {
		switch(options.selectedDataKeyIndex) {
			case 'last':
				selectedDataKey = Object.keys(results[results.length-1])[0];
				break;
			default:
				selectedDataKey = Object.keys(results[options.selectedDataKeyIndex])[0];
		}
	}


	return {
		data: results, 
		groupNames: groupNames,
		lastUpdated: Date.now(),
		legendLabels: legendLabels,
		longUnits: longUnits,
		selectedDataKey: selectedDataKey,
		syncId: options.syncId,
		units: units,
		xAxisLabels: xAxisLabels,
	};
}

/** 
 * @returns {Object}
 **/
const dataSetByMonth = (key, source, filter, options, fiscalYear, calendarYear) => {
	if(source === undefined) return source;

	let xAxisLabels, legendLabels, groupNames, units, longUnits, selectedDataKey;

	// We add this for now until we update our data to always include units and long units
	units = source[0].data.Units || "$";
	longUnits = source[0].data.Units || "dollars";

	let results = JSON.parse(JSON.stringify(source));

	if(filter.period === "recent" && filter.limit > 0) {
		let resultsGroupedByDate = Object.entries( utils.groupBy( source, getDateKey(source[0].data) ) ).map(e => ({[e[0]] : e[1] }) );
		let resultsLimited = resultsGroupedByDate.splice(0, filter.limit);
		results = results.filter((monthData) => (Object.keys(resultsLimited[resultsLimited.length-1])[0] <= getDate(monthData.data) ));
	}
	// Fiscal Year is Oct (Year-1) to Sept (Year)
	else if(filter.period === "fiscal") {
		let fiscalYearStart = results.find((item) => 
			( getMonth(item.data) === "October" && parseInt( getYear(item.data) ) === (fiscalYear-1)));

		let fiscalYearEnd = results.find((item) => 
			( getMonth(item.data) === "September" && parseInt( getYear(item.data) ) === (fiscalYear)));
		
		results = results.filter((item) => (new Date( getDate(item.data) ) >= new Date( getDate(fiscalYearStart.data) ) && 
					new Date( getDate(item.data) ) <= new Date( getDate(fiscalYearEnd.data) ) ) );
	}
	else if(filter.period === "calendar") {
		results = results.filter((item) => ( parseInt( getYear(item.data) ) === calendarYear ) );
	}

	results = Object.entries(utils.groupBy(results, [getMonthKey(source[0].data), getYearKey(source[0].data) ])).map(e => ({[e[0]] : e[1] }) );

	// Sort ascending by date
	results.sort((a,b) => { 
			let aDate = new Date( getDate(a[Object.keys(a)[0]][0].data) );
			let bDate = new Date( getDate(b[Object.keys(b)[0]][0].data) );
			return (aDate < bDate)? -1 : (aDate == bDate)? 0 : 1;
		});


	if(options) {

		// Get display names before we filter the data.
		if(options && options.includeDisplayNames) {
			xAxisLabels = {};
			legendLabels = {}
			results.forEach((item) => {
				xAxisLabels[Object.keys(item)[0]] = item[Object.keys(item)[0]][0].data.DisplayMonth;
				if(units === "$"){
					legendLabels[Object.keys(item)[0]] = item[Object.keys(item)[0]][0].data.DisplayMonth+"\xa0"+getYear(item[Object.keys(item)[0]][0].data).toString();
				}
				else {
					legendLabels[Object.keys(item)[0]] = item[Object.keys(item)[0]][0].data.DisplayMonth+"\xa0"+getYear(item[Object.keys(item)[0]][0].data)+" ("+units+")";
				}
				
			});
		}

		if(options.subGroup) {
			groupNames = {};
			results.map((item) => {
				let key = Object.keys(item)[0];
				let name = item[key][0].data[options.subGroup];
				if(groupNames[name]) {
					groupNames[name].push(key);
				}
				else{
					groupNames[name] = [key];
				}
			});
		}
	}

	if(filter) {

		// Sum volume by data key and assign month key to the result
		if(filter.sumBy) {
			results = results.map((monthData) => {
				let month = Object.keys(monthData)[0];
				let sums = [monthData[month].reduce((total, item) => {

					total[item.data[filter.sumBy]] = 
						(total[item.data[filter.sumBy]] !== undefined) ?
							total[item.data[filter.sumBy]]+getNumToSum(item.data) 
							: 
							getNumToSum(item.data);

					return total;},{})];

				return {[month]: sums}
			});
		}

	}


	if(options && options.selectedDataKeyIndex) {
		switch(options.selectedDataKeyIndex) {
			case 'last':
				selectedDataKey = Object.keys(results[results.length-1])[0];
				break;
			default:
				selectedDataKey = Object.keys(results[options.selectedDataKeyIndex])[0];
		}
	}

	return {data:results, 
					groupNames: groupNames,
					lastUpdated: Date.now(),
					legendLabels: legendLabels,
					longUnits: longUnits,
					selectedDataKey: selectedDataKey,
					syncId: options.syncId,
					units: units,
					xAxisLabels: xAxisLabels,};	
}
