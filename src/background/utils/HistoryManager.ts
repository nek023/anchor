import { EventEmitter } from "events";
import { HistoryItem, ItemType } from "../../common/types";

const MAX_HISTORIES = 1000;
const HISTORY_RANGE = 1000 * 60 * 60 * 24 * 30; // 30 days

export const HistoryManagerEvent = {
  Update: "update",
} as const;

export class HistoryManager extends EventEmitter {
  private _items: HistoryItem[];

  constructor() {
    super();

    this._items = [];

    this.updateItems();

    chrome.history.onVisited.addListener(this.updateItems);
    chrome.history.onVisitRemoved.addListener(this.updateItems);
  }

  get items(): HistoryItem[] {
    return this._items;
  }

  private updateItems = () => {
    chrome.history.search(
      {
        text: "",
        maxResults: MAX_HISTORIES,
        startTime: Date.now() - HISTORY_RANGE,
      },
      (items) => {
        this._items = items.map((item) => ({
          type: ItemType.History,
          title: item.title,
          url: item.url,
        }));
        this.emit(HistoryManagerEvent.Update);
      }
    );
  };
}
