import React from 'react';
import assert from 'power-assert';
import { shallow } from 'enzyme';
import { ResultListItem } from '../../src/components';
import { createResult } from '../helpers';

describe('ResultListItem', () => {
  let result;
  let wrapper;

  beforeEach(() => {
    result = createResult();
    wrapper = shallow(<ResultListItem result={result} />);
  });

  it('should be rendered correctly', () => {
    const favIconUrl = result.item.getFavIconUrl();

    assert(wrapper.containsMatchingElement(<img src={favIconUrl} />));
    assert(wrapper.containsMatchingElement(<div>{result.item.title}</div>));
    assert(wrapper.containsMatchingElement(<div>{result.item.url}</div>));
  });

  it("should not have 'selected' class as default", () => {
    assert(!wrapper.prop('className').includes('selected'));
  });

  it("should have 'selected' class if props.selected is true", () => {
    wrapper = shallow(<ResultListItem result={result} selected={true} />);
    assert(wrapper.prop('className').includes('selected'));
  });
});
