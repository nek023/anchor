import * as Commands from './constants/commands';
import DisplayManager from './utils/display_manager';
import WindowManager from './utils/window_manager';
import ItemManager from './utils/item_manager';
import { QUERY_ITEMS, SET_QUERY } from './messages';

const displayManager = new DisplayManager();
const windowManager = new WindowManager();
const itemManager = new ItemManager();

function showWindowOnCurrentDisplay(initialQuery = '') {
  if (windowManager.isWindowVisible() && windowManager.isWindowFocused()) {
    windowManager.closeWindow();
  } else {
    chrome.windows.getCurrent(window => {
      // Build url
      const url = chrome.runtime.getURL('index.html') + `?q=${initialQuery}`;

      // Compute window size and position
      const display = displayManager.displayContainsWindow(window);
      if (display == null) return;

      const width = 600;
      const height = 496 + 22;
      const left = display.bounds.left + Math.round((display.bounds.width - width) * 0.5);
      const top = display.bounds.top + Math.round((display.bounds.height - height) * 0.5);

      windowManager.showWindow({ url, left, top, width, height }, (window, created) => {
        if (created) return;
        chrome.runtime.sendMessage({
          type: SET_QUERY,
          payload: initialQuery
        });
      });
    });
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type == QUERY_ITEMS) {
    const query = message.payload;
    const items = itemManager.queryItems(query);
    sendResponse(items);
  }
});

chrome.commands.onCommand.addListener(command => {
  switch (command) {
  case Commands.TOGGLE_ANCHOR:
    showWindowOnCurrentDisplay();
    break;

  case Commands.TOGGLE_ANCHOR_WITH_BOOKMARK_MODE:
    showWindowOnCurrentDisplay('b:');
    break;

  case Commands.TOGGLE_ANCHOR_WITH_HISTORY_MODE:
    showWindowOnCurrentDisplay('h:');
    break;

  default:
    break;
  }
});
