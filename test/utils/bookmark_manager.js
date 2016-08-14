import BookmarkManager from '../../src/utils/bookmark_manager';
import * as ItemTypes from '../../src/constants/item_types';
import assert from 'power-assert';
import sinon from 'sinon';
import createMockChromeObject from '../helpers/chrome_extension_helper';
import createBookmark from '../fixtures/bookmark';

describe('BookmarkManager', () => {
  let bookmarks;
  let items;
  let bookmarkManager;

  beforeEach(() => {
    bookmarks = [...Array(100).keys()].map(() => createBookmark());
    items = bookmarks.map(bookmark => {
      return {
        type:  ItemTypes.BOOKMARK,
        title: bookmark.title,
        url:   bookmark.url
      };
    });

    global.chrome = createMockChromeObject();
    chrome.bookmarks.getRecent.callsArgWith(1, bookmarks);

    bookmarkManager = new BookmarkManager();
  });

  it("should emit 'update' when bookmarks has been created", () => {
    const callback = sinon.spy();
    bookmarkManager.on('update', callback);
    chrome.bookmarks.onCreated.emit();

    assert(callback.called);
    assert.deepEqual(bookmarkManager.getItems(), items);
  });

  it("should not emit 'update' when bookmarks has been created during import", () => {
    const callback = sinon.spy();
    bookmarkManager.on('update', callback);
    chrome.bookmarks.onImportBegan.emit();
    chrome.bookmarks.onCreated.emit();

    assert(!callback.called);
    assert.deepEqual(bookmarkManager.getItems(), items);
  });

  it("should emit 'update' when bookmarks has been removed", () => {
    const callback = sinon.spy();
    bookmarkManager.on('update', callback);
    chrome.bookmarks.onRemoved.emit();

    assert(callback.called);
    assert.deepEqual(bookmarkManager.getItems(), items);
  });

  it("should emit 'update' when bookmarks has been changed", () => {
    const callback = sinon.spy();
    bookmarkManager.on('update', callback);
    chrome.bookmarks.onChanged.emit();

    assert(callback.called);
    assert.deepEqual(bookmarkManager.getItems(), items);
  });

  it("should not emit 'update' when bookmarks has been imported", () => {
    const callback = sinon.spy();
    bookmarkManager.on('update', callback);
    chrome.bookmarks.onImportBegan.emit();
    chrome.bookmarks.onImportEnded.emit();

    assert(callback.called);
    assert.deepEqual(bookmarkManager.getItems(), items);
  });
});
