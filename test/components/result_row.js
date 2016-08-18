import React from 'react';
import ResultRow from '../../src/components/ResultRow';
import assert from 'power-assert';
import { shallow } from 'enzyme';
import createResult from '../factories/result';

describe('ResultRow', () => {
  let result;
  let wrapper;

  beforeEach(() => {
    result = createResult();
    wrapper = shallow(<ResultRow result={result} />);
  });

  it('should be rendered correctly', () => {
    const favIconUrl = result.item.getFavIconUrl();

    assert(wrapper.containsMatchingElement(<img src={favIconUrl} />));

    assert(wrapper.containsAllMatchingElements([
      <div>{result.item.title}</div>,
      <div>{result.item.url}</div>
    ]));
  });

  it("should not have 'selected' class as default", () => {
    assert(!wrapper.prop('className').includes('selected'));
  });

  it("should have 'selected' class if props.selected is true", () => {
    wrapper = shallow(<ResultRow result={result} selected={true} />);
    assert(wrapper.prop('className').includes('selected'));
  });
});
