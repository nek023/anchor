import process from 'process';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer, { rootSaga } from './modules';

export default function configureStore(initialState) {
  let middlewares = [];

  if (process.env.NODE_ENV !== 'production') {
    const logger = require('redux-logger').default;
    middlewares.push(logger);
  }

  const sagaMiddleware = createSagaMiddleware();
  middlewares.push(sagaMiddleware);

  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(...middlewares)
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
