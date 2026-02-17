import { BookmarkItem, ItemType } from "../../shared/types";

export class BookmarkLoader {
  private _items: BookmarkItem[] = [];
  private _importing = false;
  private _maxItems = 1000;
  private _debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private _debounceDelay = 200;

  onUpdate?: () => void;

  constructor() {
    chrome.bookmarks.onImportBegan.addListener(() => {
      this._importing = true;
    });
    chrome.bookmarks.onImportEnded.addListener(() => {
      this._importing = false;
      this.scheduleUpdate();
    });
    chrome.bookmarks.onCreated.addListener(() => {
      if (this._importing) return;
      this.scheduleUpdate();
    });
    chrome.bookmarks.onChanged.addListener(() => this.scheduleUpdate());
    chrome.bookmarks.onRemoved.addListener(() => this.scheduleUpdate());

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
    chrome.bookmarks.getRecent(this._maxItems, (items) => {
      this._items = items
        .filter((item) => item.url != null)
        .map((item) => ({
          id: `bookmark-${item.id}`,
          type: ItemType.Bookmark,
          title: item.title,
          url: item.url,
        }));
      this.onUpdate?.();
    });
  }
}
