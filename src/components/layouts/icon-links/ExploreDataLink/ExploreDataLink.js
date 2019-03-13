import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../../utils/temp-link';

import styles from "./ExploreDataLink.module.css"

import ExploreDataIcon from '-!svg-react-loader!../../../../img/icons/explore-data.svg';

const ExploreDataLink = (props) => ( 
    <Link to={props.to} className={styles.exploreDataLink}>
        <ExploreDataIcon />
        <span>
        	{props.children === undefined ?
            'Explore data' :
            props.children}
        </span>
    </Link>
);

ExploreDataLink.propTypes = {
	/** The url for the link */
	to: PropTypes.string,
}

export default ExploreDataLink;