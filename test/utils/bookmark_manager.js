import EventEmitter from 'events';
import BookmarkManager from '../../src/utils/bookmark_manager';
import * as ItemTypes from '../../src/constants/item_types';
import assert from 'power-assert';
import sinon from 'sinon';
import createBookmark from '../fixtures/bookmark';

describe('BookmarkManager', () => {
  let bookmarks;
  let items;
  let eventEmitter;
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

    eventEmitter = new EventEmitter();

    function addListenerForEvent(event) {
      return (callback) => {
        eventEmitter.on(event, callback);
      };
    }

    global.chrome = {
      bookmarks: {
        onImportBegan: {
          addListener: addListenerForEvent('importBegan')
        },
        onImportEnded: {
          addListener: addListenerForEvent('importEnded')
        },
        onCreated: {
          addListener: addListenerForEvent('created')
        },
        onRemoved: {
          addListener: addListenerForEvent('removed')
        },
        onChanged: {
          addListener: addListenerForEvent('changed')
        },
        getRecent: sinon.stub().callsArgWith(1, bookmarks)
      }
    };

    bookmarkManager = new BookmarkManager();
  });

  it("should emit 'update' when bookmarks has been created", () => {
    const callback = sinon.spy();
    bookmarkManager.on('update', callback);
    eventEmitter.emit('created');

    assert(callback.called);
    assert.deepEqual(bookmarkManager.getItems(), items);
  });

  it("should not emit 'update' when bookmarks has been created during import", () => {
    const callback = sinon.spy();
    bookmarkManager.on('update', callback);
    eventEmitter.emit('importBegan');
    eventEmitter.emit('created');

    assert(!callback.called);
    assert.deepEqual(bookmarkManager.getItems(), items);
  });

  it("should emit 'update' when bookmarks has been removed", () => {
    const callback = sinon.spy();
    bookmarkManager.on('update', callback);
    eventEmitter.emit('removed');

    assert(callback.called);
    assert.deepEqual(bookmarkManager.getItems(), items);
  });

  it("should emit 'update' when bookmarks has been changed", () => {
    const callback = sinon.spy();
    bookmarkManager.on('update', callback);
    eventEmitter.emit('changed');

    assert(callback.called);
    assert.deepEqual(bookmarkManager.getItems(), items);
  });

  it("should not emit 'update' when bookmarks has been imported", () => {
    const callback = sinon.spy();
    bookmarkManager.on('update', callback);
    eventEmitter.emit('importBegan');
    eventEmitter.emit('importEnded');

    assert(callback.called);
    assert.deepEqual(bookmarkManager.getItems(), items);
  });
});
