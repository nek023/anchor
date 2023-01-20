import Fuse from "fuse.js";
import { Item } from "../../lib/types";

export interface Loader {
  load(): Item[];
}

export class ItemManager {
  private _loaders: Record<string, Loader>;

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

  constructor(loaders: Record<string, Loader>) {
    this._loaders = loaders;
  }

  searchItems(filter: string, pattern: string): Item[] {
    const items = this.loadItems(filter);

    if (pattern === "") return items;

    this._fuse.setCollection(items);
    return this._fuse.search(pattern).map((result) => result.item);
  }

  private loadItems(filter: string): Item[] {
    return Object.entries(this._loaders)
      .map(([key, loader]) => {
        return filter.includes(key) ? loader.load() : [];
      })
      .flat();
  }
}
