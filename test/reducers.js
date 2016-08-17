import * as reducers from '../src/reducers';
import * as actions from '../src/actions';
import assert from 'power-assert';
import createResult from './fixtures/result';

describe('Reducers', () => {
  describe('query()', () => {
    const reducer = reducers.query;

    it('should return the initial state', () => {
      const actual = reducer(undefined, {});
      const expected = '';

      assert(actual === expected);
    });

    it('should handle SET_QUERY', () => {
      const query = 'test query';
      const actual = reducer('', actions.setQuery(query));

      assert(actual === query);
    });
  });

  describe('results()', () => {
    const reducer = reducers.results;

    it('should return the initial state', () => {
      const actual = reducer(undefined, {});
      const expected = [];

      assert.deepEqual(actual, expected);
    });

    it('should handle SET_RESULTS', () => {
      const results = [createResult(), createResult()];
      const actual = reducer([], actions.setResults(results));

      assert.deepEqual(actual, results);
    });
  });

  describe('selectedRowIndex()', () => {
    const reducer = reducers.selectedRowIndex;

    it('should return the initial state', () => {
      const actual = reducer(undefined, {});
      const expected = 0;

      assert(actual === expected);
    });

    it('should handle SELECT_ROW', () => {
      const index = 1;
      const actual = reducer(0, actions.selectRow(index));

      assert(actual === index);
    });
  });
});
