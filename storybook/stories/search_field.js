import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import SearchField from '../../src/components/SearchField';

storiesOf('SearchField', module)
  .add('with value', () => (
    <SearchField value={'value'} onValueChanged={action('onValueChanged')} />
  ))
  .add('with no value', () => (
    <SearchField onValueChanged={action('onValueChanged')} />
  ));
