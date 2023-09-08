import { Item, ItemType } from "../../shared/types";

export const openItem = (item: Item) => {
  if (item.type === ItemType.Tab) {
    chrome.tabs.highlight(
      {
        tabs: item.tabIndex,
        windowId: item.windowId,
      },
      (window) => {
        if (window.id != null) {
          chrome.windows.update(window.id, { focused: true });
        }
      },
    );
  } else {
    chrome.tabs.create({ url: item.url });
  }
};
