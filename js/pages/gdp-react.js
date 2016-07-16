var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var DataExplorer = require( '../react/data-explorer.js' );

var pathData = function( location ) {
	var args = location
		.hash
		.split( /[#&]/ )
		.map( function( item ) { return item.split( '=' ); } )
		.filter( function( item ) { return item.length; } )
		.reduce( function( o, item ) { o[ item[0] ] = item[1]; return o; }, {} );

	return Object.assign(
		{
			selectedYear: (new Date()).getFullYear(),
			units: 'dollars'
		},
		args.year && { selectedYear: parseInt( args.year, 10 ) },
		args.units && { selectedUnits: args.units }
	);
};

var render = function() {
	ReactDOM.render(
		React.createElement( DataExplorer, Object.assign( {
			dataUrl: '/data/gdp/regional.tsv',
		}, pathData( document.location ) ) ),
		document.getElementById( 'gdp-react' )
	);
};

render();
window.addEventListener( 'hashchange', render );

