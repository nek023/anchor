import EventEmitter from 'events';
import * as ItemTypes from '../constants/item_types';

const MAX_HISTORY_RESULTS = 100;

export default class HistoryManager extends EventEmitter {
  constructor() {
    super();
    this.items = [];

    const days = 30;
    const microsecondsBack = 1000 * 60 * 60 * 24 * days;
    this.startTime = Date.now() - microsecondsBack;

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
      maxResults: MAX_HISTORY_RESULTS,
      startTime: this.startTime
    }, items => {
      this.items = items.map(item => {
        return {
          type: ItemTypes.HISTORY,
          title: item.title,
          url: item.url
        };
      });
      this.emit('update', items);
    });
  }
}
