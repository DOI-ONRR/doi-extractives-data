/* global window:true */
/* eslint no-underscore-dangle: 0 */

import { createStore } from 'redux';
import rootReducer from './reducers';



export default () => {  
  console.log("******* Starting Create Store *********");

	const devtools = 
		(process.env.NODE_ENV === 'development' && window.devToolsExtension) ? 
			window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
		: 
			f => f;

	const store = createStore(rootReducer, devtools);

	console.log("Store State: ", store.getState());

	console.log("******* Finished Create Store *********");
	return store;
};
