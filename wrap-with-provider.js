import React from 'react'
import { Provider } from 'react-redux'
import { MDXProvider } from '@mdx-js/react'
import createStore from './src/state/create-store'
import CodeBlock from './src/components/layouts/CodeBlock'

import * as components from './.cache/components'

const store = createStore()

const mdxComponents = {
  pre: props => <div {...props} />,
  code: CodeBlock,
  ...components
}

// eslint-disable-next-line react/display-name,react/prop-types
export default ({ element }) =>
  <Provider store={store}>
    <MDXProvider
      components={ mdxComponents }>
      {element}
    </MDXProvider>
  </Provider>
