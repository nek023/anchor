import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { SearchBox } from '../src/components';

const actions = { onValueChanged: action('onValueChanged') };

storiesOf('SearchBox', module)
  .add('with value', () => (
    <SearchBox value={'value'} {...actions} />
  ))
  .add('with no value', () => (
    <SearchBox {...actions} />
  ));
