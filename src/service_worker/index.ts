import { DisplayManager } from "./lib/DisplayManager";
import { Message, MessageType, sendMessage, setQuery } from "../shared/ipc";
import { parseQuery } from "./lib/parseQuery";
import { ItemManager } from "./lib/ItemManager";
import { BookmarkLoader } from "./lib/BookmarkLoader";
import { HistoryLoader } from "./lib/HistoryLoader";
import { TabLoader } from "./lib/TabLoader";

const Command = {
  toggleTab: "toggle-anchor",
  toggleBookmark: "toggle-anchor-with-bookmark-mode",
  toggleHistory: "toggle-anchor-with-history-mode",
} as const;

const WindowSize = {
  width: 600,
  height: 526,
};

const displayManager = new DisplayManager();
const itemManager = new ItemManager({
  b: new BookmarkLoader(),
  h: new HistoryLoader(),
  t: new TabLoader(),
});

let mainWindow: chrome.windows.Window | undefined;

const openWindow = (query: string) => {
  if (mainWindow?.id != null && mainWindow.focused) {
    chrome.windows.remove(mainWindow.id, () => {
      mainWindow = undefined;
    });
  } else {
    chrome.windows.getCurrent((currentWindow) => {
      const display =
        displayManager.displayContainsWindow(currentWindow) ||
        displayManager.primaryDisplay;
      if (display == null) return;

      const bounds = {
        width: WindowSize.width,
        height: WindowSize.height,
        left:
          display.bounds.left +
          Math.round((display.bounds.width - WindowSize.width) * 0.5),
        top:
          display.bounds.top +
          Math.round((display.bounds.height - WindowSize.height) * 0.5),
      };

      if (mainWindow?.id != null) {
        chrome.windows.update(
          mainWindow.id,
          {
            ...bounds,
            focused: true,
          },
          () => sendMessage(setQuery(query))
        );
      } else {
        const url = chrome.runtime.getURL("public/popup.html") + `?q=${query}`;
        chrome.windows.create(
          {
            ...bounds,
            url,
            focused: true,
            type: "popup",
          },
          (window) => {
            mainWindow = window;
          }
        );
      }
    });
  }
};

chrome.windows.onRemoved.addListener((windowId) => {
  if (mainWindow == null) return;

  if (windowId === mainWindow.id) {
    mainWindow = undefined;
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (mainWindow == null) return;

  if (windowId === mainWindow.id) {
    mainWindow.focused = true;
  } else {
    mainWindow.focused = false;
  }
});

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case Command.toggleTab:
      openWindow("");
      break;

    case Command.toggleBookmark:
      openWindow("b:");
      break;

    case Command.toggleHistory:
      openWindow("h:");
      break;

    default:
      break;
  }
});

chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    if (message.type === MessageType.searchItems) {
      const { filter, pattern } = parseQuery(message.payload.query);
      const items = itemManager.searchItems(
        filter !== "" ? filter : "t",
        pattern
      );
      sendResponse(items);
    }
  }
);
