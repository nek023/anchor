import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ResultList } from '../src/components';
import { ItemTypes } from '../src/constants';
import { createItem, createResult } from '../test/helpers';
import favicon from './static/favicon.png';

const results = [...Array(10).keys()].map((index) => {
  const item = createItem({
    type: ItemTypes.TAB,
    favIconUrl: favicon
  });
  return createResult({ index, item });
});

const actions = {
  onClickItem: action('onClickItem'),
  onMouseEnterItem: action('onMouseEnterItem')
};

storiesOf('ResultList', module)
  .add('with results', () => (
    <ResultList results={results} {...actions} />
  ))
  .add('with no results', () => (
    <ResultList {...actions} />
  ));
