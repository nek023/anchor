import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as reducers from './reducers';

export default function configureStore(initialState) {
  let middlewares = [];

  if (__DEBUG__) {
    const createLogger = require('redux-logger');
    middlewares.push(createLogger());
  }

  const sagaMiddleware = createSagaMiddleware();
  middlewares.push(sagaMiddleware);

  const store = createStore(
    combineReducers(reducers),
    initialState,
    applyMiddleware(...middlewares)
  );

  return {
    ...store,
    runSaga: sagaMiddleware.run
  };
}
