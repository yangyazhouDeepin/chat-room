import { createStore } from 'redux'
import Reducers from './reducers'

export default function configureStore(initialState) {
  const store = createStore(Reducers, initialState, window.devToolsExtension ? window.devToolsExtension() : undefined)
  return store
}