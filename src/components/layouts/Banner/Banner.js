import React from 'react'

import styles from './Banner.module.scss'
import logo from '../../../img/us-flag-small.png'

const Banner = () => (
  <section className={styles.root}>
    <span>
      <img
        className={styles.bannerImage}
        src={logo} alt="U.S. flag signifying that this is a United States Federal Government website" /> An official website of the U.S. government</span>
  </section>
)

export default Banner
