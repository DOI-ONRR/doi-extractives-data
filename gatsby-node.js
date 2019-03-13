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
var copydir = require('copy-dir');
var copyfile = require('fs-copy-file-sync');

exports.onPostBuild = () => {
	console.log("Copying Files from public to _site");
	copydir.sync(__dirname+'/public', './_site');
	console.log("Finished Copying Files to _site.");

	// index.html will be created or overwritten by default.
	console.log("Copying index.html to root...");
	copyfile(__dirname+'/public/index.html', __dirname+'/index.html');
	console.log("Finished Copying index.html to root.");
}
