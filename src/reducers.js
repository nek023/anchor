import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

const query = handleActions({
  SET_QUERY: (state, action) => action.payload
}, '');

const results = handleActions({
  SET_RESULTS: (state, action) => action.payload.results
}, []);

const selectedRowIndex = handleActions({
  SET_RESULTS: (state, action) => action.payload.nextSelectedRowIndex,
  SELECT_ROW: (state, action) => action.payload
}, 0);

const rootReducer = combineReducers({
  query,
  results,
  selectedRowIndex
});

export default rootReducer;
