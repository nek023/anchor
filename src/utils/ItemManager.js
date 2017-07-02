import Fuse from 'fuse.js';
import BookmarkManager from './BookmarkManager';
import HistoryManager from './HistoryManager';
import TabManager from './TabManager';

export default class ItemManager {
  constructor({
    bookmarkManager = new BookmarkManager(),
    historyManager  = new HistoryManager(),
    tabManager      = new TabManager()
  } = {}) {
    this.filter = '';
    this.items = [];
    this.bookmarkManager = bookmarkManager;
    this.historyManager = historyManager;
    this.tabManager = tabManager;

    const options = {
      includeMatches: true,
      includeScore: true,
      keys: [
        {
          name: 'title',
          weight: 0.7
        },
        {
          name: 'url',
          weight: 0.3
        }
      ]
    };
    this.fuse = new Fuse([], options);

    this.updateItems();

    this.bookmarkManager.on('update', this.updateItems);
    this.historyManager.on('update', this.updateItems);
    this.tabManager.on('update', this.updateItems);
  }

  updateItems = () => {
    let items = [];
    let matched = false;

    if (this.filter.includes('b')) {
      items = items.concat(this.bookmarkManager.getItems());
      matched = true;
    }
    if (this.filter.includes('h') || this.filter.includes('r')) {
      items = items.concat(this.historyManager.getItems());
      matched = true;
    }
    if (this.filter.includes('t') || !matched) {
      items = items.concat(this.tabManager.getItems());
    }

    this.items = items;
    this.fuse.setCollection(items);
  }

  separateQuery = (query) => {
    query = query.trim();
    const separatorIndex = query.indexOf(':');
    const filter = query.substring(0, separatorIndex);
    const pattern = query.substring(separatorIndex + 1);
    return { filter, pattern };
  }

  queryItems = (query) => {
    const { filter, pattern } = this.separateQuery(query);

    if (this.filter !== filter) {
      this.filter = filter;
      this.updateItems();
    }

    if (pattern === '') {
      return this.items.map((item) => {
        return {
          item: item,
          score: 0,
          matches: []
        };
      });
    }

    return this.fuse.search(pattern);
  }
}
