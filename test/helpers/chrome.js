import sinon from 'sinon';
import SingleEventEmitter from '../helpers/single_event_emitter';

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

    system: {
      display: {
        onDisplayChanged: new SingleEventEmitter(),
        getInfo: sinon.stub()
      }
    },

    tabs: {
      onCreated: new SingleEventEmitter(),
      onUpdated: new SingleEventEmitter(),
      onRemoved: new SingleEventEmitter(),
      onReplaced: new SingleEventEmitter(),
      query: sinon.stub()
    },

    windows: {
      onRemoved: new SingleEventEmitter(),
      onFocusChanged: new SingleEventEmitter(),
      create: sinon.stub(),
      update: sinon.stub(),
      remove: sinon.stub()
    }
  };

  return chrome;
}
