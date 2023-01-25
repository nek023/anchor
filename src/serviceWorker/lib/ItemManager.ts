import Fuse from "fuse.js";
import { Item } from "../../shared/types";

const MAX_ITEMS = 100;

export interface ItemLoader {
  get items(): Item[];
}

export class ItemManager {
  private _loaders: Record<string, ItemLoader>;
  private _lastFilter?: string;
  private _items: Item[] = [];

  private _fuse = new Fuse<Item>([], {
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

  constructor(loaders: Record<string, ItemLoader>) {
    this._loaders = loaders;
  }

  searchItems(filter: string, pattern: string): Item[] {
    if (this._lastFilter == null || filter !== this._lastFilter) {
      this._items = this.loadItems(filter);
      this._fuse.setCollection(this._items);
    }
    this._lastFilter = filter;

    if (pattern === "") return this._items.slice(0, MAX_ITEMS);

    return this._fuse
      .search(pattern, { limit: MAX_ITEMS })
      .map((result) => result.item);
  }

  private loadItems(filter: string): Item[] {
    return Object.entries(this._loaders)
      .map(([key, loader]) => {
        return filter.includes(key) ? loader.items : [];
      })
      .flat();
  }
}
