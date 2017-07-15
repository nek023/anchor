import EventEmitter from 'events';
import { ItemTypes } from '../constants';

export default class TabManager extends EventEmitter {
  constructor() {
    super();

    this.items = [];

    this.updateItems();

    chrome.tabs.onCreated.addListener(this.updateItems);
    chrome.tabs.onUpdated.addListener(this.updateItems);
    chrome.tabs.onRemoved.addListener(this.updateItems);
    chrome.tabs.onReplaced.addListener(this.updateItems);
  }

  getItems = () => {
    return this.items;
  }

  updateItems = () => {
    chrome.tabs.query({
      windowType: 'normal'
    }, (items) => {
      this.items = items.map((item) => {
        return {
          type: ItemTypes.TAB,
          windowId: item.windowId,
          tabIndex: item.index,
          title: item.title,
          url: item.url,
          favIconUrl: item.favIconUrl
        };
      });
      this.emit('update', items);
    });
  }
}
