import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import createStore from './src/state/createStore';

exports.replaceRenderer = ({
  bodyComponent,
  replaceBodyHTMLString,
  setHeadComponents,
}) => {
  const store = createStore();

  // Connect Redux store
  const ConnectedBody = () => (
    <Provider store={store}>{bodyComponent}</Provider>
  );

  //replaceBodyHTMLString(html);
};
