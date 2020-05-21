/* eslint-disable indent */

const path = require(`path`)
const GRAPHQL_QUERIES = require('./src/js/graphql-queries')

// Data to import to be added to graphql schema
// Import data from yml files
const yaml = require('js-yaml')
const fs = require('fs')
const OFFSHORE_PRODUCTION_DATA = './src/data/offshore_federal_production_regions.yml'
const offshoreProductionTransformer = require('./src/js/data-transformers/offshore-production-transformer')
exports.sourceNodes = ({ getNodes, boundActionCreators }) => {
  const { createNode } = boundActionCreators

  try {
	    offshoreProductionTransformer(createNode, yaml.safeLoad(fs.readFileSync(OFFSHORE_PRODUCTION_DATA, 'utf8')))
  }
  catch (e) {
	    console.log(e)
  }
}

/* @TODO Parse markdown from frontmatter. hopefully we cna fidn a btr solution in future */
const Remark = require('remark')
const toHAST = require(`mdast-util-to-hast`)
const stripPosition = require(`unist-util-remove-position`)
const hastReparseRaw = require(`hast-util-raw`)
const visit = require(`unist-util-visit`)

const remark = new Remark().data(`settings`, { commonmark: true, footnotes: true, pedantic: true, gfm: true })

exports.onCreateNode = ({ node, pathPrefix, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators

  if (node.internal.type === 'MarkdownRemark') {
    createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `case_study_link`)
    createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_optin_intro`)
    createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_production`)
    createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_land`)
    createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_land_production`)
    createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_revenue`)
    createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_revenue_sustainability`)
    createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_tax_expenditures`)
    createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_disbursements`)
    createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_saving_spending`)
    createHtmlAstFromFrontmatterField(createNodeField, pathPrefix, node, `state_impact`)
  }
}

const createHtmlAstFromFrontmatterField = (createNodeField, pathPrefix, node, field) => {
  const withPathPrefix = (url, pathPrefix) => {
    let newPrefix = pathPrefix.slice(0, -14) // remove gatsby_public

	  return ((newPrefix + url).replace(/\/\//, `/`))
  }

  if (node.frontmatter[field] !== undefined) {
    let html = remark.parse(node.frontmatter[field])

    let hast = toHAST(html, { allowDangerousHTML: true })

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

    const strippedAst = stripPosition(JSON.parse(JSON.stringify(hast)), true)

    const reparseRaw = hastReparseRaw(strippedAst)

    createNodeField({
      node,
      name: field + '_htmlAst',
      value: JSON.stringify(reparseRaw),
    })
  }
}

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage, createRedirect } = boundActionCreators

  createRedirect({ fromPath: '/how-it-works/federal-revenue-by-company', toPath: '/how-it-works/federal-revenue-by-company/2018', redirectInBrowser: true })
  createRedirect({ fromPath: '/how-it-works/federal-revenue-by-company/', toPath: '/how-it-works/federal-revenue-by-company/2018', redirectInBrowser: true })
  createRedirect({ fromPath: '/explore/revenue/', toPath: '/query-data/?dataType=Revenue', redirectInBrowser: true })
  createRedirect({ fromPath: '/downloads/federal-production/', toPath: '/downloads/production/', redirectInBrowser: true })
  createRedirect({ fromPath: '/downloads/federal-production-by-month/', toPath: '/downloads/production-by-month/', redirectInBrowser: true })
  createRedirect({ fromPath: '/downloads/federal-revenue-by-location/', toPath: '/downloads/revenue/', redirectInBrowser: true })
  createRedirect({ fromPath: '/downloads/federal-revenue-by-month/', toPath: '/downloads/revenue-by-month/', redirectInBrowser: true })
  createRedirect({ fromPath: '/downloads/federal-disbursements-by-month/', toPath: '/downloads/disbursements-by-month/', redirectInBrowser: true })

  //const used = process.memoryUsage().heapUsed / 1024 / 1024
  //console.log(`#Create Pages: ${ Math.round(used * 100) / 100 } MB`)

  return Promise.all([
    createStatePages(createPage, graphql),
    createHowItWorksPages(createPage, graphql),
    createDownloadsPages(createPage, graphql),
    createArchivePages(createPage, graphql),
    createCaseStudiesPages(createPage, graphql),
    createOffshorePages(createPage, graphql),
  ])
}

// Page Templates
const CONTENT_DEFAULT_TEMPLATE = path.resolve(`src/templates/content-default.js`)
const ARCHIVE_DEFAULT_TEMPLATE = path.resolve(`src/templates/archive-default.js`)
const HOWITWORKS_DEFAULT_TEMPLATE = path.resolve(`src/templates/how-it-works-default.js`)
const HOWITWORKS_PROCESS_TEMPLATE = path.resolve(`src/templates/how-it-works-process.js`)
const DOWNLOADS_TEMPLATE = path.resolve(`src/templates/downloads-default.js`)
const HOWITWORKS_RECONCILIATION_TEMPLATE = path.resolve(`src/templates/how-it-works-reconciliation.js`)
const HOWITWORKS_REVENUE_BY_COMPANY_TEMPLATE = path.resolve(`src/templates/how-it-works-revenue-by-company.js`)
const CASE_STUDIES_TEMPLATE = path.resolve(`src/templates/case-studies-template.js`)
const OFFSHORE_REGION_TEMPLATE = path.resolve(`src/templates/offshore-region.js`)

const getPageTemplate = templateId => {
  switch (templateId) {
  case 'howitworks-default':
    return HOWITWORKS_DEFAULT_TEMPLATE
  case 'archive-default':
    return ARCHIVE_DEFAULT_TEMPLATE
  case 'howitworks-process':
    return HOWITWORKS_PROCESS_TEMPLATE
  case 'downloads':
    return DOWNLOADS_TEMPLATE
  case 'how-it-works-reconciliation':
    return HOWITWORKS_RECONCILIATION_TEMPLATE
  case 'howitworks-revenue-by-company':
    return HOWITWORKS_REVENUE_BY_COMPANY_TEMPLATE
  case 'case-studies':
    return CASE_STUDIES_TEMPLATE
  case 'offshore-region':
    return OFFSHORE_REGION_TEMPLATE
  }

  return CONTENT_DEFAULT_TEMPLATE
}

const compareValues = (key, order = 'asc') => {
  return function (a, b) {
    /* if (!a.hasOwnProperty(key) ||
       !b.hasOwnProperty(key)) {
      return 0
    } */

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key]
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key]

    let comparison = 0
    if (varA > varB) {
      comparison = 1
    }
    else if (varA < varB) {
      comparison = -1
    }
    return (
      (order === 'desc')
        ? (comparison * -1) : comparison
    )
  }
}
const createRevenueTypeCommoditiesData = (groupByCommodity, groupByYear, stateId) => {
  if (!groupByCommodity) return { commodities: undefined, commodityYears: undefined }
  let data = groupByCommodity

  let commodityYears = groupByYear.sort(compareValues('id'))
  if (commodityYears.length > 10) {
	  commodityYears = commodityYears.slice(commodityYears.length - 10)
  }
  commodityYears = commodityYears.map(item => parseInt(item.id))

  let commoditiesCounty = data.reduce((total, item) => {
    item.edges.forEach(element => {
      let node = element.node
      let year = parseInt(node.CalendarYear)
      if (commodityYears.includes(year) && node.State === stateId) {
        total[node.FipsCode] = total[node.FipsCode] || { name: node.County, revenue: {} }
        total[node.FipsCode].revenue[year] = (total[node.FipsCode].revenue[year])
          ? total[node.FipsCode].revenue[year] + node.Revenue
          : node.Revenue
      }
    })

    return total
  }, {})

  let commodities = data.reduce((total, item) => {
	  item.edges.forEach(element => {
      let node = element.node
      if (commodityYears.includes(node.CalendarYear) && node.State === stateId) {
        total[item.id] = total[item.id] || {}
        total[item.id][node.RevenueType] = total[item.id][node.RevenueType] || {}
        total[item.id]['All'] = total[item.id]['All'] || {}
		    total[item.id][node.RevenueType][node.CalendarYear] = (total[item.id][node.RevenueType][node.CalendarYear])
          ? total[item.id][node.RevenueType][node.CalendarYear] + node.Revenue
          : node.Revenue

        total[item.id]['All'][node.CalendarYear] = (total[item.id]['All'][node.CalendarYear])
          ? total[item.id]['All'][node.CalendarYear] + node.Revenue
          : node.Revenue

        if (!total['All']['All'][node.CalendarYear]) {
          total['All']['All'][node.CalendarYear] = 0
        }
        total['All'][node.RevenueType] = total['All'][node.RevenueType] || {}
        if (!total['All'][node.RevenueType][node.CalendarYear]) {
          total['All'][node.RevenueType][node.CalendarYear] = 0
        }
        total['All']['All'][node.CalendarYear] += node.Revenue
        total['All'][node.RevenueType][node.CalendarYear] += node.Revenue
      }
	  })

	  return total
  }, { 'All': { 'All': {} } })

  Object.keys(commoditiesCounty).forEach(code => {
    Object.keys(commoditiesCounty[code].revenue).forEach(year => {
      commoditiesCounty[code].revenue[year] = parseInt(commoditiesCounty[code].revenue[year])
    })
  })
  Object.keys(commodities).forEach(commodity => {
	  Object.keys(commodities[commodity]).forEach(revenueType => {
      Object.keys(commodities[commodity][revenueType]).forEach(year => {
        commodities[commodity][revenueType][year] = parseInt(commodities[commodity][revenueType][year])
      })
	  })
  })

  return { commodities, commoditiesCounty, commodityYears }
}
const createProductionCommoditiesData = (groupByCommodity, groupByYear, stateId) => {
  let data = groupByCommodity
  let commodityProductionYears = groupByYear.sort(compareValues('id'))
  if (commodityProductionYears.length > 10) {
    commodityProductionYears = commodityProductionYears.slice(commodityProductionYears.length - 10)
  }
  commodityProductionYears = commodityProductionYears.map(item => parseInt(item.id))

  let commoditiesFipsCode = data.reduce((total, item) => {
    let productName = (item.id.includes('~')) ? item.id.split('~')[0] : item.id
    item.edges.forEach(element => {
      let node = element.node
      let year = parseInt(node.ProductionYear)
      if (commodityProductionYears.includes(year) && node.State === stateId) {
        total[node.FipsCode] = total[node.FipsCode] || { name: node.County, products: {} }
        total[node.FipsCode].products[item.id] = total[node.FipsCode].products[item.id] || { name: productName, units: node.Units, withheld: node.Withheld, volume: {} }
        total[node.FipsCode].products[item.id].volume[year] = (total[node.FipsCode].products[item.id].volume[year])
          ? total[node.FipsCode].products[item.id].volume[year] + node.Volume
          : node.Volume
      }
    })

    return total
  }, {})

  let commoditiesProduction = data.reduce((total, item) => {
    let name = (item.id.includes('~')) ? item.id.split('~')[0] : item.id
    item.edges.forEach(element => {
      let node = element.node
      let year = parseInt(node.ProductionYear)
      if (commodityProductionYears.includes(year) && node.State === stateId) {
        total[item.id] = total[item.id] || { name: name, units: node.Units, withheld: node.Withheld, total: 0, volume: {} }
        total[item.id].volume[year] = (total[item.id].volume[year])
          ? total[item.id].volume[year] + node.Volume
          : node.Volume

          total[item.id].total += total[item.id].volume[year]
      }
    })

    return total
  }, {})

  Object.keys(commoditiesFipsCode).forEach(code => {
    Object.keys(commoditiesFipsCode[code].products).forEach(product => {
      Object.keys(commoditiesFipsCode[code].products[product].volume).forEach(year => {
        commoditiesFipsCode[code].products[product].volume[year] = parseInt(commoditiesFipsCode[code].products[product].volume[year])
      })
    })
  })
  Object.keys(commoditiesProduction).forEach(commodity => {
    commoditiesProduction[commodity].total = parseInt(commoditiesProduction[commodity].total)
    Object.keys(commoditiesProduction[commodity].volume).forEach(year => {
      commoditiesProduction[commodity].volume[year] = parseInt(commoditiesProduction[commodity].volume[year])
    })
  })

  return { commoditiesProduction, commoditiesFipsCode, commodityProductionYears }
}

const createStatePages = (createPage, graphql) => {
  const createStatePageSlug = state => {
    return '/explore/' + state.frontmatter.unique_id + '/'
  }

  return new Promise((resolve, reject) => {
	    const statePageTemplate = path.resolve(`src/templates/state-page.js`)
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
        RevenueGroupByCalendarYear: allResourceRevenuesCalendarYear(
          filter: {
            Commodity: {ne: "Not tied to a commodity"}
            LandClass: {ne: "Native American"}}) {
          group(field: CalendarYear) {
            id: fieldValue
            edges {
              node {
                id
              }
            }
          }
        }
        RevenueGroupByCommodity: allResourceRevenuesCalendarYear(
          filter: {
            Commodity: {ne: "Not tied to a commodity"}
            LandClass: {ne: "Native American"}}) {
          group(field: Commodity) {
            id: fieldValue
            edges {
              node {
                id
                Commodity
                Revenue
                CalendarYear
                RevenueType
                State
                FipsCode
                County
              }
            }
          }
        }
        FederalProductionByProduct:  allProductVolumesCalendarYear (filter:{LandCategory:{eq:"Federal"}}){
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
              }
            }
          }
        }
        FederalProductionByYear:  allProductVolumesCalendarYear 
          (filter:{
            LandCategory:{eq:"Federal"}
          }){
          group(field: ProductionYear) {
            id: fieldValue
            edges {
              node {
                id
              }
            }
          }
        }

      }`
	      ).then(result => {
	        if (result.errors) {
	          reject(result.errors)
	        }
	        else {
            // console.log(result.data.RevenueGroupByCalendarYear.group)
          // Create pages for each markdown file.
		        // eslint-disable-next-line camelcase
		        result.data.allMarkdownRemark.us_states.forEach(({ us_state }) => {
		          const path = createStatePageSlug(us_state)
              let { commodities, commoditiesCounty, commodityYears } = createRevenueTypeCommoditiesData(result.data.RevenueGroupByCommodity.group,
                result.data.RevenueGroupByCalendarYear.group,
                us_state.frontmatter.unique_id)

              let { commoditiesProduction, commoditiesFipsCode, commodityProductionYears } = createProductionCommoditiesData(result.data.FederalProductionByProduct.group,
                result.data.FederalProductionByYear.group,
                us_state.frontmatter.unique_id)

              createPage({
		            path,
		            component: statePageTemplate,
		            // In your blog post template's graphql query, you can use path
		            // as a GraphQL variable to query for data from the markdown file.
		            context: {
                stateMarkdown: us_state,
                commodities: commodities,
                commoditiesCounty: commoditiesCounty,
                commodityYears: commodityYears,
                commoditiesProduction: commoditiesProduction,
                commoditiesFipsCode: commoditiesFipsCode,
                commodityProductionYears: commodityProductionYears,
		            },
		          })
		        })
            resolve()
	        }
	      })
	    )
	  })
}

const createHowItWorksPages = (createPage, graphql) => {
  const graphQLQueryString = '{' + GRAPHQL_QUERIES.MARKDOWN_HOWITWORKS + GRAPHQL_QUERIES.DISBURSEMENTS_SORT_BY_YEAR_DESC + '}'

  return new Promise((resolve, reject) => {
    resolve(
      graphql(graphQLQueryString).then(result => {
        if (result.errors) {
          console.error(result.errors)
          reject(result.errors)
        }
        else {
          // Create pages for each markdown file.
	        result.data.allMarkdownRemark.pages.forEach(({ page }) => {
	          const path = page.frontmatter.permalink
	          const template = getPageTemplate(page.frontmatter.layout)

	          createPage({
	            path,
	            component: template,
	            context: {
	              markdown: page,
	              disbursements: result.data.Disbursements.disbursements,
	            },
	          })
	        })
          resolve()
        }
      })
    )
  })
}

const createArchivePages = (createPage, graphql) => {
	const graphQLQueryString = '{' + GRAPHQL_QUERIES.MARKDOWN_ARCHIVE + '}'

	return new Promise((resolve, reject) => {
	    resolve(
	      graphql(graphQLQueryString).then(result => {
	        if (result.errors) {
	        	console.error(result.errors)
	          reject(result.errors)
	        }
	        else {
	        	// Create pages for each markdown file.
		        result.data.allMarkdownRemark.pages.forEach(({ page }) => {
		          const path = page.frontmatter.permalink
		          const template = getPageTemplate(page.frontmatter.layout)

		          createPage({
		            path,
		            component: template,
		            context: {
		              markdown: page,
		            },
		          })
		        })
	        	resolve()
	        }
	      })
	    )
	  })
}

const createDownloadsPages = (createPage, graphql) => {
  const graphQLQueryString = '{' + GRAPHQL_QUERIES.MARKDOWN_DOWNLOADS + '}'

  return new Promise((resolve, reject) => {
	    resolve(
	      graphql(graphQLQueryString).then(result => {
	        if (result.errors) {
          console.error(result.errors)
	          reject(result.errors)
	        }
	        else {
          // Create pages for each markdown file.
		        result.data.allMarkdownRemark.pages.forEach(({ page }) => {
		          const path = page.frontmatter.permalink
		          const template = getPageTemplate(page.frontmatter.layout)

		          createPage({
		            path,
		            component: template,
		            context: {
		              markdown: page,
		            },
		          })
		        })
          resolve()
	        }
	      })
	    )
	  })
}

const createCaseStudiesPages = (createPage, graphql) => {
  const graphQLQueryString = '{' + GRAPHQL_QUERIES.MARKDOWN_CASE_STUDIES + '}'

  return new Promise((resolve, reject) => {
	    resolve(
	      graphql(graphQLQueryString).then(result => {
	        if (result.errors) {
          console.error(result.errors)
	          reject(result.errors)
	        }
	        else {
          // Create pages for each markdown file.
		        result.data.allMarkdownRemark.pages.forEach(({ page }) => {
		          const path = page.frontmatter.permalink
		          const template = getPageTemplate(page.frontmatter.layout)

		          createPage({
		            path,
		            component: template,
		            context: {
		              markdown: page,
		            },
		          })
		        })
          resolve()
	        }
	      })
	    )
	  })
}
const createOffshoreRevenueTypeCommoditiesData = (groupByCommodity, groupByYear, offshoreId) => {
  if (!groupByCommodity) return { commodities: undefined, commodityYears: undefined }
  let data = groupByCommodity

  let commodityYears = groupByYear.sort(compareValues('id'))
  if (commodityYears.length > 10) {
	  commodityYears = commodityYears.slice(commodityYears.length - 10)
  }
  commodityYears = commodityYears.map(item => parseInt(item.id))

  let commoditiesCounty = data.reduce((total, item) => {
    item.edges.forEach(element => {
      let node = element.node
      let year = parseInt(node.CalendarYear)
      if (commodityYears.includes(year) && node.OffshoreRegion.toLowerCase().includes(offshoreId)) {
        total[node.FipsCode] = total[node.FipsCode] || { name: node.OffshorePlanningArea, revenue: {} }
        total[node.FipsCode].revenue[year] = (total[node.FipsCode].revenue[year])
          ? total[node.FipsCode].revenue[year] + node.Revenue
          : node.Revenue
      }
    })

    return total
  }, {})

  let commodities = data.reduce((total, item) => {
	  item.edges.forEach(element => {
      let node = element.node
      if (commodityYears.includes(node.CalendarYear) && node.OffshoreRegion.toLowerCase().includes(offshoreId)) {
        total[item.id] = total[item.id] || {}
        total[item.id][node.RevenueType] = total[item.id][node.RevenueType] || {}
        total[item.id]['All'] = total[item.id]['All'] || {}
		    total[item.id][node.RevenueType][node.CalendarYear] = (total[item.id][node.RevenueType][node.CalendarYear])
          ? total[item.id][node.RevenueType][node.CalendarYear] + node.Revenue
          : node.Revenue

        total[item.id]['All'][node.CalendarYear] = (total[item.id]['All'][node.CalendarYear])
          ? total[item.id]['All'][node.CalendarYear] + node.Revenue
          : node.Revenue

        if (!total['All']['All'][node.CalendarYear]) {
          total['All']['All'][node.CalendarYear] = 0
        }
        total['All'][node.RevenueType] = total['All'][node.RevenueType] || {}
        if (!total['All'][node.RevenueType][node.CalendarYear]) {
          total['All'][node.RevenueType][node.CalendarYear] = 0
        }
        total['All']['All'][node.CalendarYear] += node.Revenue
        total['All'][node.RevenueType][node.CalendarYear] += node.Revenue
      }
	  })

	  return total
  }, { 'All': { 'All': {} } })

  Object.keys(commoditiesCounty).forEach(code => {
    Object.keys(commoditiesCounty[code].revenue).forEach(year => {
      commoditiesCounty[code].revenue[year] = parseInt(commoditiesCounty[code].revenue[year])
    })
  })
  Object.keys(commodities).forEach(commodity => {
	  Object.keys(commodities[commodity]).forEach(revenueType => {
      Object.keys(commodities[commodity][revenueType]).forEach(year => {
        commodities[commodity][revenueType][year] = parseInt(commodities[commodity][revenueType][year])
      })
	  })
  })

  return { commodities, commoditiesCounty, commodityYears }
}

const createOffshoreProductionCommoditiesData = (groupByCommodity, groupByYear, offshoreId) => {
  // console.log(offshoreId)
  let data = groupByCommodity
  let commodityProductionYears = groupByYear.sort(compareValues('id'))
  if (commodityProductionYears.length > 10) {
    commodityProductionYears = commodityProductionYears.slice(commodityProductionYears.length - 10)
  }
  commodityProductionYears = commodityProductionYears.map(item => parseInt(item.id))

  let commoditiesOffshoreCode = data.reduce((total, item) => {
    let productName = (item.id.includes('~')) ? item.id.split('~')[0] : item.id

    item.edges.forEach(element => {
      let node = element.node
      let id = node.FipsCode
      let year = parseInt(node.ProductionYear)
      if (commodityProductionYears.includes(year) && node.OffshoreRegion.toLowerCase().includes(offshoreId)) {
        total[id] = total[id] || { name: node.OffshorePlanningArea, products: {} }
        total[id].products[item.id] = total[id].products[item.id] || { name: productName, units: node.Units, withheld: node.Withheld, volume: {} }
        total[id].products[item.id].volume[year] = (total[id].products[item.id].volume[year])
          ? total[id].products[item.id].volume[year] + node.Volume
          : node.Volume
      }
    })

    return total
  }, {})

  let commoditiesProduction = data.reduce((total, item) => {
    item.edges.forEach(element => {
      let node = element.node
      let name = node.ProductName
      let year = parseInt(node.ProductionYear)
      if (commodityProductionYears.includes(year) && node.OffshoreRegion.toLowerCase().includes(offshoreId)) {
        total[item.id] = total[item.id] || { name: name, units: node.Units, withheld: node.Withheld, total: 0, volume: {} }
        total[item.id].volume[year] = (total[item.id].volume[year])
          ? total[item.id].volume[year] + node.Volume
          : node.Volume

          total[item.id].total += total[item.id].volume[year]
      }
    })

    return total
  }, {})

  Object.keys(commoditiesOffshoreCode).forEach(code => {
    Object.keys(commoditiesOffshoreCode[code].products).forEach(product => {
      Object.keys(commoditiesOffshoreCode[code].products[product].volume).forEach(year => {
        commoditiesOffshoreCode[code].products[product].volume[year] = parseInt(commoditiesOffshoreCode[code].products[product].volume[year])
      })
    })
  })
  Object.keys(commoditiesProduction).forEach(commodity => {
    commoditiesProduction[commodity].total = parseInt(commoditiesProduction[commodity].total)
    Object.keys(commoditiesProduction[commodity].volume).forEach(year => {
      commoditiesProduction[commodity].volume[year] = parseInt(commoditiesProduction[commodity].volume[year])
    })
  })

  return { commoditiesProduction, commoditiesOffshoreCode, commodityProductionYears }
}

const createOffshorePages = (createPage, graphql) => {
  const graphQLQueryString = '{' + GRAPHQL_QUERIES.MARKDOWN_OFFSHORE +
                                GRAPHQL_QUERIES.OFFSHORE_PRODUCTION +
                                GRAPHQL_QUERIES.OFFSHORE_REVENUE +
                                GRAPHQL_QUERIES.OFFSHORE_REVENUE_BY_CY +
																GRAPHQL_QUERIES.OFFSHORE_PRODUCTION_ALASKA +
																GRAPHQL_QUERIES.OFFSHORE_PRODUCTION_GULF +
																GRAPHQL_QUERIES.OFFSHORE_PRODUCTION_PACIFIC + '}'

  return new Promise((resolve, reject) => {
	    resolve(
	      graphql(graphQLQueryString).then(result => {
	        if (result.errors) {
            console.error(result.errors)
            reject(result.errors)
	        }
	        else {
            // Create pages for each markdown file.
		        result.data.allMarkdownRemark.pages.forEach(({ page }) => {
		          const path = page.frontmatter.permalink
		          const template = getPageTemplate(page.frontmatter.layout)
		          let dataSet
		          switch (page.frontmatter.unique_id) {
              case 'alaska':
                dataSet = result.data.AlaskaOffshoreProduction
                break
              case 'gulf':
                dataSet = result.data.GulfOffshoreProduction
                break
              case 'pacific':
                dataSet = result.data.PacificOffshoreProduction
                break
              }

              let { commodities, commoditiesCounty, commodityYears } = createOffshoreRevenueTypeCommoditiesData(result.data.RevenueGroupByCommodity.group,
                result.data.RevenueGroupByCY.group,
                page.frontmatter.unique_id)

              let { commoditiesProduction, commoditiesOffshoreCode, commodityProductionYears } =
              createOffshoreProductionCommoditiesData(result.data.OffshoreProductionByProduct.group,
                  result.data.OffshoreProductionByYear.group,
                  page.frontmatter.unique_id)

		          createPage({
		            path,
		            component: template,
		            context: {
		              markdown: page,
                  data: dataSet,
                  commoditiesProduction: commoditiesProduction,
                  commoditiesOffshoreCode: commoditiesOffshoreCode,
                  commodityProductionYears: commodityProductionYears,
                  commodities: commodities,
                  commoditiesCounty: commoditiesCounty,
                  commodityYears: commodityYears,
		            },
		          })
		        })
            resolve()
	        }
	      })
	    )
	  })
}

/* This is required for Federalist build */
let copydir = require('copy-dir')
exports.onPostBuild = () => {
	// console.log('Copying static html pages to _site...')
	// copydir.sync(__dirname + '/static/pages', __dirname + '/_site')
	// console.log('Finished Copying static html pages to _site.')

  console.log('Copying Files from public to _site...')
  fs.rename(__dirname + '/public', __dirname + '/_site')
	//copydir.sync(__dirname + '/public', './_site')
	console.log('Finished Copying Files to _site.')

	console.log('Copying Files from downloads to _site...')
	copydir.sync(__dirname + '/downloads', './_site/downloads')
	console.log('Finished Copying Files to _site.')
}
