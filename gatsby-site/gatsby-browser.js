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
    {"componentChunkName":"component---src-pages-404-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"404.json","path":"/404/"},
    {"componentChunkName":"component---src-pages-about-index-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"about.json","path": "/about/"},
    {"componentChunkName":"component---src-pages-explore-index-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"explore.json","path":"/explore/"},
    {"componentChunkName":"component---src-pages-404-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"404-html.json","path":"/404.html"},
    {componentChunkName: "component---src-pages-about-index-js", layout: "layout---index", layoutComponentChunkName: "component---src-layouts-index-js", jsonName: "about.json", path: "/preview/onrr/doi-extractives-data/gatsby-explore-data-page/about/"},
    {componentChunkName: "component---src-pages-explore-index-js", layout: "layout---index", layoutComponentChunkName: "component---src-layouts-index-js", jsonName: "explore.json", path: "/preview/onrr/doi-extractives-data/gatsby-explore-data-page/explore/"}

  ];

  loader.addPagesArray(pages);
}
