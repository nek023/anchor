import EventEmitter from 'events';
import { ItemTypes } from '../constants';

const MAX_BOOKMARKS = 1000;

export default class BookmarkManager extends EventEmitter {
  constructor() {
    super();

    this.items = [];
    this.importing = false;

    this.updateItems();

    chrome.bookmarks.onImportBegan.addListener(() => {
      this.importing = true;
    });
    chrome.bookmarks.onImportEnded.addListener(() => {
      this.importing = false;
      this.updateItems();
    });
    chrome.bookmarks.onCreated.addListener(() => {
      if (!this.importing) this.updateItems();
    });
    chrome.bookmarks.onRemoved.addListener(this.updateItems);
    chrome.bookmarks.onChanged.addListener(this.updateItems);
  }

  getItems = () => {
    return this.items;
  }

  updateItems = () => {
    chrome.bookmarks.getRecent(MAX_BOOKMARKS, (items) => {
      this.items = items.map((item) => {
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
