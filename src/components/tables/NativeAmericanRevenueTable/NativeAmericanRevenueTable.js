import React from 'react'
import ReactDOM from 'react-dom'
import { useStaticQuery, graphql } from 'gatsby'

import utils from '../../../js/utils'

const createRevenueCommoditiesData = (groupByCommodity, groupByYear) => {
  let data = groupByCommodity
  let commodityYears = groupByYear.sort(utils.compareValues('id'))
  if (commodityYears.length > 10) {
    commodityYears = commodityYears.slice(commodityYears.length - 5)
  }
  commodityYears = commodityYears.map(item => parseInt(item.id))

  let commodities = data.reduce((total, item) => {
    item.edges.forEach(element => {
      let node = element.node

      if (commodityYears.includes(parseInt(node.FiscalYear))) {
        total[item.id] = total[item.id] || {}
        total[item.id][node.FiscalYear] = total[item.id][node.FiscalYear] || { Bonus: 0, Rents: 0, Royalties: 0, 'Other Revenues': 0 }

        switch (node.RevenueType) {
        case 'Bonus':
          total[item.id][node.FiscalYear].Bonus = (total[item.id][node.FiscalYear].Bonus)
            ? total[item.id][node.FiscalYear].Bonus + node.Revenue
            : node.Revenue
          break
        case 'Rents':
          total[item.id][node.FiscalYear].Rents = (total[item.id][node.FiscalYear].Rents)
            ? total[item.id][node.FiscalYear].Rents + node.Revenue
            : node.Revenue
          break
        case 'Royalties':
          total[item.id][node.FiscalYear].Royalties = (total[item.id][node.FiscalYear].Royalties)
            ? total[item.id][node.FiscalYear].Royalties + node.Revenue
            : node.Revenue
          break
        case 'Other Revenues':
          total[item.id][node.FiscalYear]['Other Revenues'] = (total[item.id][node.FiscalYear]['Other Revenues'])
            ? total[item.id][node.FiscalYear]['Other Revenues'] + node.Revenue
            : node.Revenue
          break
        }
      }
    })

    return total
  }, { })

  Object.keys(commodities).forEach(commodity => {
    Object.keys(commodities[commodity]).forEach(year => {
      Object.keys(commodities[commodity][year]).forEach(revenueType => {
        commodities[commodity][year][revenueType] = parseInt(commodities[commodity][year][revenueType])
      })
    })
  })

  return { commodities, commodityYears }
}

const NativeAmericanRevenueTable = props => {
  const data = useStaticQuery(graphql`
        query NativeAmericanRevenue {
            GroupByCommodity:allResourceRevenuesFiscalYear(filter: {LandClass: {eq: "Native American"}}) {
                group(field: Commodity) {
                    id: fieldValue
                    edges {
                        node {
                            id
                            LandClass
                            Revenue
                            FiscalYear
                            Commodity
                            RevenueType
                        }
                    }
                }
            }
            GroupByYear:allResourceRevenuesFiscalYear(filter: {LandClass: {eq: "Native American"}}) {
                group(field: FiscalYear) {
                  id: fieldValue
                  edges {
                    node {
                      id
                    }
                  }
                }
            }
        }`)

  const { commodities, commodityYears } = createRevenueCommoditiesData(data.GroupByCommodity.group, data.GroupByYear.group)

  let commodityYearsSortDesc = commodityYears.slice(0)
  commodityYearsSortDesc.sort((a, b) => b - a)

  return (
    <div>
        {commodityYearsSortDesc &&
            commodityYearsSortDesc.map((year, index) => {
                return (
                <div key={index}>
                    <h3>Revenue from natural resources on Native American land (FY {year})</h3>
                    <table className="table-basic u-margin-top u-margin-bottom">
                    <thead>
                        <tr>
                        <th>Commodity</th>
                        <th>Bonus</th>
                        <th>Rents</th>
                        <th>Royalties</th>
                        <th>Other Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        Object.keys(commodities).map(commodity => (
                            Object.keys(commodities[commodity]).map((commodityYear, index) => (
                            parseInt(commodityYear) === year &&
                                <tr key={index}><td>{commodity}</td>
                                    {
                                    Object.keys(commodities[commodity][commodityYear]).map(revenueType => (
                                        <td className="numeric">{
                                        (commodities[commodity][commodityYear][revenueType] === 0)
                                            ? '-'
                                            :                                                
                                            utils.formatToDollarInt(commodities[commodity][commodityYear][revenueType])
                                        }</td>
                                    ))
                                    }
                                </tr>
                            ))
                        ))
                        }
                    </tbody>
                    </table>
                </div>
                )
            })

      }

    </div>
  )
}

export default NativeAmericanRevenueTable
