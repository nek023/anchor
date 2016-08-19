import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { App } from '../../src/containers/App';
import * as ItemTypes from '../../src/constants/item_types';
import createItem from '../factories/item';
import createResult from '../factories/result';

const results = [...Array(10).keys()].map(index => {
  const item = createItem({
    type: ItemTypes.TAB,
    favIconUrl: 'images/favicon.png'
  });
  return createResult({ index, item });
});

const props = {
  query: 'query',
  results: results,
  selectedRowIndex: 1,
  setQuery: action('setQuery'),
  selectRow: action('selectRow')
};

storiesOf('App', module)
  .add('with results', () => (
    <App {...props} />
  ))
  .add('with no results', () => (
    <App {...props} results={[]} />
  ));
