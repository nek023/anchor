import { call, put, takeLatest } from 'redux-saga/effects'
import { ActionType, setItems, setQuery } from './modules'
import { Item } from '../common/types'
import { queryItems, sendMessage } from '../common/ipc'

const MAX_RESULTS = 100

function* handleSetQuery(action: ReturnType<typeof setQuery>) {
  const items: Item[] = yield call(
    sendMessage,
    queryItems(action.payload.query)
  )
  yield put(setItems(items.slice(0, MAX_RESULTS)))
}

export function* rootSaga() {
  yield takeLatest(ActionType.SetQuery, handleSetQuery)
}
