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
	console.log("Copying Files from public to gatsby-public...");
	copydir.sync(__dirname+'/public', '../_stage');
	console.log("Finished Copying Files to gatsby-public.");
}
