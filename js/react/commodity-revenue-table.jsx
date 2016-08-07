import React, { Component } from 'react';
import {
	has,
	pathOr
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


export class CommodityRevenueTable extends Component {
	render() {
		const {
			asCurrency,
			title,
			icons,
			data,
			year
		} = this.props;

		const getRevenue = ( category, year ) => pathOr( 0, [ category, year ], data );

		const iconClasses = icons
			.concat( 'padded' )
			.map( icon => `icon-${ icon }` )
			.join( ' ' );

		return (
			<tbody id={ `revenue-${ slugify( title ) }` }>
				<tr className="table-arrow_box-category">
					<td colSpan="5">
						{ title + ' ' }
						<icon className={ iconClasses } />
					</td>
				</tr>
				<tr>
					<th scope="row">
						<a href={ `#revenue-${ slugify( title ) }` }>
							<strong>{ title }</strong>
						</a><br />
						<strong>{ asCurrency( getRevenue( 'All', year ) ) }</strong>
					</th>
					{ revenueTypes
						.map( type => (
							<td key={ `revenue-type-${ slugify( type ) }` } >
								<span className="text">
									<FilledBar
										height={ 15 }
										width={ 122 }
										value={ getRevenue( type, year ) }
										maxValue={ getRevenue( 'All', year ) }
									/><br />
									{ asCurrency( getRevenue( type, year ) ) }
								</span>
							</td>
						) )
					}
				</tr>
			</tbody>
		);
	}
}

export default localize( CommodityRevenueTable );
