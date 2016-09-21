import * as types from './constants/action_types';

export function query(state = '', action) {
  switch (action.type) {
  case types.SET_QUERY:
    return action.payload;

  default:
    return state;
  }
}

export function results(state = [], action) {
  switch (action.type) {
  case types.SET_RESULTS:
    return action.payload.results;

  default:
    return state;
  }
}

export function selectedRowIndex(state = 0, action) {
  switch (action.type) {
  case types.SET_RESULTS:
    return action.payload.nextSelectedRowIndex;

  case types.SELECT_ROW:
    return action.payload;

  default:
    return state;
  }
}
