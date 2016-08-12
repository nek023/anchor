import * as actions from '../src/actions';
import { SET_QUERY, SET_RESULTS, SELECT_ROW } from '../src/actions';
import assert from 'power-assert';

describe('actions', () => {
  describe('setQuery', () => {
    it('should create an action to set a query', () => {
      const query = 'test query';
      const expected = {
        type: SET_QUERY,
        payload: query
      };

      assert.deepEqual(actions.setQuery(query), expected);
    });
  });

  describe('setResults', () => {
    it('should create an action to set results', () => {
      const results = ['result1', 'result2'];
      const nextSelectedRowIndex = 1;
      const expected = {
        type: SET_RESULTS,
        payload: {
          results,
          nextSelectedRowIndex
        }
      };

      assert.deepEqual(
        actions.setResults(results, nextSelectedRowIndex),
        expected
      );
    });

    it('should set nextSelectedRowIndex to 0 if omitted', () => {
      const results = ['result1', 'result2'];
      const nextSelectedRowIndex = 0;
      const expected = {
        type: SET_RESULTS,
        payload: {
          results,
          nextSelectedRowIndex
        }
      };

      assert.deepEqual(actions.setResults(results), expected);
    });
  });

  describe('selectRow', () => {
    it('should create an action to select row', () => {
      const index = 1;
      const expected = {
        type: SELECT_ROW,
        payload: index
      };

      assert.deepEqual(actions.selectRow(index), expected);
    });
  });
});
