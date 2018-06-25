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
  return createStore(rootReducer, devtools);
};
