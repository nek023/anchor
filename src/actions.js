import * as types from './constants/action_types';

export function setQuery(query) {
  return {
    type: types.SET_QUERY,
    payload: query
  };
}

export function setResults(results, nextSelectedRowIndex = 0) {
  return {
    type: types.SET_RESULTS,
    payload: { results, nextSelectedRowIndex }
  };
}

export function selectRow(index) {
  return {
    type: types.SELECT_ROW,
    payload: index
  };
}
