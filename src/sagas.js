import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import * as actions from './actions';
import * as messages from './messages';

function* queryItems(action) {
  const results = yield call(messages.queryItems, action.payload);
  yield put(actions.setResults(results));
}

function* rootSaga() {
  yield* takeLatest(actions.SET_QUERY, queryItems);
}

export default rootSaga;
