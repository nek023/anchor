import React from 'react';
import { storiesOf } from '@kadira/storybook';
import ResultList from '../../src/components/ResultList';
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

storiesOf('ResultList', module)
  .add('with results', () => (
    <ResultList results={results} />
  ))
  .add('with no results', () => (
    <ResultList />
  ));
