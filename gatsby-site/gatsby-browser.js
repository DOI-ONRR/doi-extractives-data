/* globals window */
import 'core-js'; /* used for IE 11 compatibility */

import ReactDOM from 'react-dom';

/* Add Redux store provider */
import wrapWithProvider from "./wrap-with-provider"
export const replaceRouterComponent = wrapWithProvider;

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
  "PA",
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
  "WV",
  "WY"
];

exports.onClientEntry = () => {
  // Patch the resource loader
  const loader = global.___loader;
  if (!loader) return;

  let path = window.location.pathname;
  let statePathId = path.substring((path.length-3), (path.length-1));

  if(path.includes("/explore") && (path.endsWith("e/") || path.endsWith("e"))) {
    loader.addPagesArray([{"componentChunkName":"component---src-pages-explore-index-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"explore.json","path": path}]);
  }
  else if(path.includes("/about")){
    loader.addPagesArray([{"componentChunkName":"component---src-pages-about-index-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"about.json","path": path}]);
  }
  else if(path.includes("/explore") && usStateIds.includes(statePathId)) {
    loader.addPagesArray([{"componentChunkName":"component---src-templates-state-page-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"explore-"+statePathId.toLowerCase()+".json","path":path}]);
  }
  else {
    loader.addPagesArray([{"componentChunkName":"component---src-pages-index-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"index.json","path":path}]);
  }
}
