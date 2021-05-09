import { EventEmitter } from "events";
import { BookmarkItem, ItemType } from "../../common/types";

const MAX_BOOKMARKS = 1000;

export const BookmarkManagerEvent = {
  Update: "update",
} as const;

export class BookmarkManager extends EventEmitter {
  private _items: BookmarkItem[] = [];
  private _importing = false;

  constructor() {
    super();

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
    chrome.bookmarks.getRecent(MAX_BOOKMARKS, (items) => {
      this._items = items.map((item) => ({
        id: `bookmark-${item.id}`,
        type: ItemType.Bookmark,
        title: item.title,
        url: item.url,
      }));
      this.emit(BookmarkManagerEvent.Update);
    });
  }
}
