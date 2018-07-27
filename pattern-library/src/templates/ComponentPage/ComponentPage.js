import React from "react"
import PropTypes from "prop-types"
import GatsbyLink from "gatsby-link"
import '../../../../public/css/main.css';

import Example from './components/Example';

function yesno(bool) {
  return !!bool ? 'yes' : 'no';
}

class ComponentPage extends React.Component {
  render() {
    const { displayName, props, html, description } = this.props.pathContext

    return (
      <div>
        <h1>{displayName}</h1>
        <Example html={html} />
        <h2>Props/Methods</h2>
        { description && <p>{description.text}</p> }
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Type</th>
              <th>Required</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            {props.map(({ name, defaultValue, description, type, required }, index) => (
              <tr key={index}>
                <td>{name}</td>
                <td>{description ? description.text : <em>N/A</em>}</td>
                <td>{type.name}</td>
                <td>{yesno(required)}</td>
                <td>{defaultValue ? <pre>{defaultValue.value}</pre> : <em>N/A</em>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

ComponentPage.propTypes = {
  pathContext: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    props: PropTypes.array.isRequired,
    html: PropTypes.string.isRequired,
    description: PropTypes.shape({
      text: PropTypes.string.isRequired,
    }),
  }).isRequired,
}

export default ComponentPage
