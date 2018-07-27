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
let inInitialRender = true;
exports.onClientEntry = () => {
  // Patch the resource loader
  const loader = global.___loader;
  if (!loader) return;
  const { getResourcesForPathname } = loader

  loader.getResourcesForPathname = (path, cb = () => {}) => {
	    if (
	      inInitialRender &&
	      navigator &&
	      navigator.serviceWorker &&
	      navigator.serviceWorker.controller &&
	      navigator.serviceWorker.controller.state === `activated`
	    ) {
	      // If we're loading from a service worker (it's already activated on
	      // this initial render) and we can't find a page, there's a good chance
	      // we're on a new page that this (now old) service worker doesn't know
	      // about so we'll unregister it and reload.
	      if (!findPage(path)) {
	        navigator.serviceWorker
	          .getRegistrations()
	          .then(function(registrations) {
	            // We would probably need this to
	            // prevent unnecessary reloading of the page
	            // while unregistering of ServiceWorker is not happening
	            if (registrations.length) {
	              for (let registration of registrations) {
	                registration.unregister()
	              }
	              window.location.reload()
	            }
	          })
	      }
	    }
	    inInitialRender = false
	    // In development we know the code is loaded already
	    // so we just return with it immediately.

		const page = findPage(path)
		if (!page) return cb()
		const pageResources = {
			component: syncRequires.components[page.componentChunkName],
			json: syncRequires.json[page.jsonName],
			layout: syncRequires.layouts[page.layout],
			page,
		}
		cb(pageResources)
		return pageResources;
	}
}
