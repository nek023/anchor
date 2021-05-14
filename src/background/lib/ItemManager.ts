import Fuse from "fuse.js";
import { Item } from "../../common/types";
import { BookmarkManager } from "./BookmarkManager";
import { HistoryManager } from "./HistoryManager";
import { TabManager } from "./TabManager";

export class ItemManager {
  private _bookmarkManager: BookmarkManager = new BookmarkManager();
  private _historyManager: HistoryManager = new HistoryManager();
  private _tabManager: TabManager = new TabManager();

  private _fuse: Fuse<Item> = new Fuse([], {
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

  queryItems(query: string) {
    const { filter, keyword } = this.parseQuery(query);

    const items = this.filtertedItems(filter);
    if (keyword === "") return items;

    this._fuse.setCollection(items);
    return this._fuse.search(keyword).map((result) => result.item);
  }

  private parseQuery(query: string) {
    query = query.trim();
    const separatorIndex = query.indexOf(":");
    const filter = query.substring(0, separatorIndex);
    const keyword = query.substring(separatorIndex + 1);
    return { filter, keyword };
  }

  private filtertedItems(filter: string) {
    let items: Item[] = [];
    let matched = false;

    if (filter.includes("b")) {
      items = items.concat(this._bookmarkManager.items);
      matched = true;
    }
    if (filter.includes("h")) {
      items = items.concat(this._historyManager.items);
      matched = true;
    }
    if (filter.includes("t") || !matched) {
      items = items.concat(this._tabManager.items);
    }

    return items;
  }
}
