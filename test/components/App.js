import React from 'react';
import assert from 'power-assert';
import { mount } from 'enzyme';
import { App, SearchBox, ResultList } from '../../src/components';
import { State } from '../../src/models';
import { createMockStore } from '../helpers';

describe('App', () => {
  it('should be rendered correctly', () => {
    const state = new State();
    const store = createMockStore(state);
    const wrapper = mount(<App store={store} />);

    assert(wrapper.containsMatchingElement(<SearchBox />));
    assert(wrapper.containsMatchingElement(<ResultList />));
  });
});
