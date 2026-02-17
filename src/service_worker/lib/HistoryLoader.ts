import { HistoryItem, ItemType } from "../../shared/types";

export class HistoryLoader {
  private _items: HistoryItem[] = [];
  private _maxItems = 1000;
  private _searchRange = 1000 * 60 * 60 * 24 * 30; // 30 days
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private _debounceDelay = 200;

  onUpdate?: () => void;

  constructor() {
    chrome.history.onVisited.addListener(() => this.scheduleUpdate());
    chrome.history.onVisitRemoved.addListener(() => this.scheduleUpdate());

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
        this.onUpdate?.();
      },
    );
  }
}
