import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import utils from '../../../js/utils';

import styles from "./PageToc.module.scss"


import {StickyWrapper} from '../../utils/StickyWrapper';

const tocSubAttr = 'data-toc-sub';

/**
 * This component assumes a single main tag for the page and a single h1 element (which is the title for the menu).
 * The table of contents will be built with h2 and nested h3 elements.
 */
class PageToc extends React.Component {

	state = {
		displayTitle: this.props.displayTitle
	}

	isScrolling

	componentDidMount() {
		this.createToc();
	}

	/* Get the on scroll nav list after updating the component. */
	componentDidUpdate() {
		let tocLinks = document.querySelectorAll("#page-toc-nav ul li a");

		if(tocLinks) {
			// Listen for scroll events
			window.addEventListener('scroll', this.stopScrolling.bind(this, tocLinks), false);		
		}
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.stopScrolling.bind(this, tocLinks) );
	}

	stopScrolling(tocLinks) {
		// Clear our timeout throughout the scroll
		window.clearTimeout(this.isScrolling);

		// Set a timeout to run after scrolling ends
		this.isScrolling = setTimeout(function() {
			// Run the callback
			this.handleScroll(tocLinks);

			}.bind(this), 66);
	
	}

	handleScroll(tocLinks) {
	  let fromTop = window.scrollY;

	  tocLinks.forEach( (link, index)  => {
	    let section = document.querySelector((link.hash || 'body'));
	    // You can add an offset number to a element to have the toc menu item activate earlier/later
	    let dataTocOffset = parseInt(section.getAttribute('data-toc-offset')) || 0;

	    if( (section.offsetTop-this.props.scrollOffset-dataTocOffset ) <= fromTop ) {

	    	if(link.getAttribute('data-toc-type') === 'sub') {
	    		let oldCurrent = document.querySelector(("."+styles.tocSubItemActive));
		    	if(oldCurrent){
		    		oldCurrent.classList.remove(styles.tocSubItemActive);
		    	}
	    		link.parentNode.classList.add(styles.tocSubItemActive);
	    	}
	    	else {
	    		let oldSubCurrent = document.querySelector(("."+styles.tocSubItemActive));
		    	if(oldSubCurrent){
		    		oldSubCurrent.classList.remove(styles.tocSubItemActive);
		    	}
		    	let oldCurrent = document.querySelector(("."+styles.tocItemActive));
		    	if(oldCurrent){
		    		oldCurrent.classList.remove(styles.tocItemActive);
		    	}
		      link.parentNode.classList.add(styles.tocItemActive);
	    	}

	    } 
	  });

	}

	createToc() {
		let mainElem = document.getElementsByTagName('main');
		let tocState = {
			displayTitle: this.state.displayTitle,
		};

		if(tocState.displayTitle === undefined && this.props.shouldDisplayTitle) {
			let h1Elem = mainElem && mainElem[0].querySelector('h1')
			tocState.displayTitle = h1Elem && h1Elem.innerText;
		}

		let allTocElems = mainElem && Array.from(mainElem[0].querySelectorAll('h2,h3'));

		let excludeClassNames = ( typeof this.props.excludeClassNames === "string")? this.props.excludeClassNames.split(',') : this.props.excludeClassNames;

		tocState.tocItems = elementArrayToTocArray(allTocElems, excludeClassNames);

		this.setState({...tocState});
	}

	render() {

		return (
			<div>
				<StickyWrapper bottomBoundary={this.props.bottomBoundary} >
					<div className={styles.root}>
						{this.state.displayTitle &&
							<h3 className={styles.displayTitle}>{this.state.displayTitle}</h3>
						}
						{this.state.tocItems &&
							<nav id="page-toc-nav">
								<ul className={styles.toc}>
									<li className={styles.tocItem}><a className={"test "+styles.tocItemActive} href="#">Top</a></li>
									{ 
										this.state.tocItems.map((tocItem, index) => {
											return (
												<li className={styles.tocItem} key={tocItem.id+"-toc-item"}>
													<a href={"#"+tocItem.id}>{ (tocItem.getAttribute('alt') || tocItem.innerText) }</a>
													{tocItem[tocSubAttr] &&
														<ul className={styles.tocSub}>
															{
																tocItem[tocSubAttr].map((tocSubItem, subIndex) => {
																	return (
																		<li className={styles.tocSubItem} key={tocSubItem.id+"-toc-sub-item"}>
																			<a data-toc-type="sub" href={"#"+tocSubItem.id}>{ (tocSubItem.getAttribute('alt') || tocSubItem.innerText) }</a>
																		</li>
																	);
																})
															}
														</ul>
													}
												</li>
											);
										})
									}
								</ul>
							</nav>
						}
					</div>
				</StickyWrapper>
			</div>
		);
	}
}

PageToc.propTypes = {
	/** Can pass a default title or it will be resolved by the H1 tag **/
	displayTitle: PropTypes.string,
	/** Can hide title if not needed **/
	shouldDisplayTitle: PropTypes.bool,
	/** This is the query string of the element for the toc to scroll within **/
	bottomBoundary: PropTypes.string,
	/** Adjust wehn the menu item becomes active when scrolling **/
	scrollOffset: PropTypes.number,
	/** An array of all class names to not use in the toc **/
	excludeClassNames:  PropTypes.oneOfType([PropTypes.string,PropTypes.array]),
}

PageToc.defaultProps = {
	bottomBoundary: 'main',
	shouldDisplayTitle: false,
	scrollOffset: 100,
}

export default PageToc;

const elementArrayToTocArray = (elems, excludeClassNames) => {

	const createTocItem = (elem) => {
		elem.id = elem.id || utils.formatToSlug(elem.innerText);
	}

	const addChild = (elem, parent) => {
		parent[tocSubAttr] = parent[tocSubAttr] || [];
		createTocItem(elem);
		parent[tocSubAttr].push(elem);
	}

	let filteredElems = elems;

	if(excludeClassNames) {
		excludeClassNames.forEach((className) => {
			filteredElems = filteredElems.filter(elem => !elem.classList.contains(className));
		});
	}

	let toc = filteredElems && [];

	let currentTocItem = filteredElems[0];

	filteredElems.map((elem) => {
		if(parseInt(elem.tagName.slice(-1)) > parseInt(currentTocItem.tagName.slice(-1))){
			addChild(elem, currentTocItem);
		}
		else {
			createTocItem(elem);
			currentTocItem = elem;

			toc.push(elem);
		}
	});

	return toc;
}



