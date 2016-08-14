import EventEmitter from 'events';
import HistoryManager from '../../src/utils/history_manager';
import * as ItemTypes from '../../src/constants/item_types';
import assert from 'power-assert';
import sinon from 'sinon';
import createHistory from '../fixtures/history';

describe('HistoryManager', () => {
  let histories;
  let items;
  let eventEmitter;
  let historyManager;

  beforeEach(() => {
    histories = [...Array(100).keys()].map(() => createHistory());
    items = histories.map(history => {
      return {
        type:  ItemTypes.HISTORY,
        title: history.title,
        url:   history.url
      };
    });

    eventEmitter = new EventEmitter();

    function addListenerForEvent(event) {
      return (callback) => {
        eventEmitter.on(event, callback);
      };
    }

    global.chrome = {
      history: {
        onVisited: {
          addListener: addListenerForEvent('visited')
        },
        onVisitRemoved: {
          addListener: addListenerForEvent('visitRemoved')
        },
        search: sinon.stub().callsArgWith(1, histories)
      }
    };

    historyManager = new HistoryManager();
  });

  it("should emit 'update' when history has been created", () => {
    const callback = sinon.spy();
    historyManager.on('update', callback);
    eventEmitter.emit('visited');

    assert(callback.called);
    assert.deepEqual(historyManager.getItems(), items);
  });

  it("should emit 'update' when history has been removed", () => {
    const callback = sinon.spy();
    historyManager.on('update', callback);
    eventEmitter.emit('visitRemoved');

    assert(callback.called);
    assert.deepEqual(historyManager.getItems(), items);
  });
});
