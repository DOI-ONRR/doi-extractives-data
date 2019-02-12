import React from 'react';

import styles from "./AlertBanner.module.css";
import alert from "../../../img/icons/icon-alert.svg";

const AlertBanner = () => (
  <section className={styles.root}>
    <span><img className={styles.alertImage} src={alert} /> Due to the government shutdown, we are not able to update this site. We will resume work on the site when the shutdown ends.</span>
  </section>
);

export default AlertBanner;
