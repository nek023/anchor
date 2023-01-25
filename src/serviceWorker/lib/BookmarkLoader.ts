import { BookmarkItem, ItemType } from "../../shared/types";

export class BookmarkLoader {
  private _items: BookmarkItem[] = [];
  private _importing = false;
  private _maxItems = 1000;

  constructor() {
    chrome.bookmarks.onImportBegan.addListener(() => {
      this._importing = true;
    });
    chrome.bookmarks.onImportEnded.addListener(() => {
      this._importing = false;
      this.updateItems();
    });
    chrome.bookmarks.onCreated.addListener(() => {
      if (this._importing) return;
      this.updateItems();
    });
    chrome.bookmarks.onChanged.addListener(() => this.updateItems());
    chrome.bookmarks.onRemoved.addListener(() => this.updateItems());

    this.updateItems();
  }

  get items() {
    return this._items;
  }

  private updateItems() {
    chrome.bookmarks.getRecent(this._maxItems, (items) => {
      this._items = items.map((item) => ({
        id: `bookmark-${item.id}`,
        type: ItemType.Bookmark,
        title: item.title,
        url: item.url,
      }));
    });
  }
}
