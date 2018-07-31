import React from "react"
import PropTypes from "prop-types"
import GatsbyLink from "gatsby-link"

import Layout from '../Layout';

class TOC extends React.Component {
  render() {
    const { allComponents } = this.props.pathContext
    return (
      <Layout>
        <h1>Component styleguide</h1>
        <ul>
          {allComponents.map(({ displayName, url }, index) => (
            <li key={index}>
              <GatsbyLink to={url}>{displayName}</GatsbyLink>
            </li>
          ))}
        </ul>
      </Layout>
    )
  }
}

TOC.propTypes = {
  pathContext: PropTypes.shape({
    allComponents: PropTypes.arrayOf(
      PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
  }).isRequired,
}

export default TOC
