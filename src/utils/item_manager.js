import Fuse from 'fuse.js';
import BookmarkManager from './bookmark_manager';
import HistoryManager from './history_manager';
import TabManager from './tab_manager';

function separateQuery(query) {
  query = query.trim();
  const separatorIndex = query.indexOf(':');
  const filter = query.substring(0, separatorIndex);
  const keyword = query.substring(separatorIndex + 1);
  return { filter, keyword };
}

export default class ItemManager {
  constructor({
    bookmarkManager = new BookmarkManager(),
    historyManager  = new HistoryManager(),
    tabManager      = new TabManager()
  } = {}) {
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

    this.filter = '';
    this.items = [];
    this.fuse = new Fuse([], fuseOptions);
    this.bookmarkManager = bookmarkManager;
    this.historyManager = historyManager;
    this.tabManager = tabManager;

    const updateItems = this.updateItems.bind(this);
    updateItems();

    this.bookmarkManager.on('update', updateItems);
    this.historyManager.on('update', updateItems);
    this.tabManager.on('update', updateItems);
  }

  updateItems() {
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
    this.fuse.set(items);
  }

  queryItems(query) {
    const { filter, keyword } = separateQuery(query);

    if (this.filter !== filter) {
      this.filter = filter;
      this.updateItems();
    }

    if (keyword === '') {
      return this.items.map(item => {
        return {
          item: item,
          score: 0,
          matches: []
        };
      });
    }

    return this.fuse.search(keyword);
  }
}
