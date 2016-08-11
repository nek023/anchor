import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import App from './containers/App';
import './assets/stylesheets/style.scss';
import { SET_QUERY } from './messages';
import { setQuery } from './actions';

const url = new URL(document.URL);
const initialQuery = url.searchParams.get('q') || '';

const initialState = {
  query: initialQuery,
  results: [],
  selectedRowIndex: 0
};

const store = configureStore(initialState);

chrome.runtime.onMessage.addListener(message => {
  if (message.type == SET_QUERY) {
    store.dispatch(setQuery(message.payload));
  }
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
