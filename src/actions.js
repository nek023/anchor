import { createAction } from 'redux-actions';

export const SET_QUERY = 'SET_QUERY';
export const SET_RESULTS = 'SET_RESULTS';
export const SELECT_ROW = 'SELECT_ROW';

export const setQuery = createAction(SET_QUERY);
export const setResults = createAction(
  SET_RESULTS,
  (results, nextSelectedRowIndex = 0) => {
    return { results, nextSelectedRowIndex };
  }
);
export const selectRow = createAction(SELECT_ROW);
