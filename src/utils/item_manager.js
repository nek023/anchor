import Fuse from 'fuse.js';
import TabManager from './tab_manager';
import HistoryManager from './history_manager';
import BookmarkManager from './bookmark_manager';

export default class ItemManager {
  constructor() {
    const fuseOptions = {
      keys: [
        {
          name: 'title',
          weight: 0.7
        },
        {
          name: 'url',
          weight: 0.3
        }
      ],
      include: ['score', 'matches']
    };

    this.items = [];
    this.filter = '';
    this.fuse = new Fuse([], fuseOptions);
    this.tabManager = new TabManager();
    this.historyManager = new HistoryManager();
    this.bookmarkManager = new BookmarkManager();

    const updateItems = this.updateItems.bind(this);
    updateItems();
    this.tabManager.on('update', updateItems);
    this.historyManager.on('update', updateItems);
    this.bookmarkManager.on('update', updateItems);
  }

  updateItems() {
    let items = [];
    let matched = false;
    if (this.filter.includes('t')) {
      items = items.concat(this.tabManager.getItems());
      matched = true;
    }
    if (this.filter.includes('h') || this.filter.includes('r')) {
      items = items.concat(this.historyManager.getItems());
      matched = true;
    }
    if (this.filter.includes('b')) {
      items = items.concat(this.bookmarkManager.getItems());
      matched = true;
    }

    if (!matched) {
      items = this.tabManager.getItems();
    }

    this.items = items;
    this.fuse.set(items);
  }

  queryItems(query) {
    query = query.trim();
    const endOfFilter = query.indexOf(':');
    const filter = query.substring(0, endOfFilter);
    const keyword = query.substring(endOfFilter);

    if (this.filter !== filter) {
      this.filter = filter;
      this.updateItems();
    }

    if (keyword === '') {
      return this.items.map((item, index) => {
        return {
          index: index,
          item: item,
          matches: [],
          score: 0
        };
      });
    }

    return this.fuse.search(keyword);
  }
}
