import React from 'react'
import Link, { withPrefix as withPrefixGatsby } from 'gatsby-link'
// This is a temporary solution for links that allow integration with jekyll
// When jekyl is retired this can be replaced with gatsby-link

class TempLink extends React.Component {
  render () {
    let { to, className, href, ...rest } = this.props

    if (rest.xLinkHref) {
      rest.xlinkHref = (rest.xLinkHref.startsWith('/')) ? withPrefix(rest.xLinkHref) : rest.xLinkHref
      delete rest.xLinkHref
    }

    console.log(href);

    if (href) {
      if (href.includes('gatsby-public')) {
        to = href.replace('/gatsby-public', '')
      }
      else {
        to = href
      }
    }
    else {
      to = withPrefix(to)
    }
    return (
      <a {...rest} href={to} className={className}>
        {this.props.children}
      </a>
    )
  }
}

export default TempLink

export function withPrefix (path) {
  return withPrefixGatsby(path)
}
export function withPrefixSVG (path) {
  return withPrefixGatsby(path)
}
