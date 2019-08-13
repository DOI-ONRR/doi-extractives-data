import React, { useEffect, useRef }  from 'react'

import * as d3 from 'd3'
import utils from '../../../js/utils'
import styles from './Explore.module.scss'


/**
* DisbursmentTrends - react functional component that generates revenue trends graph
*
* uses hook useStaticQuery and graphl to get revenu data then 
* summarizes data for graphical representation
*/

const Explore = (props) => {
    
      return (
        <section className={styles.root}>
	  <div className={styles.contentHeader}>
	    <h3 className={styles.title+" h3-bar"}>Explore {props.title}</h3>
	    <span className={styles.info}>
	      {props.info}
	    </span>
	  </div>
	  <div className={styles.contentLeft}>
	    {props.contentLeft}
	  </div>
	  <div className={styles.contentCenter}>
	    {props.contentCenter}
	  </div>
	  <div className={styles.contentRight}>
	    {props.contentRight}
	  </div>
	  <div className={styles.contentChildren}>
	    {props.children}
	  </div>

        </section>
      )

}

/*              <tr>
                <td><strong>Total revenues</strong></td>
                <td className={styles.alignRight}><strong>{utils.formatToSigFig_Dollar(123212, 3)}</strong></td>
              </tr>
              <tr>
                <td><Sparkline data={totalDisbursements} /></td>
                <td className={styles.alignRight}>
                  <PercentDifference 
                    currentAmount={currentYearTotal} 
                    previousAmount={previousYearTotal} 
                  />{' '+previousFiscalYearText}</td>
              </tr>
*/


export default Explore

