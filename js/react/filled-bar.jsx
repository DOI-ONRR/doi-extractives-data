import React, { Component, PropTypes } from 'react';

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
			value,
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

		if ( 0 === value ) {
			return;
		}

		const barWidth = Math.max( 1, width * ( Math.abs( value ) / ( maxValue + Number.EPSILON ) ) );

		if ( value > 0 ) {
			ctx.fillStyle = fillColor;
			ctx.fillRect( 0, 0, barWidth, height );
		} else {
			ctx.fillStyle = '#c00';
			ctx.fillRect( width - barWidth, 0, width - barWidth, height );
		}
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
	value: PropTypes.number.isRequired,
	maxValue: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired
};

FilledBar.defaultProps = {
	backColor: '#ebebeb',
	fillColor: '#2e4e24'
};

export default FilledBar;
