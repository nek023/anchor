import { Command, Message } from './constants';
import WindowManager from './utils/window_manager';
import ItemManager from './utils/item_manager';

const windowManager = new WindowManager();
const itemManager = new ItemManager();

function toggleWindow() {
  if (windowManager.isWindowVisible()) {
    windowManager.closeWindow();
  } else {
    windowManager.showWindow();
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type == Message.QUERY_ITEMS) {
    const query = message.query;
    const items = itemManager.queryItems(query);
    sendResponse(items);
  }
});

chrome.commands.onCommand.addListener(command => {
  switch(command) {
  case Command.TOGGLE_ANCHOR:
    toggleWindow();
    break;

  case Command.TOGGLE_ANCHOR_WITH_BOOKMARK_MODE:
    // TODO: Set 'b:' as initial query
    toggleWindow();
    break;

  case Command.TOGGLE_ANCHOR_WITH_HISTORY_MODE:
    // TODO: Set 'h:' as initial query
    toggleWindow();
    break;

  default:
    break;
  }
});
