import React from "react"
import PropTypes from "prop-types"
import GatsbyLink from "gatsby-link"
import '../../../../public/css/main.css';
import '../../sass/preview.scss';


class Layout extends React.Component {
  render() {
    return (
      <div className="pl-layout">
        {this.props.children}
      </div>
    );
  }
}

export default Layout;
