import React from 'react';

// This is a temporary solution for links that allow integration with jekyll
// When jekyl is retired this can be replaced with gatsby-link

class TempLink extends React.Component {
  render() {
    let { to, className, href, ...rest } = this.props;
    
    if(href) {
      to = href.replace('/gatsby-public', '');
    }
    else {
      to = withPrefix(to);
    }
    return (
      <a {...rest} href={to} className={className}>
        {this.props.children}
      </a>
    );
  }
}

export default TempLink;

export function withPrefix(path) {
  let newPrefix = "";
  if(__PATH_PREFIX__ && __PATH_PREFIX__.length > 0) {
    newPrefix = __PATH_PREFIX__.slice(0, -14);
  }
  return (newPrefix+path);

}
export function withPrefixSVG(path) {

  return (process.env.NODE_ENV === `production`)? __PATH_PREFIX__+path : withPrefix(path);
}