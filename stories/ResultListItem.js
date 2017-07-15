import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ResultListItem } from '../src/components';
import { ItemTypes } from '../src/constants';
import { createItem, createResult } from '../test/helpers';
import favicon from './static/favicon.png';

const item = createItem({
  type: ItemTypes.TAB,
  favIconUrl: favicon
});
const result = createResult({ item });

const actions = {
  onClick: action('onClick'),
  onMouseEnter: action('onMouseEnter')
};

storiesOf('ResultListItem', module)
  .add('default', () => (
    <ResultListItem result={result} {...actions} />
  ))
  .add('selected', () => (
    <ResultListItem result={result} selected={true} {...actions} />
  ));
