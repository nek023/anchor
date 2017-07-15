import assert from 'power-assert';
import {
  BookmarkManager,
  HistoryManager,
  ItemManager,
  TabManager
} from '../../src/utils';
import {
  createBookmark,
  createHistory,
  createMockChromeObject,
  createTab
} from '../helpers';

function createResultObject({
  item    = null,
  score   = 0,
  matches = []
} = {}) {
  return {
    item,
    score,
    matches
  };
}

function resultsFromItems(items) {
  return items.map((item) => createResultObject({ item }));
}

describe('ItemManager', () => {
  let bookmarks;
  let histories;
  let tabs;
  let bookmarkManager;
  let historyManager;
  let tabManager;
  let itemManager;

  beforeEach(() => {
    bookmarks = [...Array(100).keys()].map(() => createBookmark());
    histories = [...Array(100).keys()].map(() => createHistory());
    tabs = [...Array(100).keys()].map(() => createTab());

    global.chrome = createMockChromeObject();
    chrome.bookmarks.getRecent.callsArgWith(1, bookmarks);
    chrome.history.search.callsArgWith(1, histories);
    chrome.tabs.query.callsArgWith(1, tabs);

    bookmarkManager = new BookmarkManager();
    historyManager = new HistoryManager();
    tabManager = new TabManager();

    itemManager = new ItemManager({
      bookmarkManager,
      historyManager,
      tabManager
    });
  });

  it('should update items when tabs have been updated', () => {
    assert(itemManager.queryItems('').length === 100);

    tabs = [...Array(200).keys()].map(() => createTab());
    chrome.tabs.query.callsArgWith(1, tabs);
    chrome.tabs.onCreated.emit();

    assert(itemManager.queryItems('').length === 200);
  });

  describe('#queryItems()', () => {
    it('should return all tab items when query is empty', () => {
      const items = tabManager.getItems();
      const expected = resultsFromItems(items);
      const actual = itemManager.queryItems('');

      assert.deepEqual(actual, expected);
    });

    it("should return all bookmark items when query is 'b:'", () => {
      const items = bookmarkManager.getItems();
      const expected = resultsFromItems(items);
      const actual = itemManager.queryItems('b:');

      assert.deepEqual(actual, expected);
    });

    it("should return all history items when query is 'h:'", () => {
      const items = historyManager.getItems();
      const expected = resultsFromItems(items);
      const actual = itemManager.queryItems('h:');

      assert.deepEqual(actual, expected);
    });

    it("should return all history items when query is 'r:'", () => {
      const items = historyManager.getItems();
      const expected = resultsFromItems(items);
      const actual = itemManager.queryItems('r:');

      assert.deepEqual(actual, expected);
    });

    it("should return all tab items when query is 't:'", () => {
      const items = tabManager.getItems();
      const expected = resultsFromItems(items);
      const actual = itemManager.queryItems('t:');

      assert.deepEqual(actual, expected);
    });

    it("should return all bookmark and history items when query is 'bh:'", () => {
      const items = [
        ...bookmarkManager.getItems(),
        ...historyManager.getItems()
      ];
      const expected = resultsFromItems(items);
      const actual = itemManager.queryItems('bh:');

      assert.deepEqual(actual, expected);
    });

    it("should return all items when query is 'tbh:'", () => {
      const items = [
        ...bookmarkManager.getItems(),
        ...historyManager.getItems(),
        ...tabManager.getItems()
      ];
      const expected = resultsFromItems(items);
      const actual = itemManager.queryItems('tbh:');

      assert.deepEqual(actual, expected);
    });
  });
});
