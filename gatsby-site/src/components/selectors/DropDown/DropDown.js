import React from 'react';
import PropTypes from 'prop-types';

import styles from "./DropDown.module.css"

const DropDown = (props) => {

  const onChangeHandler = (e, key) => {
    e.stopPropagation();
    if(props.action) {
        props.action(e.currentTarget.value);
    }
  }

	return (
		<div className={styles.root}>
			<select onChange={onChangeHandler}>
				{props.options &&
					props.options.map((option, index) => {
						return (			
							<option className={styles.option} key={index} value={option.key} selected={option.default}>
								{option.name}
							</option>
						);
					})
				}
			</select>
		</div>
	);
}

DropDown.propTypes = {
	/** Array of objects for all the buttons. The default selected vlaue should be mark as default: true */
	buttons: PropTypes.array,
	/** This action will be called when a toggle is clicked. */
	toggleAction: PropTypes.func
}

export default DropDown;
