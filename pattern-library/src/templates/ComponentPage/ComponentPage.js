import React from "react"
import PropTypes from "prop-types"
import GatsbyLink from "gatsby-link"
import '../../../../public/css/main.css';

import styles from './styles.module.scss';
import Example from './components/Example';

function yesno(bool) {
  return !!bool ? 'yes' : 'no';
}

class ComponentPage extends React.Component {
  render() {
    const { displayName, props, html, childComponentDescription } = this.props.pathContext
    const description = childComponentDescription ? childComponentDescription.childMarkdownRemark.html : '';

    return (
      <div className={styles.componentPage}>
        <h1>{displayName}</h1>
        <Example html={html} />
        <h2>Props/Methods</h2>
        <div dangerouslySetInnerHTML={{__html: description}} />
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
            {props.map(({ name, defaultValue, childComponentDescription, type, required }, index) => {
              const description = childComponentDescription ? childComponentDescription.childMarkdownRemark.html : '';
              return (
                <tr key={index}>
                  <td>{name}</td>
                  <td dangerouslySetInnerHTML={{__html: description}} />
                  <td>{type.name}</td>
                  <td>{yesno(required)}</td>
                  <td>{defaultValue ? <pre>{defaultValue.value}</pre> : <em>N/A</em>}</td>
                </tr>
              );
            })}
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
    childComponentDescription: PropTypes.shape({
      childMarkdownRemark: PropTypes.shape({
        html: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
}

export default ComponentPage
