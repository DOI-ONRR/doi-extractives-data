import React from 'react';

// This is a temporary solution for links that allow integration with jekyll
// When jekyl is retired this can be replaced with gatsby-link

class TempLink extends React.Component {
  constructor(props, context) {
    super()
    this.withPrefix = this.withPrefix.bind(this)
  }
  
  withPrefix(path) {
    let newPrefix = "";
    if(__PATH_PREFIX__ && __PATH_PREFIX__.length > 0) {
      newPrefix = __PATH_PREFIX__.slice(0, -14);
    }
    return (newPrefix+path);
  }
  
  render() {
    const { to, ...rest } = this.props;
    return (
      <a {...rest} href={this.withPrefix(to)}>
        {this.props.children}
      </a>
    );
  }

}

export default TempLink;