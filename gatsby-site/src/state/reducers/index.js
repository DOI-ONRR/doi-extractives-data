"use strict";

import { combineReducers } from 'redux';

import glossary from './glossary';
import disbursements from './disbursements';
import productionVolumes from './production-volumes';
import revenues from './revenues';
import federalDisbursements from './federal-disbursements';
import dataManager from './data-manager';

export default combineReducers({ glossary, dataManager, disbursements, productionVolumes, revenues, federalDisbursements });

export const createReducer = (initialState, handlers) => {
	return function reducer(state = initialState, action) {
		if (handlers.hasOwnProperty(action.type)) {
			return handlers[action.type](state, action);
		} else {
			return state;
		}
	}
}

