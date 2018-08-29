const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

/*exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators
  if (node.internal.type === `MarkdownRemark`) {
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
};*/

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  //let createStatePagesPromise = createStatePages()

  return Promise.all([createStatePages(createPage, graphql)]);
};

const createStatePages = (createPage, graphql) => {
	const createStatePageSlug = (state) => {
		return '/explore/'+state.frontmatter.unique_id+"/";
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
			          }
			        }
			      }
			    }
	          }
	        `
	      ).then(result => {
	        if (result.errors) {
	          reject(result.errors);
	        }

	        // Create pages for each markdown file.
	        result.data.allMarkdownRemark.us_states.forEach(({ us_state }) => {
	          const path = createStatePageSlug(us_state);
	          console.log(path);
	          createPage({
	            path,
	            component: statePageTemplate,
	            // In your blog post template's graphql query, you can use path
	            // as a GraphQL variable to query for data from the markdown file.
	            context: {
	              stateData: us_state,
	            },
	          });
	        });
	        resolve();
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
    console.log("Finished prepending frontmatter to files.");

	console.log("Copying Files from public to gatsby-public...");
	copydir.sync(__dirname+'/public', '../gatsby-public');
	console.log("Finished Copying Files to gatsby-public.");
}