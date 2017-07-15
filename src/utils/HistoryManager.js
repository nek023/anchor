import EventEmitter from 'events';
import { ItemTypes } from '../constants';

const MAX_HISTORIES = 100;
const HISTORY_RANGE = 1000 * 60 * 60 * 24 * 30; // 30 days

export default class HistoryManager extends EventEmitter {
  constructor() {
    super();

    this.items = [];

    this.updateItems();

    chrome.history.onVisited.addListener(this.updateItems);
    chrome.history.onVisitRemoved.addListener(this.updateItems);
  }

  getItems = () => {
    return this.items;
  }

  updateItems = () => {
    chrome.history.search({
      text: '',
      maxResults: MAX_HISTORIES,
      startTime: (Date.now() - HISTORY_RANGE)
    }, (items) => {
      this.items = items.map((item) => {
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
