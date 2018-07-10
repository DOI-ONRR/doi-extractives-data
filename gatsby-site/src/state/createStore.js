/* global window:true */
/* eslint no-underscore-dangle: 0 */

import { createStore } from 'redux';
import rootReducer from './index';

export default () => {
  
  
  const devtools =
    process.env.NODE_ENV === 'development' && window.devToolsExtension
      ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f;
  
  
  const store = createStore(rootReducer, devtools);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./', () => {
      const nextRootReducer = require('./index');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};
