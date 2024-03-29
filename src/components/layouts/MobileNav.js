import React from 'react'

import { StickyWrapper } from '../utils/StickyWrapper'

const MobileNav = props => (
  <StickyWrapper innerZ="20000">
    <div>
      <div id="top" aria-label="anchor for mobile navigation" className="mobile-nav-anchor"></div>
      <div is="mobile-nav" class="mobile-nav">
			  <button is="aria-toggle"
			    aria-controls="mobile-nav-content"
			    aria-expanded="false">
			      <div className="flex-row">
			        <h3 className="mobile-nav-header flex-row-flex">{props.navTitle}</h3>
			        <span className="hide-expanded flex-row-icon">
			          <div className="icon icon-chevron-sm-down"></div>
			        </span>
			        <span className="show-expanded flex-row-icon">
			          <div className="icon icon-chevron-sm-up"></div>
			        </span>
			      </div>
			  </button>
			  <div id="mobile-nav-content" className="mobile-nav-list-items" aria-hidden="true">
			    <ul>
            {props.navItems &&
							props.navItems.map((navItem, index) => {
							  return (
							    <li key={index}>
							      {navItem.mobileName === 'top'
							        ? <a key={index + '_navitem'} href='#' className='mobile-nav-list-item'>{navItem.title}</a>
							        : <a key={index + '_navitem'} href={'#' + navItem.name} className='mobile-nav-list-item'>{navItem.title}</a>
							      }
							      {navItem.subNavItems &&
											<ul key={index + '_subnavitem'}>
											  {navItem.subNavItems.map((subNavItem, index) => {
											    return (<a key={index} className="mobile-nav-sublist-item"
											      data-mobile-nav-item={ subNavItem.name }
											      href={'#' + subNavItem.name}>{ subNavItem.title }</a>)
											  })
											  }
											</ul>
							      }
							    </li>
							  )
							})
            }
			    </ul>
			  </div>
      </div>
	  </div>
  </StickyWrapper>
)

export default MobileNav
