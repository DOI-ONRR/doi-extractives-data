import React from 'react';

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

const RevenueTypeTable = (props) => {
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



    return (
		<table id={props.id} is="bar-chart-table" class="revenue table-arrow_box">
			<thead>
				<tr>
					<th className="arrow_box"><span>Commodity</span></th>
					<th className="arrow_box"><span>1. Securing rights</span></th>
					<th className="arrow_box"><span>2. Before production</span></th>
					<th className="arrow_box-last"><span>3. During production</span></th>
					<th><span>Other revenue</span></th>
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

			{coalExists &&
				<tbody id={"revenue-types-"+Utils.formatToSlug('Coal')}>
				    <tr className="table-arrow_box-category">
				    	<td colSpan="5">
					        Coal
					        <CoalIcon />
				      	</td>
				    </tr>
				    <RevenueTypeTableRow commodityName='Coal' commodityData={revenueTypes['Coal']} year={props.year} />
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
				</tbody>
			}
			{otherProductExists &&
				<tbody id={"revenue-types-"+Utils.formatToSlug('Other Products')}>
				    <tr className="table-arrow_box-category">
				    	<td colSpan="5">
					        Other products
				      	</td>
				    </tr>
				    {
				    	Lazy(revenueTypes).toArray().map((commodity, index) => {
				    		let commodityName = commodity[0];
				    		let commodityValues = commodity[1];
				    		if(Lazy(otherProductCommodities).contains(commodityName) && commodityValues.All[props.year]) {
				    			return (<RevenueTypeTableRow key={index} commodityName={commodityName} commodityData={commodityValues} year={props.year} />);
				    		}
				    	})
				    }
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

		 </table>
    );
};

export default RevenueTypeTable;