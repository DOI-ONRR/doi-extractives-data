"use strict";

/***
 * This reducer handles the state of data for the application.
 * For example when data is selcted or needs to be synchronized
 * we will handle it in this reducer for all slices of our data.
 **/

import CONSTANTS from '../../js/constants';
import utils from '../../js/utils';

const initialState = {
	SelectedData: {},
};

// Define Action Types
const HYDRATE = 'HYDRATE_PRODUCTION_VOLUMES';

// Define Action Creators 
export const hydrate = (key, data) => ({ type: HYDRATE, payload: data,  key: key});

// Define Reducers
export default (state = initialState, action) => {
  const { type, payload, key } = action;

  switch (type) {
    default:
      return state;
  }

};