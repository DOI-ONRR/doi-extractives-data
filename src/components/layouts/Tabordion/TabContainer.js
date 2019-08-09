import React, { useEffect, useRef }  from 'react'
import ReactDOM from 'react-dom'
import  styles from './TabContainer.module.scss'
const TabContainer = (props) => {

    
    return (
	    <section className={styles.root}>
	      <div className={styles.contentTop}>
		<h3 className={styles.title}>
		  {props.title}
		</h3>					      
		<span className={styles.info}>
		  {props.info}
		</span>
	      </div>
	      <div className={styles.contentLeft}>
		{props.contentLeft}
	      </div>
	      <div className={styles.contentRight}>
		{props.contentRight}
	      </div>
	      <div className={styles.contentChildren}>
		{props.children}
	      </div> 
	      <div className={styles.contentBottom}>
		{props.contentBottom}
	      </div>
	    </section>
    )

    
    
}

export default TabContainer
