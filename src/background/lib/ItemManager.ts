import Fuse from "fuse.js";
import { Item } from "../../common/types";
import { BookmarkManager, BookmarkManagerEvent } from "./BookmarkManager";
import { HistoryManager, HistoryManagerEvent } from "./HistoryManager";
import { TabManager, TabManagerEvent } from "./TabManager";

export class ItemManager {
  private _bookmarkManager: BookmarkManager;
  private _historyManager: HistoryManager;
  private _tabManager: TabManager;
  private _filter: string;
  private _items: Item[];
  private _fuse: Fuse<Item>;

  constructor(
    bookmarkManager: BookmarkManager = new BookmarkManager(),
    historyManager: HistoryManager = new HistoryManager(),
    tabManager: TabManager = new TabManager()
  ) {
    this._bookmarkManager = bookmarkManager;
    this._historyManager = historyManager;
    this._tabManager = tabManager;
    this._filter = "";
    this._items = [];
    this._fuse = new Fuse(this.items, {
      keys: [
        {
          name: "title",
          weight: 0.7,
        },
        {
          name: "url",
          weight: 0.3,
        },
      ],
    });

    this.updateItems();

    this._bookmarkManager.on(BookmarkManagerEvent.Update, this.updateItems);
    this._historyManager.on(HistoryManagerEvent.Update, this.updateItems);
    this._tabManager.on(TabManagerEvent.Update, this.updateItems);
  }

  get items(): Item[] {
    return this._items;
  }

  queryItems(query: string) {
    const { filter, keyword } = this.separateQuery(query);

    if (this._filter !== filter) {
      this._filter = filter;
      this.updateItems();
    }

    if (keyword === "") {
      return this.items;
    }

    return this._fuse.search(keyword).map((result) => result.item);
  }

  private separateQuery(query: string) {
    query = query.trim();
    const separatorIndex = query.indexOf(":");
    const filter = query.substring(0, separatorIndex);
    const keyword = query.substring(separatorIndex + 1);
    return { filter, keyword };
  }

  private updateItems = () => {
    let items: Item[] = [];
    let matched = false;

    if (this._filter.includes("b")) {
      items = items.concat(this._bookmarkManager.items);
      matched = true;
    }
    if (this._filter.includes("h")) {
      items = items.concat(this._historyManager.items);
      matched = true;
    }
    if (this._filter.includes("t") || !matched) {
      items = items.concat(this._tabManager.items);
    }

    this._items = items;
    this._fuse.setCollection(items);
  };
}
