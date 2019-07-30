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
            is_cropped
          }
          htmlAst
        }
      }
    }`,
  OFFSHORE_REVENUE:
    `RevenueGroupByCommodity: allResourceRevenuesCalendarYear(filter: {Commodity: {ne: "Not tied to a commodity"}, LandCategory: {eq: "Offshore"}}) {
      group(field: Commodity) {
        id: fieldValue
        edges {
          node {
            id
            Commodity
            Revenue
            CalendarYear
            RevenueType
            FipsCode
            LandCategory
            OffshoreRegion
            OffshorePlanningArea
          }
        }
      }
    }`,
  OFFSHORE_REVENUE_BY_CY:
    `RevenueGroupByCY: allResourceRevenuesCalendarYear(filter: {Commodity: {ne: "Not tied to a commodity"}, LandCategory: {eq: "Offshore"}}) {
      group(field: CalendarYear) {
        id: fieldValue
        edges {
          node {
            id
          }
        }
      }
    }`,
  OFFSHORE_PRODUCTION:
    `OffshoreProductionByProduct: allProductVolumesCalendarYear(filter: {
      OnshoreOffshore: {eq: "Offshore"}}) {
      group(field: ProductName) {
        id: fieldValue
        edges {
          node {
            id
            ProductName
            ProductionDate
            ProductionYear
            Units
            LongUnits
            Volume
            Withheld
            LandCategory
            County
            FipsCode
            State
            OnshoreOffshore
            OffshoreRegion
            OffshorePlanningArea
          }
        }
      }
    }
    OffshoreProductionByYear: allProductVolumesCalendarYear(filter: {
      OnshoreOffshore: {eq: "Offshore"}}) {
      group(field: ProductionYear) {
        id: fieldValue
        edges {
          node {
            id
          }
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
