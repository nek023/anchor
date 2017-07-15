/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import 'babel-polyfill';
import { configure } from '@storybook/react';
import '../src/assets/stylesheets/app.scss';

function loadStories() {
  require('../stories');
}

configure(loadStories, module);
