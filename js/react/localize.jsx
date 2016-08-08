import React, { Component, PropTypes } from 'react';

export const asCurrency = n => n.toLocaleString( 'en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: ( Math.abs( n ) >= 100 ) ? 0 : 2
} );

export const Localize = Wrapped => class extends Component {
	render() {
		return <Wrapped { ...this.props } { ...{ asCurrency } } />;
	}
};

Localize.displayName = 'Localize';

Localize.propTypes = {
	children: PropTypes.element.isRequired
};

export default Localize;
