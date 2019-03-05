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
  "ID",
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

  let lastFourteen = path.substr(path.length - 14); 

  if(path.includes("/explore") && (path.endsWith("e/") || path.endsWith("e"))) {
    loader.addPagesArray([{"componentChunkName":"component---src-pages-explore-index-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"explore.json","path": path}]);
  }
  else if(path.includes("/about")){
    loader.addPagesArray([{"componentChunkName":"component---src-pages-about-index-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"about.json","path": path}]);
  }
  else if(path.includes("/downloads/federal-revenue-by-company/")){
    loader.addPagesArray([{"componentChunkName":"component---src-templates-downloads-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"federal-revenue-by-company.json","path": path}]);
  }
  else if(path.includes("/downloads/federal-revenue-by-month/")){
    loader.addPagesArray([{"componentChunkName":"component---src-templates-downloads-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"federal-revenue-by-month.json","path": path}]);
  }
  else if(path.includes("/downloads/federal-revenue-by-location/")){
    loader.addPagesArray([{"componentChunkName":"component---src-templates-downloads-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"federal-revenue-by-location.json","path": path}]);
  }
  else if(path.includes("/downloads/federal-production/")){
    loader.addPagesArray([{"componentChunkName":"component---src-templates-downloads-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"federal-production.json","path": path}]);
  }
  else if(path.includes("/downloads/federal-production-by-month/")){
    loader.addPagesArray([{"componentChunkName":"component---src-templates-downloads-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"federal-production-by-month.json","path": path}]);
  }
  else if(path.includes("/downloads")){
    loader.addPagesArray([{"componentChunkName":"component---src-templates-downloads-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"downloads.json","path": path}]);
  }
  else if(path.includes("/how-it-works") && !lastFourteen.includes("default-page")){

    if(path.includes("/native-american-ownership-governance") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([{"componentChunkName":"component---src-templates-content-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-native-american-ownership-governance.json","path":path}]);
    }
    else if(path.includes("/reconciliation/2015") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([,{"componentChunkName":"component---src-templates-how-it-works-reconciliation-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-reconciliation-2015.json","path":path}]);
    }
    else if(path.includes("/reconciliation/2016") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([,{"componentChunkName":"component---src-templates-how-it-works-reconciliation-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-reconciliation-2016.json","path":path}]);
    }
    else if(path.includes("/aml-reclamation-program") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([,{"componentChunkName":"component---src-templates-content-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-aml-reclamation-program.json","path":path}]);
    }
    else if(path.includes("/revenues") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([{"componentChunkName":"component---src-templates-content-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-revenues.json","path":path}]);
    }
    else if(path.includes("/minerals") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([,{"componentChunkName":"component---src-templates-how-it-works-process-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-minerals.json","path":path}]);
    }
    else if(path.includes("/onshore-renewables") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([,{"componentChunkName":"component---src-templates-how-it-works-process-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-onshore-renewables.json","path":path}]);
    }
    else if(path.includes("/offshore-renewables") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([,{"componentChunkName":"component---src-templates-how-it-works-process-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-offshore-renewables.json","path":path}]);
    }
    else if(path.includes("/minerals") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([,{"componentChunkName":"component---src-templates-how-it-works-process-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-minerals.json","path":path}]);
    }
    else if(path.includes("/federal-revenue-by-company/2017") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([,{"componentChunkName":"component---src-templates-how-it-works-revenue-by-company-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-federal-revenue-by-company-2017.json","path":path}]);
    }
    else if(path.includes("/federal-revenue-by-company/2016") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([,{"componentChunkName":"component---src-templates-how-it-works-revenue-by-company-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-federal-revenue-by-company-2016.json","path":path}]);
    }
    else if(path.includes("/federal-revenue-by-company/2015") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([,{"componentChunkName":"component---src-templates-how-it-works-revenue-by-company-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-federal-revenue-by-company-2015.json","path":path}]);
    }
    else if(path.includes("/federal-revenue-by-company/2014") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([,{"componentChunkName":"component---src-templates-how-it-works-revenue-by-company-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-federal-revenue-by-company-2014.json","path":path}]);
    }
    else if(path.includes("/federal-revenue-by-company/2013") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([,{"componentChunkName":"component---src-templates-how-it-works-revenue-by-company-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-federal-revenue-by-company-2013.json","path":path}]);
    }
    else if(path.includes("/offshore-oil-gas") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([,{"componentChunkName":"component---src-templates-how-it-works-process-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-offshore-oil-gas.json","path":path}]);
    }
    else if(path.includes("/onshore-oil-gas") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([,{"componentChunkName":"component---src-templates-how-it-works-process-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-onshore-oil-gas.json","path":path}]);
    }
    else if(path.includes("/coal") && !path.includes("/coal-excise-tax")){
      loader.addPagesArray([,{"componentChunkName":"component---src-templates-how-it-works-process-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-coal.json","path":path}]);
    }
    else if(path.includes("/disbursements") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([{"componentChunkName":"component---src-templates-content-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-disbursements.json","path":path}]);
    }
    else if(path.includes("/coal-excise-tax") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([{"componentChunkName":"component---src-templates-content-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-coal-excise-tax.json","path":path}]);
    }
    else if(path.includes("/state-laws-and-regulations") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([{"componentChunkName":"component---src-templates-content-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-state-laws-and-regulations.json","path":path}]);
    }
    else if(path.includes("/federal-laws") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([{"componentChunkName":"component---src-templates-content-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-federal-laws.json","path":path}]);
    }
    else if(path.includes("/federal-reforms") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([{"componentChunkName":"component---src-templates-content-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-federal-reforms.json","path":path}]);
    }
    else if(path.includes("/renewables") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([{"componentChunkName":"component---src-templates-content-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-renewables.json","path":path}]);
    }
    else if(path.includes("/nonenergy-minerals") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([{"componentChunkName":"component---src-templates-content-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-nonenergy-minerals.json","path":path}]);
    }
    else if(path.includes("/fossil-fuels") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([{"componentChunkName":"component---src-templates-content-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-fossil-fuels.json","path":path}]);
    }
    else if(path.includes("/native-american-production") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([{"componentChunkName":"component---src-templates-content-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-native-american-production.json","path":path}]);
    }
    else if(path.includes("/ownership") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([{"componentChunkName":"component---src-templates-content-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-ownership.json","path":path}]);
    }
    else if(path.includes("/native-american-revenue") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([{"componentChunkName":"component---src-templates-content-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-native-american-revenue.json","path":path}]);
    }
    else if(path.includes("/native-american-economic-impact") && !lastFourteen.includes("default-page")){
      loader.addPagesArray([{"componentChunkName":"component---src-templates-content-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works-native-american-economic-impact.json","path":path}]);
    }
    else{
      loader.addPagesArray([{"componentChunkName":"component---src-templates-how-it-works-default-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"how-it-works.json","path":path}]);
    }
  }
  else if(path.includes("/explore") && usStateIds.includes(statePathId)) {
    loader.addPagesArray([{"componentChunkName":"component---src-templates-state-page-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"explore-"+statePathId.toLowerCase()+".json","path":path}]);
  }
  else {
    loader.addPagesArray([{"componentChunkName":"component---src-pages-index-js","layout":"layout---index","layoutComponentChunkName":"component---src-layouts-index-js","jsonName":"index.json","path":path}]);
  }
}
