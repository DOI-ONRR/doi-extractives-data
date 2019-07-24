import React from 'react'
import rehypeReact from 'rehype-react';

/* @TODO Could we use gatsby to get a list of all components and svgs to add to the renderer automatically?
We could then prepend the imports to this file as well as the mapping object. Just a thought. */

import OilRig from '-!svg-react-loader!../img/svg/icon-ribbon-oil-rig.svg'
import HowItWorksRibbonGraphic from '-!svg-react-loader!../img/svg/how-it-works-ribbon-graphic.svg'
import HowMainIconOil from '-!svg-react-loader!../img/svg/how-main-icon-oil.svg'
import HowMainIconCoal from '-!svg-react-loader!../img/svg/how-main-icon-coal.svg'
import HowMainIconHardrock from '-!svg-react-loader!../img/svg/how-main-icon-hardrock.svg'
import HowMainIconWind from '-!svg-react-loader!../img/svg/how-main-icon-wind.svg'
import IconDownload from '-!svg-react-loader!../img/svg/icon-download.svg'
import GlossaryTerm from '../components/utils/glossary-term.js'
import NavList from '../components/layouts/NavList'
import { DisplayStatistic } from '../components/utils/DisplayStatistic'
import { DisplayYear } from '../components/stats/DisplayYear'
import { DisplayDisbursement } from '../components/stats/DisplayDisbursement'
import { PageToc } from '../components/navigation/PageToc'
import Link, { withPrefix } from '../components/utils/temp-link'
import { Accordion } from '../components/layouts/Accordion'
import { DidYouKnow } from '../components/layouts/DidYouKnow'
import { ProcessGroup } from '../components/layouts/ProcessGroup'
import { ProcessStep } from '../components/layouts/ProcessGroup'
import { MsgPrioritizedStatesSvg } from '../components/maps/MsgPrioritizedStatesSvg'
import ImgWrapper from '../components/utils/img-wrapper'
import { UpdateFlag } from '../components/layouts/UpdateFlag'
import { DownloadDataLink } from '../components/layouts/icon-links/DownloadDataLink'
import IconArchive from '-!svg-react-loader!../img/svg/icon-archive.svg'
import { DataArchiveLink } from '../components/layouts/icon-links/DataArchiveLink'
import { ArchiveBanner } from '../components/info/ArchiveBanner'
import CoalIcon from '-!svg-react-loader!../img/svg/icon-coal.svg'
import OilGasIcon from '-!svg-react-loader!../img/svg/icon-oil.svg'
import HardrockIcon from '-!svg-react-loader!../img/svg/icon-hardrock.svg'
import RenewablesIcon from '-!svg-react-loader!../img/svg/icon-renewables.svg'
import GeothermalIcon from '-!svg-react-loader!../img/svg/icon-geothermal.svg'
import ChevronIcon from '-!svg-react-loader!../img/svg/chevron-lt.svg'
import DownloadLink from '../components/layouts/icon-links/DownloadLink'
import DownloadCsvLink from '../components/layouts/icon-links/DownloadCsvLink'
import DownloadExcelLink from '../components/layouts/icon-links/DownloadExcelLink'
import NativeAmericanRevenueTable from '../components/tables/NativeAmericanRevenueTable'

const SelectWrapper = props => {
  let { onchange, ...mutableProps } = props

  // Since attribute values are passed in as a string we have to create a function since onchange expects a function
  // We also will pass in the event and replace 'this' with e.target to replace any code that uses this.value for example
  let onchangeFunc
  if (onchange) {
    onchange = onchange.replace('this.', 'e.target.')
    // eslint-disable-next-line no-new-func
    onchangeFunc = Function('e', onchange)
  }

  return (
    <select {...mutableProps} onChange={onchangeFunc && (e => onchangeFunc(e))} >
      {props.children}
    </select>
  )
}

const UseWrapper = props => {
  let { ...mutableProps } = props

  if (mutableProps.xLinkHref) {
    mutableProps.xlinkHref = (mutableProps.xLinkHref.startsWith('/')) ? withPrefix(mutableProps.xLinkHref) : mutableProps.xLinkHref
    delete mutableProps.xLinkHref
  }
  return (
    <use {...mutableProps}>
      {props.children}
    </use>
  )
}

const SvgWrapper = props => {
  let { ...mutableProps } = props

  if (mutableProps.xmlnsXLink) {
    mutableProps.xmlnsXLink = (mutableProps.xmlnsXLink.startsWith('/')) ? withPrefix(mutableProps.xmlnsXLink) : mutableProps.xmlnsXLink
    delete mutableProps.xmlnsXLink
  }
  return (
    <svg {...mutableProps}>
      {props.children}
    </svg>
  )
}
/***
 * This utility is used to render html and react components from markdown files
 * Gatsby's markdown transformer plugin automatically creates and htmlAst attribute
 * We also included in gatsby node a utility to convert frontmatter to hast.
 **/
const hastReactRenderer = new rehypeReact({
  createElement: React.createElement,
  components: { 'glossary-term': GlossaryTerm,
    'nav-list': NavList,
    'oil-rig': OilRig,
    'how-it-works-ribbon-graphic': HowItWorksRibbonGraphic,
    'how-main-icon-oil': HowMainIconOil,
    'how-main-icon-coal': HowMainIconCoal,
    'how-main-icon-hardrock': HowMainIconHardrock,
    'how-main-icon-wind': HowMainIconWind,
    'display-statistic': DisplayStatistic,
    'display-year': DisplayYear,
    'display-disbursement': DisplayDisbursement,
    'page-toc': PageToc,
    'custom-link': Link,
    'msg-prioritzed-states-svg': MsgPrioritizedStatesSvg,
    'a': Link,
    'accordion-component': Accordion,
    'did-you-know': DidYouKnow,
    'process-group': ProcessGroup,
    'process-step': ProcessStep,
    'img': ImgWrapper,
    'update-flag': UpdateFlag,
    'download-data-link': DownloadDataLink,
    'icon-archive': IconArchive,
    'icon-download': IconDownload,
    'data-archive-link': DataArchiveLink,
    'archive-banner': ArchiveBanner,
    'coal-icon': CoalIcon,
    'oil-gas-icon': OilGasIcon,
    'hardrock-icon': HardrockIcon,
    'renewables-icon': RenewablesIcon,
    'geothermal-icon': GeothermalIcon,
    'chevron-icon': ChevronIcon,
    'select': SelectWrapper,
    'use': UseWrapper,
    'svg': SvgWrapper,
    'download-link': DownloadLink,
    'excel-link': DownloadExcelLink,
    'csv-link': DownloadCsvLink,
    'native-american-revenue-table': NativeAmericanRevenueTable,
  },

}).Compiler

export default hastReactRenderer
