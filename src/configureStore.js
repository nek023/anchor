import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from "./sagas";

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();
  const logger = createLogger();
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      sagaMiddleware,
      logger
    )
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
