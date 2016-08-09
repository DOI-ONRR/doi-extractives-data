import React, { Component } from 'react';
import {
	map,
	max
} from 'ramda';

import { slugify } from './utils';

import CommodityRow from './commodity-revenue-row';

export const CommodityRevenueTable = props => {
	const {
		title,
		icons,
		data,
		maxRevenue
	} = props;

	return (
		<tbody id={ `revenue-${ slugify( title ) }` }>
			<tr className="table-arrow_box-category">
				<td colSpan="5">
					{ title }
					{ icons.map( ( className, index ) => (
						<icon
							key={ index }
							className={ `icon-${ className }` }
							style={ { marginLeft: '4px' } }
						/>
					) ) }
				</td>
			</tr>
			{ data.map( ( [ type, typeData ] ) => (
				<CommodityRow { ...{
					title,
					type,
					maxRevenue,
					key: type,
					data: typeData
				} } />
			) ) }
		</tbody>
	);
};

export default CommodityRevenueTable;
