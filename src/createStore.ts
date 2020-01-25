/* eslint-disable @typescript-eslint/no-var-requires */

import { applyMiddleware, createStore as reduxCreateStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { State, rootReducer } from './modules/index'
import { rootSaga } from './sagas/index'

export const createStore = (initialState: State) => {
  const middlewares = []

  if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger')
    middlewares.push(logger)
  }

  const sagaMiddleware = createSagaMiddleware()
  middlewares.push(sagaMiddleware)

  const store = reduxCreateStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  )

  sagaMiddleware.run(rootSaga)

  return store
}
