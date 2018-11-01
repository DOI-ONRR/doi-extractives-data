import * as CONSTANTS from '../../js/constants';

const initialState = {
	SourceData: {
		[CONSTANTS.PRODUCT_VOLUMES_OIL]: undefined
	},
	[CONSTANTS.PRODUCT_VOLUMES_OIL]: undefined
};


// Define Action Types
const HYDRATE = 'HYDRATE';
const BY_YEAR = 'BY_YEAR'

// Define Action Creators 
export const hydrate = (key, data) => ({ type: HYDRATE, payload: data,  key: key});
export const byYear = (key, filter) => ({ type: BY_YEAR, payload: filter,  key: key});

// Define Reducers
export default (state = initialState, action) => {
  const { type, payload, key } = action;
  
  switch (type) {
    case HYDRATE:
      return ({...state, SourceData:{[key]: payload}});
    case BY_YEAR:
    	console.log("ByYear", key);
      return ({...state, [key]:groupByYear(state.SourceData[key], payload) });
    default:
      return state;
  }

};


const groupByYear = (data, filter) => {
	let filterData = data;
	console.log(data[0].Volume.ProductionDate);
	let redcuedData = data.reduce((updated, volume) => {
		//console.log(volume);
		return volume;
	});
	console.log(redcuedData);
	return filterData;
}