import { Commands } from './constants';
import DisplayManager from './utils/display_manager';
import WindowManager from './utils/window_manager';
import ItemManager from './utils/item_manager';
import { QUERY_ITEMS } from './messages';

const appUrl = chrome.runtime.getURL('index.html');

const displayManager = new DisplayManager();
const windowManager = new WindowManager(appUrl);
const itemManager = new ItemManager();

function showWindowOnCurrentDisplay() {
  if (windowManager.isWindowVisible() && windowManager.isWindowFocused()) {
    windowManager.closeWindow();
  } else {
    chrome.windows.getCurrent(window => {
      const display = displayManager.displayContainsWindow(window);
      if (display == null) return;

      const width = 600;
      const height = 496 + 22;
      const left = display.bounds.left + Math.round((display.bounds.width - width) * 0.5);
      const top = display.bounds.top + Math.round((display.bounds.height - height) * 0.5);
      windowManager.showWindow(left, top, width, height);
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
    // TODO: Set 'b:' as initial query
    showWindowOnCurrentDisplay();
    break;

  case Commands.TOGGLE_ANCHOR_WITH_HISTORY_MODE:
    // TODO: Set 'h:' as initial query
    showWindowOnCurrentDisplay();
    break;

  default:
    break;
  }
});
