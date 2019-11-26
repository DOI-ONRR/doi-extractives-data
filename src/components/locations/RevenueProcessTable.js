import React from 'react'
import Link from '../utils/temp-link'

import Lazy from 'lazy.js'

import utils from '../../js/utils'

import ALL_OFFSHORE_REVENUES_BY_TYPE from '../../../static/data/offshore_revenues_by_type.yml'
import COMMODITIES from '../../../static/data/commodities.yml'
import NATIONAL_REVENUES_INSPECTION_FEES from '../../../static/data/national_revenues_inspection_fees.yml'
import NATIONAL_REVENUES_CIVIL_PENALTIES from '../../../static/data/national_revenues_civil_penalties.yml'
import NATIONAL_REVENUES_OTHER_REVENUES from '../../../static/data/national_revenues_other_revenues.yml'

import OilGasIcon from '-!svg-react-loader!../../img/svg/icon-oil.svg'
import CoalIcon from '-!svg-react-loader!../../img/svg/icon-coal.svg'
import GeothermalIcon from '-!svg-react-loader!../../img/svg/icon-geothermal.svg'
import RenewablesIcon from '-!svg-react-loader!../../img/svg/icon-renewables.svg'

// @TODO Copied from revenuetypetable, need to fix this duplication
const createRevenueTypeCommoditiesData = (groupByCommodity, groupByYear) => {
  if (!groupByCommodity) return undefined
  let data = groupByCommodity
  let commodityYears = groupByYear.sort(utils.compareValues('id'))
  if (commodityYears.length > 10) {
    commodityYears = commodityYears.slice(commodityYears.length - 10)
  }
  commodityYears = commodityYears.map(item => parseInt(item.id))

  let commodities = data.reduce((total, item) => {
    item.edges.forEach(element => {
      let node = element.node
      if (commodityYears.includes(node.CalendarYear)) {
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

  Object.keys(commodities).forEach(commodity => {
    Object.keys(commodities[commodity]).forEach(revenueType => {
      Object.keys(commodities[commodity][revenueType]).forEach(year => {
		  commodities[commodity][revenueType][year] = parseInt(commodities[commodity][revenueType][year])
      })
    })
  })

  return commodities
}

const getYearValueForCommodityRevenueType = (commodityRevenueType, year) => {
  return (commodityRevenueType && commodityRevenueType[year] ? commodityRevenueType[year] : 0)
}

const RevenueTypeTableRow2 = props => {
  const revenueTypeNames = ['Bonus', 'Rents', 'Royalties', 'Other Revenues']

  function getOtherRevenuesValues () {
    let values = {}
    values.CivilPenalties = getYearValueForCommodityRevenueType(props.commodityData['Civil Penalties'], props.year)
    values.OtherRevenues = getYearValueForCommodityRevenueType(props.commodityData['Other Revenues'], props.year)
    values.InspectionFees = getYearValueForCommodityRevenueType(props.commodityData['Inspection Fees'], props.year)
    values.Sum = values.CivilPenalties +
					values.OtherRevenues +
					values.InspectionFees

    return values
  }

  return (
    <tr>
		    <th headers={`${props.id}_col_0`} scope="row" data-value={props.commodityData.All[props.year]} name={'#revenue-' + utils.formatToSlug(props.commodityName)} className="table-arrow_box-subheader">
		      <strong>{ props.commodityName }</strong><br/>
		      <strong className="table-arrow_box-subheader-value"> { utils.formatToDollarInt(props.commodityData.All[props.year]) }</strong>
		    </th>
		  	{
		  		revenueTypeNames.map((revenueTypeName, index) => {
		  			let yearTotalValue = getOtherRevenuesValues().Sum
		  			if (revenueTypeName.toLowerCase() == 'other revenues') {
		  				return (
		  					<td headers={`col_${index + 1}`} key={index} data-value={yearTotalValue} className="table-arrow_box-value  table-arrow_box-text">
		  						<span className="text table-arrow_box-subheader-value">
		  							{ utils.formatToDollarInt(yearTotalValue)}
		  						</span>
		  						{ props.isNationalPage &&
		  							<div>
		  								<br/>
			  							<span className="table-arrow_box-asterisk">
			  								* Includes revenues not tied to specific commo&shy;dities
			  								({ utils.formatToDollarInt(NATIONAL_REVENUES_INSPECTION_FEES[props.year]) } in inspection fees,
			  								{ utils.formatToDollarInt(NATIONAL_REVENUES_CIVIL_PENALTIES[props.year]) } in civil penalties,
			  								and { utils.formatToDollarInt(NATIONAL_REVENUES_OTHER_REVENUES[props.year]) } in other revenue).
			  							</span>
		  							</div>
		  						}
		  					</td>
		  				)
		  			}
		  			else {
		  				let yearValue = getYearValueForCommodityRevenueType(props.commodityData[revenueTypeName], props.year)
		  				return (
		  					<td headers={`col_${index + 1}`} key={index} data-value={yearValue} className="table-arrow_box-value">
		  						<span className="text table-arrow_box-subheader-value">
		  							{ utils.formatToDollarInt(yearValue)}
		  						</span>
		  					</td>
		  				)
		  			}
		  		})
		  	}
    </tr>
  )
}

const RevenueProcessTable = props => {
  let { commodities } = props

  if (props.revenueGroupByCommodity) {
	  commodities = createRevenueTypeCommoditiesData(props.revenueGroupByCommodity, props.revenueGroupByCalendarYear)
  }

  let revenueTypes = commodities

  if (props.isNationalPage) {
    revenueTypes = commodities
  }

  if (props.isOffshorePage) {
    revenueTypes = ALL_OFFSHORE_REVENUES_BY_TYPE[props.locationId]
  }

  let commodityGroups = COMMODITIES.groups
  let oilGasCommodities = commodityGroups.oilgas.commodities
  let otherProductCommodities = commodityGroups.other.commodities

  let oilGasExists = false
  let coalExists = false
  let geothermalExists = false
  let windExists = false
  let otherProductExists = false
  let allExists = false

  let oilGasRevenueTypeRowHtml

  for (let commodity in revenueTypes) {
  		let commodityName = commodity
  		let commodityValues = revenueTypes[commodity]

	  	let commodityValueExistsForYear = false

    for (let type in commodityValues) {
      if (commodityValues[type][props.year] !== undefined) {
        commodityValueExistsForYear = true
        break
      }
    }

    if (Lazy(oilGasCommodities).contains(commodityName)) {
      oilGasExists = oilGasExists || commodityValueExistsForYear
      if (commodityName.toLowerCase() === 'oil & gas' ||
				commodityName.toLowerCase() === 'oil & gas (non-royalty)') {
        let commodityNameSlug = utils.formatToSlug(commodityName)

        oilGasRevenueTypeRowHtml = getOilAndGasRow(getValuesForOilAndGasCommoditiesByRevenueType(commodityValues, revenueTypes, 'All'),
          getValuesForOilAndGasCommoditiesByRevenueType(commodityValues, revenueTypes, 'Bonus'),
          getValuesForOilAndGasCommoditiesByRevenueType(commodityValues, revenueTypes, 'Rents'),
          getValuesForOilAndGasCommoditiesByRevenueType(commodityValues, revenueTypes, 'Royalties'),
          getValuesForOilAndGasCommoditiesByRevenueType(commodityValues, revenueTypes, 'Other Revenues'),
          commodityNameSlug)
      }
    }

    if (Lazy(otherProductCommodities).contains(commodityName) && commodityValueExistsForYear) {
      otherProductExists = commodityValueExistsForYear
    }

    if (commodityName.toLowerCase() === 'coal') {
      coalExists = commodityValueExistsForYear
    }

    if (commodityName.toLowerCase() === 'geothermal') {
      geothermalExists = commodityValueExistsForYear
    }

    if (commodityName.toLowerCase() === 'wind') {
      windExists = commodityValueExistsForYear
    }

    if (commodityName.toLowerCase() === 'all') {
      allExists = commodityValueExistsForYear
    }
  }

  function getOilAndGasRow (valuesAll, valuesBonus, valuesRents, valuesRoyalties, valuesOtherRevenues, slug) {
    return (
      <tr>
			  <th headers={`${props.id}_col_0`} scope="row" rowSpan="2" data-value={ valuesAll.Sum} name={'#revenue-' + slug} className="table-arrow_box-subheader">
			    <strong>Oil &amp; Gas </strong><br />
			    <strong className="table-arrow_box-subheader-value">{ utils.formatToDollarInt(valuesAll.Sum) }</strong>
			  </th>
			  <td headers={`${props.id}_col_1`} rowSpan="2" data-value={ valuesBonus.Sum } className="table-arrow_box-value">
			    <span className="text table-arrow_box-subheader-value">{ utils.formatToDollarInt(valuesBonus.Sum) }</span>
			  </td>
			  <td headers={`${props.id}_col_2`} rowSpan="2" data-value={ valuesRents.Sum } className="table-arrow_box-value">
			    <span className="text table-arrow_box-subheader-value">{ utils.formatToDollarInt(valuesRents.Sum) }</span>
			  </td>
			  <td headers={`${props.id}_col_3`} className="bars table-arrow_box-value" data-value={ valuesRoyalties.Oil } >
			  	<span data-value={ valuesRoyalties.Gas } />
			  	<span data-value={ valuesRoyalties.NGL } />
			  	<span data-value={ valuesRoyalties.OilShale } />
			  	{valuesRoyalties.Sum === 0 &&
			  		<span className="text table-arrow_box-subheader-value">
			  			{ utils.formatToDollarInt(valuesRoyalties.Sum)}
			  		</span>
			  	}
			  	{ valuesRoyalties.Oil > 0 &&
				  	<span className="text table-arrow_box-subheader-value">
				  		<strong className="text-header text-header-first">Oil </strong>
				  		{ utils.formatToDollarInt(valuesRoyalties.Oil)}
				  	</span>
			  	}
			  	{ valuesRoyalties.Gas > 0 &&
				  	<span className="text table-arrow_box-subheader-value">
				  		<strong className="text-header text-header-first">Gas </strong>
				  		{ utils.formatToDollarInt(valuesRoyalties.Gas)}
				  	</span>
			  	}
			  	{ valuesRoyalties.NGL > 0 &&
				  	<span className="text table-arrow_box-subheader-value">
				  		<strong className="text-header text-header-first">NGL </strong>
				  		{ utils.formatToDollarInt(valuesRoyalties.NGL)}
				  	</span>
			  	}
			  	{ valuesRoyalties.OilShale > 0 &&
				  	<span className="text table-arrow_box-subheader-value">
				  		<strong className="text-header text-header-first">OilShale </strong>
				  		{ Ututilsils.formatToDollarInt(valuesRoyalties.OilShale)}
				  	</span>
			  	}
			  </td>
			  <td headers={`${props.id}_col_4`} rowSpan="2" data-value={valuesOtherRevenues.Sum} className="table-arrow_box-value">
			  	<span className="text table-arrow_box-subheader-value">{ utils.formatToDollarInt(valuesOtherRevenues.Sum) }</span>
			  </td>

      </tr>
    )
  }

  function getValuesForOilAndGasCommoditiesByRevenueType (oilAndGasCommodityValues, revenueTypes, type) {
    let revenueTypeValues = {}

    revenueTypeValues.OilGas = getYearValueForCommodityRevenueType(oilAndGasCommodityValues[type], props.year)
    revenueTypeValues.Oil = (revenueTypes.Oil) && getYearValueForCommodityRevenueType(revenueTypes.Oil[type], props.year)
    revenueTypeValues.Gas = (revenueTypes.Gas) && getYearValueForCommodityRevenueType(revenueTypes.Gas[type], props.year)
    revenueTypeValues.NGL = (revenueTypes.NGL) && getYearValueForCommodityRevenueType(revenueTypes.NGL[type], props.year)
    if (revenueTypes['Oil Shale'] !== undefined) {
      revenueTypeValues.OilShale = getYearValueForCommodityRevenueType(revenueTypes['Oil Shale'][type], props.year)
    }
    else {
      revenueTypeValues.OilShale = 0
    }

    revenueTypeValues.Sum = revenueTypeValues.OilGas +
							revenueTypeValues.Oil +
							revenueTypeValues.Gas +
							revenueTypeValues.NGL +
							revenueTypeValues.OilShale

    return revenueTypeValues
  }

  function getOffshoreHtml () {
    return (
      <tr>
        <th headers={`${props.id}_col_0`} scope="row" className="table-arrow_box-subcategory">Offshore</th>
        <td headers={`${props.id}_col_1`}>
          <strong>Bonus:</strong> The amount offered by the highest bidder
        </td>
        <td headers={`${props.id}_col_2`}>
          <strong>$7</strong> or <strong>$11</strong> annual rent per acre, increasing over time up to <strong>$44</strong> per acre in some cases
        </td>
        <td headers={`${props.id}_col_3`}>
          <strong>12.5%</strong>, <strong>16.67%</strong>, or 
          <strong>18.75%</strong> of production value
        </td>
        <td headers={`${props.id}_col_4`}></td>
      </tr>)
  }

  function getOnshoreHtml () {
    return (
      <tr>
        <th headers={`${props.id}_col_0`} scope="row" className="table-arrow_box-subcategory">Onshore</th>
        <td headers={`${props.id}_col_1`}>
          <strong>Bonus:</strong> The amount offered by the highest bidder
        </td>
        <td headers={`${props.id}_col_2`}>
          <strong>$1.50</strong> annual rent per acre for 5 years<br/>
          <strong>$2</strong> annual rent per acre thereafter
        </td>
        <td headers={`${props.id}_col_3`}>
          <strong>12.5%</strong> of production value
        </td>
        <td headers={`${props.id}_col_4`}></td>
      </tr>)
  }

  return (
    <table id={props.id} is="bar-chart-table" class="revenue table-arrow_box">
      <thead>
        <tr>
          <th id={`${props.id}_col_0`} scope="col" className="arrow_box"><span>Commodity</span></th>
          <th id={`${props.id}_col_1`} scope="col" className="arrow_box"><span>1. Securing rights</span>Companies pay bonuses or other fees to secure rights to resources on federal land</th>
          <th id={`${props.id}_col_2`} scope="col" className="arrow_box"><span>2. Before production</span>Companies pay rent on federal land while exploring for resources</th>
          <th id={`${props.id}_col_3`} scope="col" className="arrow_box-last"><span>3. During production</span>Companies pay royalties after production begins</th>
          <th id={`${props.id}_col_4`} scope="col"><span>Other revenue</span>Minimum or estimated royalties, settlements, and interest payments</th>
        </tr>
      </thead>

      {oilGasExists &&
				<tbody className={'revenue-types-' + utils.formatToSlug('oil gas')}>
				  <tr className="table-arrow_box-category">
				    <td headers={`${props.id}_col_0`} colSpan="5">
							Oil and Gas <span className="icon-padded"><OilGasIcon /></span>
				    </td>
				  </tr>
				  {oilGasRevenueTypeRowHtml}
				</tbody>
      }

      { props.isNationalPage &&
				<tbody>
				  {getOffshoreHtml()}
				  {getOnshoreHtml()}
				</tbody>
      }

      { (props.isOffshorePage && !props.isNationalPage) &&
				<tbody>
				  {getOffshoreHtml()}
				</tbody>
      }

      { (!props.isOffshorePage && !props.isNationalPage) &&
				<tbody>
				  {getOnshoreHtml()}
				</tbody>
      }

      {coalExists &&
				<tbody className={'revenue-types-' + utils.formatToSlug('Coal')}>
				    <tr className="table-arrow_box-category">
				    	<td headers={`${props.id}_col_0`} colSpan="5">
					        Coal <span className="icon-padded"><CoalIcon /></span>
				      	</td>
				    </tr>
					<RevenueTypeTableRow2
						commodityName='Coal'
						commodityData={revenueTypes['Coal']}
						year={props.year}
						commodityTableName={props.id} />
		            <tr>
		              <th headers={`${props.id}_col_0`}></th>
		              <td headers={`${props.id}_col_1`}>
		                <strong>Bonus:</strong> The amount offered by the highest bidder
		              </td>
		              <td headers={`${props.id}_col_2`}>
		                <strong>$3</strong> annual rent per acre
		              </td>
		              <td headers={`${props.id}_col_3`}>
		                <strong>Surface mining:</strong> 12.5% of production value + $0.28 per ton in AML fees<br/>
		                <strong>Subsurface mining:</strong> 8% of production value + $0.12 per ton in AML fees
		              </td>
		              <td headers={`${props.id}_col_4`}></td>
		            </tr>
				</tbody>
      }
      {geothermalExists &&
				<tbody className={'revenue-types-' + utils.formatToSlug('Geothermal')}>
				    <tr className="table-arrow_box-category">
				    	<td headers={`${props.id}_col_0`} colSpan="5">
					        Geothermal <span className="icon-padded"><GeothermalIcon /></span>
				      	</td>
				    </tr>
				    <RevenueTypeTableRow
						commodityName='Geothermal'
						commodityData={revenueTypes['Geothermal']}
						year={props.year}
						commodityTableName={props.id} />
		            <tr>
		              <th headers={`${props.id}_col_0`} scope="row" className="table-arrow_box-subcategory">Competitive leasing</th>
		              <td headers={`${props.id}_col_1`}>
		                <strong>Nomination fee:</strong> $110 per nomination + $0.11 per acre<br/>
		                <strong>Bonus:</strong> The amount offered by the highest bidder<br/>
		                <strong>$160</strong> processing fee
		              </td>
		              <td headers={`${props.id}_col_2`}>
		                <strong>$2</strong> per acre for the first year<br/>
		                <strong>$3</strong> annual rent per acre for years 2-10<br/>
		                <strong>$5</strong> annual rent per acre thereafter
		              </td>
		              <td  headers={`${props.id}_col_3`} rowSpan="2">
		                <strong>Electricity sales:</strong> 1.75% of gross proceeds for 10 years, then 3.5%<br/>
		                <strong>Arm’s length sales:</strong> 10% of gross proceeds from contract multiplied by lease royalty rate<br/>
		                <Link to="/downloads/federal-revenue-by-location/#note-geothermal-rate-details">More about geothermal rates</Link>
		              </td>
		              <td headers={`${props.id}_col_4`}></td>
		            </tr>
		            <tr>
		              <th headers={`${props.id}_col_0`} scope="row" className="table-arrow_box-subcategory">Noncompetitive leasing</th>
		              <td headers={`${props.id}_col_1`}><strong>Lease:</strong> $410 payment
		              </td>
		              <td headers={`${props.id}_col_2`}><strong>$1</strong> annual rent per acre for 10 years<br/> <strong>$5</strong> annual rent per acre thereafter
		              </td>
		              <td headers={`${props.id}_col_3`}></td>
					  <td headers={`${props.id}_col_4`}></td>
		            </tr>
				</tbody>
      }
      {windExists &&
				<tbody className={'revenue-types-' + utils.formatToSlug('Wind')}>
				    <tr className="table-arrow_box-category">
				    	<td headers={`${props.id}_col_0`} colSpan="5">
					        Offshore renewable energy <span className="icon-padded"><RenewablesIcon /></span>
				      	</td>
				    </tr>
				    <RevenueTypeTableRow2
						commodityName='Wind'
						commodityData={revenueTypes['Wind']}
						year={props.year}
						commodityTableName={props.id} />
		            <tr>
		              <th headers={`${props.id}_col_0`} scope="row" className="table-arrow_box-subcategory">Competitive leasing</th>
		              <td headers={`${props.id}_col_1`}>
		                <strong>Bonus:</strong> The amount offered by the highest bidder
		              </td>
		              <td headers={`${props.id}_col_2`} rowSpan="2">
		                <strong>$3</strong> annual rent per acre<br/>
		              </td>
		              <td headers={`${props.id}_col_3`} rowSpan="2">
		                <strong>2%</strong> of anticipated value of wind energy produced (unless otherwise specified)
		              </td>
		              <td headers={`${props.id}_col_4`}></td>
		            </tr>
		            <tr>
		              <th headers={`${props.id}_col_0`} scope="row" className="table-arrow_box-subcategory">Noncompetitive leasing</th>
		              <td headers={`${props.id}_col_1`}>
		                <strong>Acquisition fee:</strong> $0.25 per acre
		              </td>
		              <td headers={`${props.id}_col_2`}></td>
					  <td headers={`${props.id}_col_3`}></td>
					  <td headers={`${props.id}_col_4`}></td>
		            </tr>
				</tbody>
      }
      {otherProductExists &&
				<tbody className={'revenue-types-' + utils.formatToSlug('Other Products')}>
				    <tr scope="row" className="table-arrow_box-category">
				    	<td headers={`${props.id}_col_0`} colSpan="5">
					        Other products
				      	</td>
				    </tr>
				  <tr>
				    <th headers={`${props.id}_col_0`} scope="row" className="table-arrow_box-subcategory">Mining claim fees</th>
				    <td headers={`${props.id}_col_1`}>
				    </td>
				    <td headers={`${props.id}_col_2`}>
				      <strong>$40</strong> location fee <strong>$20</strong> processing fee <strong>$165</strong> maintenance fee
				    </td>
				    <td headers={`${props.id}_col_3`}>
						Royalty rates are determined by leasing officers on an individual case basis (no minimums apply)
				    </td>
				    <td headers={`${props.id}_col_4`}></td>
				  </tr>
				</tbody>
      }
      {allExists &&
				<tbody className={'revenue-types-' + utils.formatToSlug('all')}>
				    <tr scope="row" className="table-arrow_box-category">
				    	<td headers={`${props.id}_col_0`} colSpan="5">
					        All commodities
					        { oilGasExists && <span className="icon-padded"> <OilGasIcon /></span> }
					        { coalExists && <span className="icon-padded"><CoalIcon /></span> }
					        { geothermalExists && <span className="icon-padded"><GeothermalIcon /></span> }
					        { windExists && <span className="icon-padded"><RenewablesIcon /></span> }
				      	</td>
				    </tr>
				    <RevenueTypeTableRow2
						isNationalPage={props.isNationalPage}
						commodityName={utils.getDisplayName_CommodityName('All')}
						commodityData={revenueTypes['All']}
						year={props.year}
						commodityTableName={props.id} />
				</tbody>
      }
      { !props.isOffshorePage &&
				<tbody>
				  <tr className="table-arrow_box-category">
				    <td headers={`${props.id}_col_0`} colSpan="5">Other revenue streams</td>
				  </tr>
				  <tr>
				    <th headers={`${props.id}_col_0`} scope="row">Hardrock mining on public domain lands</th>
				    <td headers={`${props.id}_col_1 ${props.id}_col_2 ${props.id}_col_3 ${props.id}_col_4`} colSpan="5">
						  Federal revenue from hardrock mining on public domain land occurs through the claim-staking process and is managed by the Bureau of Land Management (BLM). It is not included here, because the dataset does not have state-level data. Learn more about <Link to="/how-it-works/minerals/">hardrock mining on federal land</Link>.
				    </td>
				  </tr>
				  <tr>
				    <th headers={`${props.id}_col_0`} scope="row">Onshore solar and wind energy</th>
				    <td headers={`${props.id}_col_1 ${props.id}_col_2 ${props.id}_col_3 ${props.id}_col_4`} colSpan="5">
						  Federal revenue from onshore renewable energy generation on federal land is not included here, because that dataset, from BLM, does not have state-level data. Learn more about <Link to="/how-it-works/onshore-renewables/">onshore renewables on federal land</Link>.
				    </td>
				  </tr>
				  <tr>
				    <td headers={`${props.id}_col_0`}>
				    </td>
				    <td headers={`${props.id}_col_1 ${props.id}_col_2 ${props.id}_col_3 ${props.id}_col_4`} colSpan="5">
						  To see how much was collected nationwide for all revenue types, including BLM revenues, see <Link to="/how-it-works/federal-revenue-by-company/">federal revenue by company</Link>.
				    </td>
				  </tr>
				</tbody>
      }

		 </table>
  )
}

export default RevenueProcessTable
