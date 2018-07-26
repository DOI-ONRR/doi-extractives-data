import React from "react"
import PropTypes from "prop-types"
import GatsbyLink from "gatsby-link"
import '../../../../public/css/main.css';

import Layout from '../Layout';

class DocumentationPage extends React.Component {
  render() {
    const { title, status, html } = this.props.pathContext;
    return (
      <Layout>
        { title && <h1>{title}</h1> }
        { status && <div>{status}</div> }
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Layout>
    )
  }
}

DocumentationPage.propTypes = {
  pathContext: PropTypes.shape({
    html: PropTypes.string.isRequired,
    status: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
}


export default DocumentationPage;
