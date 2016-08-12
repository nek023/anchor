import 'babel-polyfill';
import { call, put } from 'redux-saga/effects';
import * as sagas from '../src/sagas';
import * as actions from '../src/actions';
import * as messages from '../src/messages';
import assert from 'power-assert';

describe('sagas', () => {
  describe('queryItems saga', () => {
    it('should query items and set results', () => {
      const query = 'test query';
      const action = actions.setQuery(query);
      const results = ['result1', 'result2'];
      const generator = sagas.queryItems(action);

      assert.deepEqual(
        generator.next().value,
        call(messages.queryItems, action.payload)
      );

      assert.deepEqual(
        generator.next(results).value,
        put(actions.setResults(results))
      );

      assert.deepEqual(
        generator.next(),
        { done: true, value: undefined }
      );
    });
  });
});
