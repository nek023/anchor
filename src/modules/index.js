import { createAction, handleActions } from 'redux-actions';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { ItemTypes, MessageTypes } from '../constants';
import { Item, Result, State } from '../models';
import { sendMessage } from '../utils';

const MAX_RESULTS = 100;

// ----------------------------------------------------------------
// Action Types
// ----------------------------------------------------------------
export const ActionTypes = {
  CLOSE_WINDOW: 'CLOSE_WINDOW',
  OPEN_ITEM:    'OPEN_ITEM',
  SELECT_ITEM:  'SELECT_ITEM',
  SET_QUERY:    'SET_QUERY',
  SET_RESULTS:  'SET_RESULTS'
};

// ----------------------------------------------------------------
// Action Creators
// ----------------------------------------------------------------
export const actions = {
  closeWindow: createAction(ActionTypes.CLOSE_WINDOW),
  openItem: createAction(ActionTypes.OPEN_ITEM),
  selectItem: createAction(ActionTypes.SELECT_ITEM),
  setQuery: createAction(ActionTypes.SET_QUERY),
  setResults: createAction(ActionTypes.SET_RESULTS, (results, nextSelectedItemIndex = 0) => {
    return { results, nextSelectedItemIndex };
  })
};

// ----------------------------------------------------------------
// Reducers
// ----------------------------------------------------------------
export default handleActions({
  [ActionTypes.SELECT_ITEM]: (state, action) => state.setSelectedItemIndex(action.payload),
  [ActionTypes.SET_QUERY]: (state, action) => state.setQuery(action.payload),
  [ActionTypes.SET_RESULTS]: (state, action) => {
    return state
      .setResults(action.payload.results)
      .setSelectedItemIndex(action.payload.nextSelectedItemIndex);
  }
}, new State());

// ----------------------------------------------------------------
// Sagas
// ----------------------------------------------------------------
export function closeWindow() {
  chrome.windows.getCurrent((window) => {
    chrome.windows.remove(window.id);
  });
}

export function openItem(action) {
  const item = action.payload;

  if (item.type == ItemTypes.TAB) {
    chrome.tabs.highlight({
      windowId: item.windowId,
      tabs: item.tabIndex
    }, (window) => {
      chrome.windows.update(window.id, { focused: true });
    });
  } else {
    chrome.tabs.create({ url: item.url });
  }
}

export function* queryItems(action) {
  const rawResults = yield call(sendMessage, MessageTypes.QUERY_ITEMS, action.payload);
  const results = rawResults.splice(0, MAX_RESULTS).map((result, index) => {
    return new Result({
      index: index,
      item: new Item(result.item),
      score: result.score,
      matches: result.matches
    });
  });

  yield put(actions.setResults(results));
}

export function* rootSaga() {
  yield takeEvery(ActionTypes.CLOSE_WINDOW, closeWindow);
  yield takeEvery(ActionTypes.OPEN_ITEM, openItem);
  yield takeLatest(ActionTypes.SET_QUERY, queryItems);
}
