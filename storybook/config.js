import { configure } from '@kadira/storybook';
import '../src/assets/stylesheets/style.scss';

function loadStories() {
  require('./stories/search_field');
  require('./stories/result_row');
  require('./stories/result_list');
  require('./stories/app');
}

configure(loadStories, module);
