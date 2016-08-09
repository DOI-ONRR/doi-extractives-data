import React, { Component, PropTypes } from 'react';

import localize from './localize';
import { slugify } from './utils';
import {
	getRevenue,
	revenueTypes
} from './revenue-table-helpers';

import FilledBar from './filled-bar';

export const CommodityRevenueRow = props => {
	const {
		asCurrency,
		title,
		type,
		data,
		maxRevenue
	} = props;

	return (
		<tr key={ `revenue-type-${ slugify( type ) }` }>
			<th scope="row">
				<a href={ `#revenue-${ slugify( title ) }` }>
					<strong>{ type }</strong>
				</a><br />
				<strong>{ asCurrency( getRevenue( 'All', data ) ) }</strong>
			</th>
			{ revenueTypes.map( type => (
				<td key={ `revenue-type-type-${ slugify( type ) }` } >
					<span className="text">
						<FilledBar
							height={ 15 }
							width={ 122 }
							values={ [ getRevenue( type, data ) ] }
							maxValue={ maxRevenue }
						/><br />
						{ asCurrency( getRevenue( type, data ) ) }
					</span>
				</td>
			) ) }
		</tr>
	);
};

export default localize( CommodityRevenueRow );
