import assert from 'power-assert';
import Immutable from 'immutable';
import { State } from '../../src/models';
import reducer, { actions } from '../../src/modules';
import { createResult } from '../helpers';

describe('Reducers', () => {
  let state;

  beforeEach(() => {
    state = new State();
  });

  it('should return initial state', () => {
    const actual = reducer(undefined, {});

    assert(Immutable.is(actual, state));
  });

  it('should handle SELECT_ITEM', () => {
    const actual = reducer(state, actions.selectItem(1));
    const expected = state.setSelectedItemIndex(1);

    assert(Immutable.is(actual, expected));
  });

  it('should handle SET_QUERY', () => {
    const query = 'test query';
    const actual = reducer(state, actions.setQuery(query));
    const expected = state.setQuery(query);

    assert(Immutable.is(actual, expected));
  });

  it('should handle SET_RESULTS', () => {
    const results = [createResult()];
    const actual = reducer(state, actions.setResults(results, 1));
    const expected = state
      .setResults(results)
      .setSelectedItemIndex(1);

    assert(Immutable.is(actual, expected));
  });
});
