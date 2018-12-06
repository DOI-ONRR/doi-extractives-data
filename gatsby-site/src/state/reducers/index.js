"use strict";

import { combineReducers } from 'redux';

import glossary from './glossary';
import disbursements from './disbursements';
import dataSets from './data-sets';

export function createReducer (initialState, handlers) {
	return function reducer(state = initialState, action) {
		if (handlers.hasOwnProperty(action.type)) {
			return handlers[action.type](state, action);
		} else {
			return state;
		}
	}
}

export default combineReducers({ glossary, dataSets, disbursements });