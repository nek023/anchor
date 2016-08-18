import React from 'react';
import { storiesOf } from '@kadira/storybook';
import ResultRow from '../../src/components/ResultRow';
import * as ItemTypes from '../../src/constants/item_types';
import createItem from '../factories/item';
import createResult from '../factories/result';

const item = createItem({
  type: ItemTypes.TAB,
  favIconUrl: 'images/favicon.png'
});
const result = createResult({ item });

storiesOf('ResultRow', module)
  .add('not selected', () => (
    <ResultRow result={result} />
  ))
  .add('selected', () => (
    <ResultRow result={result} selected={true} />
  ));
