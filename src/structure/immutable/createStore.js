import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'
import { applyMiddleware, compose, createStore as reduxCreateStore } from 'redux'
import { batchedSubscribe } from 'redux-batched-subscribe'
import { combineReducers } from 'redux-immutablejs'
import thunk from 'redux-thunk'
import { Map, Iterable } from 'immutable'


const devTools = typeof window !== 'undefined' && window.devToolsExtension ? window.devToolsExtension() : (v) => v

const defaultMiddleware = [
  thunk,
]

const defaultEnhancers = [
  batchedSubscribe(batchedUpdates),
]

const createStore = ({
  initialState = Map(),
  reducers = {},
  middleware = [],
  enhancers = [],
}) => {
  if (!Iterable.isIterable(initialState)) {
    throw new Error('Invalid initialState option')
  }

  const finalMiddleware = [
    ...defaultMiddleware,
    ...middleware,
  ]

  const finalEnhancers = [
    ...defaultEnhancers,
    ...enhancers,
    devTools,
  ]

  const store = reduxCreateStore(
    combineReducers(reducers),
    initialState,
    compose(
      applyMiddleware(...finalMiddleware),
      ...finalEnhancers,
    ),
  )

  return store
}

export default createStore
