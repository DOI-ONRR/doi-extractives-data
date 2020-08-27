import React from 'react'
import Link from '../../utils/temp-link'

import styles from './ArchiveSiteBanner.module.scss'
import DataArchiveIcon from '-!svg-react-loader!../../../img/svg/icon-archive.svg'

const ArchiveSiteBanner = () => (
  <div className={styles.root}>
    <p className={styles.content}>
      <DataArchiveIcon/> This is an archived version of this website that is no longer being updated. For current data, visit the <Link to="https://revenuedata.doi.gov/">latest version of the site.</Link>
    </p>
  </div>
)

export default ArchiveSiteBanner
