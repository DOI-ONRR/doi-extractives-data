const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

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

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  return Promise.all([createStatePages(createPage, graphql)]);
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
		return '/Explore/'+state.frontmatter.unique_id+"/";
	}

	return new Promise((resolve, reject) => {
	    const statePageTemplate = path.resolve(`src/templates/StatePage.js`);
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
var os = require('os');

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
    prependFile.sync(__dirname+'/public/About/index.html', aboutPageFrontmatter);
    prependFile.sync(__dirname+'/public/Explore/index.html', explorePageFrontmatter);
    allStateIds.map((stateId,index) => {
    	prependFile.sync(__dirname+'/public/Explore/'+stateId+'/index.html',  "---"+os.EOL+"permalink: /explore/"+stateId+"/"+os.EOL+"---"+os.EOL);
    });
    console.log("Finished prepending frontmatter to files.");

	console.log("Copying Files from public to gatsby-public...");
	copydir.sync(__dirname+'/public', '../gatsby-public');
	console.log("Finished Copying Files to gatsby-public.");
}