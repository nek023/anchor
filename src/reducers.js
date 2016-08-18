import { handleActions } from 'redux-actions';

export const query = handleActions({
  SET_QUERY: (state, action) => action.payload
}, '');

export const results = handleActions({
  SET_RESULTS: (state, action) => action.payload.results
}, []);

export const selectedRowIndex = handleActions({
  SET_RESULTS: (state, action) => action.payload.nextSelectedRowIndex,
  SELECT_ROW: (state, action) => action.payload
}, 0);
