import EventEmitter from 'events';
import * as ItemTypes from '../constants/item_types';

export default class TabManager extends EventEmitter {
  constructor() {
    super();

    this.items = [];

    const updateItems = this.updateItems.bind(this);
    updateItems();

    chrome.tabs.onCreated.addListener(updateItems);
    chrome.tabs.onUpdated.addListener(updateItems);
    chrome.tabs.onRemoved.addListener(updateItems);
    chrome.tabs.onReplaced.addListener(updateItems);
  }

  getItems() {
    return this.items;
  }

  updateItems() {
    chrome.tabs.query({
      windowType: 'normal'
    }, items => {
      this.items = items.map(item => {
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
