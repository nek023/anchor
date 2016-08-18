import { createAction } from 'redux-actions';
import * as types from './constants/action_types';

export const setQuery = createAction(types.SET_QUERY);
export const setResults = createAction(
  types.SET_RESULTS,
  (results, nextSelectedRowIndex = 0) => {
    return { results, nextSelectedRowIndex };
  }
);
export const selectRow = createAction(types.SELECT_ROW);
