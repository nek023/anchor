import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { App } from '../src/components/App';
import { ItemTypes } from '../src/constants';
import { State } from '../src/models';
import { createItem, createResult } from '../test/helpers';
import favicon from './static/favicon.png';

const results = [...Array(10).keys()].map((index) => {
  const item = createItem({
    type: ItemTypes.TAB,
    favIconUrl: favicon
  });
  return createResult({ index, item });
});

const state = new State({
  query: 'query',
  results: results,
  selectedItemIndex: 1
});

const actions = {
  closeWindow: action('closeWindow'),
  openItem: action('openItem'),
  selectItem: action('selectItem'),
  setQuery: action('setQuery'),
  setResults: action('setResults')
};

storiesOf('App', module)
  .add('with results', () => (
    <App state={state} actions={actions} />
  ))
  .add('with no results', () => (
    <App state={state.setResults([])} actions={actions} />
  ));
