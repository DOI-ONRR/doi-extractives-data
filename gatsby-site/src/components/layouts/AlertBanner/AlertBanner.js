import React from 'react';

import styles from "./AlertBanner.module.css";
import AlertIcon from '-!svg-react-loader!../../../img/svg/icon-alert.svg';

const AlertBanner = () => (
  <section className={styles.root}>
    <span><AlertIcon className={styles.alertImage} /> Due to the government shutdown, we're unable to update this site. We will resume work on the site when the shutdown ends.</span>
  </section>
);

export default AlertBanner;
