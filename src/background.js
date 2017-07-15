import { Commands, MessageTypes } from './constants';
import { DisplayManager, ItemManager, sendMessage } from './utils';

let mainWindow = null;

const displayManager = new DisplayManager();
const itemManager = new ItemManager();

function showWindow(query = '') {
  if (mainWindow && mainWindow.focused) {
    chrome.windows.remove(mainWindow.id, () => {
      mainWindow = null;
    });
  } else {
    chrome.windows.getCurrent((currentWindow) => {
      const url = chrome.runtime.getURL('index.html') + `?q=${query}`;

      const display = displayManager.displayContainsWindow(currentWindow);
      if (display == null) return;

      const width = 600;
      const height = 496 + 22;
      const left = display.bounds.left + Math.round((display.bounds.width - width) * 0.5);
      const top = display.bounds.top + Math.round((display.bounds.height - height) * 0.5);

      if (mainWindow) {
        chrome.windows.update(mainWindow.id, {
          left, top, width, height,
          focused: true
        }, () => {
          sendMessage(MessageTypes.SET_QUERY, query);
        });
      } else {
        chrome.windows.create({
          left, top, width, height, url,
          focused: true,
          type: 'popup'
        }, (window) => {
          mainWindow = window;
        });
      }
    });
  }
}

chrome.windows.onRemoved.addListener((windowId) => {
  if (!mainWindow) return;

  if (windowId == mainWindow.id) {
    mainWindow = null;
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (!mainWindow) return;

  if (windowId == mainWindow.id) {
    mainWindow.focused = true;
  } else {
    mainWindow.focused = false;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type == MessageTypes.QUERY_ITEMS) {
    const query = message.payload;
    const items = itemManager.queryItems(query);
    sendResponse(items);
  }
});

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
  case Commands.TOGGLE_ANCHOR:
    showWindow();
    break;

  case Commands.TOGGLE_ANCHOR_WITH_BOOKMARK_MODE:
    showWindow('b:');
    break;

  case Commands.TOGGLE_ANCHOR_WITH_HISTORY_MODE:
    showWindow('h:');
    break;

  default:
    break;
  }
});
