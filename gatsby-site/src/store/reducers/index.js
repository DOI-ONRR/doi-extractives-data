"use strict";

import { combineReducers } from 'redux';

import app from './app';
import disbursements from './disbursements';

export default combineReducers({ app, disbursements });

export const createReducer = (initialState, handlers) => {
	return function reducer(state = initialState, action) {
		if (handlers.hasOwnProperty(action.type)) {
			return handlers[action.type](state, action);
		} else {
			return state;
		}
	}
}

