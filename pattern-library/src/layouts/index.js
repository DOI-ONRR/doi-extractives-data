import React from "react"
import {Provider} from 'react-redux';

import createStore from '../../../gatsby-site/src/store/create-store';

// Import NRRD styles
// TODO these apply to the entire pattern library. Really we want the pattern
// library to have it's own theme to avoid distracting from the components and
// content. We're using css-modules to avoid class name collisions but still
// inherit the base styles for elements. This is okay for now since we don't
// want to spend time building a theme for the styleguide.
import '../../../gatsby-site/src/styles/_main.scss';

import SideNav from '../components/side-nav';
import styles from './styles.module.scss';

const store = createStore();

class DefaultLayout extends React.Component {
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
      <Provider store={store}>
        <div className={styles.defaultLayout}>
          <div className={styles.main}>
            {children()}
          </div>
          <aside className={styles.sidebar}>
            <SideNav components={components} docs={docs} />
          </aside>
        </div>
      </Provider>
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
            nav_title
            displayName
          }
        }
      }
    }
  }
`;


export default DefaultLayout;
