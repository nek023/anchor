import EventEmitter from 'events';
import TabManager from '../../src/utils/tab_manager';
import * as ItemTypes from '../../src/constants/item_types';
import assert from 'power-assert';
import sinon from 'sinon';
import createTab from '../fixtures/tab';

describe('TabManager', () => {
  let tabs;
  let items;
  let eventEmitter;
  let tabManager;

  beforeEach(() => {
    tabs = [...Array(100).keys()].map(() => createTab());
    items = tabs.map(tab => {
      return {
        type:       ItemTypes.TAB,
        windowId:   tab.windowId,
        tabIndex:   tab.index,
        title:      tab.title,
        url:        tab.url,
        favIconUrl: tab.favIconUrl
      };
    });

    eventEmitter = new EventEmitter();

    function addListenerForEvent(event) {
      return (callback) => {
        eventEmitter.on(event, callback);
      };
    }

    global.chrome = {
      tabs: {
        onCreated: {
          addListener: addListenerForEvent('created')
        },
        onUpdated: {
          addListener: addListenerForEvent('updated')
        },
        onRemoved: {
          addListener: addListenerForEvent('removed')
        },
        onReplaced: {
          addListener: addListenerForEvent('replaced')
        },
        query: sinon.stub().callsArgWith(1, tabs)
      }
    };

    tabManager = new TabManager();
  });

  it("should emit 'update' when tab has been created", () => {
    const callback = sinon.spy();
    tabManager.on('update', callback);
    eventEmitter.emit('created');

    assert(callback.called);
    assert.deepEqual(tabManager.getItems(), items);
  });

  it("should emit 'update' when tab has been updated", () => {
    const callback = sinon.spy();
    tabManager.on('update', callback);
    eventEmitter.emit('updated');

    assert(callback.called);
    assert.deepEqual(tabManager.getItems(), items);
  });

  it("should emit 'update' when tab has been removed", () => {
    const callback = sinon.spy();
    tabManager.on('update', callback);
    eventEmitter.emit('removed');

    assert(callback.called);
    assert.deepEqual(tabManager.getItems(), items);
  });

  it("should emit 'update' when tab has been replaced", () => {
    const callback = sinon.spy();
    tabManager.on('update', callback);
    eventEmitter.emit('replaced');

    assert(callback.called);
    assert.deepEqual(tabManager.getItems(), items);
  });
});
