import React, { Component, PropTypes } from 'react';
import Color from 'color';
import {
	last,
	sort
} from 'ramda';

const stepColor = ( color, step ) =>
	Color( color )
		.lighten( 0.5 * step )
		.desaturate( 0.5 * step )
		.hexString();

export class FilledBar extends Component {
	constructor( props ) {
		super( props );

		this.draw = this.draw.bind( this );
	}

	componentDidMount() {
		this.draw();
	}

	componentDidUpdate() {
		this.draw();
	}

	draw() {
		const {
			backColor,
			fillColor,
			negativeFillColor,
			values,
			maxValue,
			height,
			width
		} = this.props;

		if ( ! this.canvas || ! this.canvas.getContext ) {
			return;
		}

		const ctx = this.canvas.getContext('2d');

		ctx.fillStyle = backColor;
		ctx.fillRect( 0, 0, width, height );

		sort( (a, b) => b - a, values )
			.reduce( (t, c) => {
				const [ , prevWidth, offset ] = last( t ) || [ 0, 0, 0 ];
				const barWidth = Math.max( 1, width * ( Math.abs( c ) / ( maxValue + Number.EPSILON ) ) );

				return [ ...t, [ c, barWidth, offset + prevWidth ] ];
			}, [] )
			.filter( ( [ value, , ] ) => 0 !== value )
			.forEach( ( [ value, barWidth, offset ], step ) => {
				if ( value > 0 ) {
					ctx.fillStyle = stepColor( fillColor, step );
					ctx.fillRect( offset + step, 0, barWidth, height );
				} else {
					ctx.fillStyle = stepColor( negativeFillColor, step );
					ctx.fillRect( offset - step + width - barWidth, 0, barWidth, height );
				}
			} );
	}

	render() {
		const {
			height,
			width
		} = this.props;

		return (
			<canvas
				ref={ r => this.canvas = r }
				height={ height }
				width={ width }
			/>
		);
	}
}

FilledBar.displayName = 'FilledBar';

FilledBar.propTypes = {
	backColor: PropTypes.string,
	fillColor: PropTypes.string,
	negativeFillColor: PropTypes.string,
	values: PropTypes.arrayOf( PropTypes.number ).isRequired,
	maxValue: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired
};

FilledBar.defaultProps = {
	backColor: '#ebebeb',
	fillColor: '#2e4e24',
	negativeFillColor: '#c00'
};

export default FilledBar;
