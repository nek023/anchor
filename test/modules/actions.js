import assert from 'power-assert';
import { createItem, createResult } from '../helpers';
import { ActionTypes, actions } from '../../src/modules';

describe('Actions', () => {
  describe('closeWindow', () => {
    it('should create correct action object', () => {
      const expected = {
        type: ActionTypes.CLOSE_WINDOW
      };

      assert.deepEqual(actions.closeWindow(), expected);
    });
  });

  describe('openItem', () => {
    it('should create correct action object', () => {
      const item = createItem();
      const expected = {
        type: ActionTypes.OPEN_ITEM,
        payload: item
      };

      assert.deepEqual(actions.openItem(item), expected);
    });
  });

  describe('selectItem', () => {
    it('should create correct action object', () => {
      const index = 1;
      const expected = {
        type: ActionTypes.SELECT_ITEM,
        payload: index
      };

      assert.deepEqual(actions.selectItem(index), expected);
    });
  });

  describe('setQuery', () => {
    it('should create correct action object', () => {
      const query = 'test query';
      const expected = {
        type: ActionTypes.SET_QUERY,
        payload: query
      };

      assert.deepEqual(actions.setQuery(query), expected);
    });
  });

  describe('setResults', () => {
    it('should create correct action object', () => {
      const results = [createResult(), createResult()];
      const nextSelectedItemIndex = 1;
      const expected = {
        type: ActionTypes.SET_RESULTS,
        payload: {
          results,
          nextSelectedItemIndex
        }
      };

      assert.deepEqual(
        actions.setResults(results, nextSelectedItemIndex),
        expected
      );
    });

    it('should set nextSelectedItemIndex to 0 if omitted', () => {
      const results = [createResult(), createResult()];
      const nextSelectedItemIndex = 0;
      const expected = {
        type: ActionTypes.SET_RESULTS,
        payload: {
          results,
          nextSelectedItemIndex
        }
      };

      assert.deepEqual(actions.setResults(results), expected);
    });
  });
});
