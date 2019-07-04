import DisplayManager from './utils/DisplayManager'
import { MessageTypes, QUERY_ITEMS, sendMessage, setQuery } from './utils/ipc'
import ItemManager from './utils/ItemManager'

enum Command {
  ToggleTab      = 'toggle-anchor',
  ToggleBookmark = 'toggle-anchor-with-bookmark-mode',
  ToggleHistory  = 'toggle-anchor-with-history-mode',
}

const WINDOW_WIDTH = 600
const WINDOW_HEIGHT = 496 + 22

const displayManager = new DisplayManager()
const itemManager = new ItemManager()

let mainWindow: chrome.windows.Window | undefined

function showWindow(query: string) {
  if (mainWindow && mainWindow.focused) {
    chrome.windows.remove(mainWindow.id, () => {
      mainWindow = undefined
    })
  } else {
    chrome.windows.getCurrent((currentWindow) => {
      const display = displayManager.displayContainsWindow(currentWindow)
        || displayManager.primaryDisplay
      if (display === undefined) { return }

      const bounds = {
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
        left: display.bounds.left + Math.round((display.bounds.width - WINDOW_WIDTH) * 0.5),
        top: display.bounds.top + Math.round((display.bounds.height - WINDOW_HEIGHT) * 0.5),
      }

      if (mainWindow) {
        chrome.windows.update(mainWindow.id, {
          ...bounds,
          focused: true,
        }, () => {
          sendMessage(setQuery(query))
        })
      } else {
        const url = chrome.runtime.getURL('index.html') + `?q=${query}`

        chrome.windows.create({
          ...bounds,
          url,
          focused: true,
          type: 'popup',
        }, (window) => {
          mainWindow = window
        })
      }
    })
  }
}

chrome.windows.onRemoved.addListener((windowId) => {
  if (!mainWindow) return

  if (windowId === mainWindow.id) {
    mainWindow = undefined
  }
})

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (!mainWindow) return

  if (windowId === mainWindow.id) {
    mainWindow.focused = true
  } else {
    mainWindow.focused = false
  }
})

chrome.commands.onCommand.addListener((command: string) => {
  switch (command) {
  case Command.ToggleTab:
    showWindow('')
    break

  case Command.ToggleBookmark:
    showWindow('b:')
    break

  case Command.ToggleHistory:
    showWindow('h:')
    break

  default:
    break
  }
})

chrome.runtime.onMessage.addListener((message: MessageTypes, sender, sendResponse) => {
  if (message.type === QUERY_ITEMS) {
    sendResponse(itemManager.queryItems(message.payload.query))
  }
})
