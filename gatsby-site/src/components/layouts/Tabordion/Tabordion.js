import React from 'react';
import PropTypes from 'prop-types';

import styles from "./Tabordion.module.css";

class Tabordion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    	tabId: this.props.children && this.props.children[0].props.id,
      tabPanel: this.props.children && this.props.children[0].props.children,
    };
  }

	tabClicked(id, content){
		if(this.state.tabId !== id) {
			this.setState({tabId: id, tabPanel: content});
		}
	}

  render() {
    return (
      <div className={styles.root+" container-page-wrapper"}>
        <div className={styles.tabContainer}>
	        {this.props.children &&
	        	React.Children.map(this.props.children, (child) => {
	        		if(child.type.name === "Tab") {
	        			return <Tab isSelected={(this.state.tabId === child.props.id)} callBack={this.tabClicked.bind(this)} {...child.props} />;
	        		}
	        	})
	        }
        </div>
      	<div className={styles.tabPanelContainer}>
      		{this.state.tabPanel}
      	</div>

      </div>
    );
  }
};

export const Tab = (props) => {
	return (
	  <div id={props.id} className={props.isSelected ? styles.tabSelected : styles.tab} onClick={() => props.callBack(props.id, props.children)}>
	  	{(props.name || "Tabsdss")}
	  </div>
	);
} 

Tab.propTypes = {
	 /** The Id for the element, used to ensure expandable containers have unique Ids. */
  id: PropTypes.string.isRequired,
}

Tabordion.propTypes = {

}

export default Tabordion;
