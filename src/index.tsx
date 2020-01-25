import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { App } from './components/App'
import { initialState, setQuery } from './modules/index'
import { createStore } from './createStore'
import { MessageTypes, SET_QUERY } from './utils/ipc'

const url = new URL(document.URL)
const query = url.searchParams.get('q') || ''

const store = createStore({
  ...initialState,
  query: query,
})

chrome.runtime.onMessage.addListener(
  (message: MessageTypes, sender, sendResponse) => {
    if (message.type === SET_QUERY) {
      store.dispatch(setQuery(message.payload.query))
      sendResponse(true)
    }
  }
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
