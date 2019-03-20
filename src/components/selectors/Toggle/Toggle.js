import React from 'react'
import PropTypes from 'prop-types'
import styles from './Toggle.module.css'

const Toggle = props => {
  const onClickHandler = (e, key) => {
    e.stopPropagation()

    Array.from(e.currentTarget.parentNode.childNodes).forEach(node => node.classList.remove(styles.selected))

    e.currentTarget.classList.add(styles.selected)

    if (props.action) {
      props.action(e.currentTarget.dataset.value)
    }
  }

  return (
    <div className={styles.toggle}>
      {props.buttons &&
				props.buttons.map((button, index) => {
				  let classNames = (button.default) ? styles.selected : ''
				  return (
				    <div key={index} type="button" onClick={onClickHandler} className={classNames} data-value={button.key}>
				      {button.name}
				    </div>
				  )
				})
      }
    </div>
  )
}

Toggle.propTypes = {
  /** Array of objects for all the buttons. The default selected vlaue should be mark as default: true */
  buttons: PropTypes.array,
  /** This action will be called when a toggle is clicked. */
  toggleAction: PropTypes.func
}

export default Toggle
