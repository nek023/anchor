import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as reducers from './reducers';
import rootSaga from './sagas';

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    combineReducers(reducers),
    initialState,
    applyMiddleware(
      sagaMiddleware
    )
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
