import React from "react"

import '../../../public/css/main.css';
import '../sass/preview.scss';

import SideNav from '../components/SideNav';


class Layout extends React.Component {
  constructor(props) {
    super(props);
    //TODO can this be done in graphql?
    // Group the pages into components and docs
    this.state = props.data.allSitePage.edges
      .reduce((memo, edge) => {
        if (/^\/components\//.test(edge.node.path)) {
          memo.components.push(edge.node);
        } else if (/^\/docs\//.test(edge.node.path) ||
                   '/' === edge.node.path) { // index.md
          memo.docs.push(edge.node);
        }

        return memo
      }, { components: [], docs: [] });
  }

  render() {
    const { children } = this.props;
    const { components, docs } = this.state;

    return (
      <div className="pl-layout">
        <aside>
          <SideNav components={components} docs={docs} />
        </aside>
        <div className="pl-layout__main">
          {children()}
        </div>
      </div>
    );
  }
}

export const query = graphql`
  query SideNavQuery {
    allSitePage {
      edges {
        node {
          path
          context {
            title
            displayName
          }
        }
      }
    }
  }
`;


export default Layout;
