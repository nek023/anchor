import EventEmitter from 'events';
import { MAX_HISTORY_RESULTS, ItemType } from '../constants';

export default class HistoryManager extends EventEmitter {
  constructor() {
    super();
    this.items = [];

    const updateItems = this.updateItems.bind(this);
    updateItems();
    chrome.history.onVisited.addListener(updateItems);
    chrome.history.onVisitRemoved.addListener(updateItems);
  }

  getItems() {
    return this.items;
  }

  updateItems() {
    chrome.history.search({
      text: '',
      maxResults: MAX_HISTORY_RESULTS
    }, items => {
      this.items = items.map(item => {
        return {
          type: ItemType.HISTORY,
          title: item.title,
          url: item.url
        };
      });
      this.emit('update', items);
    });
  }
}
