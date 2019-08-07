import {createStore, applyMiddleware, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers'

const loggerMiddleware = createLogger()

export default function configureStore(preloadedState) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  // const store = createStore(reducer, /* preloadedState, */ composeEnhancers(

  return createStore(
      rootReducer,
      preloadedState,
      composeEnhancers(
      applyMiddleware(thunkMiddleware, loggerMiddleware)
      )
  )
}

