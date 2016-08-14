import EventEmitter from 'events';
import sinon from 'sinon';

class SingleEventEmitter {
  constructor(eventName = '') {
    this.eventEmitter = new EventEmitter();
    this.eventName = eventName;
  }

  addListener(listener) {
    this.eventEmitter.on(this.eventName, listener);
  }

  emit(...args) {
    this.eventEmitter.emit(this.eventName, ...args);
  }
}

export default function createMockChromeObject() {
  const chrome = {
    bookmarks: {
      onImportBegan: new SingleEventEmitter(),
      onImportEnded: new SingleEventEmitter(),
      onCreated: new SingleEventEmitter(),
      onRemoved: new SingleEventEmitter(),
      onChanged: new SingleEventEmitter(),
      getRecent: sinon.stub()
    },

    history: {
      onVisited: new SingleEventEmitter(),
      onVisitRemoved: new SingleEventEmitter(),
      search: sinon.stub()
    },

    tabs: {
      onCreated: new SingleEventEmitter(),
      onUpdated: new SingleEventEmitter(),
      onRemoved: new SingleEventEmitter(),
      onReplaced: new SingleEventEmitter(),
      query: sinon.stub()
    }
  };

  return chrome;
}
