'use strict';

var React = require( 'react' );

var asDollars = function( value ) {
	var pieces = [ 'k', 'm', 'b', 't' ].reduce( function( total, unit ) {
		return ( total[0] / 1000 ) > 1
			? [ total[0] / 1000, unit ]
			: [ total[0], total[1] ];
	}, [ parseInt( value, 10 ), '' ] );

	return '$' + Math.round( pieces[0] ) + pieces[1];
};

var TableRow = React.createClass( {
	render: function() {
		var dollars = asDollars( this.props.Value );
		var percent = Math.round( this.props.Share * 100 ) + '%';
		var state = eiti.data.REGION_ID_NAME[ this.props.Region ];

		return React.createElement( 'tr', { key: this.props.Region }, [
			React.createElement( 'td', { key: 'Region' }, state ),
			React.createElement( 'td', { key: 'Value' }, dollars ),
			React.createElement( 'td', { key: 'Share' }, percent )
		] );
	}
} );

TableRow.displayName = 'TableRow';

TableRow.PropTypes = {
	Region: React.PropTypes.string.isRequired,
	Share: React.PropTypes.number.isRequired,
	Total: React.PropTypes.number.isRequired,
	Value: React.PropTypes.number.isRequired,
	Year: React.PropTypes.number.isRequired
};

module.exports = TableRow;
