/* globals window */

import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import createStore from './src/store/create-store';

exports.replaceRouterComponent = ({ history }) => {
  const store = createStore();

  const ConnectedRouterWrapper = ({ children }) => (
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  );

  return ConnectedRouterWrapper;
};


exports.onClientEntry = () => {
  // Patch the resource loader
  const loader = global.___loader;
  if (!loader) return;

  let path = window.location.pathname;

  if(path.includes("/explore")) {
    loader.addPagesArray([{"componentChunkName":"component---src-pages-explore-index-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"explore.json","path": path}]);
  }
  else if(path.includes("/about")){
    loader.addPagesArray([{"componentChunkName":"component---src-pages-about-index-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"about.json","path": path}]);
  }
}
