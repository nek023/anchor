import Fuse from "fuse.js";
import { Item } from "../../shared/types";

export interface ItemLoader {
  get items(): Item[];
}

export class ItemManager {
  private _loaders: Record<string, ItemLoader>;
  private _items: Item[] = [];
  private _lastFilter?: string;
  private _lastUpdateDate = Date.now();
  private _cacheTtl = 1000 * 10; // 10 seconds
  private _maxItems = 100;

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
    if (
      this._lastFilter == null ||
      filter !== this._lastFilter ||
      Date.now() - this._lastUpdateDate > this._cacheTtl
    ) {
      this._items = this.loadItems(filter);
      this._lastUpdateDate = Date.now();
      this._fuse.setCollection(this._items);
    }
    this._lastFilter = filter;

    if (pattern === "") return this._items.slice(0, this._maxItems);

    return this._fuse
      .search(pattern, { limit: this._maxItems })
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
