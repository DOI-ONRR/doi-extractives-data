import React from "react"
import PropTypes from "prop-types"
import Link from "gatsby-link"


class SideNav extends React.Component {
  render() {
    const { components, docs } = this.props;
    return (
      <div>
        <h2>Docs</h2>
        <ul>
          {docs.map(doc => (
            <li key={doc.path}>
              <Link to={doc.path}>{doc.context.title || doc.path}</Link>
            </li>
          ))}
        </ul>
        <h2>Components</h2>
        <ul>
          {components.map(component => (
            <li key={component.path}>
              <Link to={component.path}>{component.context.displayName || component.path}</Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

SideNav.propTypes = {
  components: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
    context: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }).isRequired,
  })),
  docs: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
    context: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
  })),
}

SideNav.defaultProps = {
  components: [],
  docs: [],
};

export default SideNav;
