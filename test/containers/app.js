import React from 'react';
import App from '../../src/containers/App';
import SearchField from '../../src/components/SearchField';
import ResultList from '../../src/components/ResultList';
import assert from 'power-assert';
import { mount } from 'enzyme';
import createMockStore from '../helpers/store';

describe('App', () => {
  let state;
  let store;
  let wrapper;

  beforeEach(() => {
    state = {
      query: '',
      results: [],
      selectedRowIndex: 0
    };
    store = createMockStore(state);
    wrapper = mount(<App store={store} />);
  });

  it('should be rendered correctly', () => {
    const elements = [
      <SearchField />,
      <ResultList />
    ];

    assert(wrapper.containsAllMatchingElements(elements));
  });
});
