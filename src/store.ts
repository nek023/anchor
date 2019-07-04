import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { rootReducer, State } from './modules/index'
import { rootSaga } from './sagas/index'

export default (initialState: State) => {
  let middlewares = []

  if (process.env.NODE_ENV === 'development') {
    const { logger } = require('redux-logger')
    middlewares.push(logger)
  }

  const sagaMiddleware = createSagaMiddleware()
  middlewares.push(sagaMiddleware)

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  )

  sagaMiddleware.run(rootSaga)

  return store
}
