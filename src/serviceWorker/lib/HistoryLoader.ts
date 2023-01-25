import { HistoryItem, ItemType } from "../../shared/types";

export class HistoryLoader {
  private _items: HistoryItem[] = [];
  private _maxItems = 1000;
  private _searchRange = 1000 * 60 * 60 * 24 * 30; // 30 days

  constructor() {
    chrome.history.onVisited.addListener(() => this.updateItems());
    chrome.history.onVisitRemoved.addListener(() => this.updateItems());

    this.updateItems();
  }

  get items() {
    return this._items;
  }

  private updateItems() {
    chrome.history.search(
      {
        text: "",
        maxResults: this._maxItems,
        startTime: Date.now() - this._searchRange,
      },
      (items) => {
        this._items = items.map((item) => ({
          id: `history-${item.id}`,
          type: ItemType.History,
          title: item.title,
          url: item.url,
        }));
      }
    );
  }
}
