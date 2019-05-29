



const path = require(`path`);
const GRAPHQL_QUERIES = require('./src/js/graphql-queries');

// Data to import to be added to graphql schema
// Import data from yml files
const yaml = require('js-yaml');
const fs = require('fs');
const OFFSHORE_PRODUCTION_DATA = './src/data/offshore_federal_production_regions.yml';
const offshoreProductionTransformer = require('./src/js/data-transformers/offshore-production-transformer');
exports.sourceNodes = ({ getNodes, boundActionCreators }) => {
	const { createNode } = boundActionCreators;

	try {
	    offshoreProductionTransformer(createNode, yaml.safeLoad(fs.readFileSync(OFFSHORE_PRODUCTION_DATA, 'utf8')));
	} catch (e) {
	    console.log(e);
	}
	

}



/* @TODO Parse markdown from frontmatter. hopefully we cna fidn a btr solution in future */
const Remark = require('remark');
const toHAST = require(`mdast-util-to-hast`);
const stripPosition = require(`unist-util-remove-position`);
const hastReparseRaw = require(`hast-util-raw`);
const visit = require(`unist-util-visit`)

const remark = new Remark().data(`settings`, { commonmark: true, footnotes: true, pedantic: true, gfm: true });

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

const createHtmlAstFromFrontmatterField = (createNodeField, pathPrefix, node, field) => {
	const withPathPrefix = (url, pathPrefix) => {
		let newPrefix = pathPrefix.slice(0, -14); // remove gatsby_public

	  return ((newPrefix + url).replace(/\/\//, `/`));
	}


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


exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage, createRedirect } = boundActionCreators;

  createRedirect({ fromPath: '/how-it-works/federal-revenue-by-company', toPath: '/how-it-works/federal-revenue-by-company/2018', redirectInBrowser: true });
  createRedirect({ fromPath: '/how-it-works/federal-revenue-by-company/', toPath: '/how-it-works/federal-revenue-by-company/2018', redirectInBrowser: true });

  return Promise.all([
  	createStatePages(createPage, graphql), 
  	createHowItWorksPages(createPage, graphql), 
  	createDownloadsPages(createPage, graphql),
  	createCaseStudiesPages(createPage, graphql),
  	//createOffshorePages(createPage, graphql),
	]);
};

// Page Templates
const CONTENT_DEFAULT_TEMPLATE = path.resolve(`src/templates/content-default.js`);
const HOWITWORKS_DEFAULT_TEMPLATE = path.resolve(`src/templates/how-it-works-default.js`);
const HOWITWORKS_PROCESS_TEMPLATE = path.resolve(`src/templates/how-it-works-process.js`);
const DOWNLOADS_TEMPLATE = path.resolve(`src/templates/downloads-default.js`);
const HOWITWORKS_RECONCILIATION_TEMPLATE = path.resolve(`src/templates/how-it-works-reconciliation.js`);
const HOWITWORKS_REVENUE_BY_COMPANY_TEMPLATE = path.resolve(`src/templates/how-it-works-revenue-by-company.js`);
const CASE_STUDIES_TEMPLATE = path.resolve(`src/templates/case-studies-template.js`);
const OFFSHORE_REGION_TEMPLATE = path.resolve(`src/templates/offshore-region.js`);

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
		case 'case-studies':
			return CASE_STUDIES_TEMPLATE;
		case 'offshore-region':
			return OFFSHORE_REGION_TEMPLATE;
	}

	return CONTENT_DEFAULT_TEMPLATE;
};

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
					    allMarkdownRemark (filter:{fileAbsolutePath: {regex: "/states/"}}) {
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

const createCaseStudiesPages = (createPage, graphql) => {

	const graphQLQueryString = "{"+GRAPHQL_QUERIES.MARKDOWN_CASE_STUDIES+"}";
	
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

const createOffshorePages = (createPage, graphql) => {

	const graphQLQueryString = "{"+GRAPHQL_QUERIES.MARKDOWN_OFFSHORE
																+GRAPHQL_QUERIES.OFFSHORE_PRODUCTION_ALASKA
																+GRAPHQL_QUERIES.OFFSHORE_PRODUCTION_GULF
																+GRAPHQL_QUERIES.OFFSHORE_PRODUCTION_PACIFIC+"}";
	
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
		          let dataSet;
		          switch(page.frontmatter.unique_id) {
		          	case 'alaska':
		          		dataSet = result.data.AlaskaOffshoreProduction;
		          		break;
		          	case 'gulf':
		          		dataSet = result.data.GulfOffshoreProduction;
		          		break;
		          	case 'pacific':
		          		dataSet = result.data.PacificOffshoreProduction;
		          		break;

		          }

		          createPage({
		            path,
		            component: template,
		            context: {
		              markdown: page,
		              data: dataSet,
		            },
		          });
		        });
	        	resolve();
	        }
	      })
	    );
	  });
};

/* This is required for Federalist build */
var copydir = require('copy-dir');
exports.onPostBuild = () => {
	console.log("Copying static html pages to _site...");
	copydir.sync(__dirname+'/static/pages', __dirname+'/_site');
	console.log("Finished Copying static html pages to _site.");

	console.log("Copying Files from public to _site...");
	copydir.sync(__dirname+'/public', './_site');
	console.log("Finished Copying Files to _site.");
	
	console.log("Copying Files from downloads to _site...");
	copydir.sync(__dirname+'/downloads', './_site/downloads');
	console.log("Finished Copying Files to _site.");
}