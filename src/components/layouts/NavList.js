import React from 'react'

import lazy from 'lazy.js'

const NavList = props => {
  let navItems = (typeof props.navItems === 'string') ? JSON.parse(props.navItems) : props.navItems
  return (
    <ul style={{ 'listStyleType': 'none' }}>
      {navItems &&

				navItems.map((navItem, index) => {
	    			return (
	    				<li key={index} style={{ 'paddingBottom': '0px' }}>
	    				 	{navItem.title === 'Top'
	    						? <a key={index + '_navitem'} href='#' className='sticky_nav-nav_item' data-nav-item={navItem.name} data-active="true">{navItem.title}</a>
	    						: <a key={index + '_navitem'} href={'#' + navItem.name} className='sticky_nav-nav_item' data-nav-item={navItem.name} data-active="true">{navItem.title}</a>
	    					}
	    					{navItem.subNavItems &&
				              <ul key={index + '_subnavitem'}>
				                {navItem.subNavItems.map((subNavItem, index) => {
				                    return (<a key={index} className="sticky_nav-nav_item sticky_nav-nav_item-sub"
				                    	data-nav-item={ subNavItem.name }
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
  )
}

export default NavList
