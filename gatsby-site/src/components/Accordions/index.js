import React from 'react';
import PropTypes from 'prop-types';

import iconPlus from '../../img/icons/icon-circled-plus.svg';
import iconMinus from '../../img/icons/icon-circled-minus.svg';


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
    const { id, children } = this.props;
    const { expandableId, expanded } = this.state;
    const toggle = () => this.toggle();

    return (
      <div id={id}>
        <h4 aria-hidden="false">
          <button is="aria-toggle" aria-controls={expandableId} aria-expanded={expanded} type="button" onClick={toggle}>
            <span className="hide-expanded">
              <img className="aria-toggle-icon" alt="icon with a plus sign" src={iconPlus} />
              Show expanded content
            </span>
            <span className="show-expanded">
              <img className="aria-toggle-icon" alt="icon with a minus sign" src={iconMinus} />
              Hide expanded content
            </span>
          </button>
        </h4>
        <div id={expandableId} aria-hidden={!expanded}>
          { children }
        </div>
      </div>
    );
  }
};

Accordion.propTypes = {
  /* The Id for the element, used to ensure expandable containers have unique Ids. */
  id: PropTypes.string.isRequired,
  /* The content to show when this accordion is expanded. */
  children: PropTypes.node.isRequired,
  /* Initial state of the accordion */
  expanded: PropTypes.bool,
}

Accordion.defaultProps = {
  expanded: false,
};

export default Accordion;
