/**
 * Enable Redux in gatsby
 * https://github.com/gatsbyjs/gatsby/tree/master/examples/using-redux
 **/

import React from 'react'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import createStore from "./src/state/create-store"

// eslint-disable-next-line react/display-name,react/prop-types
export default ({ history }) => {
    const store = createStore();

    const ConnectedRouterWrapper = ({ children }) => {
    	return (
	        <Provider store={store}>
	            <Router history={history}>{children}</Router>
	        </Provider>
	    );
    }

    return ConnectedRouterWrapper
}
