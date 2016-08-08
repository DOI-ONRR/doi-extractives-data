import React, { Component } from 'react';
import {
	has,
	last,
	map,
	max,
	propOr,
	reduce
} from 'ramda';

import localize from './localize';
import { slugify } from './utils';

import FilledBar from './filled-bar';

const revenueTypes = [
	'Bonus',
	'Rents',
	'Royalties',
	'Other Revenues'
];

export const CommodityRevenueTable = props => {
	const {
		asCurrency,
		title,
		icons,
		data,
		maxRevenue
	} = props;

	const getRevenue = ( category, data ) => propOr( 0, category, data );

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
				<tr key={ `revenue-type-${ slugify( type ) }` }>
					<th scope="row">
						<a href={ `#revenue-${ slugify( title ) }` }>
							<strong>{ type }</strong>
						</a><br />
						<strong>{ asCurrency( getRevenue( 'All', typeData ) ) }</strong>
					</th>
					{ revenueTypes.map( type => (
						<td key={ `revenue-type-type-${ slugify( type ) }` } >
							<span className="text">
								<FilledBar
									height={ 15 }
									width={ 122 }
									values={ [ getRevenue( type, typeData ) ] }
									maxValue={ maxRevenue }
								/><br />
								{ asCurrency( getRevenue( type, typeData ) ) }
							</span>
						</td>
					) ) }
				</tr>
			) ) }
		</tbody>
	);
};

export default localize( CommodityRevenueTable );
