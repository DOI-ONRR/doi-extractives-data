/* globals window */

import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import createStore from './src/state/createStore';

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
  let pages = [
  	{componentChunkName: "component---src-pages-about-index-js", layout: "layout---index", layoutComponentChunkName: "component---src-layouts-index-js", jsonName: "about.json", path: "/preview/onrr/doi-extractives-data/gatsby-federalist-1/about/"},
	{componentChunkName: "component---src-pages-explore-index-js", layout: "layout---index", layoutComponentChunkName: "component---src-layouts-index-js", jsonName: "explore.json", path: "/preview/onrr/doi-extractives-data/gatsby-federalist-1/explore/"}
  ];

  loader.addPagesArray(pages);
}
