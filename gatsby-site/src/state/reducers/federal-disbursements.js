"use strict";

import CONSTANTS from '../../js/constants';
import utils from '../../js/utils';

const initialState = {
	SourceData: {
		[CONSTANTS.DISBURSEMENTS_ALL_KEY]: undefined,
	},
	[CONSTANTS.DISBURSEMENTS_ALL_KEY]: undefined,
};

// Define Action Types
const HYDRATE = 'HYDRATE_DISBURSEMENTS';
const BY_YEAR = 'BY_YEAR_DISBURSEMENTS';

// Define Action Creators 
export const hydrate = (key, data) => ({ type: HYDRATE, payload: data,  key: key});
export const byYear = (key, filter, options) => ({ type: BY_YEAR, payload: {filter, options},  key: key});

// Define Reducers
export default (state = initialState, action) => {
  const { type, payload, key } = action;

  switch (type) {
    case HYDRATE:
    	let {SourceData} = state;
    	SourceData[key] = payload;
      return ({...state, SourceData: SourceData});
    case BY_YEAR:
      return ({...state, [key]:groupByYear(state.SourceData[key], payload.filter, payload.options) });
    default:
      return state;
  }

};

/** 
 * 
 * @returns {Object}
 **/
const groupByYear = (source, filter, options) => {
	if(source === undefined) return source;

	let xAxisLabels, legendLabels, groupNames;
	let results = Object.entries(utils.groupBy(source, "data.Year")).map(e => ({[e[0]] : e[1] }) );

	results.sort((a,b) => (a[Object.keys(a)[0]][0].data.Year - b[Object.keys(b)[0]][0].data.Year));

	if(options) {
		// Get display names before we filter the data.
		if(options.includeDisplayNames) {
			xAxisLabels = {};
			legendLabels = {}
			results.forEach((item) => {
				xAxisLabels[Object.keys(item)[0]] = item[Object.keys(item)[0]][0].data.DisplayYear;
				legendLabels[Object.keys(item)[0]] = item[Object.keys(item)[0]][0].data.Year.toString();
			});
		}
	}

	if(filter) {
		
		if(filter.limit > 0) {
			results.splice(0,(results.length-filter.limit));
		}

		// Sum volume by data key and assign year key to the result
		if(filter.sumBy) {
			results = results.map((yearData) => {
				let year = Object.keys(yearData)[0];
				let sums = [yearData[year].reduce((total, item) => {
					total[item.data[filter.sumBy]] = 
						(total[item.data[filter.sumBy]] !== undefined) ?
							total[item.data[filter.sumBy]]+item.data.Disbursement 
							: 
							item.data.Disbursement;

					return total;},{})];

				return {[year]: sums}
			});
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

	return {Data:results, 
					Units: "$",
					LongUnits: "dollars",
					XAxisLabels: xAxisLabels,
					LegendLabels: legendLabels,
					GroupNames: groupNames};
}

