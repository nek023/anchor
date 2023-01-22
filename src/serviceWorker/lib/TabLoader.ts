import { ItemType, TabItem } from "../../lib/types";

export class TabLoader {
  private _items: TabItem[] = [];

  constructor() {
    chrome.tabs.onCreated.addListener(() => this.updateItems());
    chrome.tabs.onRemoved.addListener(() => this.updateItems());
    chrome.tabs.onReplaced.addListener(() => this.updateItems());
    chrome.tabs.onUpdated.addListener(() => this.updateItems());

    this.updateItems();
  }

  get items() {
    return this._items;
  }

  private updateItems() {
    chrome.tabs.query({ windowType: "normal" }, (items) => {
      this._items = items.map((item) => ({
        id: `tab-${item.id}`,
        type: ItemType.Tab,
        favIconUrl: item.favIconUrl,
        title: item.title,
        url: item.url,
        tabIndex: item.index,
        windowId: item.windowId,
      }));
    });
  }
}
