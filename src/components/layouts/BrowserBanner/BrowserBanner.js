import React from 'react'

import styles from './BrowserBanner.module.scss'

const BrowserBanner = () => (
  <section className={styles.root}>
    <span>
      <p>>We try to make this website work for everyone, but some older web browsers don’t display every feature on this site.</p> 

       <p>If it looks like something isn't working as it should, try using a different browser, such as Chrome, Edge, or Firefox.</p>
    </span>
  </section>
)

export default BrowserBanner
