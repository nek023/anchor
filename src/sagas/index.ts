import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {
  ActionType,
  OpenItemAction,
  SetQueryAction,
  setItems,
} from '../modules/index'
import { Item, ItemType } from '../types'
import { queryItems, sendMessage } from '../utils/ipc'

const MAX_RESULTS = 100

function closeWindow() {
  chrome.windows.getCurrent((window) => {
    chrome.windows.remove(window.id)
  })
}

function openItem(action: OpenItemAction) {
  const item = action.payload.item

  if (item.type === ItemType.Tab) {
    chrome.tabs.highlight(
      {
        tabs: item.tabIndex,
        windowId: item.windowId,
      },
      (window) => {
        chrome.windows.update(window.id, { focused: true })
      }
    )
  } else {
    chrome.tabs.create({ url: item.url })
  }
}

function* setQuery(action: SetQueryAction) {
  const items: Item[] = yield call(
    sendMessage,
    queryItems(action.payload.query)
  )
  yield put(setItems(items.slice(0, MAX_RESULTS)))
}

export function* rootSaga() {
  yield takeEvery(ActionType.CloseWindow, closeWindow)
  yield takeEvery(ActionType.OpenItem, openItem)
  yield takeLatest(ActionType.SetQuery, setQuery)
}
