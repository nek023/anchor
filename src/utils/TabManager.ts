import EventEmitter from 'events'
import { ItemType, TabItem } from '../types'

export enum TabManagerEvent {
  Update = 'update',
}

export default class TabManager extends EventEmitter {
  private _items: TabItem[]

  constructor() {
    super()

    this._items = []

    this.updateItems()

    chrome.tabs.onCreated.addListener(this.updateItems)
    chrome.tabs.onRemoved.addListener(this.updateItems)
    chrome.tabs.onReplaced.addListener(this.updateItems)
    chrome.tabs.onUpdated.addListener(this.updateItems)
  }

  get items(): TabItem[] {
    return this._items
  }

  private updateItems = () => {
    chrome.tabs.query({ windowType: 'normal' }, items => {
      this._items = items.map(item => {
        return {
          type: ItemType.Tab,
          favIconUrl: item.favIconUrl,
          title: item.title,
          url: item.url,
          tabIndex: item.index,
          windowId: item.windowId,
        }
      })
      this.emit(TabManagerEvent.Update)
    })
  }
}
