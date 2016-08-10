import EventEmitter from 'events';
import { MAX_BOOKMARK_RESULTS, ItemTypes } from '../constants';

export default class BookmarkManager extends EventEmitter {
  constructor() {
    super();
    this.items = [];
    this.importing = false;

    chrome.bookmarks.onImportBegan.addListener(() => {
      this.importing = true;
    });

    chrome.bookmarks.onImportEnded.addListener(() => {
      this.importing = false;
    });

    const updateItems = this.updateItems.bind(this);
    updateItems();
    chrome.bookmarks.onCreated.addListener(() => {
      if (!this.importing) updateItems();
    });
    chrome.bookmarks.onRemoved.addListener(updateItems);
    chrome.bookmarks.onChanged.addListener(updateItems);
  }

  getItems() {
    return this.items;
  }

  updateItems() {
    chrome.bookmarks.getRecent(MAX_BOOKMARK_RESULTS, items => {
      this.items = items.map(item => {
        return {
          type: ItemTypes.BOOKMARK,
          title: item.title,
          url: item.url
        };
      });
      this.emit('update', items);
    });
  }
}
