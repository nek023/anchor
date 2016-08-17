import * as actions from '../src/actions';
import * as types from '../src/constants/action_types';
import assert from 'power-assert';

describe('Actions', () => {
  describe('setQuery()', () => {
    it('should create an action to set a query', () => {
      const query = 'test query';
      const expected = {
        type: types.SET_QUERY,
        payload: query
      };

      assert.deepEqual(actions.setQuery(query), expected);
    });
  });

  describe('setResults()', () => {
    it('should create an action to set results', () => {
      const results = ['result1', 'result2'];
      const nextSelectedRowIndex = 1;
      const expected = {
        type: types.SET_RESULTS,
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
        type: types.SET_RESULTS,
        payload: {
          results,
          nextSelectedRowIndex
        }
      };

      assert.deepEqual(actions.setResults(results), expected);
    });
  });

  describe('selectRow()', () => {
    it('should create an action to select row', () => {
      const index = 1;
      const expected = {
        type: types.SELECT_ROW,
        payload: index
      };

      assert.deepEqual(actions.selectRow(index), expected);
    });
  });
});
