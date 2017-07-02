import React from 'react';
import assert from 'power-assert';
import { shallow } from 'enzyme';
import { ResultList, ResultListItem } from '../../src/components';
import { createResult } from '../helpers';

describe('ResultList', () => {
  let results;

  beforeEach(() => {
    results = [...Array(100).keys()].map((index) => createResult({ index }));
  });

  it('should be rendered correctly', () => {
    const wrapper = shallow(<ResultList results={results} />);
    const elements = results.map((result, index) => {
      const selected = (index == 0);
      return <ResultListItem key={index} result={result} selected={selected} />;
    });

    assert(wrapper.containsAllMatchingElements(elements));
  });

  it('should select item at props.selectedItemIndex', () => {
    const selectedItemIndex = 1;
    const wrapper = shallow(
      <ResultList results={results} selectedItemIndex={selectedItemIndex} />
    );
    const elements = results.map((result, index) => {
      const selected = (index == selectedItemIndex);
      return <ResultListItem key={index} result={result} selected={selected} />;
    });

    assert(wrapper.containsAllMatchingElements(elements));
  });
});
