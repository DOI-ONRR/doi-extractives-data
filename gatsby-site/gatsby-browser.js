/* globals window */

import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import createStore from './src/state/createStore';

exports.replaceRouterComponent = ({ history }) => {
  const store = createStore();

  const ConnectedRouterWrapper = ({ children }) => (
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  );

  return ConnectedRouterWrapper;
};

exports.onClientEntry = () => {
  // Check for a custom pathname
  const pathname = global.___pathname
  if (!pathname) return

  // Override the history location
  const history = global.___history
  history.location.pathname = pathname

  // Patch the resource loader
  const loader = global.___loader
  const { getResourcesForPathname } = loader

  loader.getResourcesForPathname = (path, ...args) => {
    return getResourcesForPathname(path === location.pathname ? pathname : path, ...args)
  }
}
