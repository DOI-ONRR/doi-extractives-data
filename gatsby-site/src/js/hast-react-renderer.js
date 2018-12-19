import React from 'react';
import rehypeReact from "rehype-react";

import HowItWorksRibbonGraphic from '-!svg-react-loader!../img/svg/how-it-works-ribbon-graphic.svg';
import HowMainIconOil from '-!svg-react-loader!../img/svg/how-main-icon-oil.svg';
import HowMainIconCoal from '-!svg-react-loader!../img/svg/how-main-icon-coal.svg';
import HowMainIconHardrock from '-!svg-react-loader!../img/svg/how-main-icon-hardrock.svg';
import HowMainIconWind from '-!svg-react-loader!../img/svg/how-main-icon-wind.svg';

import GlossaryTerm from '../components/utils/glossary-term.js';
import NavList from '../components/layouts/NavList';

/***
 * This utility is used to render html and react components from markdown files
 * Gatsby's markdown transformer plugin automatically creates and htmlAst attribute
 * We also included in gatsby node a utility to convert frontmatter to hast.
 **/
const hastReactRenderer = new rehypeReact({
  createElement: React.createElement,
  components: { "glossary-term": GlossaryTerm,
  							"nav-list": NavList,
  							"how-it-works-ribbon-graphic": HowItWorksRibbonGraphic,
  							"how-main-icon-oil": HowMainIconOil,
  							"how-main-icon-coal": HowMainIconCoal,
  							"how-main-icon-hardrock": HowMainIconHardrock,
  							"how-main-icon-wind": HowMainIconWind, },

}).Compiler; 

export default hastReactRenderer;