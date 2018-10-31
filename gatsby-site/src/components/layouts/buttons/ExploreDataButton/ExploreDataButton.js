import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../../utils/temp-link';

import styles from "./ExploreDataButton.module.css"

import ExploreDataIcon from '-!svg-react-loader!../../../../img/icons/explore-data.svg';

const ExploreDataButton = (props) => ( 
    <Link to={props.to} className={styles.root}>
        <div><ExploreDataIcon /></div>
        <div>
        	{props.children === undefined ?
            'Explore the data' :
            props.children}
        </div>
    </Link>
);

ExploreDataButton.propTypes = {
	/** The url for the link */
	to: PropTypes.string,
}

export default ExploreDataButton;