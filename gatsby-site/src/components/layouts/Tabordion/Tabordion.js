import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import styles from "./Tabordion.module.css";

class Tabordion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    	tabId: this.props.children && this.props.children[0].props.id,
      tabPanel: this.props.children && this.props.children[0].props.children,
    };
  }

	tabClicked(id, content, element){
		if(this.state.tabId !== id) {
			this.setState({tabId: id, tabPanel: content});
		}
	}

  render() {
    return (
    	<div>
      	<MediaQuery minWidth={481}>
	      	<div className={styles.root+" container-page-wrapper"}>
		        <div className={styles.tabContainer}>
			        {this.props.children &&
			        	React.Children.map(this.props.children, (child,index) => {
			        		return <Tab key={index} isSelected={(this.state.tabId === child.props.id)} callBack={this.tabClicked.bind(this)} {...child.props} />;
			        	})
			        }
		        </div>
		      	<div className={styles.tabPanelContainer}>
		      		{this.state.tabPanel}
		      	</div>
		      </div>
	      </MediaQuery>
      	<MediaQuery maxWidth={480}>
	      	<div className={styles.root+" container-page-wrapper"}>
		        <div className={styles.tabContainer}>
			        {this.props.children &&
			        	React.Children.map(this.props.children, (child,index) => {
			        		let isSelected = (this.state.tabId === child.props.id);

			        		if(isSelected) {
			        			return (
			        				<div>
												<Tab key={index} isAccordion={true} isSelected={(this.state.tabId === child.props.id)} callBack={this.tabClicked.bind(this)} {...child.props} />
								      	<div className={styles.tabPanelContainer+" "+styles.accordionPanelContainer}>
								      		{this.state.tabPanel}
								      	</div>
								      </div>
			        			);
			        		}
			        		else {
			        			return <Tab key={index} isAccordion={true} isSelected={(this.state.tabId === child.props.id)} callBack={this.tabClicked.bind(this)} {...child.props} />;
			        		}

			        	})
			        }

		        </div>
		      </div>
	      </MediaQuery>
	    </div>
    );
  }
};

export class Tab extends React.Component {
  componentDidMount() {
  	if(this.props.isSelected && this.props.isAccordion){
  		window.scrollTo(0, this.node.offsetTop-5, {behavior:"smooth"})
  	}
  }

	render() {
		return (
		  <div id={this.props.id} 
		  			ref={node => this.node = node} 
		  			className={this.props.isSelected ? styles.tabSelected+" "+styles.tab : styles.tab} 
		  			onClick={() => this.props.callBack(this.props.id, this.props.children)}>
		  	{(this.props.name || "Tabsdss")}
		  </div>
		);
	}

} 

Tab.propTypes = {
	 /** The Id for the element, used to ensure expandable containers have unique Ids. */
  id: PropTypes.string.isRequired,
}

Tabordion.propTypes = {

}

export default Tabordion;
