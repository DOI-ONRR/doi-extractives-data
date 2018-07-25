import React from 'react';
import Link from 'components/utils/temp-link';

import Lazy from 'lazy.js';

import Utils from 'js/utils';

import ALL_NATIONAL_REVENUES_BY_TYPE from '../../../static/data/national_revenues_by_type.yml';
import ALL_STATE_REVENUES_BY_TYPE from '../../../static/data/state_revenues_by_type.yml';
import ALL_OFFSHORE_REVENUES_BY_TYPE from '../../../static/data/offshore_revenues_by_type.yml';
import COMMODITIES from '../../../static/data/commodities.yml';
import NATIONAL_REVENUES_INSPECTION_FEES from '../../../static/data/national_revenues_inspection_fees.yml';
import NATIONAL_REVENUES_CIVIL_PENALTIES from '../../../static/data/national_revenues_civil_penalties.yml';
import NATIONAL_REVENUES_OTHER_REVENUES from '../../../static/data/national_revenues_other_revenues.yml';

import OilGasIcon from '-!svg-react-loader!img/svg/icon-oil.svg';
import CoalIcon from '-!svg-react-loader!img/svg/icon-coal.svg';
import GeothermalIcon from '-!svg-react-loader!img/svg/icon-geothermal.svg';
import RenewablesIcon from '-!svg-react-loader!img/svg/icon-renewables.svg';

const getYearValueForCommodityRevenueType = (commodityRevenueType, year) => {
	return (commodityRevenueType && commodityRevenueType[year] ? commodityRevenueType[year] : 0)
}

const RevenueTypeTableRow = (props) => {
	const revenueTypeNames = ['Bonus','Rents','Royalties','Other Revenues'];

	function getOtherRevenuesValues(){
		let values = {};
		values.CivilPenalties = getYearValueForCommodityRevenueType(props.commodityData['Civil Penalties'], props.year);
		values.OtherRevenues = getYearValueForCommodityRevenueType(props.commodityData['Other Revenues'], props.year);
		values.InspectionFees = getYearValueForCommodityRevenueType(props.commodityData['Inspection Fees'], props.year);
		values.Sum = values.CivilPenalties +
					values.OtherRevenues +
					values.InspectionFees;

		return values;
	}

	return (
		<tr>
		    <th scope="row" data-value={props.commodityData.All[props.year]} name={"#revenue-"+Utils.formatToSlug(props.commodityName)} className="table-arrow_box-subheader">
		      <strong>{ props.commodityName }</strong><br/>
		      <strong className="table-arrow_box-subheader-value">{ Utils.formatToDollarInt(props.commodityData.All[props.year]) }</strong>
		    </th>
		  	{ 
		  		revenueTypeNames.map((revenueTypeName, index) => {
		  			let yearTotalValue = getOtherRevenuesValues().Sum;
		  			if(revenueTypeName.toLowerCase() == "other revenues") {
		  				return (
		  					<td key={index} data-value={yearTotalValue} className="table-arrow_box-value  table-arrow_box-text">
		  						<span className="text table-arrow_box-subheader-value">
		  							{ Utils.formatToDollarInt(yearTotalValue)}
		  						</span>
		  						{ props.isNationalPage &&
		  							<div>
		  								<br/>
			  							<span className="table-arrow_box-asterisk">
			  								* Includes revenues not tied to specific commo&shy;dities 
			  								({ Utils.formatToDollarInt(NATIONAL_REVENUES_INSPECTION_FEES[props.year]) } in inspection fees, 
			  								{ Utils.formatToDollarInt(NATIONAL_REVENUES_CIVIL_PENALTIES[props.year]) } in civil penalties, 
			  								and { Utils.formatToDollarInt(NATIONAL_REVENUES_OTHER_REVENUES[props.year]) } in other revenue).
			  							</span>
		  							</div>
		  						}
		  					</td>
		  				);
		  			}
		  			else {
		  				let yearValue = getYearValueForCommodityRevenueType(props.commodityData[revenueTypeName], props.year);
		  				return (
		  					<td key={index} data-value={yearValue} className="table-arrow_box-value">
		  						<span className="text table-arrow_box-subheader-value">
		  							{ Utils.formatToDollarInt(yearValue)}
		  						</span>
		  					</td>
		  				);
		  			}

		  		})
		  	}
		</tr>
	);

}

const RevenueProcessTable = (props) => {
	let revenueTypes = ALL_STATE_REVENUES_BY_TYPE[props.locationId];

	if(props.isNationalPage){
		revenueTypes = ALL_NATIONAL_REVENUES_BY_TYPE.US;
	}

	if(props.isOffshorePage){
		revenueTypes = ALL_OFFSHORE_REVENUES_BY_TYPE[props.locationId];
	}

	let commodityGroups = COMMODITIES.groups;
	let oilGasCommodities = commodityGroups.oilgas.commodities;
	let otherProductCommodities = commodityGroups.other.commodities;

	let oilGasExists = false;
	let coalExists = false;
	let geothermalExists = false;
	let windExists = false;
	let otherProductExists = false;
	let allExists = false;

  	let commodityName;
  	let commodityValues;

  	let oilGasRevenueTypeRowHtml;
  	let otherProductsRevenueTypeRowHtml = "";

	for(let commodity in revenueTypes){
  		let commodityName = commodity;
  		let commodityValues = revenueTypes[commodity];

	  	let commodityValueExistsForYear = false

		for(let type in commodityValues) {
			if(commodityValues[type][props.year] !== undefined){
				commodityValueExistsForYear = true;
				break;
			}
		}

		if(Lazy(oilGasCommodities).contains(commodityName)) {
			oilGasExists = commodityValueExistsForYear;
			if(commodityName.toLowerCase() === "oil & gas" ||
				commodityName.toLowerCase() === "oil & gas (non-royalty)"){
				let commodityNameSlug = Utils.formatToSlug(commodityName);

				oilGasRevenueTypeRowHtml = getOilAndGasRow(getValuesForOilAndGasCommoditiesByRevenueType(commodityValues, revenueTypes, 'All'), 
															getValuesForOilAndGasCommoditiesByRevenueType(commodityValues, revenueTypes, 'Bonus'), 
															getValuesForOilAndGasCommoditiesByRevenueType(commodityValues, revenueTypes, 'Rents'), 
															getValuesForOilAndGasCommoditiesByRevenueType(commodityValues, revenueTypes, 'Royalties'),
															getValuesForOilAndGasCommoditiesByRevenueType(commodityValues, revenueTypes, 'Other Revenues'),
															commodityNameSlug)
			}
		}

		if(Lazy(otherProductCommodities).contains(commodityName) && commodityValueExistsForYear) {
			otherProductExists = commodityValueExistsForYear;
		}

		if(commodityName.toLowerCase() === "coal"){
			coalExists = commodityValueExistsForYear;
		}
		
		if(commodityName.toLowerCase() === "geothermal"){
			geothermalExists = commodityValueExistsForYear;
		}

		if(commodityName.toLowerCase() === "wind"){
			windExists = commodityValueExistsForYear;
		}

		if(commodityName.toLowerCase() === "all"){
			allExists = commodityValueExistsForYear;
		}
	}

	function getOilAndGasRow(valuesAll, valuesBonus, valuesRents, valuesRoyalties, valuesOtherRevenues, slug){

		return(
			<tr>
			  <th scope="row" rowSpan="2" data-value={ valuesAll.Sum} name={"#revenue-"+slug} className="table-arrow_box-subheader">
			    <strong>Oil &amp; Gas </strong><br />
			    <strong className="table-arrow_box-subheader-value">{ Utils.formatToDollarInt(valuesAll.Sum) }</strong>
			  </th>
			  <td rowSpan="2" data-value={ valuesBonus.Sum } className="table-arrow_box-value">
			    <span className="text table-arrow_box-subheader-value">{ Utils.formatToDollarInt(valuesBonus.Sum) }</span>
			  </td>
			  <td rowSpan="2" data-value={ valuesRents.Sum } className="table-arrow_box-value">
			    <span className="text table-arrow_box-subheader-value">{ Utils.formatToDollarInt(valuesRents.Sum) }</span>
			  </td>
			  <td className="bars table-arrow_box-value" data-value={ valuesRoyalties.Oil } >
			  	<span data-value={ valuesRoyalties.Gas } />
			  	<span data-value={ valuesRoyalties.NGL } />
			  	<span data-value={ valuesRoyalties.OilShale } />
			  	{valuesRoyalties.Sum === 0 &&
			  		<span className="text table-arrow_box-subheader-value">
			  			{ Utils.formatToDollarInt(valuesRoyalties.Sum)}
			  		</span>
			  	}
			  	{ valuesRoyalties.Oil > 0 &&
				  	<span className="text table-arrow_box-subheader-value">
				  		<strong className="text-header text-header-first">Oil</strong>
				  		{ Utils.formatToDollarInt(valuesRoyalties.Oil)}
				  	</span>
			  	}
			  	{ valuesRoyalties.Gas > 0 &&
				  	<span className="text table-arrow_box-subheader-value">
				  		<strong className="text-header text-header-first">Gas</strong>
				  		{ Utils.formatToDollarInt(valuesRoyalties.Gas)}
				  	</span>
			  	}
			  	{ valuesRoyalties.NGL > 0 &&
				  	<span className="text table-arrow_box-subheader-value">
				  		<strong className="text-header text-header-first">NGL</strong>
				  		{ Utils.formatToDollarInt(valuesRoyalties.NGL)}
				  	</span>
			  	}
			  	{ valuesRoyalties.OilShale > 0 &&
				  	<span className="text table-arrow_box-subheader-value">
				  		<strong className="text-header text-header-first">OilShale</strong>
				  		{ Utils.formatToDollarInt(valuesRoyalties.OilShale)}
				  	</span>
			  	}
			  </td>
			  <td rowSpan="2" data-value={valuesOtherRevenues.Sum} className="table-arrow_box-value">
			  	<span className="text table-arrow_box-subheader-value">{ Utils.formatToDollarInt(valuesOtherRevenues.Sum) }</span>
			  </td>

			</tr>
		);
	}

	function getValuesForOilAndGasCommoditiesByRevenueType(oilAndGasCommodityValues, revenueTypes, type) {
		let revenueTypeValues = {};

		revenueTypeValues.OilGas = getYearValueForCommodityRevenueType(oilAndGasCommodityValues[type], props.year);
		revenueTypeValues.Oil = getYearValueForCommodityRevenueType(revenueTypes.Oil[type], props.year);
		revenueTypeValues.Gas = getYearValueForCommodityRevenueType(revenueTypes.Gas[type], props.year);
		revenueTypeValues.NGL = getYearValueForCommodityRevenueType(revenueTypes.NGL[type], props.year);
		revenueTypeValues.OilShale = getYearValueForCommodityRevenueType(revenueTypes['Oil Shale'][type], props.year);

		revenueTypeValues.Sum = revenueTypeValues.OilGas +
							revenueTypeValues.Oil +
							revenueTypeValues.Gas +
							revenueTypeValues.NGL +
							revenueTypeValues.OilShale;

		return revenueTypeValues;
	}

	function getOffshoreHtml(){
		return (	
			<tr>
				<th className="table-arrow_box-subcategory">Offshore</th>
				<td>
					<strong>Bonus:</strong> The amount offered by the highest bidder
				</td>
				<td>
					<strong>$7</strong> or <strong>$11</strong> annual rent per acre, increasing over time up to <strong>$44</strong> per acre in some cases
				</td>
				<td>
					<strong>12.5%</strong>, <strong>16.67%</strong>, or
					<strong>18.75%</strong> of production value
				</td>
				<td></td>
			</tr>);
	}	

	function getOnshoreHtml(){
		return (	
			<tr>
				<th className="table-arrow_box-subcategory">Onshore</th>
				<td>
					<strong>Bonus:</strong> The amount offered by the highest bidder
				</td>
				<td>
					<strong>$1.50</strong> annual rent per acre for 5 years<br/>
					<strong>$2</strong> annual rent per acre thereafter
				</td>
				<td>
					<strong>12.5%</strong> of production value
				</td>
				<td></td>
			</tr>);
	}


    return (
		<table id={props.id} is="bar-chart-table" class="revenue table-arrow_box">
			<thead>
				<tr>
					<th className="arrow_box"><span>Commodity</span></th>
					<th className="arrow_box"><span>1. Securing rights</span>Companies pay bonuses or other fees to secure rights to resources on federal land</th>
					<th className="arrow_box"><span>2. Before production</span>Companies pay rent on federal land while exploring for resources</th>
					<th className="arrow_box-last"><span>3. During production</span>Companies pay royalties after production begins</th>
					<th><span>Other revenue</span>Minimum or estimated royalties, settlements, and interest payments</th>
				</tr>
			</thead>

			{oilGasExists &&
				<tbody id={"revenue-types-"+Utils.formatToSlug('oil gas')}>
					<tr className="table-arrow_box-category">
						<td colSpan="5">
							Oil and Gas
							<OilGasIcon />
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
				<tbody id={"revenue-types-"+Utils.formatToSlug('Coal')}>
				    <tr className="table-arrow_box-category">
				    	<td colSpan="5">
					        Coal
					        <CoalIcon />
				      	</td>
				    </tr>
				    <RevenueTypeTableRow commodityName='Coal' commodityData={revenueTypes['Coal']} year={props.year} />
		            <tr>
		              <th></th>
		              <td>
		                <strong>Bonus:</strong> The amount offered by the highest bidder
		              </td>
		              <td>
		                <strong>$3</strong> annual rent per acre
		              </td>
		              <td>
		                <strong>Surface mining:</strong> 12.5% of production value + $0.28 per ton in AML fees<br/>
		                <strong>Subsurface mining:</strong> 8% of production value + $0.12 per ton in AML fees
		              </td>
		              <td></td>
		            </tr>
				</tbody>
			}	
			{geothermalExists &&
				<tbody id={"revenue-types-"+Utils.formatToSlug('Geothermal')}>
				    <tr className="table-arrow_box-category">
				    	<td colSpan="5">
					        Geothermal
					        <GeothermalIcon />
				      	</td>
				    </tr>
				    <RevenueTypeTableRow commodityName='Geothermal' commodityData={revenueTypes['Geothermal']} year={props.year} />
		            <tr>
		              <th className="table-arrow_box-subcategory">Competitive leasing</th>
		              <td>
		                <strong>Nomination fee:</strong> $110 per nomination + $0.11 per acre<br/>
		                <strong>Bonus:</strong> The amount offered by the highest bidder<br/>
		                <strong>$160</strong> processing fee
		              </td>
		              <td>
		                <strong>$2</strong> per acre for the first year<br/>
		                <strong>$3</strong> annual rent per acre for years 2-10<br/>
		                <strong>$5</strong> annual rent per acre thereafter
		              </td>
		              <td rowSpan="2">
		                <strong>Electricity sales:</strong> 1.75% of gross proceeds for 10 years, then 3.5%<br/>
		                <strong>Arm’s length sales:</strong> 10% of gross proceeds from contract multiplied by lease royalty rate<br/>
		                <Link to="/downloads/federal-revenue-by-location/#note-geothermal-rate-details">More about geothermal rates</Link>
		              </td>
		              <td></td>
		            </tr>
		            <tr>
		              <th className="table-arrow_box-subcategory">Noncompetitive leasing</th>
		              <td><strong>Lease:</strong> $410 payment
		              </td>
		              <td><strong>$1</strong> annual rent per acre for 10 years<br/> <strong>$5</strong> annual rent per acre thereafter
		              </td>
		              <td></td>
		            </tr>
				</tbody>
			}	
			{windExists &&
				<tbody id={"revenue-types-"+Utils.formatToSlug('Wind')}>
				    <tr className="table-arrow_box-category">
				    	<td colSpan="5">
					        Offshore renewable energy
					        <RenewablesIcon />
				      	</td>
				    </tr>
				    <RevenueTypeTableRow commodityName='Wind' commodityData={revenueTypes['Wind']} year={props.year} />
		            <tr>
		              <th className="table-arrow_box-subcategory">Competitive leasing</th>
		              <td>
		                <strong>Bonus:</strong> The amount offered by the highest bidder
		              </td>
		              <td rowSpan="2">
		                <strong>$3</strong> annual rent per acre<br/>
		              </td>
		              <td rowSpan="2">
		                <strong>2%</strong> of anticipated value of wind energy produced (unless otherwise specified)
		              </td>
		              <td></td>
		            </tr>
		            <tr>
		              <th className="table-arrow_box-subcategory">Noncompetitive leasing</th>
		              <td>
		                <strong>Acquisition fee:</strong> $0.25 per acre
		              </td>
		              <td></td>
		            </tr>
				</tbody>
			}
			{otherProductExists &&
				<tbody id={"revenue-types-"+Utils.formatToSlug('Other Products')}>
				    <tr className="table-arrow_box-category">
				    	<td colSpan="5">
					        Other products
				      	</td>
				    </tr>
					<tr>
						<th className="table-arrow_box-subcategory">Hardrock Acquired lands</th>
					<td>
						<strong>$6,500</strong> prospecting permit fee
					</td>
					<td>
						<strong>$37</strong> annual rent per acre + <strong>$0.50</strong> annual prospecting fee per acre
					</td>
					<td>
						Royalty rates are determined by leasing officers on an individual case basis (no minimums apply)
					</td>
					<td></td>
					</tr>
				</tbody>
			}
			{allExists &&
				<tbody id={"revenue-types-"+Utils.formatToSlug('all')}>
				    <tr className="table-arrow_box-category">
				    	<td colSpan="5">
					        All commodities
					        { oilGasExists &&  <OilGasIcon /> }
					        { coalExists &&  <CoalIcon /> }
					        { geothermalExists && <GeothermalIcon /> }
					        { windExists && <RenewablesIcon /> }
				      	</td>
				    </tr>
				    <RevenueTypeTableRow isNationalPage={props.isNationalPage} commodityName='All' commodityData={revenueTypes['All']} year={props.year} />
				</tbody>
			}	
			{ !props.isOffshorePage &&
				<tbody>
					<tr className="table-arrow_box-category">
						<td colSpan="5">Other revenue streams</td>
					</tr>
					<tr>
						<th>Hardrock mining on public domain lands</th>
						<td colSpan="5">
						  Federal revenue from hardrock mining on public domain land occurs through the claim-staking process and is managed by the Bureau of Land Management (BLM). It is not included here, because the dataset does not have state-level data. Learn more about <Link to="/how-it-works/minerals/">hardrock mining on federal land</Link>.
						</td>
					</tr>
					<tr>
						<th>Onshore solar and wind energy</th>
						<td colSpan="5">
						  Federal revenue from onshore renewable energy generation on federal land is not included here, because that dataset, from BLM, does not have state-level data. Learn more about <Link to="/how-it-works/onshore-renewables/">onshore renewables on federal land</Link>.
						</td>
					</tr>
					<tr>
						<td>
						</td>
						<td colSpan="5">
						  To see how much was collected nationwide for all revenue types, including BLM revenues, see <Link to="/how-it-works/federal-revenue-by-company/">federal revenue by company</Link>.
						</td>
					</tr>
				</tbody>
			}

		 </table>
    );
};

export default RevenueProcessTable;