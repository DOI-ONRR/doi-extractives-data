/* globals window */
import 'core-js';
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


const usStateIds =[
  "AK",
  "AL",
  "AR",
  "AZ",
  "CA",
  "CO",
  "CT",
  "DC",
  "DE",
  "FL",
  "GA",
  "HI",
  "IA",
  "IL",
  "IN",
  "KS",
  "KY",
  "LA",
  "MA",
  "MD",
  "ME",
  "MI",
  "MN",
  "MO",
  "MS",
  "MT",
  "NC",
  "ND",
  "NE",
  "NH",
  "NJ",
  "NM",
  "NV",
  "NY",
  "OH",
  "OK",
  "OR",
  "PA".
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VA",
  "VT",
  "WA",
  "WI",
  "WV"
];

exports.onClientEntry = () => {
  // Patch the resource loader
  const loader = global.___loader;
  if (!loader) return;

  let path = window.location.pathname;
  let statePathId = path.substring((path.length-3), (path.length-1));

  console.log(statePathId);


  if(path.includes("/explore") && (path.endsWith("e/") || path.endsWith("e"))) {
    loader.addPagesArray([{"componentChunkName":"component---src-pages-explore-index-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"explore.json","path": path}]);
  }
  else if(path.includes("/about")){
    loader.addPagesArray([{"componentChunkName":"component---src-pages-about-index-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"about.json","path": path}]);
  }
  else if(path.includes("/explore") && usStateIds.includes(statePathId)) {
    console.log(statePathId);
    loader.addPagesArray([{"componentChunkName":"component---src-templates-state-page-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"explore-ar.json","path":"/Explore/"+statePathId+"/"},{"componentChunkName":"component---src-templates-state-page-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"explore-"+statePathId.toLowerCase()+".json","path":path}]);
  }


}