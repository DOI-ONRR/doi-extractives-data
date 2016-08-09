import {
	defaultTo
} from 'ramda';

export const slugify = text =>
	defaultTo( '', text )
		.toLowerCase()
		.replace( /\W+/, '_' );
