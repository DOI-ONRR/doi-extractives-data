import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../utils/temp-link';

import GlossaryTerm from '../../utils/glossary-term.js';

import styles from "./ArchiveBanner.module.scss";
import DataArchiveIcon from '-!svg-react-loader!../../../img/svg/icon-archive.svg';

const ArchiveBanner = () => (
	<div className={styles.root}>
		<p className={styles.content}><DataArchiveIcon/> This content was created as part of the <GlossaryTerm termKey="EITI Standard">USEITI</GlossaryTerm> and is no longer being updated. <Link to="/about/#history">Learn more about USEITI.</Link></p>
	</div>
);

export default ArchiveBanner;