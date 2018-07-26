import React from 'react';

import lazy from 'lazy.js';

const NavList = (props) => (
	<ul style={{ 'listStyleType': 'none'}}>
		{props.navItems &&

			props.navItems.map((navItem, index) => {
    			return (
    				<li key={index}>
    				 	{navItem.title === "Top" ?
    						<a key={index+"_navitem"} href='#' className='sticky_nav-nav_item' data-nav-item={navItem.name} data-active="true">{navItem.title}</a>
    						:
    						<a key={index+"_navitem"} href={'#'+navItem.name} className='sticky_nav-nav_item' data-nav-item={navItem.name} data-active="true">{navItem.title}</a>
    					}
    					{navItem.subNavItems &&
			              <ul key={index+"_subnavitem"}>
			                {navItem.subNavItems.map((subNavItem, index) => {
			                    return (<a key={index} className="sticky_nav-nav_item sticky_nav-nav_item-sub" 
			                    	data-nav-item={ subNavItem.name } 
			                    	href={"#"+subNavItem.name}>{ subNavItem.title }</a>);
			                    })
			                }
			              </ul>
    					}
    				</li>
    			);
    		})
		}
	</ul>
)

export default NavList;