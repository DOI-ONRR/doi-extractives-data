import React from 'react';
import MediaQuery from 'react-responsive';
import Helmet from 'react-helmet';

import hastReactRenderer from '../js/hast-react-renderer';

import utils from '../js/utils';
import {withPrefixSVG} from '../components/utils/temp-link';

import {PageToc} from '../components/navigation/PageToc'

class CaseStudiesTemplate extends React.Component {

  componentDidMount() {
    const script1 = document.createElement("script");

    script1.src = withPrefixSVG("/public/js/main.min.js");
    script1.async = false;

    document.body.appendChild(script1);

    const script2 = document.createElement("script");

    script2.src = withPrefixSVG("/public/js/narrative.min.js");
    script2.async = false;

    document.body.appendChild(script2);
  }

  render() {
    let title = this.props.pathContext.markdown.frontmatter.title || "Natural Resources Revenue Data";

    return (
      <main>
        <Helmet
            title={title}
            meta={[
                // title
                { name: "og:title", content: title},
                { name: "twitter:title", content: title},
            ]}

            />
        {hastReactRenderer(this.props.pathContext.markdown.htmlAst)}
      </main>
    );
  }

}
export default CaseStudiesTemplate;