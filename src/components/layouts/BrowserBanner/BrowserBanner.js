import React from 'react'

import styles from './BrowserBanner.module.scss'
import AlertIcon from './img/svg/icon-alert.svg'

const BrowserBanner = () => (
  <section className={styles.root}>
    <span>
      <AlertIcon className={styles.alertImage} /> We try to make this website work for everyone, but some older web browsers don’t display every feature on this site. 

       If it looks like something isn't working as it should, try using a different browser, such as Chrome, Edge, or Firefox.
    </span>
  </section>
)

export default BrowserBanner
