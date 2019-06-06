import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../../utils/temp-link';

import styles from "./DownloadCsvLink.module.scss"

import DownloadCsvIcon from '-!svg-react-loader!../../../../img/svg/icon-download-csv.svg';

const DownloadCsvLink = (props) => ( 
    <Link to={props.to} className={styles.root}>
        <DownloadCsvIcon />
        <span>
        	{props.children === undefined ?
            'Download' :
            props.children}
        </span>
    </Link>
);

DownloadCsvLink.propTypes = {
	/** The url for the link */
	to: PropTypes.string,
}

export default DownloadCsvLink;