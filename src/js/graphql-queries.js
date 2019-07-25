/**
 * Constants that are used by the application
 **/
module.exports = Object.freeze({
  DISBURSEMENTS_SORT_BY_YEAR_DESC:
	`Disbursements:allFederalDisbursements (
      sort:{fields:[Year], order: DESC}
    ){
      disbursements:edges {
        data:node {
          id
          Year
          DisplayYear
          Fund
          Source
          Disbursement
          DisbursementCategory
          internal {
            type
            contentDigest
            owner
          }
        }
      }
    }`,
  MARKDOWN_HOWITWORKS:
		`allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/how-it-works/"}}) {
	    pages: edges {
	      page: node {
	        frontmatter {
	          title
	          permalink
	          layout
	          redirect_from
            report_year
	        }
	        htmlAst
	      }
	    }
    }`,
    MARKDOWN_ARCHIVE:
		`allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/archive/"}}) {
	    pages: edges {
	      page: node {
	        frontmatter {
	          title
	          permalink
	          layout
	        }
	        htmlAst
	      }
	    }
	  }`,
  MARKDOWN_DOWNLOADS:
    `allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/downloads/"}}) {
      pages: edges {
        page: node {
          frontmatter {
            title
            permalink
            layout
            redirect_from
          }
          htmlAst
        }
      }
    }`,
  MARKDOWN_CASE_STUDIES:
    `allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/case-studies/"}}) {
      pages: edges {
        page: node {
          frontmatter {
            title
            permalink
            layout
            redirect_from
          }
          htmlAst
          html
        }
      }
    }`,
  MARKDOWN_OFFSHORE:
    `allMarkdownRemark(filter: {fileAbsolutePath: {regex: "/offshore_regions/"}}) {
      pages: edges {
        page: node {
          frontmatter {
            title
            permalink
            layout
            redirect_from
            unique_id
            neighbors
          }
          htmlAst
        }
      }
    }`,
  OFFSHORE_PRODUCTION_ALASKA:
    `AlaskaOffshoreProduction: allOffshoreProduction(filter: {RegionId: {eq: "Alaska"}}) {
      commodities: group(field: Commodity) {
        name: fieldValue
        volumes: edges {
          data: node {
            id
            RegionId
            DisplayYear
            DisplayCategory
            CalendarYear
            LandCategory
            LandClass
            Commodity
            Date
            Volume
            Units
          }
        }
      }
    }`,
  OFFSHORE_PRODUCTION_GULF:
    `GulfOffshoreProduction:allOffshoreProduction (filter: {RegionId: {eq: "Gulf"}}) {
      commodities: group(field: Commodity) {
        name: fieldValue
        volumes:edges {
          data:node {
            id
            RegionId
            DisplayYear
            DisplayCategory
            CalendarYear
            LandCategory
            LandClass
            Commodity
            Date
            Volume
            Units
          }
        }
      }
    }`,
  OFFSHORE_PRODUCTION_PACIFIC:
    `PacificOffshoreProduction:allOffshoreProduction (filter: {RegionId: {eq: "Pacific"}}){
      commodities: group(field: Commodity) {
        name: fieldValue
        volumes:edges {
          data:node {
            id
            RegionId
            DisplayYear
            DisplayCategory
            CalendarYear
            LandCategory
            LandClass
            Commodity
            Date
            Volume
            Units
          }
        }
      }
    }`,

})
