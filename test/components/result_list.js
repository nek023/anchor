import React from 'react';
import ResultList from '../../src/components/ResultList';
import ResultRow from '../../src/components/ResultRow';
import assert from 'power-assert';
import { shallow } from 'enzyme';
import createResult from '../fixtures/result';

describe('ResultList', () => {
  let results;

  beforeEach(() => {
    results = [...Array(100).keys()].map(index => createResult({ index }));
  });

  it('should be rendered correctly', () => {
    const selectedRowIndex = 1;
    const wrapper = shallow(
      <ResultList results={results} selectedRowIndex={selectedRowIndex} />
    );
    const elements = results.map((result, index) => {
      const selected = (index == selectedRowIndex);
      return <ResultRow result={result} selected={selected} />;
    });

    assert(wrapper.containsAllMatchingElements(elements));
  });

  it('should select first row as default', () => {
    const wrapper = shallow(<ResultList results={results} />);
    const elements = results.map((result, index) => {
      const selected = (index == 0);
      return <ResultRow result={result} selected={selected} />;
    });

    assert(wrapper.containsAllMatchingElements(elements));
  });
});
