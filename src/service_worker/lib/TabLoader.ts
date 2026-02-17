import { ItemType, TabItem } from "../../shared/types";

export class TabLoader {
  private _items: TabItem[] = [];
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private _debounceDelay = 200;

  onUpdate?: () => void;

  constructor() {
    chrome.tabs.onCreated.addListener(() => this.scheduleUpdate());
    chrome.tabs.onRemoved.addListener(() => this.scheduleUpdate());
    chrome.tabs.onReplaced.addListener(() => this.scheduleUpdate());
    chrome.tabs.onUpdated.addListener(() => this.scheduleUpdate());

    this.updateItems();
  }

  get items() {
    return this._items;
  }

  private scheduleUpdate() {
    if (this._debounceTimer != null) {
      clearTimeout(this._debounceTimer);
    }
    this._debounceTimer = setTimeout(() => {
      this._debounceTimer = null;
      this.updateItems();
    }, this._debounceDelay);
  }

  private updateItems() {
    chrome.tabs.query({ windowType: "normal" }, (items) => {
      this._items = items.map((item) => ({
        id: `tab-${item.id}`,
        type: ItemType.Tab,
        faviconUrl: item.favIconUrl,
        title: item.title,
        url: item.url,
        tabIndex: item.index,
        windowId: item.windowId,
      }));
      this.onUpdate?.();
    });
  }
}
