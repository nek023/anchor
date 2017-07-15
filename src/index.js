import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { MessageTypes } from './constants';
import { actions } from './modules';
import { State } from './models';
import { App } from './components';
import './assets/stylesheets/app.scss';

const url = new URL(document.URL);
const query = url.searchParams.get('q') || '';

const initialState = new State({ query });
const store = configureStore(initialState);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type == MessageTypes.SET_QUERY) {
    store.dispatch(actions.setQuery(message.payload));
    sendResponse(true);
  }
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
