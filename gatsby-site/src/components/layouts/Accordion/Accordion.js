import React from 'react';
import PropTypes from 'prop-types';

import styles from "./Accordion.module.css";

import IconPlus from '-!svg-react-loader!../../../img/icons/icon-circled-plus.svg';
import IconMinus from '-!svg-react-loader!../../../img/icons/icon-circled-minus.svg';

class Accordion extends React.Component {
  constructor(props) {
    super(props);

    const expandableId = `${props.id}-expandable-content`;
    const { expanded } = props;
    this.state = {
      expandableId,
      expanded,
    };
  }

  toggle() {
    const { expanded } = this.state;
    this.setState({
      expanded: !expanded,
    });
  }

  render() {
    const { id, children, text } = this.props;
    const { expandableId, expanded } = this.state;
    const toggle = () => this.toggle();

    return (
      <div id={id} className={styles.root}>
        <div class={styles.toggle} is="aria-toggle" 
          aria-controls={expandableId} 
          aria-expanded={expanded} 
          type="button" 
          onClick={toggle}>

          <span className={styles.plus} >
            <IconPlus />
            <span>{text[0]}</span>
          </span>
          <span className={styles.minus} >
            <IconMinus />
            <span>{text[1]}</span>
          </span>
        </div>
        <div id={expandableId} aria-hidden={!expanded} className={styles.content}>
          { children }
        </div>
      </div>
    );
  }
};

Accordion.propTypes = {
  /** The Id for the element, used to ensure expandable containers have unique Ids. */
  id: PropTypes.string.isRequired,
  /** The content to show when this accordion is expanded. */
  children: PropTypes.node.isRequired,
  /** Initial state of the accordion */
  expanded: PropTypes.bool,
  /** Text to display next to the icon. Collapsed text first then Expanded text */
  text: PropTypes.array,
}

Accordion.defaultProps = {
  expanded: false,
};

export default Accordion;
