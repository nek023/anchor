import TabManager from '../../src/utils/tab_manager';
import * as ItemTypes from '../../src/constants/item_types';
import assert from 'power-assert';
import sinon from 'sinon';
import createMockChromeObject from '../helpers/chrome_extension_helper';
import createTab from '../fixtures/tab';

describe('TabManager', () => {
  let tabs;
  let items;
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

    global.chrome = createMockChromeObject();
    chrome.tabs.query.callsArgWith(1, tabs);

    tabManager = new TabManager();
  });

  it("should emit 'update' when tab has been created", () => {
    const callback = sinon.spy();
    tabManager.on('update', callback);
    chrome.tabs.onCreated.emit();

    assert(callback.called);
    assert.deepEqual(tabManager.getItems(), items);
  });

  it("should emit 'update' when tab has been updated", () => {
    const callback = sinon.spy();
    tabManager.on('update', callback);
    chrome.tabs.onUpdated.emit();

    assert(callback.called);
    assert.deepEqual(tabManager.getItems(), items);
  });

  it("should emit 'update' when tab has been removed", () => {
    const callback = sinon.spy();
    tabManager.on('update', callback);
    chrome.tabs.onRemoved.emit();

    assert(callback.called);
    assert.deepEqual(tabManager.getItems(), items);
  });

  it("should emit 'update' when tab has been replaced", () => {
    const callback = sinon.spy();
    tabManager.on('update', callback);
    chrome.tabs.onReplaced.emit();

    assert(callback.called);
    assert.deepEqual(tabManager.getItems(), items);
  });
});
