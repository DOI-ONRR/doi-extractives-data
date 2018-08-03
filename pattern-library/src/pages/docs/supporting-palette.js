import React from 'react';
import Helmet from 'react-helmet';

import ColorDirectory from '../../components/color-directory';

const SupportingPalettePage = ({ data }) => {
  const variants = data.allColorPaletteSupportingYaml.edges.map(edge => edge.node.context);
  return (
    <div>
      <Helmet>
        <title>Colors: Supporting Palette</title>
      </Helmet>
      <ColorDirectory variants={variants} />
    </div>
  );
};

export const query = graphql`
  query SupportingPaletteQuery {
    allColorPaletteSupportingYaml {
      edges {
        node {
          name
          context {
            className
            colorName
            colorCode
            accessible
          }
        }
      }
    }
  }
`;


export default SupportingPalettePage;
