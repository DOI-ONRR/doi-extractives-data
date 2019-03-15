const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

const GRAPHQL_QUERIES = require('./src/js/graphql-queries');




// Custom Data Transformers
const DATA_TRANSFORMER_CONSTANTS = require('./src/js/data-transformers/constants');
const productionVolumesTransformer = require('./src/js/data-transformers/production-volumes-transformer');
const revenuesTransformer = require('./src/js/data-transformers/revenues-transformer');
const federalDisbursementsTransformer = require('./src/js/data-transformers/federal-disbursements-transformer');

const Remark = require('remark');
const remarkHTML = require('remark-html');
const toHAST = require(`mdast-util-to-hast`);
const stripPosition = require(`unist-util-remove-position`);
const hastReparseRaw = require(`hast-util-raw`);
const visit = require(`unist-util-visit`)

const remark = new Remark().data(`settings`, { commonmark: true, footnotes: true, pedantic: true, gfm: true });

let allStateIds = [];

exports.onCreateNode = ({ node, pathPrefix, getNode, boundActionCreators }) => {

	const { createNodeField } = boundActionCreators

	createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `case_study_link`);
	createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_optin_intro`);
	createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_production`);
	createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_land`);
	createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_land_production`);
	createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_revenue`);
	createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_revenue_sustainability`);
	createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_tax_expenditures`);
	createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_disbursements`);
	createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_saving_spending`);
	createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_impact`);

};

/**
 *
 * This function is called from the gatsby api after the initial node creation and  
 * before the queries are run on the pages. This is where we add application ready nodes
 * created from the raw graphql nodes that get created from our source data files.
 * This is run during the build process and provides the application graphql nodes that
 * are easily filtered, sorted and/or grouped. They also contain display ready names to be used
 * on the site.
 *
 * The redux store object can also be used here if needed. Its another argument that can be added
 * if we want to do anything with the store here. Currently we have the pages populate the redux store with 
 * the data they query from graphql. This gives each page ownership over what data is actually needed for that
 * page.
 *
 **/
exports.sourceNodes = ({ getNodes, boundActionCreators }) => {
	const { createNode } = boundActionCreators;

	productionVolumesTransformer(createNode, 
		getNodes().filter(n => n.internal.type === DATA_TRANSFORMER_CONSTANTS.PRODUCTION_VOLUMES_EXCEL));

	revenuesTransformer(createNode, 
		getNodes().filter(n => n.internal.type === DATA_TRANSFORMER_CONSTANTS.REVENUES_MONTHLY_EXCEL));

	federalDisbursementsTransformer(createNode, 
		getNodes().filter(n => n.internal.type === DATA_TRANSFORMER_CONSTANTS.FEDERAL_DISBURSEMENTS_EXCEL));

}


// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  return Promise.all([createStatePages(createPage, graphql), createHowItWorksPages(createPage, graphql), createDownloadsPages(createPage, graphql)]);
};

// Page Templates
const CONTENT_DEFAULT_TEMPLATE = path.resolve(`src/templates/content-default.js`);
const HOWITWORKS_DEFAULT_TEMPLATE = path.resolve(`src/templates/how-it-works-default.js`);
const HOWITWORKS_PROCESS_TEMPLATE = path.resolve(`src/templates/how-it-works-process.js`);
const DOWNLOADS_TEMPLATE = path.resolve(`src/templates/downloads-default.js`);
const HOWITWORKS_RECONCILIATION_TEMPLATE = path.resolve(`src/templates/how-it-works-reconciliation.js`);
const HOWITWORKS_REVENUE_BY_COMPANY_TEMPLATE = path.resolve(`src/templates/how-it-works-revenue-by-company.js`);

const getPageTemplate = (templateId) => {
	switch(templateId) {
		case 'howitworks-default':
			return HOWITWORKS_DEFAULT_TEMPLATE;
		case 'howitworks-process':
			return HOWITWORKS_PROCESS_TEMPLATE;
		case 'downloads':
			return DOWNLOADS_TEMPLATE;
		case 'how-it-works-reconciliation':
			return HOWITWORKS_RECONCILIATION_TEMPLATE;
		case 'howitworks-revenue-by-company':
			return HOWITWORKS_REVENUE_BY_COMPANY_TEMPLATE;
	}

	return CONTENT_DEFAULT_TEMPLATE;
};

const withPathPrefix = (url, pathPrefix) => {
	let newPrefix = pathPrefix.slice(0, -14); // remove gatsby_public

  return ((newPrefix + url).replace(/\/\//, `/`));
}


const createHtmlAstFromFrontmatterField = (createNodeField, pathPrefix, node, field) => {
	if (node.internal.type === `MarkdownRemark` &&
		node.frontmatter[field] !== undefined) {

		let html = remark.parse(node.frontmatter[field]);

		let hast = toHAST(html, { allowDangerousHTML: true });

    if (pathPrefix) {
      // Ensure relative links include `pathPrefix`
      visit(hast, `link`, node => {
        if (
          node.url &&
          node.url.startsWith(`/`) &&
          !node.url.startsWith(`//`)
        ) {

          node.url = withPathPrefix(node.url, pathPrefix)
        }
      })
    }

    const strippedAst = stripPosition(JSON.parse(JSON.stringify(hast)), true);

    const reparseRaw = hastReparseRaw(strippedAst);

		createNodeField({
			node,
			name: field+"_htmlAst",
			value: JSON.stringify(reparseRaw),
			});

	}
}

const createHtmlStringFromFrontmatterField = (createNodeField, node, field) => {
	if (node.internal.type === `MarkdownRemark` &&
		node.frontmatter[field] !== undefined) {
		let html = remark()
		    .use(remarkHTML)
		    .processSync(node.frontmatter[field])
		    .toString();
		createNodeField({
			node,
			name: field,
			value: html,
			});
	}
}

const createStatePages = (createPage, graphql) => {
	const createStatePageSlug = (state) => {
		return '/explore/'+state.frontmatter.unique_id+"/";
	}

	return new Promise((resolve, reject) => {
	    const statePageTemplate = path.resolve(`src/templates/state-page.js`);
	    resolve(
	      graphql(
	        `
	          {
					    allMarkdownRemark (filter:{id: {regex: "/states/"}}) {
					      us_states:edges {
					        us_state:node {
					          frontmatter {
					            title
					            unique_id
					            is_cropped
					            nearby_offshore_region
					            opt_in
					            state_optin_intro
					            case_study_link
					            locality_name
					            state_revenue_year
					            priority
					            neighbors
					          }
					          fields {
					          	case_study_link_htmlAst
					          	case_study_link_htmlAst
					          	state_optin_intro_htmlAst
					          	state_production_htmlAst
					          	state_land_htmlAst
					          	state_land_production_htmlAst
					          	state_revenue_htmlAst
					          	state_revenue_sustainability_htmlAst
					          	state_tax_expenditures_htmlAst
					          	state_disbursements_htmlAst
					          	state_saving_spending_htmlAst
					          	state_impact_htmlAst
					          }
					          html
					        }
					      }
					    }
	          }
	        `
	      ).then(result => {
	        if (result.errors) {
	          reject(result.errors);
	        }
	        else{ 
	        	// Create pages for each markdown file.
		        result.data.allMarkdownRemark.us_states.forEach(({ us_state }) => {
		          const path = createStatePageSlug(us_state);
		          allStateIds.push(us_state.frontmatter.unique_id);

		          createPage({
		            path,
		            component: statePageTemplate,
		            // In your blog post template's graphql query, you can use path
		            // as a GraphQL variable to query for data from the markdown file.
		            context: {
		              stateMarkdown: us_state
		            },
		          });
		        });
	        	resolve();
	        }
	      })
	    );
	  });
};

const createHowItWorksPages = (createPage, graphql) => {

	const graphQLQueryString = "{"+GRAPHQL_QUERIES.MARKDOWN_HOWITWORKS+GRAPHQL_QUERIES.DISBURSEMENTS_SORT_BY_YEAR_DESC+"}";
	
	return new Promise((resolve, reject) => {
	    resolve(
	      graphql(graphQLQueryString).then(result => {
	        if (result.errors) {
	        	console.error(result.errors);
	          reject(result.errors);
	        }
	        else{ 
	        	// Create pages for each markdown file.
		        result.data.allMarkdownRemark.pages.forEach(({ page }) => {
		          const path = page.frontmatter.permalink;
		          const template = getPageTemplate(page.frontmatter.layout);

		          createPage({
		            path,
		            component: template,
		            context: {
		              markdown: page,
		              disbursements: result.data.Disbursements.disbursements,
		            },
		          });
		        });
	        	resolve();
	        }
	      })
	    );
	  });
};

const createDownloadsPages = (createPage, graphql) => {

	const graphQLQueryString = "{"+GRAPHQL_QUERIES.MARKDOWN_DOWNLOADS+"}";
	
	return new Promise((resolve, reject) => {
	    resolve(
	      graphql(graphQLQueryString).then(result => {
	        if (result.errors) {
	        	console.error(result.errors);
	          reject(result.errors);
	        }
	        else{ 
	        	// Create pages for each markdown file.
		        result.data.allMarkdownRemark.pages.forEach(({ page }) => {
		          const path = page.frontmatter.permalink;
		          const template = getPageTemplate(page.frontmatter.layout);

		          createPage({
		            path,
		            component: template,
		            context: {
		              markdown: page,
		            },
		          });
		        });
	        	resolve();
	        }
	      })
	    );
	  });
};

exports.modifyBabelrc = ({ babelrc }) => {
  if (process.env.NODE_ENV !== `production`) {
    return {
      plugins: [
      ].concat(babelrc.plugins),
    };
  }
  return {
    plugins: [].concat(babelrc.plugins),
  };
};

/**
 * Post build processing for adding gatsby site to jekyll
 **/
var prependFile = require('prepend-file');
var copydir = require('copy-dir');
var copyfile = require('fs-copy-file-sync');
var os = require('os');

var howItWorksPageFrontmatter = "---"+os.EOL+
							"title: How It Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/"+os.EOL+
							"redirect_from: /how-it-works/production/"+os.EOL+
							"---"+os.EOL;

var howItWorksNativeOwnerPageFrontmatter = "---"+os.EOL+
							"title:  Native American Lands | Ownership and Governance"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/native-american-ownership-governance/"+os.EOL+
							"redirect_from: /how-it-works/tribal-ownership-governance/"+os.EOL+
							"---"+os.EOL;
							
var howItWorksNativeProductionPageFrontmatter = "---"+os.EOL+
							"title:  Native American Lands | Natural Resource Production"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/native-american-production/"+os.EOL+
							"redirect_from: /how-it-works/tribal-production/"+os.EOL+
							"---"+os.EOL;
							
var howItWorksStateLawsPageFrontmatter = "---"+os.EOL+
							"title:  State laws and regulations | How It Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/state-laws-and-regulations/"+os.EOL+
							"redirect_from: /how-it-works/state-legal-fiscal-info/"+os.EOL+
							"---"+os.EOL;

var howItWorksNativeProductionPageFrontmatter = "---"+os.EOL+
							"title:  Native American Lands | Natural Resource Production"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/native-american-production/"+os.EOL+
							"redirect_from: /how-it-works/tribal-production/"+os.EOL+
							"---"+os.EOL;



var howItWorksOwnershipPageFrontmatter = "---"+os.EOL+
							"title:  Ownership | How it Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/ownership/"+os.EOL+
							"---"+os.EOL;

var howItWorksNativeRevenuePageFrontmatter = "---"+os.EOL+
							"title: Native American Lands | Revenue"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/native-american-revenue/"+os.EOL+
							"redirect_from: /how-it-works/tribal-revenue/"+os.EOL+
							"---"+os.EOL;

var howItWorksNativeImpactPageFrontmatter = "---"+os.EOL+
							"title: Native American Lands | Economic Impact"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/native-american-economic-impact/"+os.EOL+
							"redirect_from: /how-it-works/tribal-economic-impact/"+os.EOL+
							"---"+os.EOL;

var howItWorksFossilFuelsPageFrontmatter = "---"+os.EOL+
							"title: Fossil Fuels | How It Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/fossil-fuels/"+os.EOL+
							"---"+os.EOL;

var howItWorksNonenergyMineralsPageFrontmatter = "---"+os.EOL+
							"title: Nonenergy Minerals | How It Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/nonenergy-minerals/"+os.EOL+
							"---"+os.EOL;

var howItWorksRenewablesFrontmatter = "---"+os.EOL+
							"title: How It Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/renewables/"+os.EOL+
							"---"+os.EOL;

var howItWorksFederalLawsPageFrontmatter = "---"+os.EOL+
							"title: How It Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/federal-laws/"+os.EOL+
							"---"+os.EOL;

var howItWorksFederalReformsPageFrontmatter = "---"+os.EOL+
							"title: How It Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/federal-reforms/"+os.EOL+
							"---"+os.EOL;

var howItWorksCoalPageFrontmatter = "---"+os.EOL+
							"title: Coal | How it Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/coal/"+os.EOL+
							"---"+os.EOL;

var howItWorksOffshoreOilGasPageFrontmatter = "---"+os.EOL+
							"title: Offshore Oil & Gas | How it Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/offshore-oil-gas/"+os.EOL+
							"---"+os.EOL;

var howItWorksOnshoreOilGasPageFrontmatter = "---"+os.EOL+
							"title: Onshore Oil & Gas | How it Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/onshore-oil-gas/"+os.EOL+
							"---"+os.EOL;

var howItWorksDisbursementsPageFrontmatter = "---"+os.EOL+
							"title: Disbursements | How it Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/disbursements/"+os.EOL+
							"---"+os.EOL;

var howItWorksRevenuesPageFrontmatter = "---"+os.EOL+
							"title: Revenues | How It Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/revenues/"+os.EOL+
							"---"+os.EOL;

var howItWorksAmlPageFrontmatter = "---"+os.EOL+
							"title: AML Reclamation Program | How It Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/aml-reclamation-program/"+os.EOL+
							"---"+os.EOL;

var howItWorksCompanyRevenue2017Frontmatter = "---"+os.EOL+
							"title: Federal Revenue By Company (2017) | How it works | Natural Resources Revenue Data"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/federal-revenue-by-company/2017/"+os.EOL+
							"---"+os.EOL;

var howItWorksCompanyRevenue2016Frontmatter = "---"+os.EOL+
							"title: Federal Revenue By Company (2016) | How it works | Natural Resources Revenue Data"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/federal-revenue-by-company/2016/"+os.EOL+
							"---"+os.EOL;

var howItWorksCompanyRevenue2015Frontmatter = "---"+os.EOL+
							"title: Federal Revenue By Company (2015) | How it works | Natural Resources Revenue Data"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/federal-revenue-by-company/2015/"+os.EOL+
							"---"+os.EOL;

var howItWorksCompanyRevenue2014Frontmatter = "---"+os.EOL+
							"title: Federal Revenue By Company (2014) | How it works | Natural Resources Revenue Data"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/federal-revenue-by-company/2014/"+os.EOL+
							"---"+os.EOL;

var howItWorksCompanyRevenue2013Frontmatter = "---"+os.EOL+
							"title: Federal Revenue By Company (2013) | How it works | Natural Resources Revenue Data"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/federal-revenue-by-company/2013/"+os.EOL+
							"---"+os.EOL;

var howItWorksCoalExciseTaxPageFrontmatter = "---"+os.EOL+
							"title: Onshore Oil & Gas | How it Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/coal-excise-tax/"+os.EOL+
							"---"+os.EOL;

var howItWorksReconcile2015PageFrontmatter = "---"+os.EOL+
							"title: Reconciliation | How it works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/reconciliation/2015/"+os.EOL+
							"---"+os.EOL;

var howItWorksReconcile2016PageFrontmatter = "---"+os.EOL+
							"title: Reconciliation | How it works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/reconciliation/2016/"+os.EOL+
							"---"+os.EOL;
 
var howItWorksMineralsPageFrontmatter = "---"+os.EOL+
							"title: Nonenergy Minerals | How it Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/minerals/"+os.EOL+
							"---"+os.EOL;

var howItWorksOnshoreRenewablesPageFrontmatter = "---"+os.EOL+
							"title: Onshore Renewables | How it Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/onshore-renewables/"+os.EOL+
							"---"+os.EOL;

var howItWorksOffshoreRenewablesPageFrontmatter = "---"+os.EOL+
							"title: Offshore Renewables | How it Works"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /how-it-works/offshore-renewables/"+os.EOL+
							"---"+os.EOL;

var downloadsPageFrontmatter = "---"+os.EOL+
							"title: Downloads"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /downloads/"+os.EOL+
							"---"+os.EOL;

var downloadsFederalProdYearPageFrontmatter = "---"+os.EOL+
							"title: Federal Production | Documentation"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /downloads/federal-production/"+os.EOL+
							"---"+os.EOL;

var downloadsFederalProdMonthPageFrontmatter = "---"+os.EOL+
							"title: Production by Month | Documentation"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /downloads/federal-production-by-month/"+os.EOL+
							"---"+os.EOL;

var downloadsFederalRevByLocPageFrontmatter = "---"+os.EOL+
							"title: Revenue by Year | Documentation"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /downloads/federal-revenue-by-location/"+os.EOL+
							"---"+os.EOL;

var downloadsFederalRevByMonthPageFrontmatter = "---"+os.EOL+
							"title: Revenue by Month | Documentation"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /downloads/federal-revenue-by-month/"+os.EOL+
							"---"+os.EOL;

var downloadsFederalRevByCompanyPageFrontmatter = "---"+os.EOL+
							"title: Revenue by Company | Documentation"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /downloads/federal-revenue-by-company/"+os.EOL+
							"---"+os.EOL;

var downloadsDisbursementsFrontmatter = "---"+os.EOL+
							"title: Disbursements | Documentation"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /downloads/disbursements/"+os.EOL+
							"---"+os.EOL;

var downloadsReconciliationFrontmatter = "---"+os.EOL+
							"title: Reconciliation | Documentation"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /downloads/reconciliation/"+os.EOL+
							"---"+os.EOL;

var aboutPageFrontmatter = "---"+os.EOL+
							"title: About"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /about/"+os.EOL+
							"redirect_from: /about/whats-new/"+os.EOL+
							"---"+os.EOL;

var explorePageFrontmatter = "---"+os.EOL+
							"title: Explore data"+os.EOL+
							"layout: none"+os.EOL+
							"permalink: /explore/"+os.EOL+
							"redirect_from:"+os.EOL+
							"  - /explore/exports/"+os.EOL+
							"  - /explore/gdp/"+os.EOL+
							"  - /explore/jobs/"+os.EOL+
							"  - /explore/all-lands-production/"+os.EOL+
							"  - /explore/federal-production/"+os.EOL+
							"  - /explore/disbursements/"+os.EOL+
							"  - /explore/federal-revenue-by-location/"+os.EOL+
							"---"+os.EOL;

exports.onPostBuild = () => {
	console.log("Prepending frontmatter to files...");
    prependFile.sync(__dirname+'/public/downloads/reconciliation/index.html', downloadsReconciliationFrontmatter);
    prependFile.sync(__dirname+'/public/downloads/disbursements/index.html', downloadsDisbursementsFrontmatter);
    prependFile.sync(__dirname+'/public/downloads/federal-revenue-by-company/index.html', downloadsFederalRevByCompanyPageFrontmatter);
    prependFile.sync(__dirname+'/public/downloads/federal-revenue-by-month/index.html', downloadsFederalRevByMonthPageFrontmatter);
    prependFile.sync(__dirname+'/public/downloads/federal-revenue-by-location/index.html', downloadsFederalRevByLocPageFrontmatter);
    prependFile.sync(__dirname+'/public/downloads/federal-production/index.html', downloadsFederalProdYearPageFrontmatter);
    prependFile.sync(__dirname+'/public/downloads/federal-production-by-month/index.html', downloadsFederalProdMonthPageFrontmatter);
    prependFile.sync(__dirname+'/public/downloads/index.html', downloadsPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/reconciliation/2015/index.html', howItWorksReconcile2015PageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/reconciliation/2016/index.html', howItWorksReconcile2016PageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/disbursements/index.html', howItWorksDisbursementsPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/revenues/index.html', howItWorksRevenuesPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/aml-reclamation-program/index.html', howItWorksAmlPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/federal-revenue-by-company/2013/index.html', howItWorksCompanyRevenue2013Frontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/federal-revenue-by-company/2014/index.html', howItWorksCompanyRevenue2014Frontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/federal-revenue-by-company/2015/index.html', howItWorksCompanyRevenue2015Frontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/federal-revenue-by-company/2016/index.html', howItWorksCompanyRevenue2016Frontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/federal-revenue-by-company/2017/index.html', howItWorksCompanyRevenue2017Frontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/offshore-renewables/index.html', howItWorksOffshoreRenewablesPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/onshore-renewables/index.html', howItWorksOnshoreRenewablesPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/coal-excise-tax/index.html', howItWorksCoalExciseTaxPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/minerals/index.html', howItWorksMineralsPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/onshore-oil-gas/index.html', howItWorksOnshoreOilGasPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/offshore-oil-gas/index.html', howItWorksOffshoreOilGasPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/coal/index.html', howItWorksCoalPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/state-laws-and-regulations/index.html', howItWorksStateLawsPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/federal-reforms/index.html', howItWorksFederalReformsPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/federal-laws/index.html', howItWorksFederalLawsPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/renewables/index.html', howItWorksRenewablesFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/nonenergy-minerals/index.html', howItWorksNonenergyMineralsPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/fossil-fuels/index.html', howItWorksFossilFuelsPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/ownership/index.html', howItWorksOwnershipPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/native-american-production/index.html', howItWorksNativeProductionPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/native-american-economic-impact/index.html', howItWorksNativeImpactPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/native-american-revenue/index.html', howItWorksNativeRevenuePageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/native-american-ownership-governance/index.html', howItWorksNativeOwnerPageFrontmatter);
    prependFile.sync(__dirname+'/public/how-it-works/index.html', howItWorksPageFrontmatter);
    prependFile.sync(__dirname+'/public/about/index.html', aboutPageFrontmatter);
    prependFile.sync(__dirname+'/public/explore/index.html', explorePageFrontmatter);
    allStateIds.map((stateId,index) => {
    	prependFile.sync(__dirname+'/public/explore/'+stateId+'/index.html',  "---"+os.EOL+"permalink: /explore/"+stateId+"/"+os.EOL+"---"+os.EOL);
    });
    console.log("Finished prepending frontmatter to files.");

	console.log("Copying Files from public to gatsby-public...");
	copydir.sync(__dirname+'/public', '../gatsby-public');
	console.log("Finished Copying Files to gatsby-public.");


	// index.html will be created or overwritten by default.
	console.log("Copying index.html to root...");
	copyfile(__dirname+'/public/index.html', __dirname+'/../index.html');
	console.log("Finished Copying index.html to root.");
}
