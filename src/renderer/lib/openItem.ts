import { Item, ItemType } from "../../common/types";

export const openItem = (item: Item) => {
  if (item.type === ItemType.Tab) {
    chrome.tabs.highlight(
      {
        tabs: item.tabIndex,
        windowId: item.windowId,
      },
      (window) => chrome.windows.update(window.id, { focused: true })
    );
  } else {
    chrome.tabs.create({ url: item.url });
  }
};
