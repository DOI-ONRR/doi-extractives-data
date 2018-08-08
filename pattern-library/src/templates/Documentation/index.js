import React from "react"
import PropTypes from "prop-types"
import rehypeReact from 'rehype-react';

import '../../../../public/css/main.css';

/**
 * Config rendering react components from markdown. This let's us use custom
 * components for pattern library documentation.
 */

// Components to allow rendering in markdown documents
const documentationComponents = {
  'color-directory': require('../../components/color-directory'),
  'color-swatch': require('../../components/color-swatch'),
};

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: documentationComponents,
}).Compiler


class DocumentationPage extends React.Component {
  render() {
    const { title, status, htmlAst } = this.props.pathContext;

    return (
      <div>
        { title && <h1>{title}</h1> }
        { status && <div>{status}</div> }
        <div>{renderAst(htmlAst)}</div>
      </div>
    )
  }
}

DocumentationPage.propTypes = {
  pathContext: PropTypes.shape({
    htmlAst: PropTypes.string.isRequired,
    status: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
}


export default DocumentationPage;
