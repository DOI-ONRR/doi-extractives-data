const path = require(`path`);
const GRAPHQL_QUERIES = require('./src/js/graphql-queries');

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  return Promise.all([
  	//createStatePages(createPage, graphql), 
  	createHowItWorksPages(createPage, graphql), 
  	//createDownloadsPages(createPage, graphql),
  	//createCaseStudiesPages(createPage, graphql),
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