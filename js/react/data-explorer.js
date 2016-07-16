'use strict';

var React = require( 'react' );

var TableRow = require( './table-row.js' );

var processTSV = function( callback ) {
	return function() {
		if ( 200 !== this.status ) {
			return;
		}

		var data = this
			.responseText
			.split( "\n" )
			.map( function( row ) { return row.split( "\t" ) } );

		var header = data.shift();

		return callback(
			data.map( function( rowData ) {
				return header.reduce( function( row, column, index ) {
					row[ column ] = rowData[ index ];

					return row;
				}, {} )
			} )
		);
	};
};

var loadData = function( url, callback ) {
	var xhr = new XMLHttpRequest();

	xhr.addEventListener( 'load', processTSV( callback ) );
	xhr.open( 'GET', url );
	xhr.send();
};

var dollarSorter = function( a, b ) {
	return parseInt( b.Value, 10 ) - parseInt( a.Value, 10 );
};

var percentSorter = function( a, b ) {
	return parseFloat( b.Share ) - parseFloat( a.Share );
};

var sorters = {
	'dollars': dollarSorter,
	'percent': percentSorter
};

var DataExplorer = React.createClass( {
	getInitialState: function() {
		return {
			data: []
		};
	},

	componentDidMount: function() {
		loadData( this.props.dataUrl, this.saveData );
	},

	saveData: function( data ) {
		this.setState( { data: data } );
	},

	render: function() {
		var year = this.props.selectedYear;
		var data = this
			.state
			.data
			.filter( function( row ) {
				return year === parseInt( row.Year, 10 );
			} )
			.sort( sorters[ this.props.selectedUnits ] );

		return React.createElement( 'div', {}, [
			React.createElement( 'table', {},
				React.createElement( 'tbody', {},
					data.map( function( row ) {
						return React.createElement( TableRow, row );
					} )
				)
			)
		] );
	}
} );

DataExplorer.displayName = 'DataExplorer';

DataExplorer.propTypes = {
	dataUrl: React.PropTypes.string.isRequired,
	selectedYear: React.PropTypes.number.isRequired
};

module.exports = DataExplorer;
