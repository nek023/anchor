import { applyMiddleware, createStore as reduxCreateStore } from 'redux'
import { State, rootReducer } from './modules'

export const createStore = (initialState: State) => {
  const middlewares = []

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { logger } = require('redux-logger')
    middlewares.push(logger)
  }

  const store = reduxCreateStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares)
  )

  return store
}
