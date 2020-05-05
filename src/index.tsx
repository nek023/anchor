import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { App } from './components/App'
import { initialState, setQuery } from './modules'
import { createStore } from './store'
import { Message, MessageType } from './ipc'

const query = new URL(document.URL).searchParams.get('q') || ''
const store = createStore({ ...initialState, query })

chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    if (message.type === MessageType.SET_QUERY) {
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
