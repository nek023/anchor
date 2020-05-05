import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { ActionType, openItem, setItems, setQuery } from './modules'
import { Item, ItemType } from './types'
import { queryItems, sendMessage } from './ipc'

const MAX_RESULTS = 100

const handleCloseWindow = () =>
  chrome.windows.getCurrent((window) => chrome.windows.remove(window.id))

const handleOpenItem = (action: ReturnType<typeof openItem>) => {
  const item = action.payload.item

  if (item.type === ItemType.Tab) {
    chrome.tabs.highlight(
      {
        tabs: item.tabIndex,
        windowId: item.windowId,
      },
      (window) => chrome.windows.update(window.id, { focused: true })
    )
  } else {
    chrome.tabs.create({ url: item.url })
  }
}

function* handleSetQuery(action: ReturnType<typeof setQuery>) {
  const items: Item[] = yield call(
    sendMessage,
    queryItems(action.payload.query)
  )
  yield put(setItems(items.slice(0, MAX_RESULTS)))
}

export function* rootSaga() {
  yield takeEvery(ActionType.CloseWindow, handleCloseWindow)
  yield takeEvery(ActionType.OpenItem, handleOpenItem)
  yield takeLatest(ActionType.SetQuery, handleSetQuery)
}
